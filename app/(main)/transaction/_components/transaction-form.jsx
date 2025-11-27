"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  CalendarIcon, 
  Loader2, 
  Mic, 
  FileText, 
  DollarSign, 
  Building2, 
  Tag, 
  Clock, 
  Repeat, 
  Lightbulb,
  Sparkles,
  ArrowUpCircle,
  ArrowDownCircle,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { VoiceInput } from "@/components/voice-input";
import { VoiceAssistant } from "@/components/voice-assistant";
import { convertCurrency } from "@/lib/currency";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction, detectCategoryFromDescription } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
  userCurrency,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // State for converted account balances
  const [convertedAccounts, setConvertedAccounts] = useState([]);
  const [previousAccountCurrency, setPreviousAccountCurrency] = useState(null);
  const [isDetectingCategory, setIsDetectingCategory] = useState(false);
  const [isConvertingAmount, setIsConvertingAmount] = useState(false);

  // Show voice assistant tip on mount
  useEffect(() => {
    if (!editMode) {
      const hasSeenTip = localStorage.getItem('voiceAssistantTipShown');
      if (!hasSeenTip) {
        setTimeout(() => {
          toast.info("Voice Assistant Available!", {
            description: 'Press Ctrl+Space to add transactions with voice commands',
            duration: 5000,
            action: {
              label: "Got it",
              onClick: () => localStorage.setItem('voiceAssistantTipShown', 'true')
            }
          });
        }, 1000);
      }
    }
  }, [editMode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  // Convert account balances to user's preferred currency
  useEffect(() => {
    const convertAccountBalances = async () => {
      if (accounts && userCurrency) {
        const converted = await Promise.all(
          accounts.map(async (account) => {
            if (account.currency !== userCurrency) {
              const convertedBalance = await convertCurrency(
                account.balance,
                account.currency,
                userCurrency
              );
              return {
                ...account,
                convertedBalance,
                displayCurrency: userCurrency,
              };
            }
            return {
              ...account,
              convertedBalance: account.balance,
              displayCurrency: account.currency,
            };
          })
        );
        setConvertedAccounts(converted);
      } else {
        setConvertedAccounts(accounts);
      }
    };

    convertAccountBalances();
  }, [accounts, userCurrency]);

  // Convert amount when account selection changes
  useEffect(() => {
    const convertAmountOnAccountChange = async () => {
      const currentAccountId = watch("accountId");
      const currentAmount = watch("amount");
      
      // Don't do any conversion - amount should always be in userCurrency
      // Just update the previous currency tracker
      const currentAccount = accounts?.find(acc => acc.id === currentAccountId);
      if (currentAccount?.currency) {
        setPreviousAccountCurrency(currentAccount.currency);
      }
    };

    convertAmountOnAccountChange();
  }, [watch("accountId")]); // Only trigger when account changes

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = async (data) => {
    // Get the selected account to know its currency
    const selectedAccount = accounts?.find(acc => acc.id === data.accountId);
    
    let finalAmount = parseFloat(data.amount);
    
    // If the account currency is different from user currency, convert the amount
    if (selectedAccount && selectedAccount.currency !== userCurrency) {
      try {
        finalAmount = await convertCurrency(
          parseFloat(data.amount),
          userCurrency,
          selectedAccount.currency
        );
        console.log(`Converting ${data.amount} ${userCurrency} to ${finalAmount.toFixed(2)} ${selectedAccount.currency}`);
      } catch (error) {
        console.error("Error converting currency:", error);
        toast.error("Failed to convert currency. Using original amount.");
      }
    }
    
    const formData = {
      ...data,
      amount: finalAmount,
    };

    console.log("Creating transaction:", {
      ...formData,
      accountCurrency: selectedAccount?.currency,
      userCurrency: userCurrency,
      accountName: selectedAccount?.name
    });

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
        toast.success(`Receipt scanned! AI detected category: ${scannedData.category}`, {
          duration: 4000
        });
      } else {
        toast.success("Receipt scanned successfully");
      }
    }
  };

  const handleVoiceResult = (voiceData) => {
    if (voiceData) {
      // Set amount
      if (voiceData.amount) {
        setValue("amount", voiceData.amount.toString());
      }
      
      // Set description
      if (voiceData.description) {
        setValue("description", voiceData.description);
      }
      
      // Set category - find matching category in the categories list
      if (voiceData.category) {
        const matchingCategory = categories.find(cat => 
          cat.name.toLowerCase() === voiceData.category.toLowerCase()
        );
        if (matchingCategory) {
          setValue("category", matchingCategory.id);
        }
      }
      
      // Set date to today (voice input typically for current expenses)
      setValue("date", new Date());
      
      // Default to EXPENSE type for voice input
      setValue("type", "EXPENSE");
      
      toast.success(`Voice input applied: ₹${voiceData.amount} for ${voiceData.description}`, {
        duration: 4000
      });
    }
  };

  // AI Category Suggestion Handler
  const handleSuggestCategory = async () => {
    const description = watch("description");
    const transactionType = watch("type");
    
    if (!description || description.trim().length < 3) {
      toast.error("Please enter a description first");
      return;
    }

    setIsDetectingCategory(true);
    
    try {
      const suggestedCategory = await detectCategoryFromDescription(description, transactionType);
      
      if (suggestedCategory) {
        setValue("category", suggestedCategory);
        const categoryName = categories.find(c => c.id === suggestedCategory)?.name || suggestedCategory;
        toast.success(`AI suggests: ${categoryName}`, {
          duration: 3000,
        });
      } else {
        toast.info("AI couldn't determine a category. Please select manually.");
      }
    } catch (error) {
      console.error("Error suggesting category:", error);
      toast.error("Failed to suggest category");
    } finally {
      setIsDetectingCategory(false);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const currentDescription = watch("description");
  const currentCategory = watch("category");

  // Auto-detect category when description changes (with debounce)
  useEffect(() => {
    // Don't auto-detect if:
    // 1. No description
    // 2. Description too short
    // 3. Category already manually selected (not "other")
    // 4. In edit mode with existing category
    if (!currentDescription || currentDescription.trim().length < 5) {
      return;
    }

    // Skip if user already selected a specific category (not "other")
    if (currentCategory && currentCategory !== "other-expense" && currentCategory !== "other-income") {
      return;
    }

    // Debounce: wait for user to stop typing
    const timeoutId = setTimeout(async () => {
      setIsDetectingCategory(true);
      
      try {
        const suggestedCategory = await detectCategoryFromDescription(currentDescription, type);
        
        if (suggestedCategory) {
          setValue("category", suggestedCategory);
          const categoryName = categories.find(c => c.id === suggestedCategory)?.name || suggestedCategory;
          console.log(`AI Auto-detected category: ${categoryName} for "${currentDescription}"`);
          
          // Show subtle toast (not too intrusive)
          toast.success(`Category auto-detected: ${categoryName}`, {
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Auto-detect category error:", error);
      } finally {
        setIsDetectingCategory(false);
      }
    }, 1500); // Wait 1.5 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [currentDescription, type]); // Only trigger on description or type change

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const accountsToShow = convertedAccounts.length > 0 ? convertedAccounts : accounts;

  // Get current form values for preview
  const currentAmount = watch("amount");
  const currentAccountId = watch("accountId");
  
  const selectedAccount = accountsToShow.find(acc => acc.id === currentAccountId);
  const selectedCategory = filteredCategories.find(cat => cat.id === currentCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Main Form - Left Side */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Glass Card Container */}
          <div className="relative overflow-hidden rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl p-4 sm:p-6 lg:p-8">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative space-y-6">
              {/* Receipt Scanner - Only show in create mode */}
              {!editMode && (
                <div className="mb-6">
                  <ReceiptScanner onScanComplete={handleScanComplete} />
                </div>
              )}

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Transaction Type
                </label>
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  defaultValue={type}
                >
                  <SelectTrigger className="h-12 text-base border-2 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE" className="text-base">
                      <div className="flex items-center gap-2">
                        <ArrowDownCircle className="w-4 h-4 text-red-500" />
                        <span>Expense</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INCOME" className="text-base">
                      <div className="flex items-center gap-2">
                        <ArrowUpCircle className="w-4 h-4 text-green-500" />
                        <span>Income</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Amount
                    </span>
                    {userCurrency && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold">
                        {userCurrency}
                      </Badge>
                    )}
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="h-12 sm:h-14 text-xl sm:text-2xl font-bold border-2 hover:border-primary/50 transition-colors"
                    {...register("amount")}
                  />
                  {userCurrency ? (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary font-medium">
                        Enter amount in {userCurrency}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
                      <span className="text-sm text-muted-foreground">
                        ℹ️ Select currency from navbar
                      </span>
                    </div>
                  )}
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Account
                  </label>
                  <Select
                    onValueChange={(value) => setValue("accountId", value)}
                    defaultValue={getValues("accountId")}
                  >
                    <SelectTrigger className="h-12 sm:h-14 border-2 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountsToShow.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span className="font-medium">{account.name}</span>
                            <span className="text-xs text-muted-foreground">
                              <CurrencyDisplay 
                                amount={account.convertedBalance || account.balance} 
                                currency={account.displayCurrency || account.currency}
                                originalAmount={account.convertedBalance !== account.balance ? account.balance : null}
                                originalCurrency={account.convertedBalance !== account.balance ? account.currency : null}
                                showOriginal={false}
                              />
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      <CreateAccountDrawer>
                        <Button
                          variant="ghost"
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          + Create New Account
                        </Button>
                      </CreateAccountDrawer>
                    </SelectContent>
                  </Select>
                  {errors.accountId && (
                    <p className="text-sm text-red-500">{errors.accountId.message}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    Category
                    {isDetectingCategory && (
                      <span className="text-xs text-purple-500 animate-pulse">
                        (Auto-detecting...)
                      </span>
                    )}
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSuggestCategory}
                    disabled={isDetectingCategory || transactionLoading || !currentDescription}
                    className="h-8 text-xs border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500"
                    title="Instantly detect category from description"
                  >
                    {isDetectingCategory ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-1 h-3 w-3" />
                        Detect Now
                      </>
                    )}
                  </Button>
                </div>
                <Select
                  onValueChange={(value) => setValue("category", value)}
                  defaultValue={getValues("category")}
                >
                  <SelectTrigger className="h-12 border-2 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* Date and Description in same row */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2">
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 pl-3 text-left font-normal border-2 hover:border-primary/50 transition-colors text-sm sm:text-base",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => setValue("date", date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Description
                  </label>
                  <Input 
                    placeholder="e.g., Grocery shopping" 
                    className="h-12 border-2 hover:border-primary/50 transition-colors text-sm sm:text-base"
                    {...register("description")} 
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Voice Assistant - Keyboard Shortcut */}
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" />
                  Voice Assistant
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/20">
                    New!
                  </Badge>
                </label>
                <div className="p-6 border-2 rounded-2xl bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 backdrop-blur-sm hover:border-primary/50 transition-all">
                  <VoiceAssistant 
                    onVoiceResult={handleVoiceResult}
                    disabled={transactionLoading}
                    enableWakeWord={false}
                    enableShortcut={true}
                  />
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>
                        <strong>2 Ways to activate:</strong>
                      </span>
                    </p>
                    <div className="pl-6 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-purple-500" />
                        <span>Click the button above</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        <span>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Space</kbd></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 pl-6">
                      <strong>Example:</strong> "Add 500 rupees for dinner at Domino's"
                    </p>
                  </div>
                </div>
              </div>

              {/* Recurring Toggle */}
              <div className="flex flex-row items-center justify-between rounded-2xl border-2 p-5 bg-gradient-to-r from-background to-primary/5 hover:border-primary/50 transition-colors">
                <div className="space-y-0.5">
                  <label className="text-base font-semibold flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-primary" />
                    Recurring Transaction
                  </label>
                  <div className="text-sm text-muted-foreground">
                    Set up a recurring schedule for this transaction
                  </div>
                </div>
                <Switch
                  checked={isRecurring}
                  onCheckedChange={(checked) => setValue("isRecurring", checked)}
                />
              </div>

              {/* Recurring Interval */}
              {isRecurring && (
                <div className="space-y-2 animate-in fade-in-50 duration-300">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Recurring Interval
                  </label>
                  <Select
                    onValueChange={(value) => setValue("recurringInterval", value)}
                    defaultValue={getValues("recurringInterval")}
                  >
                    <SelectTrigger className="h-12 border-2 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.recurringInterval && (
                    <p className="text-sm text-red-500">
                      {errors.recurringInterval.message}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col xs:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full xs:flex-1 h-12 border-2 text-sm sm:text-base"
                  onClick={() => router.back()}
                  disabled={transactionLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full xs:flex-1 h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  disabled={transactionLoading}
                >
                  {transactionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span className="truncate">{editMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : editMode ? (
                    <span className="truncate">✓ Update</span>
                  ) : (
                    <span className="truncate">✓ Create</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Preview Panel - Right Side (Sticky) */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          {/* Live Preview Card */}
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-primary/20 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-6 h-6" />
              <h3 className="text-lg font-bold">Live Preview</h3>
            </div>
            
            <div className="space-y-4">
              {/* Type Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  type === "EXPENSE" 
                    ? "bg-red-500/20 text-red-600 dark:text-red-400" 
                    : "bg-green-500/20 text-green-600 dark:text-green-400"
                )}>
                  {type === "EXPENSE" ? "↓ Expense" : "↑ Income"}
                </span>
              </div>

              {/* Amount Display */}
              <div className="p-4 rounded-xl bg-background/50 text-center">
                <div className="text-sm text-muted-foreground mb-1">Amount</div>
                <div className="text-3xl font-bold gradient-title">
                  {currentAmount ? (
                    parseFloat(currentAmount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              {/* Account Info */}
              {selectedAccount && (
                <div className="p-3 rounded-xl bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Account</div>
                  <div className="font-semibold">{selectedAccount.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Balance: <CurrencyDisplay 
                      amount={selectedAccount.convertedBalance || selectedAccount.balance} 
                      currency={selectedAccount.displayCurrency || selectedAccount.currency}
                      showOriginal={false}
                    />
                  </div>
                </div>
              )}

              {/* Category */}
              {selectedCategory && (
                <div className="p-3 rounded-xl bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <div className="font-semibold">{selectedCategory.name}</div>
                </div>
              )}

              {/* Description */}
              {currentDescription && (
                <div className="p-3 rounded-xl bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <div className="text-sm">{currentDescription}</div>
                </div>
              )}

              {/* Date */}
              {date && (
                <div className="p-3 rounded-xl bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Date</div>
                  <div className="font-medium">{format(date, "PPP")}</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="rounded-2xl bg-card/50 backdrop-blur-sm border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Quick Tips</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Use voice input for hands-free entry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Scan receipts to auto-fill details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Set recurring for regular payments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Categories help with budgeting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
