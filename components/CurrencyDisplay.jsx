"use client";
import React, { useState, useEffect } from "react";
import { formatCurrency, getCurrencySymbol, convertCurrency } from "@/lib/currency";

export function CurrencyDisplay({ 
  amount, 
  currency = "USD", 
  targetCurrency = null,
  originalAmount = null, 
  originalCurrency = null,
  className = "",
  showOriginal = false,
  showSign = false,
  type = null
}) {
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function performConversion() {
      if (targetCurrency && currency !== targetCurrency) {
        setIsLoading(true);
        try {
          const converted = await convertCurrency(amount, currency, targetCurrency);
          setConvertedAmount(converted);
        } catch (error) {
          console.error("Currency conversion error:", error);
          setConvertedAmount(amount);
        } finally {
          setIsLoading(false);
        }
      } else {
        setConvertedAmount(amount);
      }
    }
    performConversion();
  }, [amount, currency, targetCurrency]);

  const displayCurrency = targetCurrency || currency;
  const prefix = showSign && type ? (type === "EXPENSE" ? "-" : "+") : "";
  const formattedAmount = formatCurrency(Math.abs(convertedAmount), displayCurrency);
  const isConverted = originalCurrency && originalCurrency !== displayCurrency;

  if (isLoading) {
    return <span className={className}>...</span>;
  }

  return (
    <div className={className}>
      <span className="font-medium">{prefix}{formattedAmount}</span>
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
