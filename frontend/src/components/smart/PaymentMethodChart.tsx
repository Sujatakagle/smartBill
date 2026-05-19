import React from "react";

interface Props {
  expenses: any[];
}

export default function PaymentMethodIntelligence({ expenses }: Props) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const gradients = [
    "from-emerald-50 to-emerald-100",
    "from-blue-50 to-blue-100",
    "from-purple-50 to-purple-100",
    "from-orange-50 to-orange-100",
    "from-rose-50 to-rose-100",
    "from-slate-50 to-slate-100",
  ];

  const borderColors = [
    "border-emerald-200",
    "border-blue-200",
    "border-purple-200",
    "border-orange-200",
    "border-rose-200",
    "border-slate-200",
  ];

  const dotColors = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-rose-500",
    "bg-slate-500",
  ];

  const map: Record<string, number> = {};

  safeExpenses.forEach((exp) => {
    const method = exp?.paymentMethod || "Unknown";
    const amount = Number(exp?.amount) || 0;
    map[method] = (map[method] || 0) + amount;
  });

  const total = Object.values(map).reduce((a, b) => a + Number(b || 0), 0);

  const sorted = Object.entries(map).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  );

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-5 py-4 h-[420px] flex flex-col">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Payment Intelligence
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Spending by payment method
        </p>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">

        {sorted.map(([method, value], index) => {
          const amount = Number(value) || 0;
          const percent = total ? (amount / total) * 100 : 0;

          const gradient = gradients[index % gradients.length];
          const border = borderColors[index % borderColors.length];
          const dot = dotColors[index % dotColors.length];

          return (
            <div
              key={method}
              className={`rounded-lg border ${border} bg-gradient-to-r ${gradient} px-4 py-3`}
            >
              <div className="flex items-center justify-between">

                {/* LEFT */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full ${dot}`} />

                    <span className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                      {method}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {percent.toFixed(1)}% of total spend
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* BAR */}
              <div className="mt-2 h-1 w-full bg-white/60 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 dark:bg-white rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}