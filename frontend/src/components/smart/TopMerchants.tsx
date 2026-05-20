import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Store, TrendingUp } from "lucide-react";

interface Props {
  expenses: any[];
}

export default function TopMerchants({ expenses }: Props) {
  const merchantTotals = (expenses || []).reduce((acc: any, exp) => {
    const shop = exp.shop || "Unknown";
    acc[shop] = (acc[shop] || 0) + (exp.amount || 0);
    return acc;
  }, {});

  const sortedMerchants = Object.entries(merchantTotals)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount: amount as number }));

  const total = sortedMerchants.reduce((sum, m) => sum + m.amount, 0);

  // Silent Pastel Palette
  const colors = ["#93c5fd", "#c4b5fd", "#fda4af", "#6ee7b7", "#fde68a", "#94a3b8"];

  const series = sortedMerchants.map((m) => m.amount);

  const options: ApexOptions = {
    chart: {
      type: "pie",
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      show: true,
      colors: ["#fff"],
      width: 2,
    },
    fill: {
      opacity: 1,
    },
    colors: colors,
    legend: {
      show: false,
    },
    labels: sortedMerchants.map((m) => m.name),
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: "11px",
        fontWeight: "700",
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) =>
          `₹${Number(val || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        dataLabels: {
            offset: -2,
        },
      }
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* HEADER */}
      <div className="mb-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 sm:text-sm">
          Top Merchants
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Venue spending distribution
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center min-h-0">
        {sortedMerchants.length > 0 ? (
          <>
            {/* PIE CHART - MATCHED SIZE */}
            <div className="relative flex items-center justify-center">
              <Chart
                options={options}
                series={series}
                type="pie"
                height={200}
                width={200}
              />
            </div>

            <div className="w-full space-y-2.5 mt-4">
              {sortedMerchants.map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: colors[i % colors.length] }} 
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {m.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                    ₹{m.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center opacity-50">
            <Store className="size-12 mb-2 text-gray-300" />
            <p className="text-sm text-gray-500">No merchant data detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
