import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Props {
  data: number[];
}

export default function StatisticsChart({ data }: Props) {
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
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ],
    },
    yaxis: {
      labels: {
        formatter: (v) => `₹${v}`,
      },
    },
  };

  return (
    <div className="w-full h-[380px] flex flex-col overflow-hidden rounded-xl border bg-white">

      <div className="p-4">
        <h3 className="text-sm font-semibold">Spending Trends</h3>
        <p className="text-xs text-gray-500">Monthly overview</p>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <Chart
          options={options}
          series={[
            {
              name: "Spending",
              data: data.length ? data : Array(12).fill(0),
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