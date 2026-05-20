import React from "react";

interface Props {
  expenses: any[];
  dailyTotals?: number[];
  weekStart?: string;
  weekEnd?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyInsights({
  expenses,
  dailyTotals: weeklyDailyTotals,
  weekStart,
  weekEnd,
}: Props) {
  const dailyTotals = Array.isArray(weeklyDailyTotals)
    ? weeklyDailyTotals
    : Array(7).fill(0);

  if (!Array.isArray(weeklyDailyTotals)) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    (expenses || []).forEach((exp) => {
      if (exp.date) {
        const date = new Date(exp.date);
        if (date >= startOfWeek && date <= endOfWeek) {
          const day = date.getDay();
          dailyTotals[day] += exp.amount || 0;
        }
      }
    });
  }

  const maxVal = Math.max(...dailyTotals, 1);
  const dateRange =
    weekStart && weekEnd
      ? `${new Date(weekStart).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })} - ${new Date(weekEnd).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })}`
      : "Current week";

  return (
    <div className="flex h-[420px] flex-col rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5">
      
      {/* HEADER */}
      <div className="mb-6">
        <h3 className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide sm:text-sm">
          Weekly Spending Pattern
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Daily breakdown for {dateRange}
        </p>
      </div>

      {/* CHART */}
      <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
        
        {dailyTotals.map((amount, i) => {
          const percentage = (amount / maxVal) * 100;

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-3 flex-1 group"
            >
              <div className="relative w-full flex flex-col items-center">
                
                {/* TOOLTIP */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
                  ₹{amount.toLocaleString("en-IN")}
                </div>

                {/* EXTRA THIN BAR */}
                <div
                  className="w-[10px] rounded-full bg-indigo-400 group-hover:bg-indigo-500 transition-all duration-500 ease-out shadow-sm"
                  style={{
                    height: `${
                      percentage === 0
                        ? 4
                        : (percentage * 200) / 100
                    }px`,
                  }}
                />
              </div>

              {/* DAY */}
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">
                {DAYS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm">
          
          <span className="text-gray-500 dark:text-gray-400">
            Peak Day
          </span>

          <span className="font-bold text-gray-900 dark:text-white">
            {
              DAYS[
                dailyTotals.indexOf(
                  Math.max(...dailyTotals)
                )
              ]
            }
          </span>
        </div>
      </div>
    </div>
  );
}
