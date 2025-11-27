"use client";

import { useState, useMemo } from "react";
import { format, startOfYear, eachDayOfInterval, isSameDay, subDays, addDays, startOfWeek } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Mon", "Wed", "Fri"];

export function SpendingHeatmap({ transactions, userCurrency }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate spending data for each day
  const heatmapData = useMemo(() => {
    const now = new Date();
    // Start from 52 weeks ago
    const startDate = subDays(now, 364);
    const allDays = eachDayOfInterval({ start: startDate, end: now });

    const dataMap = new Map();

    // Initialize all days with zero values
    allDays.forEach(day => {
      const dateKey = format(day, "yyyy-MM-dd");
      dataMap.set(dateKey, { date: day, income: 0, expense: 0, transactions: [] });
    });

    // Aggregate transaction data
    transactions?.forEach(transaction => {
      const dateKey = format(new Date(transaction.date), "yyyy-MM-dd");
      const dayData = dataMap.get(dateKey);
      
      if (dayData) {
        if (transaction.type === "INCOME") {
          dayData.income += transaction.amount;
        } else {
          dayData.expense += transaction.amount;
        }
        dayData.transactions.push(transaction);
      }
    });

    return Array.from(dataMap.values());
  }, [transactions]);

  // Calculate intensity levels (0-4) for color coding
  const getIntensity = (income, expense) => {
    const netAmount = income - expense;
    const absAmount = Math.abs(netAmount);
    
    if (absAmount === 0) return 0;
    if (absAmount < 100) return 1;
    if (absAmount < 500) return 2;
    if (absAmount < 1000) return 3;
    return 4;
  };

  // Get color class based on intensity and type
  const getColorClass = (income, expense) => {
    const netAmount = income - expense;
    const intensity = getIntensity(income, expense);
    
    if (intensity === 0) return "bg-muted/30 border-border/30";
    
    if (netAmount > 0) {
      // Income (green) - GitHub-like colors
      switch (intensity) {
        case 1: return "bg-green-200 dark:bg-green-950 border-green-300 dark:border-green-900 hover:border-green-400";
        case 2: return "bg-green-400 dark:bg-green-800 border-green-500 dark:border-green-700 hover:border-green-600";
        case 3: return "bg-green-600 dark:bg-green-700 border-green-700 dark:border-green-600 hover:border-green-800";
        case 4: return "bg-green-800 dark:bg-green-600 border-green-900 dark:border-green-500 hover:border-green-900";
        default: return "bg-green-500 border-green-600";
      }
    } else {
      // Expense (red) - GitHub-like colors
      switch (intensity) {
        case 1: return "bg-red-200 dark:bg-red-950 border-red-300 dark:border-red-900 hover:border-red-400";
        case 2: return "bg-red-400 dark:bg-red-800 border-red-500 dark:border-red-700 hover:border-red-600";
        case 3: return "bg-red-600 dark:bg-red-700 border-red-700 dark:border-red-600 hover:border-red-800";
        case 4: return "bg-red-800 dark:bg-red-600 border-red-900 dark:border-red-500 hover:border-red-900";
        default: return "bg-red-500 border-red-600";
      }
    }
  };

  // Group days by week for grid layout (GitHub style)
  const weekData = useMemo(() => {
    const now = new Date();
    const startDate = subDays(now, 364);
    
    // Start on Sunday (like GitHub)
    let currentDate = startOfWeek(startDate, { weekStartsOn: 0 });
    
    const weeks = [];
    
    // Generate weeks until we reach today
    while (currentDate <= now) {
      const week = [];
      
      // Generate 7 days for this week (Sun-Sat)
      for (let i = 0; i < 7; i++) {
        const day = addDays(currentDate, i);
        const dateKey = format(day, "yyyy-MM-dd");
        const dayData = heatmapData.find(d => format(d.date, "yyyy-MM-dd") === dateKey) || 
                       { date: day, income: 0, expense: 0, transactions: [] };
        
        // Check if day is in our data range
        const isInRange = day >= startDate && day <= now;
        
        week.push({ ...dayData, isInRange });
      }
      
      weeks.push(week);
      currentDate = addDays(currentDate, 7); // Move to next week
    }
    
    return weeks;
  }, [heatmapData]);

  // Get month labels for the timeline
  const monthLabels = useMemo(() => {
    const labels = [];
    const now = new Date();
    const startDate = subDays(now, 364);
    
    // Track when months change in the week data
    let currentMonth = -1;
    let weekIndex = 0;
    
    // Generate weeks from start date
    const current = startOfWeek(startDate, { weekStartsOn: 0 });
    const end = now;
    
    while (current <= end) {
      const month = current.getMonth();
      
      // Only add label when month changes and it's not the very first week
      if (month !== currentMonth && weekIndex > 0) {
        labels.push({ 
          month: MONTHS[month], 
          weekIndex: weekIndex 
        });
      }
      
      currentMonth = month;
      current.setDate(current.getDate() + 7);
      weekIndex++;
    }
    
    return labels;
  }, []);

  const handleDayClick = (dayData) => {
    if (dayData.transactions.length > 0) {
      setSelectedDate(dayData);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Card className="relative overflow-hidden border-2 border-border/50">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
        
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <CardTitle>Activity Heatmap</CardTitle>
            </div>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Less</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-muted/30 border border-border/30" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-200 dark:bg-green-950 border border-green-300 dark:border-green-900" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-400 dark:bg-green-800 border border-green-500 dark:border-green-700" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-600 dark:bg-green-700 border border-green-700 dark:border-green-600" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-800 dark:bg-green-600 border border-green-900 dark:border-green-500" />
                </div>
                <span className="text-muted-foreground">Income</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Less</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-red-200 dark:bg-red-950 border border-red-300 dark:border-red-900" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-red-400 dark:bg-red-800 border border-red-500 dark:border-red-700" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-red-600 dark:bg-red-700 border border-red-700 dark:border-red-600" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-red-800 dark:bg-red-600 border border-red-900 dark:border-red-500" />
                </div>
                <span className="text-muted-foreground">Spending</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="overflow-x-auto pb-2">
            <div className="inline-flex gap-1">
              {/* Day labels on the left */}
              <div className="flex flex-col gap-[3px] justify-start pt-[18px]">
                <div className="h-[10px] text-[9px] text-muted-foreground flex items-center"></div>
                <div className="h-[10px] text-[9px] text-muted-foreground flex items-center">Mon</div>
                <div className="h-[10px] text-[9px] text-muted-foreground flex items-center"></div>
                <div className="h-[10px] text-[9px] text-muted-foreground flex items-center">Wed</div>
                <div className="h-[10px] text-[9px] text-muted-foreground flex items-center"></div>
                <div className="h-[10px] text-[9px] text-muted-foreground flex items-center">Fri</div>
                <div className="h-[10px] text-[9px] text-muted-foreground flex items-center"></div>
              </div>

              {/* Main grid container */}
              <div className="flex flex-col gap-1">
                {/* Month labels */}
                <div className="flex gap-[3px] mb-1 h-4">
                  {weekData.map((week, weekIdx) => {
                    // Check if this week starts a new month
                    const weekStart = week[0]?.date;
                    const prevWeekStart = weekIdx > 0 ? weekData[weekIdx - 1][0]?.date : null;
                    
                    const showMonth = weekStart && (
                      !prevWeekStart || 
                      weekStart.getMonth() !== prevWeekStart.getMonth()
                    );
                    
                    return (
                      <div
                        key={weekIdx}
                        className="w-[10px] text-[9px] text-muted-foreground font-medium"
                      >
                        {showMonth && weekStart.getMonth() !== new Date(subDays(new Date(), 364)).getMonth() 
                          ? MONTHS[weekStart.getMonth()] 
                          : ""}
                      </div>
                    );
                  })}
                </div>

                {/* Weeks grid (transposed - columns are weeks, rows are days) */}
                <div className="flex gap-[3px]">
                  {weekData.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[3px]">
                      {week.map((day, dayIdx) => {
                        const isToday = isSameDay(day.date, new Date());
                        const isFuture = day.date > new Date();
                        
                        return (
                          <TooltipProvider key={dayIdx} delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleDayClick(day)}
                                  disabled={!day.isInRange || isFuture || day.transactions.length === 0}
                                  className={cn(
                                    "w-[10px] h-[10px] rounded-[2px] transition-all duration-150 border",
                                    !day.isInRange && "opacity-0 cursor-default border-transparent",
                                    day.isInRange && isFuture && "bg-muted/10 cursor-not-allowed border-border/20",
                                    day.isInRange && !isFuture && getColorClass(day.income, day.expense),
                                    isToday && "ring-[1.5px] ring-primary ring-offset-1 ring-offset-background",
                                    day.transactions.length > 0 && !isFuture && "cursor-pointer hover:ring-1 hover:ring-primary/50"
                                  )}
                                />
                              </TooltipTrigger>
                              {day.isInRange && (
                                <TooltipContent side="top" className="max-w-xs">
                                  <div className="text-xs">
                                    <div className="font-semibold mb-1">
                                      {format(day.date, "EEEE, MMMM dd, yyyy")}
                                    </div>
                                    {day.transactions.length > 0 ? (
                                      <>
                                        {day.income > 0 && (
                                          <div className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                            <span>Income:</span>
                                            <CurrencyDisplay amount={day.income} currency={userCurrency} />
                                          </div>
                                        )}
                                        {day.expense > 0 && (
                                          <div className="text-red-600 dark:text-red-400 flex items-center gap-1">
                                            <span>Expense:</span>
                                            <CurrencyDisplay amount={day.expense} currency={userCurrency} />
                                          </div>
                                        )}
                                        <div className="text-xs text-muted-foreground mt-1">
                                          {day.transactions.length} transaction{day.transactions.length !== 1 ? "s" : ""}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-muted-foreground">No transactions</div>
                                    )}
                                  </div>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t">
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-green-400 bg-clip-text text-transparent">
                {heatmapData.filter(d => d.income > 0).length}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Days with Income</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold bg-gradient-to-br from-red-600 to-red-400 bg-clip-text text-transparent">
                {heatmapData.filter(d => d.expense > 0).length}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Days with Expenses</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold gradient-title">
                {heatmapData.filter(d => d.transactions.length > 0).length}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Active Days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Transactions on {selectedDate && format(selectedDate.date, "MMMM dd, yyyy")}
            </DialogTitle>
            <DialogDescription>
              {selectedDate?.transactions.length} transaction{selectedDate?.transactions.length !== 1 ? "s" : ""} on this day
            </DialogDescription>
          </DialogHeader>

          {selectedDate && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Income</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    <CurrencyDisplay amount={selectedDate.income} currency={userCurrency} />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    <CurrencyDisplay amount={selectedDate.expense} currency={userCurrency} />
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                {selectedDate.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(transaction.date), "h:mm a")}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "text-lg font-semibold",
                        transaction.type === "INCOME" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      <CurrencyDisplay amount={transaction.amount} currency={userCurrency} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
