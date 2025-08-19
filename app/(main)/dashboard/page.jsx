import { Suspense } from "react";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { getUserCurrency } from "@/actions/currency";
import { currentUser } from "@clerk/nextjs/server";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [accounts, transactions, userCurrencyData, user] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
    getUserCurrency(),
    currentUser(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const userCurrency = userCurrencyData.currency;

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
        userEmail={user?.emailAddresses?.[0]?.emailAddress}
        userCurrency={userCurrency}
      />

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
        userCurrency={userCurrency}
      />

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 mb-16 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow  cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} userCurrency={userCurrency} />
          ))}
      </div>
    </div>
  );
}