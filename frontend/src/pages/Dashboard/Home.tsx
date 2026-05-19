import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

import SmartMetrics from "../../components/smart/SmartMetrics";
import PaymentMethodChart from "../../components/smart/PaymentMethodChart";
import CategoryBreakdown from "../../components/smart/CategoryBreakdown";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import RecentTransactions from "../../components/smart/RecentTransactions";
import { API_BASE_URL } from "../../config/api";
export default function Home() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  // ✅ SAFE API FETCH
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/expense`, {
          headers: { "x-auth-token": token },
        });

        const data = res.data;

        // ✅ Normalize API response safely
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

  // ✅ SAFE CALCULATIONS
  const totalSpent = Array.isArray(expenses)
    ? expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    : 0;

  const avgBill =
    expenses.length > 0 ? totalSpent / expenses.length : 0;

  // CATEGORY DATA
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

  // MONTHLY DATA
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

  return (
    <>
      <PageMeta
        title="Dashboard | Expenzoir"
        description="Expenzoir Expense Dashboard"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {/* METRICS */}
        <div className="col-span-12 space-y-6">
          <SmartMetrics
            totalSpent={totalSpent}
            avgBill={avgBill}
            totalReceipts={expenses.length}
            topCategory={topCategory}
          />
        </div>

        {/* RECENT TRANSACTIONS */}

    {/* MAIN CHART (BIGGER) */}
<div className="col-span-12 lg:col-span-8 flex">
  <StatisticsChart data={monthlyData} />
</div>

{/* SIDE CHART (SMALLER) */}
<div className="col-span-12 lg:col-span-4 flex">
  <CategoryBreakdown
    categoryCounts={categoryCounts}
    totalSpent={totalSpent}
  />
</div>{/* ROW: TRANSACTIONS + PAYMENT INTELLIGENCE */}
<div className="col-span-12 flex flex-col lg:flex-row gap-6 items-stretch">

  {/* LEFT - Recent Transactions */}
  <div className="w-full lg:w-1/2 flex">
    <div className="w-full h-full">
      <RecentTransactions expenses={expenses} />
    </div>
  </div>

  {/* RIGHT - Payment Intelligence */}
  <div className="w-full lg:w-1/2 flex">
    <div className="w-full h-full">
      <PaymentMethodChart expenses={expenses} />
    </div>
  </div>

</div>
      </div>
    </>
  );
}
