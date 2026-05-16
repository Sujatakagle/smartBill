import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ExpenseCard from '../components/ExpenseCard';
import { Filter, Search, History as HistoryIcon, ArrowUpRight } from 'lucide-react';

const History = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredExpenses = expenses.filter(e => {
    const matchesFilter = filter === 'All' || e.category === filter;
    const matchesSearch = e.shop.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const categoriesCount = [...new Set(expenses.map(e => e.category))].length;
  const recentExpense = expenses[0];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <HistoryIcon size={32} className="text-primary-500" /> Expense History
              </h2>
              <p className="text-slate-500">Search, filter, and manage all saved bills.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Total spent</p>
                <p className="mt-3 text-2xl font-black text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Receipts</p>
                <p className="mt-3 text-2xl font-black text-slate-900">{expenses.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Categories</p>
                <p className="mt-3 text-2xl font-black text-slate-900">{categoriesCount}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative rounded-[2rem] border border-slate-200 bg-slate-50 p-4">
              <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm">Live</div>
              <div className="flex items-center gap-3">
                <Search className="text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search merchant or note..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-slate-200 bg-slate-50 p-4">
              <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm">Filter</div>
              <div className="flex items-center gap-3">
                <Filter className="text-slate-400" size={18} />
                <select
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All categories</option>
                  {['Food', 'Shopping', 'Medical', 'Fuel', 'Bills', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredExpenses.length ? (
              filteredExpenses.map(expense => (
                <ExpenseCard key={expense._id} expense={expense} onDelete={deleteExpense} />
              ))
            ) : (
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-14 text-center">
                <p className="text-xl font-bold text-slate-900">No expenses found</p>
                <p className="mt-2 text-sm text-slate-500">Try adjusting your search or selecting a different category.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50">
          <div className="rounded-[2rem] bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Snapshot</p>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">Quick overview</h3>
            <p className="mt-3 text-sm text-slate-500">A fast glance at your latest receipts and spending behavior.</p>
          </div>

          {recentExpense ? (
            <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Latest receipt</p>
                <ArrowUpRight size={16} className="text-primary-500" />
              </div>
              <p className="text-lg font-black text-slate-900">{recentExpense.shop}</p>
              <p className="text-sm text-slate-500">{new Date(recentExpense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p className="text-2xl font-black text-slate-900">₹{recentExpense.amount.toLocaleString('en-IN')}</p>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{recentExpense.category}</span>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">No receipts available yet. Upload one to populate this panel.</p>
            </div>
          )}

          <div className="rounded-[2rem] bg-gradient-to-br from-primary-700 via-indigo-700 to-slate-900 p-6 text-white shadow-xl shadow-primary-100/30">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Need a quick action?</p>
            <div className="mt-5 space-y-3">
              <Link to="/upload" className="block rounded-3xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 hover:text-white">Upload receipt</Link>
              <Link to="/history" className="block rounded-3xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 hover:text-white">Review history</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default History;
