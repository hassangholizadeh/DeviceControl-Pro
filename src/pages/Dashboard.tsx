import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Monitor, Printer, Package, AlertTriangle, Clock, TrendingUp, Users, Wrench, Activity } from 'lucide-react';
import { Link } from 'react-router';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export const Dashboard = () => {
  const { systems, printers, parts, consumables, users, repairs, auditLogs } = useData();
  const { user } = useAuth();

  const totalInventory = parts.reduce((sum, p) => sum + p.stock, 0) + consumables.reduce((sum, c) => sum + c.stock, 0);
  const lowStockParts = parts.filter(p => p.stock <= p.minStock);
  const lowStockConsumables = consumables.filter(c => c.stock <= c.minStock);
  const lowStockCount = lowStockParts.length + lowStockConsumables.length;
  const pendingRepairs = repairs.filter(r => r.status === 'Pending' || r.status === 'In Progress').length;
  const recentActivity = auditLogs.length;

  const stats = [
    { title: 'سیستم‌های ثبت شده', value: systems.length, icon: Monitor, color: 'from-blue-500 to-blue-600', link: '/list/systems' },
    { title: 'پرینترهای ثبت شده', value: printers.length, icon: Printer, color: 'from-emerald-500 to-emerald-600', link: '/list/printers' },
    { title: 'تعمیرات در جریان', value: pendingRepairs, icon: Wrench, color: 'from-orange-500 to-orange-600', link: '/repairs/systems' },
    { title: 'هشدارهای موجودی', value: lowStockCount, icon: AlertTriangle, color: 'from-amber-500 to-amber-600', link: '/inventory/alerts' },
  ];

  // Chart Data
  const assetsPieData = {
    labels: ['سیستم‌ها', 'پرینترها'],
    datasets: [
      {
        data: [systems.length, printers.length],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
        borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const inventoryBarData = {
    labels: ['قطعات یدکی', 'مواد مصرفی'],
    datasets: [
      {
        label: 'موجودی کل',
        data: [
          parts.reduce((sum, p) => sum + p.stock, 0),
          consumables.reduce((sum, c) => sum + c.stock, 0)
        ],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
      },
    ],
  };

  const repairsPieData = {
    labels: ['در انتظار', 'در حال انجام', 'تکمیل شده'],
    datasets: [
      {
        data: [
          repairs.filter(r => r.status === 'Pending').length,
          repairs.filter(r => r.status === 'In Progress').length,
          repairs.filter(r => r.status === 'Completed').length
        ],
        backgroundColor: ['rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
        borderColor: ['rgba(245, 158, 11, 1)', 'rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const recentSystems = [...systems].reverse().slice(0, 5);
  const recentLogs = [...auditLogs].slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-white/50 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            داشبورد مدیریتی
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            خلاصه وضعیت سیستم‌ها، پرینترها و انبار در یک نگاه
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/50 p-3 rounded-2xl border border-white/50 dark:border-gray-700/50">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">کاربر فعال</div>
            <div className="font-bold text-gray-900 dark:text-white">{user?.username}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-xl">
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${stat.color}`} />
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</div>
            </div>
            <div className="relative z-10 text-sm font-bold text-gray-500 dark:text-gray-400 mb-4">{stat.title}</div>
            <Link to={stat.link} className="relative z-10 inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors group/link">
              مشاهده جزئیات <span className="mr-2 transform group-hover/link:-translate-x-1 transition-transform">&larr;</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">توزیع اموال IT</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Pie data={assetsPieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <Package className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">وضعیت انبار</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Bar 
              data={inventoryBarData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <Wrench className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">وضعیت تعمیرات</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Pie data={repairsPieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">آخرین سیستم‌های ثبت شده</h3>
            </div>
            <Link to="/list/systems" className="text-sm text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors">مشاهده همه</Link>
          </div>
          
          {recentSystems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 text-sm">
                  <tr>
                    <th className="p-4 font-bold rounded-r-2xl">کد اموال</th>
                    <th className="p-4 font-bold">تحویل گیرنده</th>
                    <th className="p-4 font-bold rounded-l-2xl">تاریخ تحویل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {recentSystems.map(sys => (
                    <tr key={sys.id} className="hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                      <td className="p-4 font-bold text-gray-900 dark:text-white">{sys.CaseAssetCode}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">{sys.FullName}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 text-sm font-medium">{sys.DeliveryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8 font-medium">
              هیچ سیستمی ثبت نشده است
            </div>
          )}
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">آخرین فعالیت‌ها</h3>
            </div>
            <Link to="/audit-logs" className="text-sm text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors">مشاهده همه</Link>
          </div>
          
          <div className="space-y-4">
            {recentLogs.length > 0 ? (
              recentLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    log.action === 'CREATE' ? 'bg-emerald-500' :
                    log.action === 'UPDATE' ? 'bg-blue-500' :
                    log.action === 'DELETE' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">{log.details}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(log.timestamp).toLocaleString('fa-IR')} توسط {log.username}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8 font-medium">
                هیچ فعالیتی ثبت نشده است
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
