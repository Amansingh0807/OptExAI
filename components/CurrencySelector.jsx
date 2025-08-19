"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { SUPPORTED_CURRENCIES, getCurrencyInfo } from "@/lib/currency";

export function CurrencySelector({ currentCurrency, onCurrencyChange }) {
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency || 'USD');
  
  useEffect(() => {
    if (currentCurrency) {
      setSelectedCurrency(currentCurrency);
    }
  }, [currentCurrency]);

  const handleCurrencySelect = async (currency) => {
    setSelectedCurrency(currency);
    if (onCurrencyChange) {
      await onCurrencyChange(currency);
    }
  };

  const currentCurrencyInfo = getCurrencyInfo(selectedCurrency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Globe size={16} className="mr-2" />
          <span className="mr-1">{currentCurrencyInfo.flag}</span>
          <span className="font-medium">{selectedCurrency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/20 dark:border-gray-700/20 shadow-xl max-h-80 overflow-y-auto"
      >
        {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleCurrencySelect(code)}
            className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer flex items-center justify-between py-3 px-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{info.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-gray-100">{code}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{info.name}</span>
              </div>
              <span className="text-gray-600 dark:text-gray-300 ml-2">{info.symbol}</span>
            </div>
            {selectedCurrency === code && (
              <Check size={16} className="text-green-600 dark:text-green-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
