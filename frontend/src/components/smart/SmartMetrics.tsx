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
      value: `₹${totalSpent.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      subText: `${totalReceipts} transactions`,
      icon: DollarLineIcon,
      iconColor: "text-blue-500",
    },

    {
      label: "Highest Bill",
      value: `₹${(highestExpense || 0).toLocaleString("en-IN")}`,
      subText: "Single largest spend",
      icon: TrendingUp,
      iconColor: "text-orange-500",
    },

    {
      label: "This Month",
      value: `₹${(thisMonthSpend || 0).toLocaleString("en-IN")}`,
      subText: "Spend in current month",
      icon: CalenderIcon,
      iconColor: "text-emerald-500",
    },

    {
      label: "Top Spend",
      value: topCategory || "N/A",
      subText: "Highest category",
      icon: PieChartIcon,
      iconColor: "text-purple-500",
    },

   
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {data.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white px-3 py-2.5 transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] sm:px-5"
          >

            {/* 🔥 Decorative Circle (HIDDEN ON MOBILE) */}
            <div className="hidden sm:block absolute -right-4 -top-4 size-24 rounded-full bg-gray-50 transition-transform duration-500 group-hover:scale-110 dark:bg-white/[0.02]" />

            {/* 🔥 Decorative Bars (HIDDEN ON MOBILE) */}
            <div className="hidden sm:flex absolute bottom-4 right-4 h-8 items-end gap-1">
              <div className="h-2 w-1 rounded-full bg-gray-100 transition-all duration-300 group-hover:h-4 dark:bg-gray-800" />
              <div className="h-4 w-1 rounded-full bg-gray-100 transition-all duration-500 group-hover:h-6 dark:bg-gray-800" />
              <div className="h-3 w-1 rounded-full bg-gray-100 transition-all duration-300 group-hover:h-5 dark:bg-gray-800" />
            </div>

            {/* HEADER */}
            <div className="relative mb-1 flex items-center gap-2">
              <Icon className={`size-6 sm:size-8 ${item.iconColor}`} />

              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-sm">
                {item.label}
              </span>
            </div>

            {/* VALUE */}
            <p className="break-words text-base font-bold text-gray-900 dark:text-white sm:text-xl">
              {item.value}
            </p>

            {/* SUBTEXT */}
            <p className="mt-0.5 text-xs text-gray-400">
              {item.subText}
            </p>

          </div>
        );
      })}
    </div>
  );
}
