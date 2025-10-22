"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { convertCurrency } from "@/lib/currency";
import emailjs from '@emailjs/browser';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses, userEmail, userName, userCurrency = "USD" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );
  const [emailSent, setEmailSent] = useState(false); // Prevent duplicate emails
  const [budgetAmount, setBudgetAmount] = useState(initialBudget?.amount || 0);
  const [expenses, setExpenses] = useState(currentExpenses || 0);
  const [previousCurrency, setPreviousCurrency] = useState(userCurrency);
  const [lastBudgetUpdate, setLastBudgetUpdate] = useState(initialBudget?.updatedAt); // Track budget changes
  const isSendingEmail = useRef(false); // Prevent concurrent email sends

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = budgetAmount
    ? (expenses / budgetAmount) * 100
    : 0;

  // Convert budget when user changes currency
  useEffect(() => {
    const convertBudgetOnCurrencyChange = async () => {
      if (!initialBudget?.amount) {
        setBudgetAmount(0);
        setExpenses(currentExpenses);
        setPreviousCurrency(userCurrency);
        return;
      }

      // If currency changed, convert the budget amount
      if (previousCurrency && previousCurrency !== userCurrency) {
        try {
          const convertedBudget = await convertCurrency(
            budgetAmount,
            previousCurrency,
            userCurrency
          );
          
          setBudgetAmount(convertedBudget);
          setNewBudget(convertedBudget.toFixed(2));
          
          console.log(`Budget converted from ${previousCurrency} to ${userCurrency}: ${budgetAmount} → ${convertedBudget.toFixed(2)}`);
        } catch (error) {
          console.error("Currency conversion error:", error);
          toast.error("Failed to convert budget currency");
        }
      } else {
        // Initial load - no conversion needed
        setBudgetAmount(initialBudget.amount);
      }

      // Expenses are already in user's currency from backend
      setExpenses(currentExpenses);
      setPreviousCurrency(userCurrency);
    };

    convertBudgetOnCurrencyChange();
  }, [userCurrency, initialBudget?.amount, currentExpenses]);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
      // Reset email flag when budget is updated so new alert can be sent
      setEmailSent(false);
      setLastBudgetUpdate(new Date());
      console.log("Budget updated - email alert reset. Will send new alert if spending exceeds 90%");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  // ✅ Send email using EmailJS from client-side - ONCE per budget update
  useEffect(() => {
    const sendBudgetAlert = async () => {
      // Only send if budget exists and is >= 90% used
      if (!initialBudget || percentUsed < 90) {
        isSendingEmail.current = false;
        return;
      }

      // Don't send if already sent in this session
      if (emailSent || isSendingEmail.current) {
        return;
      }

      // Lock to prevent concurrent sends
      isSendingEmail.current = true;

      const now = new Date();
      const lastAlert = initialBudget.lastAlertSent 
        ? new Date(initialBudget.lastAlertSent) 
        : null;

      // If alert was sent in the last 24 hours, don't send again
      if (lastAlert) {
        const hoursSinceLastAlert = (now - lastAlert) / (1000 * 60 * 60);
        
        if (hoursSinceLastAlert < 24) {
          console.log(`⏭️ Budget alert already sent ${hoursSinceLastAlert.toFixed(1)} hours ago. Skipping.`);
          setEmailSent(true);
          isSendingEmail.current = false;
          return;
        }
      }

      try {
        const monthName = now.toLocaleString('default', { month: 'long' });
        
        // Initialize EmailJS with your public key
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

        // Prepare template parameters - including recipient email
        const templateParams = {
          to_email: userEmail, // Recipient email address
          to_name: userName || userEmail.split("@")[0],
          user_name: userName || userEmail.split("@")[0],
          spending_percentage: percentUsed.toFixed(1),
          month: monthName,
          current_spent: expenses.toFixed(2),
          budget_limit: budgetAmount.toFixed(2),
          currency: userCurrency,
          reply_to: userEmail, // Reply-to address
        };

        console.log("📧 Sending ONE budget alert email:", templateParams);

        // Send email using EmailJS client-side SDK
        const result = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY // Public key as 4th parameter
        );

        if (result.status === 200) {
          console.log("✅ Budget alert email sent successfully!");
          toast.success("Budget alert email sent!");
          setEmailSent(true);

          // Update lastAlertSent in database via API
          await fetch("/api/updateBudgetAlert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updateAlert: true }),
          });
        }
      } catch (err) {
        console.error("EmailJS Error Details:", {
          error: err,
          message: err.text || err.message,
          status: err.status,
        });
        // Mark as sent to prevent retries
        setEmailSent(true);
        console.log("Skipping budget alert email due to error");
      } finally {
        // Unlock after send attempt
        isSendingEmail.current = false;
      }
    };

    sendBudgetAlert();
  }, [initialBudget?.id, initialBudget?.updatedAt]); // Only run when budget changes

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-32"
                    placeholder="Enter amount"
                    autoFocus
                    disabled={isLoading}
                  />
                  <Badge variant="secondary" className="text-xs">
                    {userCurrency}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? (
                        <span className="flex items-center gap-1">
                          <CurrencyDisplay amount={expenses} currency={userCurrency} /> of{" "}
                          <CurrencyDisplay amount={budgetAmount} currency={userCurrency} /> spent
                        </span>
                      )
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              className={`${
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
