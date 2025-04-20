import SavingsForm from "./_components/SavingsForm";
import SavingsList from "./_components/SavingsList";

export default function SavingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Savings Goals</h1>
      <SavingsForm />
      <SavingsList />
    </div>
  );
}
