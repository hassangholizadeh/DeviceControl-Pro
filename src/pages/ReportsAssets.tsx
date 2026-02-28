import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { FileBarChart, Download, Monitor, Printer, Package, Wrench, TrendingUp, AlertCircle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export const ReportsAssets = () => {
  const { systems, printers, parts, consumables, repairs } = useData();
  const [activeTab, setActiveTab] = useState<'assets' | 'inventory' | 'repairs'>('assets');

  // --- Assets Data ---
  const unitCounts: Record<string, { systems: number, printers: number }> = {};
  [...systems, ...printers].forEach(item => {
    const unit = item.Unit || 'نامشخص';
    if (!unitCounts[unit]) unitCounts[unit] = { systems: 0, printers: 0 };
    if ('CaseAssetCode' in item) unitCounts[unit].systems++;
    else unitCounts[unit].printers++;
  });

  const systemStatusCounts = {
    Active: systems.filter(s => s.Status === 'Active').length,
    Repair: systems.filter(s => s.Status === 'Repair').length,
    Broken: systems.filter(s => s.Status === 'Broken').length,
  };

  const printerStatusCounts = {
    Active: printers.filter(p => p.Status === 'Active').length,
    Repair: printers.filter(p => p.Status === 'Repair').length,
    Broken: printers.filter(p => p.Status === 'Broken').length,
  };

  // --- Inventory Data ---
  const totalPartsValue = parts.reduce((sum, p) => sum + (p.stock * (p.price || 0)), 0);
  const totalConsumablesValue = consumables.reduce((sum, c) => sum + (c.stock * (c.price || 0)), 0);
  
  const lowStockItems = [
    ...parts.filter(p => p.stock <= p.minStock).map(p => ({ ...p, itemType: 'قطعه' })),
    ...consumables.filter(c => c.stock <= c.minStock).map(c => ({ ...c, itemType: 'مصرفی' }))
  ].sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock)).slice(0, 10);

  // --- Repairs Data ---
  const repairStatusCounts = {
    Pending: repairs.filter(r => r.status === 'Pending').length,
    InProgress: repairs.filter(r => r.status === 'In Progress').length,
    Completed: repairs.filter(r => r.status === 'Completed').length,
  };

  const repairsByDevice = {
    System: repairs.filter(r => r.deviceType === 'System').length,
    Printer: repairs.filter(r => r.deviceType === 'Printer').length,
  };

  // --- Detailed Stats ---
  const detailedStats = {
    totalSystems: systems.length,
    totalMonitors: systems.reduce((acc, s) => acc + (s.monitors?.length || 0), 0),
    totalMice: systems.filter(s => s.Mouse).length,
    totalKeyboards: systems.filter(s => s.Keyboard).length,
    singlePrinters: printers.filter(p => p.DeviceType === 'پرینتر').length,
    multiPrinters: printers.filter(p => p.DeviceType === 'چندکاره (MFP)').length,
    copiers: printers.filter(p => p.DeviceType === 'کپی').length,
    scanners: printers.filter(p => p.DeviceType === 'اسکنر').length,
    colorPrinters: printers.filter(p => p.color === 'رنگی').length,
    bwPrinters: printers.filter(p => p.color === 'سیاه و سفید').length,
  };

  // --- Export Functions ---
  const exportAssetsToExcel = () => {
    const data = Object.keys(unitCounts).map(unit => ({
      'واحد': unit,
      'تعداد سیستم': unitCounts[unit].systems,
      'تعداد پرینتر': unitCounts[unit].printers,
      'جمع کل': unitCounts[unit].systems + unitCounts[unit].printers
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "گزارش اموال");
    XLSX.writeFile(wb, "Assets_Report.xlsx");
  };

  const exportInventoryToExcel = () => {
    const data = [
      ...parts.map(p => ({ 'نوع': 'قطعه', 'نام': p.name, 'موجودی': p.stock, 'حداقل موجودی': p.minStock, 'ارزش کل': p.stock * (p.price || 0) })),
      ...consumables.map(c => ({ 'نوع': 'مصرفی', 'نام': c.name, 'موجودی': c.stock, 'حداقل موجودی': c.minStock, 'ارزش کل': c.stock * (c.price || 0) }))
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "گزارش انبار");
    XLSX.writeFile(wb, "Inventory_Report.xlsx");
  };

  const exportRepairsToExcel = () => {
    const data = repairs.map(r => ({
      'نوع دستگاه': r.deviceType === 'System' ? 'سیستم' : 'پرینتر',
      'کد اموال': r.deviceAssetCode,
      'تاریخ': r.date,
      'تکنسین': r.technician,
      'وضعیت': r.status === 'Completed' ? 'تکمیل شده' : r.status === 'In Progress' ? 'در حال انجام' : 'در انتظار',
      'شرح مشکل': r.problem
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "گزارش تعمیرات");
    XLSX.writeFile(wb, "Repairs_Report.xlsx");
  };

  // --- Charts Data ---
  const assetsBarData = {
    labels: Object.keys(unitCounts),
    datasets: [
      { label: 'سیستم', data: Object.values(unitCounts).map(u => u.systems), backgroundColor: 'rgba(59, 130, 246, 0.8)' },
      { label: 'پرینتر', data: Object.values(unitCounts).map(u => u.printers), backgroundColor: 'rgba(16, 185, 129, 0.8)' },
    ],
  };

  const inventoryBarData = {
    labels: [...parts.map(p => p.name), ...consumables.map(c => c.name)],
    datasets: [
      {
        label: 'موجودی',
        data: [...parts.map(p => p.stock), ...consumables.map(c => c.stock)],
        backgroundColor: [
          ...parts.map(() => 'rgba(147, 51, 234, 0.8)'), // Purple for parts
          ...consumables.map(() => 'rgba(236, 72, 153, 0.8)') // Pink for consumables
        ],
      }
    ]
  };

  const statusDoughnutData = {
    labels: ['فعال', 'در حال تعمیر', 'خراب/اسقاط'],
    datasets: [
      {
        data: [systemStatusCounts.Active + printerStatusCounts.Active, systemStatusCounts.Repair + printerStatusCounts.Repair, systemStatusCounts.Broken + printerStatusCounts.Broken],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderWidth: 0,
      },
    ],
  };

  const repairsPieData = {
    labels: ['در انتظار', 'در حال انجام', 'تکمیل شده'],
    datasets: [
      {
        data: [repairStatusCounts.Pending, repairStatusCounts.InProgress, repairStatusCounts.Completed],
        backgroundColor: ['rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
            <FileBarChart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">گزارش‌گیری جامع</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">آمار و اطلاعات تحلیلی سیستم</p>
          </div>
        </div>
        <div className="flex gap-2">
          {activeTab === 'assets' && (
            <button onClick={exportAssetsToExcel} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 text-sm">
              <Download className="w-4 h-4" /> خروجی اموال
            </button>
          )}
          {activeTab === 'inventory' && (
            <button onClick={exportInventoryToExcel} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all active:scale-95 text-sm">
              <Download className="w-4 h-4" /> خروجی انبار
            </button>
          )}
          {activeTab === 'repairs' && (
            <button onClick={exportRepairsToExcel} className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95 text-sm">
              <Download className="w-4 h-4" /> خروجی تعمیرات
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><Monitor className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{systems.length}</div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">کل سیستم‌ها</div>
          </div>
        </div>
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl"><Printer className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{printers.length}</div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">کل پرینترها</div>
          </div>
        </div>
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><Package className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{(totalPartsValue + totalConsumablesValue).toLocaleString()}</div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">ارزش کل انبار (تومان)</div>
          </div>
        </div>
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl"><Wrench className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{repairs.length}</div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">کل تعمیرات ثبت شده</div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-gray-800/50 overflow-hidden">
        <div className="flex border-b border-gray-200/50 dark:border-gray-700/50 overflow-x-auto">
          <button onClick={() => setActiveTab('assets')} className={`flex-1 py-4 px-6 text-center font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'assets' ? 'bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
            گزارش اموال (سیستم و پرینتر)
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`flex-1 py-4 px-6 text-center font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'inventory' ? 'bg-purple-50/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
            گزارش انبار (قطعات و مصرفی)
          </button>
          <button onClick={() => setActiveTab('repairs')} className={`flex-1 py-4 px-6 text-center font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'repairs' ? 'bg-orange-50/50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-b-2 border-orange-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
            گزارش تعمیرات
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'assets' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" /> توزیع تجهیزات در واحدها</h3>
                  <div className="h-72"><Bar data={assetsBarData} options={{ maintainAspectRatio: false, scales: { y: { stacked: true }, x: { stacked: true } } }} /></div>
                </div>
                <div className="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-indigo-500" /> وضعیت سلامت تجهیزات</h3>
                  <div className="h-64"><Doughnut data={statusDoughnutData} options={{ maintainAspectRatio: false, cutout: '70%' }} /></div>
                  <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-emerald-100/50 dark:bg-emerald-900/20 p-2 rounded-xl"><div className="text-lg font-black text-emerald-600">{systemStatusCounts.Active + printerStatusCounts.Active}</div><div className="text-[10px] font-bold text-emerald-700">فعال</div></div>
                    <div className="bg-amber-100/50 dark:bg-amber-900/20 p-2 rounded-xl"><div className="text-lg font-black text-amber-600">{systemStatusCounts.Repair + printerStatusCounts.Repair}</div><div className="text-[10px] font-bold text-amber-700">در حال تعمیر</div></div>
                    <div className="bg-red-100/50 dark:bg-red-900/20 p-2 rounded-xl"><div className="text-lg font-black text-red-600">{systemStatusCounts.Broken + printerStatusCounts.Broken}</div><div className="text-[10px] font-bold text-red-700">خراب/اسقاط</div></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Monitor className="w-5 h-5 text-blue-500" /> آمار تفکیکی تجهیزات</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">تعداد مانیتور</div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{detailedStats.totalMonitors}</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">تعداد ماوس</div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{detailedStats.totalMice}</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">تعداد کیبورد</div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{detailedStats.totalKeyboards}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">پرینتر تک کاره</div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{detailedStats.singlePrinters}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">پرینتر چند کاره</div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{detailedStats.multiPrinters}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">دستگاه کپی</div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{detailedStats.copiers}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">اسکنر</div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{detailedStats.scanners}</div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">پرینتر رنگی</div>
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{detailedStats.colorPrinters}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-gray-200 dark:border-gray-700/30">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">پرینتر سیاه و سفید</div>
                    <div className="text-2xl font-black text-gray-600 dark:text-gray-400">{detailedStats.bwPrinters}</div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto border border-gray-200/50 dark:border-gray-700/50 rounded-2xl">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
                    <tr>
                      <th className="p-4 font-bold text-gray-600 dark:text-gray-300">واحد سازمانی</th>
                      <th className="p-4 font-bold text-gray-600 dark:text-gray-300">تعداد سیستم</th>
                      <th className="p-4 font-bold text-gray-600 dark:text-gray-300">تعداد پرینتر</th>
                      <th className="p-4 font-bold text-gray-600 dark:text-gray-300">جمع کل تجهیزات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                    {Object.keys(unitCounts).sort((a, b) => (unitCounts[b].systems + unitCounts[b].printers) - (unitCounts[a].systems + unitCounts[a].printers)).map(unit => (
                      <tr key={unit} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="p-4 font-bold text-gray-900 dark:text-white">{unit}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{unitCounts[unit].systems}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{unitCounts[unit].printers}</td>
                        <td className="p-4 font-black text-indigo-600 dark:text-indigo-400">{unitCounts[unit].systems + unitCounts[unit].printers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Package className="w-5 h-5 text-purple-500" /> نمودار موجودی انبار</h3>
                <div className="h-80">
                  <Bar 
                    data={inventoryBarData} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const index = context.dataIndex;
                              const isPart = index < parts.length;
                              return `${isPart ? 'قطعه' : 'مصرفی'}: ${context.raw} عدد`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'تعداد موجودی' } },
                        x: { ticks: { maxRotation: 45, minRotation: 45 } }
                      }
                    }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Package className="w-5 h-5 text-purple-500" /> خلاصه ارزش انبار</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                      <span className="font-bold text-gray-600 dark:text-gray-400">ارزش قطعات یدکی</span>
                      <span className="font-black text-lg text-gray-900 dark:text-white">{totalPartsValue.toLocaleString()} <span className="text-xs text-gray-500">تومان</span></span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                      <span className="font-bold text-gray-600 dark:text-gray-400">ارزش مواد مصرفی</span>
                      <span className="font-black text-lg text-gray-900 dark:text-white">{totalConsumablesValue.toLocaleString()} <span className="text-xs text-gray-500">تومان</span></span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                      <span className="font-black text-purple-700 dark:text-purple-400">ارزش کل انبار</span>
                      <span className="font-black text-xl text-purple-700 dark:text-purple-400">{(totalPartsValue + totalConsumablesValue).toLocaleString()} <span className="text-xs">تومان</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-500" /> بحرانی‌ترین اقلام (نیاز به شارژ)</h3>
                  <div className="space-y-3">
                    {lowStockItems.length > 0 ? lowStockItems.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-red-100 dark:border-red-900/30">
                        <div>
                          <div className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-1">نوع: {item.itemType}</div>
                        </div>
                        <div className="text-left">
                          <div className="font-black text-red-600 dark:text-red-400">{item.stock} عدد</div>
                          <div className="text-[10px] text-gray-500">حداقل: {item.minStock}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500 font-medium">هیچ کالایی در وضعیت بحرانی نیست.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'repairs' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Wrench className="w-5 h-5 text-orange-500" /> وضعیت کلی تعمیرات</h3>
                  <div className="h-64"><Pie data={repairsPieData} options={{ maintainAspectRatio: false }} /></div>
                </div>
                
                <div className="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Monitor className="w-5 h-5 text-orange-500" /> تفکیک تعمیرات بر اساس دستگاه</h3>
                  <div className="space-y-6 mt-8">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-blue-600 dark:text-blue-400">سیستم‌ها</span>
                        <span className="text-gray-900 dark:text-white">{repairsByDevice.System} مورد</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${repairs.length ? (repairsByDevice.System / repairs.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-emerald-600 dark:text-emerald-400">پرینترها</span>
                        <span className="text-gray-900 dark:text-white">{repairsByDevice.Printer} مورد</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${repairs.length ? (repairsByDevice.Printer / repairs.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
