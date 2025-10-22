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
import { SpendingHeatmap } from "./_components/spending-heatmap";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Hero Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-title">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.firstName || 'User'}! Here's your financial overview.</p>
            </div>
          </div>
        </div>

        {/* Budget Progress Section */}
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
          userEmail={user?.emailAddresses?.[0]?.emailAddress}
          userName={user?.firstName || user?.username || 'User'}
          userCurrency={userCurrency}
        />

        {/* Add New Account Section */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
          <CreateAccountDrawer>
            <Card className="relative hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-sm">
              <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center p-8">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Add New Account</p>
                  <p className="text-sm text-muted-foreground">Create a new account to track your finances</p>
                </div>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
        </div>

        {/* Dashboard Overview (Charts & Recent Transactions) */}
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []}
          userCurrency={userCurrency}
        />

        {/* Accounts Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold gradient-title">Your Accounts</h2>
              <p className="text-sm text-muted-foreground">Manage all your financial accounts</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-xl">💳</span>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {accounts.length > 0 ? (
              accounts?.map((account) => (
                <AccountCard key={account.id} account={account} userCurrency={userCurrency} />
              ))
            ) : (
              <div className="col-span-full">
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-4xl">🏦</span>
                    </div>
                    <p className="text-lg font-medium mb-2">No accounts yet</p>
                    <p className="text-sm">Create your first account to start tracking your finances</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Spending Heatmap */}
        <SpendingHeatmap transactions={transactions || []} userCurrency={userCurrency} />
      </div>
    </div>
  );
}