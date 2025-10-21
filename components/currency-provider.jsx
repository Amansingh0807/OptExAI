"use client";

import React, { createContext, useContext } from "react";

// Create Currency Context
const CurrencyContext = createContext({ currency: "USD" });

// Hook to use currency
export function useCurrency() {
  return useContext(CurrencyContext);
}

// Currency Provider Component
export function CurrencyProvider({ children, currency }) {
  return (
    <CurrencyContext.Provider value={{ currency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
