import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Props {
  data: number[];
  categories?: string[];
  selectedYear?: number;
  selectedMonth?: number | null;
  availableYears?: number[];
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number | null) => void;
  subtitle?: string;
}

export default function StatisticsChart({
  data,
  categories = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ],
  selectedYear = new Date().getFullYear(),
  selectedMonth = null,
  availableYears = [new Date().getFullYear()],
  onYearChange,
  onMonthChange,
  subtitle = "Monthly overview",
}: Props) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#465FFF"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.05,
      },
    },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4 },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: (v) => `₹${v}`,
      },
    },
  };

  return (
    <div className="w-full h-[380px] flex flex-col overflow-hidden rounded-xl border bg-white">

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
              <h3 className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide sm:text-sm">
            Spending Trends</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selectedYear}
            onChange={(event) => onYearChange?.(Number(event.target.value))}
            className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            aria-label="Select spending trend year"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth || 0}
            onChange={(event) => {
              const month = Number(event.target.value);
              onMonthChange?.(month || null);
            }}
            className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            aria-label="Select spending trend month"
          >
            <option value={0}>All months</option>
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <Chart
          options={options}
          series={[
            {
              name: "Spending",
              data: data.length ? data : Array(categories.length).fill(0),
            },
          ]}
          type="area"
          height="100%"
          width="100%"
        />
      </div>

    </div>
  );
}
