"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

// ✅ AI-Powered Category Detection
export async function detectCategoryFromDescription(description, type = "EXPENSE") {
  try {
    if (!description || description.trim().length < 3) {
      return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const availableCategories = type === "EXPENSE" 
      ? [
          "housing", "transportation", "groceries", "utilities", "entertainment",
          "food", "shopping", "healthcare", "education", "personal", "travel",
          "insurance", "gifts", "bills", "other-expense"
        ]
      : [
          "salary", "freelance", "investments", "business", "rental", "other-income"
        ];

    const prompt = `You are a financial assistant. Analyze the following transaction description and determine the most appropriate category.

Transaction Type: ${type}
Description: "${description}"

Available Categories: ${availableCategories.join(", ")}

Rules:
- "food" is for restaurants, dining out, food delivery
- "groceries" is for supermarket shopping, grocery stores
- "shopping" is for general retail, clothing, electronics
- "utilities" is for electricity, water, internet, phone bills
- "transportation" is for fuel, uber, taxi, public transport
- "entertainment" is for movies, games, streaming services
- "healthcare" is for medical, pharmacy, hospital
- "housing" is for rent, mortgage
- "bills" is for bank fees, service charges

Respond with ONLY the category ID from the available categories. No explanation, just the category ID.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim().toLowerCase();
    
    // Validate the response is a valid category
    if (availableCategories.includes(response)) {
      console.log(`🤖 AI detected category: ${response} for "${description}"`);
      return response;
    }

    console.log(`⚠️ AI returned invalid category: ${response}`);
    return null;
  } catch (error) {
    console.error("Error detecting category:", error);
    return null;
  }
}

// Create Transaction
export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // ✅ Validate sufficient balance for EXPENSE transactions
    if (data.type === "EXPENSE") {
      const currentBalance = account.balance.toNumber();
      
      if (currentBalance < data.amount) {
        throw new Error(
          `Insufficient balance! Your account balance is ${currentBalance.toFixed(2)} ${account.currency}, but you're trying to spend ${data.amount.toFixed(2)} ${account.currency}. Please add funds or reduce the transaction amount.`
        );
      }
    }

    // ✅ AI-Powered Auto Category Detection
    let finalCategory = data.category;
    
    // If no category provided or category is "other", try to detect from description
    if ((!data.category || data.category === "other-expense" || data.category === "other-income") && data.description) {
      const detectedCategory = await detectCategoryFromDescription(data.description, data.type);
      if (detectedCategory) {
        finalCategory = detectedCategory;
        console.log(`✨ Auto-detected category: ${detectedCategory} for "${data.description}"`);
      }
    }

    // Calculate new balance
    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    // Create transaction and update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          category: finalCategory, // Use AI-detected or original category
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // Calculate balance changes
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;
    
    // ✅ Validate sufficient balance for updated EXPENSE transactions
    if (data.type === "EXPENSE") {
      const currentBalance = originalTransaction.account.balance.toNumber();
      const balanceAfterChange = currentBalance + netBalanceChange;
      
      if (balanceAfterChange < 0) {
        const requiredBalance = data.amount;
        const availableBalance = currentBalance + (originalTransaction.type === "EXPENSE" ? originalTransaction.amount.toNumber() : 0);
        
        throw new Error(
          `Insufficient balance! Available balance: ${availableBalance.toFixed(2)} ${originalTransaction.account.currency}, but you're trying to spend ${requiredBalance.toFixed(2)} ${originalTransaction.account.currency}.`
        );
      }
    }

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get User Transactions
export async function getUserTransactions(query = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        ...query,
      },
      include: {
        account: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return { success: true, data: transactions };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Scan Receipt
export async function scanReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}

// Helper function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}