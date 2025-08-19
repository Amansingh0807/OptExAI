"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { convertCurrency, fetchExchangeRates } from "@/lib/currency";

// Update user's default currency
export async function updateUserCurrency(currency) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const updatedUser = await db.user.update({
      where: { clerkUserId: user.id },
      data: { defaultCurrency: currency },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user currency:", error);
    return { success: false, error: error.message };
  }
}

// Get user's currency preference
export async function getUserCurrency() {
  try {
    const user = await currentUser();
    if (!user) {
      return { currency: 'USD' }; // Default currency for non-authenticated users
    }

    const userRecord = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select: { defaultCurrency: true },
    });

    return { 
      currency: userRecord?.defaultCurrency || 'USD',
      success: true 
    };
  } catch (error) {
    console.error("Error fetching user currency:", error);
    return { 
      currency: 'USD',
      success: false, 
      error: error.message 
    };
  }
}

// Convert all user's account balances to display currency
export async function getUserAccountsWithConvertedBalances(displayCurrency) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert balances to display currency
    const accountsWithConvertedBalances = await Promise.all(
      accounts.map(async (account) => {
        const convertedBalance = await convertCurrency(
          parseFloat(account.balance),
          account.currency,
          displayCurrency
        );

        return {
          ...account,
          originalBalance: account.balance,
          originalCurrency: account.currency,
          displayBalance: convertedBalance,
          displayCurrency: displayCurrency,
        };
      })
    );

    return { success: true, accounts: accountsWithConvertedBalances };
  } catch (error) {
    console.error("Error fetching accounts with converted balances:", error);
    return { success: false, error: error.message };
  }
}

// Convert transaction amounts for display
export async function getTransactionsWithConvertedAmounts(displayCurrency, accountId = null) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const whereClause = { userId: user.id };
    if (accountId) {
      whereClause.accountId = accountId;
    }

    const transactions = await db.transaction.findMany({
      where: whereClause,
      include: {
        account: {
          select: {
            name: true,
            currency: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    // Convert amounts to display currency
    const transactionsWithConvertedAmounts = await Promise.all(
      transactions.map(async (transaction) => {
        const convertedAmount = await convertCurrency(
          parseFloat(transaction.amount),
          transaction.account.currency,
          displayCurrency
        );

        return {
          ...transaction,
          originalAmount: transaction.amount,
          originalCurrency: transaction.account.currency,
          displayAmount: convertedAmount,
          displayCurrency: displayCurrency,
        };
      })
    );

    return { success: true, transactions: transactionsWithConvertedAmounts };
  } catch (error) {
    console.error("Error fetching transactions with converted amounts:", error);
    return { success: false, error: error.message };
  }
}

// Update account currency
export async function updateAccountCurrency(accountId, currency) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const updatedAccount = await db.account.update({
      where: { 
        id: accountId,
        userId: user.id, // Ensure user owns the account
      },
      data: { currency },
    });

    return { success: true, account: updatedAccount };
  } catch (error) {
    console.error("Error updating account currency:", error);
    return { success: false, error: error.message };
  }
}
