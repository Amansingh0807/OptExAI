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
    <div className="space-y-8 mb-16 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl mt-24 text-center font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            <CurrencyDisplay 
              amount={parseFloat(account.balance)} 
              currency={userCurrency}
              originalAmount={account.currency !== userCurrency ? parseFloat(account.balance) : null}
              originalCurrency={account.currency}
              showOriginal={true}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <AccountChart transactions={transactions} userCurrency={userCurrency} account={account} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable transactions={transactions} userCurrency={userCurrency} account={account} />
      </Suspense>
    </div>
  );
}