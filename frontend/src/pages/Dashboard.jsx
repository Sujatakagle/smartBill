import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import CategoryChart from '../components/CategoryChart';
import MonthlyGraph from '../components/MonthlyGraph';
import ExpenseCard from '../components/ExpenseCard';
import { TrendingUp, Wallet, Calendar, ArrowUpRight, ArrowRight, BarChart3, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expense');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expense/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const averageExpense = expenses.length ? totalSpent / expenses.length : 0;
  const categoryData = expenses.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.category);
    if (found) found.value += curr.amount;
    else acc.push({ name: curr.category, value: curr.amount });
    return acc;
  }, []);

  const dailyData = expenses
    .reduce((acc, curr) => {
      const day = new Date(curr.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const found = acc.find(item => item.day === day);
      if (found) found.amount += curr.amount;
      else acc.push({ day, amount: curr.amount });
      return acc;
    }, [])
    .reverse()
    .slice(0, 7);

  const topCategories = categoryData.sort((a, b) => b.value - a.value).slice(0, 3);
  const recentExpense = expenses[0];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_1.8fr] animate-in fade-in duration-500">
      <aside className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.3em] text-slate-600">
            <Wallet size={16} /> Smart Summary
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Hello, {user?.name}</h2>
            <p className="text-slate-500">Your spending snapshot for the last 30 days.</p>
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] bg-slate-50 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Total spent</p>
              <p className="mt-2 text-3xl font-black text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-500 text-white">
              <BarChart3 size={20} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Receipts</p>
              <p className="mt-3 text-2xl font-black text-slate-900">{expenses.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Avg. spend</p>
              <p className="mt-3 text-2xl font-black text-slate-900">₹{averageExpense.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] bg-gradient-to-br from-slate-950 via-primary-700 to-indigo-700 p-6 text-white shadow-2xl shadow-slate-200/10">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Quick actions</p>
          <div className="grid gap-3">
            <Link to="/upload" className="inline-flex items-center justify-between rounded-3xl border border-white/20 bg-white/10 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-white/20 hover:shadow-2xl">
              <span>Add Receipt</span>
              <PlusCircle size={18} />
            </Link>
            <Link to="/history" className="inline-flex items-center justify-between rounded-3xl border border-white/20 bg-white/10 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-white/20 hover:shadow-2xl">
              <span>View History</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Top categories</p>
          <div className="mt-5 space-y-4">
            {topCategories.length ? topCategories.map((category) => (
              <div key={category.name} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">{category.name}</span>
                <span className="text-sm font-black text-slate-900">₹{category.value.toLocaleString('en-IN')}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500">Upload a bill to start seeing category insights.</p>
            )}
          </div>
        </div>
      </aside>

      <main className="space-y-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
            <h1 className="text-3xl font-extrabold text-slate-900">Expense Performance</h1>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-white px-5 py-3 shadow-sm border border-slate-200">
            <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Monthly</button>
            <button className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Yearly</button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total spend</p>
            <p className="mt-4 text-3xl font-black text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</p>
            <p className="mt-3 text-sm text-slate-500">Spending across all receipts this month.</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Average bill</p>
            <p className="mt-4 text-3xl font-black text-slate-900">₹{averageExpense.toFixed(0)}</p>
            <p className="mt-3 text-sm text-slate-500">Average spend per logged receipt.</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total receipts</p>
            <p className="mt-4 text-3xl font-black text-slate-900">{expenses.length}</p>
            <p className="mt-3 text-sm text-slate-500">Receipts captured in the current view.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Spending distribution</h2>
                <p className="text-sm text-slate-500">See where your money is going.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Top 7</span>
            </div>
            <CategoryChart data={categoryData} />
          </section>

          <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Weekly trend</h2>
                <p className="text-sm text-slate-500">Latest activity over the last 7 days.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-500">
                <TrendingUp size={16} /> Growth
              </div>
            </div>
            <MonthlyGraph data={dailyData} />
          </section>
        </div>

        <section className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Recent activity</h2>
              <p className="text-sm text-slate-500">Review the most recent receipts and actions.</p>
            </div>
            <Link to="/history" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 transition">
              View full history
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {expenses.slice(0, 4).map((expense) => (
              <ExpenseCard key={expense._id} expense={expense} onDelete={deleteExpense} />
            ))}
            {expenses.length === 0 && (
              <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
                <p className="text-slate-400 font-bold">No expenses found. Upload a bill to get started.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
