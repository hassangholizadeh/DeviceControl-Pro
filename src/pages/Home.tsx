import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Monitor, Printer, Package, FileText, Search, ArrowLeft } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/list/systems');
    }
  };

  const quickActions = [
    { title: 'ثبت سیستم جدید', icon: Monitor, link: '/register/system', color: 'bg-blue-500', hover: 'hover:bg-blue-600', shadow: 'shadow-blue-500/30' },
    { title: 'ثبت پرینتر جدید', icon: Printer, link: '/register/printer', color: 'bg-emerald-500', hover: 'hover:bg-emerald-600', shadow: 'shadow-emerald-500/30' },
    { title: 'ورود قطعه به انبار', icon: Package, link: '/inventory/parts', color: 'bg-purple-500', hover: 'hover:bg-purple-600', shadow: 'shadow-purple-500/30' },
    { title: 'گزارش‌گیری', icon: FileText, link: '/reports/assets', color: 'bg-amber-500', hover: 'hover:bg-amber-600', shadow: 'shadow-amber-500/30' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">سلام {user?.username}، روز بخیر! 👋</h1>
          <p className="text-indigo-100 max-w-2xl text-lg leading-relaxed">
            به سامانه یکپارچه مدیریت اموال و تجهیزات IT خوش آمدید. برای شروع می‌توانید از میانبرهای زیر استفاده کنید یا از طریق منوی سمت راست به بخش‌های مختلف دسترسی داشته باشید.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Monitor className="w-96 h-96 absolute -left-20 -bottom-20 transform -rotate-12" />
        </div>
      </div>

      {/* Quick Search */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-sm border border-white/50 dark:border-gray-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
          <Search className="w-6 h-6 text-indigo-500" />
          جستجوی سریع اموال
        </h2>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative z-10">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="کد اموال، کد IT یا نام تحویل‌گیرنده را وارد کنید..." 
            className="flex-1 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/50 dark:border-gray-700/50 border outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group"
          >
            جستجو
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          دسترسی سریع
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <Link 
              key={i} 
              to={action.link}
              className={`relative overflow-hidden ${action.color} text-white rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${action.shadow} flex flex-col items-center justify-center gap-4 group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500 -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl group-hover:bg-black/20 transition-colors duration-500 -ml-8 -mb-8" />
              
              <div className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                <action.icon className="w-10 h-10" />
              </div>
              <span className="relative z-10 font-bold text-lg tracking-wide">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
