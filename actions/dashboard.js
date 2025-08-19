"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { convertCurrency, formatCurrency } from "@/lib/currency";
import { getUserCurrency } from "@/actions/currency";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    // Serialize accounts before sending to client
    const serializedAccounts = accounts.map((account) => ({
      ...account,
      balance: account.balance.toNumber(), // Serialize Decimal to number
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }));

    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
  }
}

// New function with currency conversion
export async function getUserAccountsWithCurrency() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // Get user's preferred currency
    const { currency: userCurrency } = await getUserCurrency();

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    // Convert balances to user's preferred currency
    const accountsWithConvertedBalances = await Promise.all(
      accounts.map(async (account) => {
        const originalBalance = parseFloat(account.balance);
        let displayBalance = originalBalance;
        
        // Convert if currencies are different
        if (account.currency !== userCurrency) {
          displayBalance = await convertCurrency(
            originalBalance,
            account.currency,
            userCurrency
          );
        }

        return {
          id: account.id,
          name: account.name,
          type: account.type,
          balance: originalBalance, // Serialize the Decimal balance
          isDefault: account.isDefault,
          userId: account.userId,
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString(),
          currency: account.currency,
          originalBalance,
          originalCurrency: account.currency,
          displayBalance,
          displayCurrency: userCurrency,
          formattedBalance: formatCurrency(displayBalance, userCurrency),
          _count: account._count, // Preserve the count
        };
      })
    );

    return accountsWithConvertedBalances;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function createAccount(data) {
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

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    // If it's the first account, make it default regardless of user input
    // If not, use the user's preference
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create new account
    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault, // Override the isDefault based on our logic
      },
    });

    // Serialize the account before returning
    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}

export async function getDashboardDataWithCurrency() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // Get user's preferred currency
    const { currency: userCurrency } = await getUserCurrency();

    // Get all user transactions with account information
    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      include: {
        account: true,
      },
    });

    // Convert transaction amounts to user's preferred currency
    const transactionsWithConvertedAmounts = await Promise.all(
      transactions.map(async (transaction) => {
        const originalAmount = parseFloat(transaction.amount);
        let displayAmount = originalAmount;
        
        // Convert if currencies are different
        if (transaction.account.currency !== userCurrency) {
          displayAmount = await convertCurrency(
            originalAmount,
            transaction.account.currency,
            userCurrency
          );
        }

        return {
          ...serializeTransaction(transaction),
          amount: displayAmount,
          originalAmount: originalAmount,
          originalCurrency: transaction.account.currency,
          displayCurrency: userCurrency,
        };
      })
    );

    return transactionsWithConvertedAmounts;
  } catch (error) {
    console.error("Error in getDashboardDataWithCurrency:", error);
    throw error;
  }
}