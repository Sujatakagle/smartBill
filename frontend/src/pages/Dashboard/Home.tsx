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
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/expense`, {
          headers: { "x-auth-token": token },
        });

        const data = res.data;

        const expensesArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.expenses)
          ? data.expenses
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setExpenses(expensesArray);
      } catch (err) {
        console.error(err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [token]);

  const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  const categoryCounts = expenses.reduce((acc: any, e) => {
    const key = e.category || "Other";
    acc[key] = (acc[key] || 0) + (e.amount || 0);
    return acc;
  }, {});

  const topCategory =
    Object.entries(categoryCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  const highestExpense = Math.max(...expenses.map((e) => e.amount || 0), 0);

  const now = new Date();

  const thisMonthSpend = expenses.reduce((s, e) => {
    const d = e.date ? new Date(e.date) : null;
    if (
      d &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    ) {
      return s + (e.amount || 0);
    }
    return s;
  }, 0);

  const monthlyData = Array(12).fill(0);

  expenses.forEach((e) => {
    const d = e.date ? new Date(e.date) : null;
    if (d) monthlyData[d.getMonth()] += e.amount || 0;
  });

  /* ---------------- LOADING UI ---------------- */
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

  /* ---------------- MAIN UI ---------------- */
  return (
    <>
      <PageMeta title="Dashboard" description="Expenzoir Dashboard" />

      {showReportModal && token && (
        <ReportModal token={token} onClose={() => setShowReportModal(false)} />
      )}

      <div className="flex flex-col gap-6 min-h-screen w-full overflow-x-hidden">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* LEFT TEXT */}
          <div>
           <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
  Welcome
</h1>

            <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Track your expenses, insights, and spending.
            </p>
          </div>

          {/* RIGHT BUTTON (FIXED MOBILE SIZE + RIGHT ALIGN) */}
          <div className="flex justify-end sm:justify-end">
            <button
              onClick={() => setShowReportModal(true)}
              className="
                inline-flex items-center gap-1.5
                px-2.5 py-1.5
                sm:px-4 sm:py-2
                text-xs sm:text-sm
                font-medium
                bg-blue-600 text-white
                rounded-md
                whitespace-nowrap
                shadow-sm
                hover:bg-blue-700
                transition
              "
            >
              <FileText className="size-3.5 sm:size-4" />
             Download Report
            </button>
          </div>

        </div>

        {/* METRICS */}
        <SmartMetrics
          totalSpent={totalSpent}
          avgBill={0}
          totalReceipts={expenses.length}
          topCategory={topCategory}
          highestExpense={highestExpense}
          thisMonthSpend={thisMonthSpend}
        />

        {/* INSIGHTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          <div className="min-w-0 flex flex-col overflow-hidden">
            <DailyInsights expenses={expenses} />
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

        {/* TABLE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          <div className="min-w-0 flex flex-col overflow-hidden">
            <TopMerchants expenses={expenses} />
          </div>

          <div className="min-w-0 flex flex-col overflow-hidden">
            <RecentTransactions expenses={expenses} />
          </div>

        </div>

        {/* CHART */}
        <div className="w-full min-w-0 flex flex-col overflow-hidden">
          <StatisticsChart data={monthlyData} />
        </div>

      </div>
    </>
  );
}