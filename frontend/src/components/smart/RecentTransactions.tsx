import React from "react";

interface Props {
  expenses: any[];
}

export default function RecentTransactions({ expenses }: Props) {
  const recentExpenses = [...(expenses || [])].slice(0, 5);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-5 py-4 h-[420px] flex flex-col">

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Latest 5 expenses
        </p>
      </div>

      {/* TABLE (SCROLL AREA) */}
      <div className="flex-1 overflow-y-auto">

        <table className="w-full min-w-[600px]">

          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="pb-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Shop
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Category
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Payment
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="pb-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-b border-gray-100 dark:border-gray-800/50"
                >
                  {/* SHOP */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {expense.shop?.charAt(0) || "S"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {expense.shop || "Unknown Shop"}
                      </p>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="py-4">
                    <span className="rounded-full bg-gray-100 dark:bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {expense.category || "Other"}
                    </span>
                  </td>

                  {/* PAYMENT */}
                  <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                    {expense.paymentMethod || "Cash"}
                  </td>

                  {/* DATE */}
                  <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "No Date"}
                  </td>

                  {/* AMOUNT */}
                  <td className="py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                    ₹{Number(expense.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}