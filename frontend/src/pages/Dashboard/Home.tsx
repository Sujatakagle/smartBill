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
        console.error("Failed to fetch expenses", err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [token]);

  const totalSpent = Array.isArray(expenses)
    ? expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    : 0;

  const avgBill = expenses.length > 0 ? totalSpent / expenses.length : 0;

  const categoryCounts = Array.isArray(expenses)
    ? expenses.reduce((acc: any, exp) => {
        const key = exp.category || "Other";
        acc[key] = (acc[key] || 0) + (exp.amount || 0);
        return acc;
      }, {})
    : {};

  const topCategory =
    Object.entries(categoryCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  const highestExpense = Array.isArray(expenses)
    ? Math.max(...expenses.map((e) => e.amount || 0), 0)
    : 0;

  const now = new Date();
  const thisMonthSpend = Array.isArray(expenses)
    ? expenses.reduce((sum, exp) => {
        const d = exp.date ? new Date(exp.date) : null;
        if (d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
          return sum + (exp.amount || 0);
        }
        return sum;
      }, 0)
    : 0;

  const currentYear = new Date().getFullYear();
  const monthlyData = Array(12).fill(0);

  if (Array.isArray(expenses)) {
    expenses.forEach((exp) => {
      const date = exp.date ? new Date(exp.date) : null;
      if (date && date.getFullYear() === currentYear) {
        monthlyData[date.getMonth()] += exp.amount || 0;
      }
    });
  }

  if (loading) {
    return (
      <>
        <PageMeta
          title="Dashboard | Expenzoir"
          description="Expenzoir Expense Dashboard"
        />
        <div className="min-h-[calc(100vh-8rem)] space-y-4 md:space-y-6">
          <div>
            <div className="h-8 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-100 dark:bg-gray-800/70" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="mb-4 h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-6 w-28 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-3 h-3 w-20 rounded bg-gray-100 dark:bg-gray-800/70" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 h-[420px] animate-pulse rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-4" />
            <div className="col-span-12 h-[420px] animate-pulse rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-4" />
            <div className="col-span-12 h-[420px] animate-pulse rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-4" />
            <div className="col-span-12 h-80 animate-pulse rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Dashboard | Expenzoir"
        description="Expenzoir Expense Dashboard"
      />

      {showReportModal && token && (
        <ReportModal token={token} onClose={() => setShowReportModal(false)} />
      )}

      <div className="min-h-[calc(100vh-8rem)] grid grid-cols-12 gap-4 md:gap-6">

        {/* HEADER */}
        <div className="col-span-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to Expenzoir
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track your spending, receipts, and payment insights in one place.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-blue-200 dark:shadow-none"
            >
              <FileText className="size-4" />
              Download Report
            </button>
          </div>
        </div>

        {/* METRICS */}
        <div className="col-span-12">
          <SmartMetrics
            totalSpent={totalSpent}
            avgBill={avgBill}
            totalReceipts={expenses.length}
            topCategory={topCategory}
            highestExpense={highestExpense}
            thisMonthSpend={thisMonthSpend}
          />
        </div>

        {/* ROW: Spending Trends + Category Breakdown + Payment Intelligence */}
        <div className="col-span-12 lg:col-span-4 min-w-0 h-[420px]">
                    <DailyInsights expenses={expenses} />


        </div>

        <div className="col-span-12 lg:col-span-4 min-w-0 h-[420px]">
          <CategoryBreakdown
            categoryCounts={categoryCounts}
            totalSpent={totalSpent}
          />
        </div>

        <div className="col-span-12 lg:col-span-4 min-w-0 h-[420px]">
          <PaymentMethodChart expenses={expenses} />
        </div>

        {/* ROW: Top Merchants + Daily Insights */}
        <div className="col-span-12 lg:col-span-6 min-w-0 h-[420px]">
          <TopMerchants expenses={expenses} />
        </div>

        <div className="col-span-12 lg:col-span-6 min-w-0 h-[420px]">
          <RecentTransactions expenses={expenses} />
        </div>

        {/* RECENT TRANSACTIONS - FULL WIDTH */}
        <div className="col-span-12">
                    <StatisticsChart data={monthlyData} />

        </div>

      </div>
    </>
  );
}