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

  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="h-full w-full flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-5 py-4">

      {/* HEADER */}
      <div className="mb-3">
              <h3 className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide sm:text-sm">
          Category Breakdown
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Distribution of your spending
        </p>
      </div>

      {/* DONUT */}
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 180 180">

          {/* BG */}
          <circle
            cx="90"
            cy="90"
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
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={colors[cat.name] || "#6366f1"}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeLinecap="round"
                transform={`rotate(${rotation - 90} 90 90)`}
              />
            );
          })}
        </svg>

        {/* CENTER */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-4 space-y-2.5">
        {categories.slice(0, 4).map((cat) => (
          <div key={cat.name} className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 flex-shrink-0 rounded-full"
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
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              ₹{cat.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}
