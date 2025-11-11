"use server";

import { savingsSchema } from "@/lib/saving";

let savingsData = []; // Temporary storage (Replace with DB later)

//  Create a savings goal
export async function createSaving(goalAmount, description, motive) {
  const newSaving = {
    id: crypto.randomUUID(),
    goalAmount,
    savedAmount: "0",
    description,
    motive,
  };

  // Validate using Zod
  const validation = savingsSchema.safeParse(newSaving);
  if (!validation.success) {
    throw new Error(validation.error.errors.map((e) => e.message).join(", "));
  }

  savingsData.push(newSaving);
  return newSaving;
}

// Fetch all savings
export async function getSavings() {
  return savingsData;
}

//  Add saved money
export async function addSavedMoney(savingId, amount) {
  const saving = savingsData.find((s) => s.id === savingId);
  if (!saving) throw new Error("Saving goal not found");

  saving.savedAmount = (parseFloat(saving.savedAmount) + parseFloat(amount)).toString();
  return saving;
}
