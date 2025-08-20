import { getUserAccounts } from "@/actions/dashboard";
import { getUserCurrency } from "@/actions/currency";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
export const dynamic = "force-dynamic";

export default async function AddTransactionPage({ searchParams }) {
  // ✅ Await searchParams before accessing its properties
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
    <div className="max-w-3xl mt-32 mx-auto px-5">
      <div className="flex justify-center md:justify-normal mt-32 mb-8">
        <h1 className="text-5xl gradient-title">Add Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
        userCurrency={userCurrency}
      />
    </div>
  );
}