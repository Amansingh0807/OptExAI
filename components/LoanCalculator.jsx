"use client";
import React, { useState } from 'react';

const LoanCalculator = () => {
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [time, setTime] = useState('');
    const [emi, setEmi] = useState(null);
  
    const handleCalculate = () => {
      if (principal && rate && time) {
        const monthlyRate = parseFloat(rate) / 100 / 12;
        const numberOfPayments = parseFloat(time) * 12;
        const emiCalculation =
          (parseFloat(principal) * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
        setEmi(emiCalculation.toFixed(2));
      }
    };
  
    return (
      <div className="p-4 border rounded shadow-md w-1/2 ml-4">
        <h2 className="text-xl font-bold mb-4">Loan Calculator</h2>
        <input
          type="number"
          placeholder="Principal Amount"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Annual Interest Rate (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Loan Term (Years)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleCalculate}
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          Calculate EMI
        </button>
        {emi !== null && (
          <div className="mt-4">
            <strong>EMI:</strong> {emi}
          </div>
        )}
      </div>
    );
  };

export default LoanCalculator;