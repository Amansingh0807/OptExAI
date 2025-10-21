"use client";
import React, { createContext, useContext } from "react";
import { CurrencySelector } from "./CurrencySelector";
import { updateUserCurrency } from "@/actions/currency";
import { useRouter } from "next/navigation";

// Create Currency Context
const CurrencyContext = createContext({ currency: "USD" });

// Hook to use currency
export function useCurrency() {
  return useContext(CurrencyContext);
}

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
    <CurrencyContext.Provider value={{ currency: currentCurrency }}>
      <CurrencySelector 
        currentCurrency={currentCurrency} 
        onCurrencyChange={handleCurrencyChange}
      />
    </CurrencyContext.Provider>
  );
}
