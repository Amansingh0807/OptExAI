"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, DollarSign } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useCurrency } from "@/components/currency-provider";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const { currency: userCurrency } = useCurrency(); // Get currency from navbar
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      currency: userCurrency, // Use navbar currency only
      isDefault: false,
    },
  });

  // Update currency when user changes it in navbar
  useEffect(() => {
    if (userCurrency) {
      setValue("currency", userCurrency);
    }
  }, [userCurrency, setValue]);

  // Reset form with correct currency when drawer opens
  useEffect(() => {
    if (open && userCurrency) {
      reset({
        name: "",
        type: "CURRENT",
        balance: "",
        currency: userCurrency,
        isDefault: false,
      });
    }
  }, [open, userCurrency, reset]);

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    // Ensure currency is set to userCurrency
    const accountData = {
      ...data,
      currency: userCurrency || data.currency,
    };
    console.log("Creating account with data:", accountData);
    await createAccountFn(accountData);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name
              </label>
              <Input id="name" placeholder="e.g., Main Checking" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="balance" className="text-sm font-medium">
                  Initial Balance
                </label>
                {userCurrency && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold">
                    {userCurrency}
                  </Badge>
                )}
              </div>
              <Input id="balance" type="number" step="0.01" placeholder="0.00" {...register("balance")} />
              {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
              {userCurrency ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-primary">
                      Account will be created in {userCurrency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Change currency from navbar to use different currency
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                      No currency selected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Please select a currency from the navbar before creating an account
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label htmlFor="isDefault" className="text-base font-medium cursor-pointer">
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1" disabled={createAccountLoading}>
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
