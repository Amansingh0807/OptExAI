"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { convertCurrency } from "@/lib/currency";
import { getUserCurrency } from "@/actions/currency";

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    // Get current month's expenses
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Get user's preferred currency
    const userCurrencyData = await getUserCurrency();
    const userCurrency = userCurrencyData?.currency || "USD";

    // Get all expense transactions with their account information
    const expenseTransactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      include: {
        account: {
          select: {
            currency: true,
          },
        },
      },
    });

    // Convert each expense to user's currency and sum them
    let totalExpensesInUserCurrency = 0;
    for (const transaction of expenseTransactions) {
      const transactionAmount = transaction.amount.toNumber();
      const accountCurrency = transaction.account.currency;

      if (accountCurrency === userCurrency) {
        // No conversion needed
        totalExpensesInUserCurrency += transactionAmount;
      } else {
        // Convert from account currency to user currency
        const convertedAmount = await convertCurrency(
          transactionAmount,
          accountCurrency,
          userCurrency
        );
        totalExpensesInUserCurrency += convertedAmount;
      }
    }

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: totalExpensesInUserCurrency,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Update or create budget
    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: {
        amount,
      },
      create: {
        userId: user.id,
        amount,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}

export async function getCurrentBudgetWithCurrency(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's preferred currency
    const { currency: userCurrency } = await getUserCurrency();

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    // Get current month's expenses from all accounts
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Get all transactions with account info for currency conversion
    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        ...(accountId && { accountId }),
      },
      include: {
        account: true,
      },
    });

    // Convert all expense amounts to user's preferred currency
    let totalExpenses = 0;
    for (const transaction of transactions) {
      const originalAmount = parseFloat(transaction.amount);
      let convertedAmount = originalAmount;
      
      // Convert if currencies are different
      if (transaction.account.currency !== userCurrency) {
        convertedAmount = await convertCurrency(
          originalAmount,
          transaction.account.currency,
          userCurrency
        );
      }
      
      totalExpenses += convertedAmount;
    }

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: totalExpenses,
      currency: userCurrency,
    };
  } catch (error) {
    console.error("Error fetching budget with currency:", error);
    throw error;
  }
}