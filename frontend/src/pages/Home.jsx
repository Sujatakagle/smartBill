import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, BarChart2, History } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <header className="py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-700">SmartBill</p>
          </div>
        </header>

        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <span className="inline-flex rounded-full bg-primary-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-700">
                Expense automation
              </span>
              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
                Stop chasing receipts. Start controlling spend.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                SmartBill turns every bill into actionable insight with instant uploads, automatic categorization, and a modern finance workspace.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-800"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Try Demo
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">2 min</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">Upload time</p>
              </div>
              <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">99%</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">Auto accuracy</p>
              </div>
              <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">One place</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">All expense data</p>
              </div>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-8 shadow-2xl shadow-slate-200">
            <div className="absolute -right-10 top-12 h-20 w-20 rounded-full bg-primary-100/80 blur-3xl" />
            <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-primary-700/10" />

            <div className="relative z-10 space-y-8">
              <div className="rounded-[2rem] bg-slate-50 p-7 shadow-sm shadow-slate-100">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Live overview</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">Expense summary</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Securely capture bills, spot trends, and prepare reports without extra manual work.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-100 border border-slate-200">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-100 text-primary-700">
                    <Camera size={20} />
                  </div>
                  <p className="mt-5 font-semibold text-slate-950">Capture receipts</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Snap bills or upload files in one step.</p>
                </div>
                <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-100 border border-slate-200">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-100 text-primary-700">
                    <BarChart2 size={20} />
                  </div>
                  <p className="mt-5 font-semibold text-slate-950">Auto categorization</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">AI sorts every expense automatically.</p>
                </div>
                <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-100 border border-slate-200">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-100 text-primary-700">
                    <History size={20} />
                  </div>
                  <p className="mt-5 font-semibold text-slate-950">Track history</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Search past bills and spending in seconds.</p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200 border border-slate-200">
            <p className="text-xs uppercase tracking-[0.35em] text-primary-700">Finance teams</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">Smart expense control</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Make every expense visible and actionable with a dashboard built for business users.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200 border border-slate-200">
            <p className="text-xs uppercase tracking-[0.35em] text-primary-700">Operations</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">Stay audit ready</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Store receipts, bills and invoices in one place so audits and reports are effortless.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200 border border-slate-200">
            <p className="text-xs uppercase tracking-[0.35em] text-primary-700">Managers</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">Review spend trends</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Track categories, merchants, and daily spend with modern visuals and easy filters.
            </p>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-white p-10 shadow-2xl shadow-slate-200 border border-slate-200">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-primary-700">How it works</p>
              <h2 className="text-3xl font-black text-slate-950">Start in three easy steps</h2>
              <p className="text-sm leading-6 text-slate-600">
                SmartBill keeps onboarding fast, so you can focus on the work that matters.
              </p>
            </div>
            <div className="space-y-5 rounded-[2rem] bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Step 1</p>
              <h3 className="text-xl font-semibold text-slate-950">Upload bills</h3>
              <p className="text-sm leading-6 text-slate-600">Snap receipts with your phone or upload PDFs instantly.</p>
            </div>
            <div className="space-y-5 rounded-[2rem] bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Step 2</p>
              <h3 className="text-xl font-semibold text-slate-950">Review totals</h3>
              <p className="text-sm leading-6 text-slate-600">See categories, spend limits, and trends at a glance.</p>
            </div>
            <div className="space-y-5 rounded-[2rem] bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Step 3</p>
              <h3 className="text-xl font-semibold text-slate-950">Take action</h3>
              <p className="text-sm leading-6 text-slate-600">Use clear data to cut costs, approve spend, and close books faster.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
