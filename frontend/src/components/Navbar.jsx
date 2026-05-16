import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, PlusCircle, Clock, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-3 bg-primary-500 rounded-2xl text-white shadow-lg shadow-primary-200">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">SmartBill</p>
            <p className="text-xs text-slate-500">AI expense assistant</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100 p-2">
                <Link to="/dashboard" className="text-slate-700 hover:text-primary-600 px-4 py-2 rounded-2xl text-sm font-semibold transition-all">Dashboard</Link>
                <Link to="/upload" className="text-slate-700 hover:text-primary-600 px-4 py-2 rounded-2xl text-sm font-semibold transition-all">Add Bill</Link>
                <Link to="/history" className="text-slate-700 hover:text-primary-600 px-4 py-2 rounded-2xl text-sm font-semibold transition-all">History</Link>
              </div>
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">SmartBill User</p>
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-600 hover:text-primary-600 font-semibold text-sm">Login</Link>
              <Link to="/register" className="btn-gradient rounded-2xl px-5 py-2.5 text-sm font-bold">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
