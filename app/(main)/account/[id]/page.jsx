import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { getUserCurrency } from "@/actions/currency";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";

// Ensure this is an async server component
export default async function AccountPage({ params }) {
  // ✅ Await params before accessing its properties
  const { id: accountId } = await params;

  if (!accountId) {
    notFound(); // Handle missing ID gracefully
  }

  const [accountData, userCurrencyData] = await Promise.all([
    getAccountWithTransactions(accountId),
    getUserCurrency(),
  ]);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;
  const userCurrency = userCurrencyData.currency;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 mt-20 mb-16">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-primary/20 p-6 sm:p-8 shadow-2xl">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            {/* Account Info */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl">💳</span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold gradient-title capitalize">
                  {account.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()} Account
                  </p>
                  <span className="text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">
                    {account._count.transactions} Transactions
                  </p>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-50 group-hover:opacity-75 blur transition duration-300"></div>
              <div className="relative bg-background rounded-2xl p-4 sm:p-6 min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                <div className="text-2xl sm:text-3xl font-bold gradient-title">
                  <CurrencyDisplay 
                    amount={parseFloat(account.balance)} 
                    currency={account.currency}
                    targetCurrency={userCurrency}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="rounded-3xl bg-card/50 backdrop-blur-sm border-2 border-border/50 shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-bold">Transaction Overview</h2>
            </div>
            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
              <AccountChart transactions={transactions} userCurrency={userCurrency} account={account} />
            </Suspense>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-3xl bg-card/50 backdrop-blur-sm border-2 border-border/50 shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold">Recent Transactions</h2>
            </div>
            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
              <TransactionTable transactions={transactions} userCurrency={userCurrency} account={account} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}