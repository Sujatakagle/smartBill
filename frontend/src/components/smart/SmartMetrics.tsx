import React from "react";
import {
  DollarLineIcon,
  PieChartIcon,
  CalenderIcon,
  TimeIcon,
} from "../../icons";

import { TrendingUp, CreditCard, Activity, CalendarDays } from "lucide-react";

interface SmartMetricsProps {
  totalSpent: number;
  avgBill: number;
  totalReceipts: number;
  topCategory: string;
  highestExpense?: number;
  thisMonthSpend?: number;
  thisWeekSpend?: number;
  topPaymentMethod?: string;
  activeDays?: number;
}

export default function SmartMetrics({
  totalSpent,
  avgBill,
  totalReceipts,
  topCategory,
  highestExpense,
  thisMonthSpend,
  thisWeekSpend,
  topPaymentMethod,
  activeDays,
}: SmartMetricsProps) {
  const data = [
    {
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      subText: `${totalReceipts} Transactions`,
      icon: DollarLineIcon,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },

    {
      label: "Highest Bill",
      value: `₹${(highestExpense || 0).toLocaleString("en-IN")}`,
      subText: "Largest Expense",
      icon: TrendingUp,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },

    {
      label: "This Month",
      value: `₹${(thisMonthSpend || 0).toLocaleString("en-IN")}`,
      subText: "Monthly Total",
      icon: CalenderIcon,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },

    {
      label: "Top Spend",
      value: topCategory || "N/A",
      subText: "Top Category",
      icon: PieChartIcon,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },

    {
      label: "Avg Bill",
      value: `₹${avgBill.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}`,
      subText: "Average per Bill",
      icon: TimeIcon,
      iconColor: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },

    {
      label: "This Week",
      value: `₹${(thisWeekSpend || 0).toLocaleString("en-IN")}`,
      subText: "Weekly Total",
      icon: CalendarDays,
      iconColor: "text-pink-500",
      bgColor: "bg-pink-50",
    },

    {
      label: "Top Payment",
      value: topPaymentMethod || "N/A",
      subText: "Primary Method",
      icon: CreditCard,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },

    {
      label: "Active Days",
      value: `${activeDays || 0} Days`,
      subText: "Usage History",
      icon: Activity,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {data.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] sm:p-5"
          >
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className={`flex size-9 items-center justify-center rounded-lg ${item.bgColor} dark:bg-white/5 sm:size-11 sm:rounded-xl`}>
                <Icon className={`size-5 sm:size-6 ${item.iconColor}`} />
              </div>

              <div className="flex flex-col gap-0.5">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 sm:text-sm">
                  {item.label}
                </p>
                <p className="text-[8px] leading-tight text-gray-400 sm:text-[11px]">
                  {item.subText}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-bold text-gray-900 dark:text-white sm:text-base">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
