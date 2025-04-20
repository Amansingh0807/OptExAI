"use client";
import { useState, useEffect } from "react";
import { getSavings, addSavedMoney } from "@/actions/savingsActions";

export default function SavingsList() {
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getSavings();
      setSavings(data);
    }
    fetchData();
  }, []);

  const handleAddMoney = async (id) => {
    const amount = parseFloat(prompt("Enter amount to add:"));
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount");
    
    await addSavedMoney(id, amount);
    alert("Money added!");
    setSavings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, savedAmount: s.savedAmount + amount } : s))
    );
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Your Savings Goals</h2>
      {savings.length === 0 ? (
        <p>No savings goals yet.</p>
      ) : (
        savings.map((saving) => (
          <div key={saving.id} className="p-4 border mb-2">
            <h3 className="font-semibold">{saving.description || "No description"}</h3>
            <p>Goal: ${saving.goalAmount}</p>
            <p>Saved: ${saving.savedAmount}</p>
            <button
              onClick={() => handleAddMoney(saving.id)}
              className="bg-green-500 text-white px-3 py-1 mt-2"
            >
              Add Money
            </button>
          </div>
        ))
      )}
    </div>
  );
}
