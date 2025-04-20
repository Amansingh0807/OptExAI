"use client";
import { useState } from "react";
import { createSaving } from "@/actions/savingsActions";

export default function SavingsForm() {
  const [goalAmount, setGoalAmount] = useState("");
  const [description, setDescription] = useState("");
  const [motive, setMotive] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSaving(parseFloat(goalAmount), description, motive);
    alert("Savings goal added!");
    setGoalAmount("");
    setDescription("");
    setMotive("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
      <input
        type="number"
        placeholder="Goal Amount"
        value={goalAmount}
        onChange={(e) => setGoalAmount(e.target.value)}
        className="border p-2 w-full mb-2"
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Motive"
        value={motive}
        onChange={(e) => setMotive(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Add Goal
      </button>
    </form>
  );
}
