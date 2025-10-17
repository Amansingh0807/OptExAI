"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { convertCurrency } from "@/lib/currency";

export function AccountCard({ account, userCurrency }) {
  const { 
    name, 
    type, 
    balance, 
    id, 
    isDefault,
    currency
  } = account;

  const [convertedBalance, setConvertedBalance] = useState(null);

  useEffect(() => {
    const performConversion = async () => {
      if (currency && userCurrency && currency !== userCurrency) {
        const converted = await convertCurrency(balance, currency, userCurrency);
        setConvertedBalance(converted);
      } else {
        setConvertedBalance(balance);
      }
    };
    
    performConversion();
  }, [balance, currency, userCurrency]);

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
      
      <Card className="relative hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20 overflow-hidden">
        {/* Default badge */}
        {isDefault && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg">
              ⭐ Default
            </Badge>
          </div>
        )}
        
        <Link href={`/account/${id}`} className="cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold capitalize">
                  {name}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {type.charAt(0) + type.slice(1).toLowerCase()} Account
                </p>
              </div>
            </div>
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-purple-600"
            />
          </CardHeader>
          
          <CardContent className="pt-6 pb-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                <CurrencyDisplay
                  amount={convertedBalance !== null ? convertedBalance : balance}
                  currency={userCurrency}
                  originalAmount={currency !== userCurrency ? balance : null}
                  originalCurrency={currency}
                  className="text-3xl font-bold gradient-title"
                  showOriginal={true}
                />
              </div>
              
              {currency && currency !== userCurrency && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    {currency}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Original Currency</span>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between text-sm bg-muted/50 py-3">
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <span className="font-medium">Income</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4" />
              </div>
              <span className="font-medium">Expense</span>
            </div>
          </CardFooter>
        </Link>
      </Card>
    </div>
  );
}