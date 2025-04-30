import { z } from "zod";

// ✅ Savings Schema for validation
export const savingsSchema = z.object({
  goalAmount: z.string().min(1, "Goal amount is required"),
  description: z.string().optional(),
  motive: z.string().optional(),
  savedAmount: z.string().default("0"),
});
