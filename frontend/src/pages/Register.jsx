import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-5xl">
        <div className="grid gap-10 rounded-[2rem] bg-white shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-10 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] mb-6">
                <Sparkles size={14} /> Start your journey
              </div>
              <h2 className="text-4xl font-black leading-tight mb-4">Create your SmartBill account</h2>
              <p className="text-slate-100/90 text-lg leading-8">
                Upload receipts, automate expense extraction, and see your spending with clear dashboards.
              </p>
            </div>
            <div className="mt-10 rounded-[1.75rem] bg-white/10 p-6 text-sm text-slate-100 shadow-lg shadow-slate-500/10">
              <p className="font-semibold mb-3">Why SmartBill?</p>
              <ul className="space-y-3 text-slate-200">
                <li>• Fast receipt parsing with Gemini AI</li>
                <li>• Categorized spending automatically</li>
                <li>• Secure login and seamless dashboard access</li>
              </ul>
            </div>
          </div>

          <div className="p-10">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Secure setup</p>
              <h3 className="mt-4 text-3xl font-extrabold text-slate-900">Join SmartBill in seconds</h3>
              <p className="mt-3 text-sm text-slate-500">Create your account and begin organizing your expenses with confidence.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="w-full rounded-2xl btn-gradient py-4 text-base font-bold flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5">
                Create Account <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
