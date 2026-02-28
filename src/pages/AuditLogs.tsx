import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Activity, Search, Filter, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export const AuditLogs = () => {
  const { auditLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [filterEntity, setFilterEntity] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = 
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = filterAction === 'ALL' || log.action === filterAction;
      const matchesEntity = filterEntity === 'ALL' || log.entityType === filterEntity;

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [auditLogs, searchTerm, filterAction, filterEntity]);

  const getActionBadge = (action: string) => {
    switch(action) {
      case 'CREATE': return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700">ایجاد</span>;
      case 'UPDATE': return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700">ویرایش</span>;
      case 'DELETE': return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">حذف</span>;
      case 'LOGIN': return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700">ورود</span>;
      case 'LOGOUT': return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">خروج</span>;
      default: return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">{action}</span>;
    }
  };

  const getEntityName = (entityType: string) => {
    switch(entityType) {
      case 'System': return 'سیستم';
      case 'Printer': return 'پرینتر';
      case 'User': return 'کاربر';
      case 'Part': return 'قطعه';
      case 'Consumable': return 'کالای مصرفی';
      case 'RepairRecord': return 'تعمیرات';
      default: return entityType;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      <div className="flex justify-between items-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">لاگ تغییرات (Audit Log)</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">پیگیری تمامی فعالیت‌ها و تغییرات سیستم</p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="جستجو در جزئیات یا نام کاربر..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select 
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white transition-all"
            >
              <option value="ALL">همه عملیات‌ها</option>
              <option value="CREATE">ایجاد</option>
              <option value="UPDATE">ویرایش</option>
              <option value="DELETE">حذف</option>
              <option value="LOGIN">ورود</option>
              <option value="LOGOUT">خروج</option>
            </select>
            <select 
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white transition-all"
            >
              <option value="ALL">همه بخش‌ها</option>
              <option value="System">سیستم‌ها</option>
              <option value="Printer">پرینترها</option>
              <option value="User">کاربران</option>
              <option value="Part">قطعات</option>
              <option value="Consumable">کالاهای مصرفی</option>
              <option value="RepairRecord">تعمیرات</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">تاریخ و زمان</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">کاربر</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">عملیات</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">بخش</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">جزئیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    هیچ لاگی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap" dir="ltr">
                      {new Date(log.timestamp).toLocaleString('fa-IR')}
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{log.username}</td>
                    <td className="p-4">{getActionBadge(log.action)}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{getEntityName(log.entityType)}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
