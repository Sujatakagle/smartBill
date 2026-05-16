import React from 'react';
import { ShoppingBag, Utensils, Zap, PlusSquare, Fuel, HelpCircle, Trash2, IndianRupee, Calendar } from 'lucide-react';

const icons = {
  'Food': <Utensils size={20} />,
  'Shopping': <ShoppingBag size={20} />,
  'Medical': <PlusSquare size={20} />,
  'Fuel': <Fuel size={20} />,
  'Bills': <Zap size={20} />,
  'Other': <HelpCircle size={20} />
};

const bgColors = {
  'Food': 'bg-orange-100 text-orange-600',
  'Shopping': 'bg-blue-100 text-blue-600',
  'Medical': 'bg-amber-100 text-amber-600',
  'Fuel': 'bg-emerald-100 text-emerald-600',
  'Bills': 'bg-purple-100 text-purple-600',
  'Other': 'bg-slate-100 text-slate-600'
};

const ExpenseCard = ({ expense, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 group">
      <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${bgColors[expense.category] || bgColors['Other']}`}>
        {icons[expense.category] || icons['Other']}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-black text-slate-900 truncate mb-0.5">{expense.shop}</h4>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Calendar size={12} /> {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </span>
          <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-tighter rounded-md">
            {expense.category}
          </span>
        </div>
      </div>

      <div className="text-right flex items-center gap-4">
        <div className="font-black text-slate-900 text-lg flex items-center">
          <IndianRupee size={16} />{expense.amount.toLocaleString('en-IN')}
        </div>
        <button 
          onClick={() => onDelete(expense._id)} 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
