// components/MoneyConverter.js
"use client";
import React, { useState, useEffect } from "react";

const MoneyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          const rate = data.conversion_rates[toCurrency];
          setExchangeRate(rate);
          setConvertedAmount((amount * rate).toFixed(2));
        });
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl max-w-md mx-auto mb-12">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Real-Time Money Converter</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded-md"
          placeholder="Amount"
        />

        <div className="flex justify-between space-x-4">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="p-2 border rounded-md w-1/2"
          >
            <option>USD</option>
            <option>EUR</option>
            <option>INR</option>
            <option>GBP</option>
            <option>JPY</option>
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="p-2 border rounded-md w-1/2"
          >
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>JPY</option>
          </select>
        </div>

        {convertedAmount && (
          <div className="text-center text-xl font-semibold text-green-600">
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoneyConverter;
