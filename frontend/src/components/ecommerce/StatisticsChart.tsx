import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface StatisticsChartProps {
  data: number[];
}

export default function StatisticsChart({ data }: StatisticsChartProps) {
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "11px",
        },
        rotate: 0,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val) => `₹${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 250,
          },
          stroke: {
            width: 2,
          },
          markers: {
            size: 0,
          },
          grid: {
            padding: {
              left: 0,
              right: 0,
            },
          },
          xaxis: {
            tickAmount: 5,
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
          yaxis: {
            labels: {
              offsetX: -8,
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Spending",
      data: data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-xl border border-gray-200 bg-white px-4 pb-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4 flex flex-col gap-5 sm:mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
              <h3 className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide sm:text-sm">
            Spending Trends
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Monthly spending overview for {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div className="min-w-0 max-w-full overflow-hidden">
        <div className="min-w-0">
          <Chart
            options={options}
            series={series}
            type="area"
            height={typeof window !== "undefined" && window.innerWidth < 640 ? 250 : 310}
          />
        </div>
      </div>
    </div>
  );
}
