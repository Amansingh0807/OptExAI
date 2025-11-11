import { getUserAccounts } from "@/actions/dashboard";
import { getUserCurrency } from "@/actions/currency";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
export const dynamic = "force-dynamic";

export default async function AddTransactionPage({ searchParams }) {
  // Await searchParams before accessing its properties
  const editId = (await searchParams)?.edit;

  const [accounts, userCurrencyData] = await Promise.all([
    getUserAccounts(),
    getUserCurrency(),
  ]);

  const userCurrency = userCurrencyData.currency;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-3 sm:mb-4 mt-6 sm:mt-10 text-xs sm:text-sm">
            <span className="text-xl sm:text-2xl">💰</span>
            <span className="font-medium text-primary">Smart Transaction Manager</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold gradient-title px-2">
            {editId ? "Edit Transaction" : "Add Transaction"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Use voice commands, scan receipts, or fill the form manually. Your financial data is processed instantly.
          </p>
          
          {/* Voice Assistant Quick Tip */}
          {!editId && (
            <div className="flex items-center justify-center mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-xs sm:text-sm">
                <kbd className="px-2 py-0.5 bg-background rounded text-xs font-mono border">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-0.5 bg-background rounded text-xs font-mono border">Space</kbd>
                <span className="font-medium">for Voice Input</span>
              </div>
            </div>
          )}
        </div>

        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
          userCurrency={userCurrency}
        />
      </div>
    </div>
  );
}