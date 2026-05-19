import React from "react";

interface CategoryBreakdownProps {
  categoryCounts: Record<string, number>;
  totalSpent: number;
}

export default function CategoryBreakdown({
  categoryCounts,
  totalSpent,
}: CategoryBreakdownProps) {

  const categories = Object.entries(categoryCounts)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const colors: Record<string, string> = {
    Food: "#f97316",
    Shopping: "#3b82f6",
    Medical: "#ef4444",
    Fuel: "#6366f1",
    Bills: "#10b981",
    Other: "#6b7280",
  };

  // 🔥 SLIGHTLY BIGGER CHART
  const radius = 85;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-5 py-4">

      {/* HEADER */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Category Breakdown
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Distribution of your spending
        </p>
      </div>

      {/* DONUT (BIGGER) */}
      <div className="relative flex items-center justify-center">

        <svg width="260" height="260" viewBox="0 0 220 220">

          {/* BG */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />

          {/* SEGMENTS */}
          {categories.map((cat, index) => {
            const percent = cat.percentage / 100;
            const dash = percent * circumference;
            const gap = circumference - dash;
            const rotation = cumulativePercent * 360;

            cumulativePercent += percent;

            return (
              <circle
                key={index}
                cx="110"
                cy="110"
                r={radius}
                fill="transparent"
                stroke={colors[cat.name] || "#6366f1"}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeLinecap="round"
                transform={`rotate(${rotation - 90} 110 110)`}
              />
            );
          })}
        </svg>

        {/* CENTER */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* 🔥 ONLY TOP 2 CATEGORIES BELOW */}
      <div className="mt-6 space-y-3">

        {categories.slice(0, 2).map((cat) => (
          <div
            key={cat.name}
            className="flex items-center justify-between"
          >

            {/* LEFT */}
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[cat.name] || "#6366f1" }}
              />

              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {cat.name}
              </span>

              <span className="text-xs text-gray-500">
                {cat.percentage.toFixed(1)}%
              </span>
            </div>

            {/* RIGHT */}
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              ₹{cat.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}