import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import PageMeta from "../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import { GridIcon } from "../icons";
import { Download, Filter, TrendingUp, Receipt, Wallet, X, FileText, Calendar } from "lucide-react";

/* ─────────────────────────────────────────────
   PDF GENERATOR UTILITY
──────────────────────────────────────────── */


function generateStatementPDF(data: any) {
  const { type, period, summary, breakdown, expenses } = data;

  const fmt = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const money = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rows = expenses
    .map(
      (e: any) => `<tr>
        <td>${e.date ? fmt(e.date) : "—"}</td>
        <td>${e.shop}</td>
        <td>${e.category}</td>
        <td>${e.paymentMethod || "Other"}</td>
        <td style="text-align:right;font-weight:600;">${money(e.amount)}</td>
      </tr>`
    )
    .join("");

  const catRows = Object.entries(breakdown.byCategory)
    .map(([k, v]: any) => `<tr><td>${k}</td><td style="text-align:right;">${money(v)}</td></tr>`)
    .join("");

  const pmRows = Object.entries(breakdown.byPaymentMethod)
    .map(([k, v]: any) => `<tr><td>${k}</td><td style="text-align:right;">${money(v)}</td></tr>`)
    .join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Expenzoir Statement</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;padding:40px}
.header{border-bottom:3px solid #2563eb;padding-bottom:18px;margin-bottom:22px}
.header h1{font-size:22px;color:#2563eb;letter-spacing:-0.5px}
.header p{color:#6b7280;margin-top:4px;font-size:12px}
.meta{display:flex;gap:48px;margin-bottom:22px}
.meta label{font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;display:block;margin-bottom:2px}
.meta span{font-weight:700;font-size:14px}
.cards{display:flex;gap:12px;margin-bottom:26px}
.card{flex:1;background:#f3f4f6;border-radius:8px;padding:12px 14px}
.card label{font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;display:block;margin-bottom:3px}
.card span{font-weight:700;font-size:17px}
.sec{font-size:10px;text-transform:uppercase;letter-spacing:0.6px;color:#6b7280;font-weight:700;margin-bottom:8px}
table{width:100%;border-collapse:collapse;margin-bottom:24px}
th{background:#f9fafb;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;padding:9px 10px;border-bottom:1px solid #e5e7eb}
td{padding:9px 10px;border-bottom:1px solid #f3f4f6;font-size:13px}
.split{display:flex;gap:20px}
.split>div{flex:1}
.total td{font-weight:700;border-top:2px solid #e5e7eb;padding-top:10px}
.footer{margin-top:36px;border-top:1px solid #e5e7eb;padding-top:14px;font-size:11px;color:#9ca3af;text-align:center}
</style></head><body>
<div class="header">
  <h1>Expenzoir</h1>
  <p>Expense Statement · Generated ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
</div>
<div class="meta">
  <div><label>Period</label><span>${fmt(period.startDate)} – ${fmt(period.endDate)}</span></div>
  <div><label>Type</label><span style="text-transform:capitalize">${type}</span></div>
</div>
<div class="cards">
  <div class="card"><label>Total spent</label><span>${money(summary.totalSpent)}</span></div>
  <div class="card"><label>Transactions</label><span>${summary.count}</span></div>
  <div class="card"><label>Avg per transaction</label><span>${money(summary.avgAmount)}</span></div>
</div>
<div class="split">
  <div><p class="sec">By category</p><table><thead><tr><th>Category</th><th style="text-align:right">Amount</th></tr></thead><tbody>${catRows}</tbody></table></div>
  <div><p class="sec">By payment method</p><table><thead><tr><th>Method</th><th style="text-align:right">Amount</th></tr></thead><tbody>${pmRows}</tbody></table></div>
</div>
<p class="sec">All transactions</p>
<table>
  <thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Payment</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>${rows}<tr class="total"><td colspan="4">Total</td><td style="text-align:right">${money(summary.totalSpent)}</td></tr></tbody>
</table>
<div class="footer">Expenzoir · Auto-generated · ${expenses.length} record(s)</div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (w) w.onload = () => w.print();
}

type ReportType = "lastdays" | "custom";

const TABS: { value: ReportType; label: string }[] = [
  { value: "lastdays", label: "Last N days" },
  { value: "custom", label: "Custom range" },
];

const MONTHS = [
  { value: "01", label: "January" }, { value: "02", label: "February" },
  { value: "03", label: "March" },   { value: "04", label: "April" },
  { value: "05", label: "May" },     { value: "06", label: "June" },
  { value: "07", label: "July" },    { value: "08", label: "August" },
  { value: "09", label: "September" },{ value: "10", label: "October" },
  { value: "11", label: "November" },{ value: "12", label: "December" },
];

/* ─────────────────────────────────────────────
   REPORT MODAL COMPONENT
──────────────────────────────────────────── */
export function ReportModal({ onClose, token }: { onClose: () => void; token: string }) {
  const [reportType, setReportType] = useState<ReportType>("monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [days, setDays] = useState("30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => String(currentYear - i));
  const today = new Date().toISOString().split("T")[0];

  const openDatePicker = (input: HTMLInputElement | null) => {
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
  };

  const summaryLabel = () => {
    if (reportType === "monthly") {
      const m = MONTHS.find((x) => x.value === month)?.label ?? month;
      return `${m} ${year}`;
    }
    if (reportType === "yearly") return `Full year ${year}`;
    if (reportType === "lastdays") return `Last ${days} days`;
    if (fromDate && toDate) {
      const f = new Date(fromDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      const t = new Date(toDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      return `${f} → ${t}`;
    }
    return "Select date range";
  };

  const handleGenerate = async () => {
    setError("");
    if (reportType === "custom") {
      if (!fromDate || !toDate) { setError("Please select both From and To dates."); return; }
      if (new Date(fromDate) > new Date(toDate)) { setError("From date cannot be after To date."); return; }
    }
    setLoading(true);
    try {
      const params: Record<string, string> = { type: reportType };
      if (reportType === "monthly") { params.year = year; params.month = String(parseInt(month)); }
      else if (reportType === "yearly") { params.year = year; }
      else if (reportType === "lastdays") { params.days = days; }
      else { params.fromDate = fromDate; params.toDate = toDate; }

      const res = await axios.get(`${API_BASE_URL}/expense/statement`, {
        headers: { "x-auth-token": token },
        params,
      });

      if (!res.data.expenses?.length) {
        setError("No transactions found for this period.");
        return;
      }
      generateStatementPDF(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to fetch statement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[460px] max-h-[calc(100vh-3rem)] bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <FileText className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Generate report
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Export as printable PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800 px-6">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setReportType(tab.value); setError(""); }}
              className={`py-3 mr-5 text-[15px] font-medium border-b-2 transition whitespace-nowrap ${
                reportType === tab.value
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[calc(100vh-15rem)] custom-scrollbar">

          {/* Monthly */}
          {reportType === "monthly" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:text-white"
                >
                  {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:text-white"
                >
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Yearly */}
          {reportType === "yearly" && (
            <div>
              <label className="block text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:text-white"
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}

          {/* Last N Days */}
          {reportType === "lastdays" && (
            <div>
              <label className="block text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Number of days
              </label>
              <div className="flex gap-2">
                {["7", "14", "30", "60", "90"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2.5 text-sm rounded-xl border font-medium transition ${
                      days === d
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-500"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-gray-400 mt-2.5">Last {days} days from today</p>
            </div>
          )}

          {/* Custom Range */}
          {reportType === "custom" && (
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    From date
                  </label>
                  <div className="relative">
                    <input
                      ref={fromDateRef}
                      type="date"
                      value={fromDate}
                      max={toDate || today}
                      onClick={(e) => openDatePicker(e.currentTarget)}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="report-date-input w-full px-3 py-2.5 pr-10 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:text-white cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => openDatePicker(fromDateRef.current)}
                      className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                      aria-label="Open from date calendar"
                    >
                      <Calendar className="size-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    To date
                  </label>
                  <div className="relative">
                    <input
                      ref={toDateRef}
                      type="date"
                      value={toDate}
                      min={fromDate || undefined}
                      max={today}
                      onClick={(e) => openDatePicker(e.currentTarget)}
                      onChange={(e) => setToDate(e.target.value)}
                      className="report-date-input w-full px-3 py-2.5 pr-10 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:text-white cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => openDatePicker(toDateRef.current)}
                      className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                      aria-label="Open to date calendar"
                    >
                      <Calendar className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
              {fromDate && toDate && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-[12px] text-blue-700 dark:text-blue-300">
                    {new Date(fromDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    {" "}→{" "}
                    {new Date(toDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <X className="size-3.5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-[12px] text-gray-400 truncate max-w-[180px]">
            {summaryLabel()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[13px] font-semibold rounded-xl transition"
            >
              {loading ? (
                <>
                  <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Download className="size-3.5" />
                  Generate PDF
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
──────────────────────────────────────────── */
export default function History() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [showReportModal, setShowReportModal] = useState(false);

  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  useEffect(() => {
    fetchExpenses(currentPage);
  }, [token, currentPage]);

  const fetchExpenses = async (page: number) => {
    if (token) {
      try {
        const res = await axios.get(`${API_BASE_URL}/expense`, {
          headers: { "x-auth-token": token },
          params: { page, limit: pageSize },
        });
        setExpenses(res.data.expenses);
        setTotalPages(res.data.pagination.pages);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadCSV = () => {
    let csv = `Expenzoir - Expense Statement\nGenerated on,${new Date().toLocaleDateString("en-IN")}\n\n`;
    csv += `Date,Merchant,Category,Payment Method,Amount\n`;
    filteredExpenses.forEach((exp) => {
      csv += `"${exp.date ? new Date(exp.date).toLocaleDateString("en-IN") : "—"}","${exp.shop}","${exp.category}","${exp.paymentMethod || "Other"}","₹${exp.amount.toLocaleString("en-IN")}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `smartbill_statement_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allCategories = ["all", ...Array.from(new Set(expenses.map((e) => e.category)))];

  const allMonths = ["all", ...Array.from(
    new Set(
      expenses
        .filter((e) => e.date)
        .map((e) => {
          const d = new Date(e.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        })
    )
  ).sort().reverse()];

  const filteredExpenses = expenses.filter((exp) => {
    const matchSearch =
      exp.shop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = selectedCategory === "all" || exp.category === selectedCategory;

    const matchMonth =
      selectedMonth === "all" ||
      (exp.date &&
        (() => {
          const d = new Date(exp.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === selectedMonth;
        })());

    return matchSearch && matchCategory && matchMonth;
  });

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgAmount = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;

  const categoryColors: Record<string, any> = {
    Food: "primary",
    Shopping: "info",
    Medical: "error",
    Fuel: "warning",
    Bills: "success",
    Other: "light",
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] space-y-5">
        <PageMeta
          title="Expense History | Expenzoir"
          description="View all your historical expenses"
        />
        <div>
          <div className="h-8 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-100 dark:bg-gray-800/70" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="mb-4 h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-3 h-3 w-16 rounded bg-gray-100 dark:bg-gray-800/70" />
            </div>
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] space-y-5">
      <PageMeta
        title="Expense History | Expenzoir"
        description="View all your historical expenses"
      />

      {/* Report Modal */}
      {showReportModal && token && (
        <ReportModal token={token} onClose={() => setShowReportModal(false)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Expense Statement
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            All your transactions in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition w-fit"
          >
            <Download className="size-4" />
            CSV
          </button> */}
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition w-fit"
          >
            <FileText className="size-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-3 py-4 sm:px-5">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="size-4 text-blue-500" />
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:text-xs">Total Spent</span>
          </div>
          <p className="break-words text-base font-bold text-gray-900 dark:text-white sm:text-xl">
            ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-0.5 text-xs text-gray-400 sm:text-md">{filteredExpenses.length} transactions</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-3 py-4 sm:px-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-4 text-emerald-500" />
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:text-xs">Average</span>
          </div>
          <p className="break-words text-base font-bold text-gray-900 dark:text-white sm:text-xl">
            ₹{avgAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-0.5 text-xs text-gray-400 sm:text-md">per transaction</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-3 py-4 sm:px-5">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="size-4 text-orange-500" />
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:text-xs">Records</span>
          </div>
          <p className="break-words text-base font-bold text-gray-900 dark:text-white sm:text-xl">
            {filteredExpenses.length}
          </p>
          <p className="mt-0.5 text-xs text-gray-400 sm:text-md">bills logged</p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <GridIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search merchant, category..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-white appearance-none cursor-pointer sm:w-auto"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-auto">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-white appearance-none cursor-pointer sm:w-auto"
          >
            {allMonths.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All Months" : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="space-y-3 p-4 sm:hidden">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm">Loading transactions...</p>
            </div>
          ) : filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div
                key={expense._id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {expense.shop}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <span className="shrink-0 text-base font-bold text-gray-900 dark:text-white">
                    ₹{expense.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge color={categoryColors[expense.category] || "light"} size="md">
                    {expense.category}
                  </Badge>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    {expense.paymentMethod || "Other"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">
              {searchTerm || selectedCategory !== "all" || selectedMonth !== "all"
                ? "No transactions match your filters"
                : "No transactions recorded yet"}
            </p>
          )}
        </div>
        <div className="hidden max-w-full overflow-x-auto sm:block">
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-gray-400 text-sm">Loading transactions...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  <TableCell isHeader className="py-3.5 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </TableCell>
                  <TableCell isHeader className="py-3.5 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Merchant
                  </TableCell>
                  <TableCell isHeader className="py-3.5 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </TableCell>
                  <TableCell isHeader className="py-3.5 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment
                  </TableCell>
                  <TableCell isHeader className="py-3.5 px-6 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow
                      key={expense._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {expense.date
                          ? new Date(expense.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </TableCell>

                      <TableCell className="py-4 px-6">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {expense.shop}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {expense.entryType === "ai_extracted" ? "AI Extracted" : "Manual Entry"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-6">
                        <Badge color={categoryColors[expense.category] || "light"} size="md">
                          {expense.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                        {expense.paymentMethod || "Other"}
                      </TableCell>

                      <TableCell className="py-4 px-6 text-right">
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          ₹{expense.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center">
                      <p className="text-gray-400 text-sm">
                        {searchTerm || selectedCategory !== "all" || selectedMonth !== "all"
                          ? "No transactions match your filters"
                          : "No transactions recorded yet"}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Footer total */}
        {filteredExpenses.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition dark:text-white"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
