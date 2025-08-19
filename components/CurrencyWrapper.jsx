"use client";
import React from "react";
import { CurrencySelector } from "./CurrencySelector";
import { updateUserCurrency } from "@/actions/currency";
import { useRouter } from "next/navigation";

export function CurrencyWrapper({ currentCurrency }) {
  const router = useRouter();

  const handleCurrencyChange = async (newCurrency) => {
    try {
      const result = await updateUserCurrency(newCurrency);
      if (result.success) {
        // Refresh the page to show updated currency
        router.refresh();
      } else {
        console.error("Failed to update currency:", result.error);
      }
    } catch (error) {
      console.error("Error updating currency:", error);
    }
  };

  return (
    <CurrencySelector 
      currentCurrency={currentCurrency} 
      onCurrencyChange={handleCurrencyChange}
    />
  );
}
