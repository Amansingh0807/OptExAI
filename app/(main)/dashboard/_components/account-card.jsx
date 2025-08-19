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
    <Card className="hover:shadow-md transition-shadow group relative cursor-pointer">
      <Link href={`/account/${id}`} className="cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </CardHeader>
        <CardContent>
          <CurrencyDisplay
            amount={convertedBalance !== null ? convertedBalance : balance}
            currency={userCurrency}
            originalAmount={currency !== userCurrency ? balance : null}
            originalCurrency={currency}
            className="text-2xl font-bold"
            showOriginal={true}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>
            {currency && currency !== userCurrency && (
              <Badge variant="outline" className="text-xs">
                {currency}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}