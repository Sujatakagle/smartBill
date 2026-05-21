import React from "react";

interface Props {
  expenses: any[];
}

export default function PaymentMethodIntelligence({ expenses }: Props) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const gradients = [
    "from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-500/5",
    "from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5",
    "from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-500/5",
    "from-orange-50 to-orange-100 dark:from-orange-500/10 dark:to-orange-500/5",
    "from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-500/5",
    "from-slate-50 to-slate-100 dark:from-slate-500/10 dark:to-slate-500/5",
  ];

  const borderColors = [
    "border-emerald-200 dark:border-emerald-500/20",
    "border-blue-200 dark:border-blue-500/20",
    "border-purple-200 dark:border-purple-500/20",
    "border-orange-200 dark:border-orange-500/20",
    "border-rose-200 dark:border-rose-500/20",
    "border-slate-200 dark:border-slate-500/20",
  ];

  const dotColors = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-rose-500",
    "bg-slate-500",
  ];

  const map: Record<string, { amount: number; count: number }> = {};

  safeExpenses.forEach((exp) => {
    const method = exp?.paymentMethod || "Unknown";
    const amount = Number(exp?.amount) || 0;
    map[method] = {
      amount: (map[method]?.amount || 0) + amount,
      count: (map[method]?.count || 0) + 1,
    };
  });

  const total = Object.values(map).reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const sorted = Object.entries(map).sort(
    (a, b) => Number(b[1].amount) - Number(a[1].amount)
  );

  return (
    <div className="flex h-full min-h-[420px] w-full flex-col rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-white/[0.03]">

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide sm:text-sm">
          Payment Intelligence
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Spending by payment method
        </p>
      </div>

      {/* LIST */}
      <div className="flex flex-1 flex-col space-y-2.5 overflow-y-auto pr-1">

        {sorted.map(([method, value], index) => {
          const amount = Number(value.amount) || 0;
          const count = Number(value.count) || 0;
          const percent = total ? (amount / total) * 100 : 0;

          const gradient = gradients[index % gradients.length];
          const border = borderColors[index % borderColors.length];
          const dot = dotColors[index % dotColors.length];

          return (
            <div
              key={method}
              className={`rounded-lg border ${border} bg-gradient-to-r ${gradient} px-4 py-3 transition-all duration-300 hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">

                {/* LEFT */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full ${dot}`} />
                    <span className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-200">
                      {method}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {count} {count === 1 ? "transaction" : "transactions"} • {percent.toFixed(1)}% of total spend
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-2 h-1 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 dark:bg-white/90 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No payment data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
