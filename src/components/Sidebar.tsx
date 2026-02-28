import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, Monitor, Printer, Wrench, Package, FileBarChart, 
  Upload, LayoutDashboard, Settings, Users, LogOut,
  ChevronDown, Sun, Moon, AlertTriangle, Droplet, FileText, Activity, RefreshCw, HelpCircle
} from 'lucide-react';
import { cn } from '../utils/cn';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(prev => prev === menu ? null : menu);
  };

  const menuItems = [
    { id: 'home', title: 'خانه', icon: Home, path: '/' },
    { id: 'dashboard', title: 'داشبورد مدیریتی', icon: LayoutDashboard, path: '/dashboard' },
    {
      id: 'register', title: 'ثبت مشخصات', icon: Monitor,
      children: [
        { title: 'سیستم', path: '/register/system' },
        { title: 'دستگاه کپی و پرینتر', path: '/register/printer' }
      ]
    },
    {
      id: 'list', title: 'لیست تجهیزات', icon: FileBarChart,
      children: [
        { title: 'سیستم', path: '/list/systems' },
        { title: 'دستگاه کپی و پرینتر', path: '/list/printers' }
      ]
    },
    {
      id: 'repairs', title: 'تعمیرات', icon: Wrench,
      children: [
        { title: 'تعمیرات سیستم', path: '/repairs/systems' },
        { title: 'تعمیرات پرینتر', path: '/repairs/printers' }
      ]
    },
    {
      id: 'inventory', title: 'انبارداری', icon: Package,
      children: [
        { title: 'قطعات یدکی', path: '/inventory/parts' },
        { title: 'مواد مصرفی', path: '/inventory/consumables' },
        { title: 'هشدار موجودی', path: '/inventory/alerts' }
      ]
    },
    {
      id: 'reports', title: 'گزارش‌گیری', icon: FileText,
      children: [
        { title: 'گزارش اموال', path: '/reports/assets' },
        { title: 'چاپ فرم تحویلی', path: '/reports/handover' }
      ]
    },
    { id: 'lifecycle', title: 'مدیریت چرخه عمر', icon: RefreshCw, path: '/lifecycle' },
    { id: 'audit-logs', title: 'لاگ تغییرات', icon: Activity, path: '/audit-logs' },
    {
      id: 'settings', title: 'تنظیمات و ابزارها', icon: Settings,
      children: [
        ...(user?.username === 'admin' ? [{ title: 'مدیریت کاربران', path: '/users' }] : []),
        { title: 'تعاریف', path: '/definitions' },
        { title: 'آپلود فایل', path: '/import' },
        { title: 'راهنمای سایت', path: '/help' }
      ]
    }
  ];

  return (
    <div className="fixed right-0 top-0 h-screen w-72 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] p-6 z-50 border-l border-gray-200/50 dark:border-gray-800/50 flex flex-col transition-all duration-300 print:hidden">
      <ul className="flex-1 space-y-2 overflow-y-auto pr-2 -mr-2">
        {menuItems.map(item => (
          <li key={item.id}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className="w-full flex items-center justify-between p-4 text-gray-800 dark:text-gray-200 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all font-medium"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", openMenu === item.id && "rotate-180")} />
                </button>
                {openMenu === item.id && (
                  <ul className="pr-12 mt-2 space-y-1">
                    {item.children.map(child => (
                      <li key={child.path}>
                        <NavLink
                          to={child.path}
                          end
                          className={({ isActive }) => cn(
                            "block p-2 text-sm rounded-xl transition-all",
                            isActive ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                          )}
                        >
                          {child.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-3 p-4 rounded-2xl transition-all font-medium",
                  isActive 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30" 
                    : "text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-6 border-t border-gray-200/50 dark:border-gray-800/50 shrink-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-white/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-semibold text-gray-900 dark:text-white">{user?.username}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.username === 'admin' ? 'مدیر سیستم' : 'کاربر'}</span>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 transition-colors shadow-sm"
              title={theme === 'dark' ? 'تم روشن' : 'تم تاریک'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full p-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl transition-all font-medium shadow-lg shadow-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            خروج از حساب
          </button>
          
          <div className="text-center">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              نسخه 1.2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

