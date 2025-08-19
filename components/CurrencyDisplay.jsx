"use client";
import React from "react";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

export function CurrencyDisplay({ 
  amount, 
  currency = "USD", 
  originalAmount = null, 
  originalCurrency = null,
  className = "",
  showOriginal = false 
}) {
  const formattedAmount = formatCurrency(amount, currency);
  const isConverted = originalCurrency && originalCurrency !== currency;

  return (
    <div className={className}>
      <span className="font-medium">{formattedAmount}</span>
      {showOriginal && isConverted && originalAmount && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          ({formatCurrency(originalAmount, originalCurrency)} {originalCurrency})
        </div>
      )}
    </div>
  );
}

export function CurrencyAmount({ 
  amount, 
  currency = "USD", 
  className = "",
  showSymbol = true 
}) {
  if (!showSymbol) {
    return (
      <span className={className}>
        {Number(amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    );
  }

  return (
    <span className={className}>
      {formatCurrency(amount, currency)}
    </span>
  );
}
