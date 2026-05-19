import React from "react";
import {
  BoxIconLine,
  GroupIcon,
  DollarLineIcon,
  PieChartIcon,
} from "../../icons";

interface SmartMetricsProps {
  totalSpent: number;
  avgBill: number;
  totalReceipts: number;
  topCategory: string;
}

export default function SmartMetrics({
  totalSpent,
  avgBill,
  totalReceipts,
  topCategory,
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
      label: "Average",
      value: `₹${avgBill.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subText: "per transaction",
      icon: BoxIconLine,
      iconColor: "text-emerald-500",
    },
    {
      label: "Records",
      value: totalReceipts,
      subText: "bills logged",
      icon: GroupIcon,
      iconColor: "text-orange-500",
    },
    {
      label: "Top Spend",
      value: topCategory || "N/A",
      subText: "highest category",
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
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-3 py-4 sm:px-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`size-6 sm:size-8 ${item.iconColor}`} />

              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:text-sm">
                {item.label}
              </span>
            </div>

            <p className="break-words text-base font-bold text-gray-900 dark:text-white sm:text-xl">
              {item.value}
            </p>

            <p className="mt-0.5 text-xs text-gray-400 sm:text-md">
              {item.subText}
            </p>
          </div>
        );
      })}
    </div>
  );
}
