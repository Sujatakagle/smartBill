import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FileText } from "lucide-react";
import { ReportModal } from "../History";

import SmartMetrics from "../../components/smart/SmartMetrics";
import PaymentMethodChart from "../../components/smart/PaymentMethodChart";
import CategoryBreakdown from "../../components/smart/CategoryBreakdown";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import RecentTransactions from "../../components/smart/RecentTransactions";
import TopMerchants from "../../components/smart/TopMerchants";
import DailyInsights from "../../components/smart/DailyInsights";
import { API_BASE_URL } from "../../config/api";

export default function Home() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/expense/dashboard`, {
          headers: { "x-auth-token": token },
          params: {
            year: selectedYear,
            ...(selectedMonth ? { month: selectedMonth } : {}),
          },
        });

        const data = res.data;

        const expensesArray = Array.isArray(data?.expenses) ? data.expenses : [];

        setDashboard(data);
        setExpenses(expensesArray);
      } catch (err) {
        console.error(err);
        setDashboard(null);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, selectedYear, selectedMonth]);

  const summary = dashboard?.summary || {};
  const breakdown = dashboard?.breakdown || {};
  const yearly = dashboard?.yearly || {};
  const weekly = dashboard?.weekly || {};
  const trend = dashboard?.trend || {};
  const totalSpent =
    typeof summary.totalSpent === "number"
      ? summary.totalSpent
      : expenses.reduce((s, e) => s + (e.amount || 0), 0);

  const categoryCounts =
    breakdown.categoryCounts ||
    expenses.reduce((acc: any, e) => {
      const key = e.category || "Other";
      acc[key] = (acc[key] || 0) + (e.amount || 0);
      return acc;
    }, {});

  const topCategory =
    summary.topCategory ||
    Object.entries(categoryCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  const highestExpense =
    typeof summary.highestExpense === "number"
      ? summary.highestExpense
      : Math.max(...expenses.map((e) => e.amount || 0), 0);
  const thisMonthSpend =
    typeof summary.thisMonthSpend === "number" ? summary.thisMonthSpend : 0;
  const monthlyData = Array.isArray(yearly.monthlyData)
    ? yearly.monthlyData
    : Array(12).fill(0);
  const trendData = Array.isArray(trend.data) ? trend.data : monthlyData;
  const trendCategories = Array.isArray(trend.categories)
    ? trend.categories
    : [
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
  const availableYears = Array.isArray(yearly.availableYears)
    ? yearly.availableYears
    : [selectedYear];
  const recentExpenses = Array.isArray(dashboard?.recentExpenses)
    ? dashboard.recentExpenses
    : expenses.slice(0, 5);

  const activeDays =
    summary.activeDays ||
    new Set(expenses.map((e) => new Date(e.date).toDateString())).size;

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekSpend =
    summary.thisWeekSpend ??
    expenses
      .filter((e) => new Date(e.date) >= startOfWeek)
      .reduce((s, e) => s + (e.amount || 0), 0);

  const paymentMethods = expenses.reduce((acc: any, e) => {
    const method = e.paymentMethod || "Other";
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  const topPaymentMethod =
    summary.topPaymentMethod ||
    Object.entries(paymentMethods).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  if (loading) {
    return (
      <>
        <PageMeta title="Dashboard" description="Expenzoir Dashboard" />

        <div className="min-h-screen w-full space-y-6 animate-pulse">
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Dashboard" description="Expenzoir Dashboard" />

      {showReportModal && token && (
        <ReportModal token={token} onClose={() => setShowReportModal(false)} />
      )}

      <div className="flex flex-col gap-6 min-h-screen w-full overflow-x-hidden">

        {/* HEADER */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

          <div className="flex items-center justify-between gap-4 sm:block">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Welcome
              </h1>
              <p className="mt-1 hidden text-base text-gray-600 dark:text-gray-400 sm:block sm:text-lg">
                Track your expenses, insights, and spending.
              </p>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setShowReportModal(true)}
                className="
                  inline-flex items-center gap-1.5
                  px-3 py-1.5
                  text-xs font-medium
                  bg-blue-600 text-white
                  rounded-md
                  whitespace-nowrap
                  shadow-sm
                "
              >
                <FileText className="size-3.5" />
                 Download Report
              </button>
            </div>
          </div>

          {/* HIDDEN ON MOBILE (Desktop version) */}
          <div className="hidden sm:flex">
            <button
              onClick={() => setShowReportModal(true)}
              className="
                inline-flex items-center gap-1.5
                px-4 py-2
                text-sm font-medium
                bg-blue-600 text-white
                rounded-md
                whitespace-nowrap
                shadow-sm
                hover:bg-blue-700
                transition
              "
            >
              <FileText className="size-4" />
              Download Report
            </button>
          </div>

          {/* MOBILE ONLY SUBTEXT */}
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:hidden">
            Track your expenses, insights, and spending.
          </p>

        </div>

        <SmartMetrics
          totalSpent={totalSpent}
          avgBill={summary.avgBill || 0}
          totalReceipts={summary.transactionCount || expenses.length}
          topCategory={topCategory}
          highestExpense={highestExpense}
          thisMonthSpend={thisMonthSpend}
          thisWeekSpend={thisWeekSpend}
          topPaymentMethod={topPaymentMethod}
          activeDays={activeDays}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="min-w-0 flex flex-col overflow-hidden">
                                    <TopMerchants expenses={expenses} />

          </div>

          <div className="min-w-0 flex flex-col overflow-hidden">
            <CategoryBreakdown
              categoryCounts={categoryCounts}
              totalSpent={totalSpent}
            />
          </div>

          <div className="min-w-0 flex flex-col overflow-hidden">
                <PaymentMethodChart expenses={expenses} />

 

          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
  <div className="min-w-0 flex flex-col overflow-hidden lg:col-span-2">
                                   <DailyInsights expenses={expenses} dailyTotals={weekly.dailyTotals} weekStart={weekly.startDate} weekEnd={weekly.endDate} />
  </div>

  <div className="min-w-0 flex flex-col overflow-hidden lg:col-span-3">
    <RecentTransactions expenses={recentExpenses} />
  </div>
</div>

        <div className="w-full min-w-0 flex flex-col overflow-hidden">
          <StatisticsChart
            data={trendData}
            categories={trendCategories}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            availableYears={availableYears}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            subtitle={trend.title || "Monthly overview"}
          />
        </div>

      </div>
    </>
  );
}
