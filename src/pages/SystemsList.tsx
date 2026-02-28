import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Monitor, Search, Grid, List, Eye, Edit, Trash2, Cpu, HardDrive, X, Check, User, MapPin, Calendar, Info, ArrowUpDown, ArrowUp, ArrowDown, History, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';

export const SystemsList = () => {
  const { systems, deleteSystem, updateSystem, lifecycleEvents, parts } = useData();
  const { addToast } = useToast();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'edit' | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [editStep, setEditStep] = useState(1);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);
  const { definitions } = useData();

  const handleDelete = (id: number) => {
    setDeleteConfirmationId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmationId) {
      try {
        deleteSystem(deleteConfirmationId);
        addToast('سیستم با موفقیت حذف شد.', 'success');
      } catch (error: any) {
        addToast(error.message, 'error');
      }
      setDeleteConfirmationId(null);
    }
  };

  const filteredSystems = useMemo(() => {
    let result = systems.filter(s => 
      s.CaseAssetCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.CPU?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.FullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || '';

        // Special handling for dates to fix sorting (e.g. 1402/1/1 vs 1402/10/1)
        if (sortConfig.key === 'DeliveryDate') {
          const normalizeDate = (d: string) => {
            if (!d) return '';
            return d.split('/').map(part => part.padStart(2, '0')).join('/');
          };
          aValue = normalizeDate(aValue);
          bValue = normalizeDate(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [systems, searchTerm, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-indigo-600" /> : <ArrowDown className="w-4 h-4 text-indigo-600" />;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">فعال</span>;
      case 'Repair': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">در تعمیر</span>;
      case 'Broken': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">خراب</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
              <input 
                type="text" 
                placeholder="جستجو در سیستم‌ها..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner text-gray-900 dark:text-white transition-all"
              />
            </div>
            <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1.5 rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-inner">
              <button onClick={() => setView('grid')} className={cn("p-2.5 rounded-xl transition-all", view === 'grid' ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300")}>
                <Grid className="w-5 h-5" />
              </button>
              <button onClick={() => setView('list')} className={cn("p-2.5 rounded-xl transition-all", view === 'list' ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300")}>
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-5 py-2.5 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
            تعداد نتایج: {filteredSystems.length}
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSystems.map(system => (
            <div key={system.id} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-gray-800/50 overflow-hidden hover:shadow-xl transition-all duration-500 group relative hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="pl-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{system.CaseAssetCode || 'بدون کد'}</h3>
                    <div className="text-sm text-gray-500">کد IT: {system.CaseITCode || '-'}</div>
                  </div>
                  {getStatusBadge(system.Status)}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">پردازنده</div>
                      <div className="font-medium text-gray-900 dark:text-white">{system.CPU || '-'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">مادربرد</div>
                      <div className="font-medium text-gray-900 dark:text-white">{system.Mainboard || '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{system.FullName || 'بدون تحویل گیرنده'}</div>
                      <div className="text-xs text-gray-500">{system.Unit || '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedSystem(system); setModalMode('details'); }}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => { setSelectedSystem(system); setEditData({...system}); setModalMode('edit'); }}
                      className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(system.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">کد پرسنلی</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">نام و نام خانوادگی</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">واحد</th>
                  <th 
                    className="p-4 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                    onClick={() => handleSort('CaseAssetCode')}
                  >
                    <div className="flex items-center gap-2">
                      کد اموال کیس
                      {getSortIcon('CaseAssetCode')}
                    </div>
                  </th>
                  <th 
                    className="p-4 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                    onClick={() => handleSort('Mainboard')}
                  >
                    <div className="flex items-center gap-2">
                      مادربرد
                      {getSortIcon('Mainboard')}
                    </div>
                  </th>
                  <th 
                    className="p-4 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                    onClick={() => handleSort('CPU')}
                  >
                    <div className="flex items-center gap-2">
                      پردازنده
                      {getSortIcon('CPU')}
                    </div>
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">رم</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">هارد</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">گرافیک</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">کد اموال مانیتور</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">مانیتور</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">ماوس</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">کیبورد</th>
                  <th 
                    className="p-4 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                    onClick={() => handleSort('DeliveryDate')}
                  >
                    <div className="flex items-center gap-2">
                      تاریخ تحویل
                      {getSortIcon('DeliveryDate')}
                    </div>
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredSystems.map(system => (
                  <tr key={system.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{system.PersonnelCode || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap font-medium">{system.FullName || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{system.Unit || '-'}</td>
                    <td className="p-4 font-medium whitespace-nowrap">{system.CaseAssetCode}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{system.Mainboard}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{system.CPU}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                      {system.rams?.map((r: any) => `${r.size} ${r.type}`).join(', ') || '-'}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                      {system.hardDrives?.map((h: any) => `${h.size} ${h.type}`).join(', ') || '-'}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                      {system.externalVGAs?.length ? system.externalVGAs.map((v: any) => `${v.model} ${v.memory}`).join(', ') : (system.onboardVGA || '-')}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                      {system.monitors?.map((m: any) => m.assetCode).join(', ') || '-'}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                      {system.monitors?.map((m: any) => `${m.brand} ${m.model}`).join(', ') || '-'}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{system.Mouse || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{system.Keyboard || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{system.DeliveryDate || '-'}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedSystem(system); setModalMode('details'); }}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedSystem(system); setEditData({...system}); setModalMode('edit'); }}
                          className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(system.id)} className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmationId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-4 mb-4 text-red-600">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">تأیید حذف</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                آیا از حذف این سیستم اطمینان دارید؟ این عملیات غیرقابل بازگشت است و تمام سوابق مرتبط حذف خواهند شد.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteConfirmationId(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  انصراف
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                >
                  حذف سیستم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modalMode && selectedSystem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalMode(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800/50 p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    modalMode === 'details' ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {modalMode === 'details' ? <Eye className="w-8 h-8" /> : <Edit className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                      {modalMode === 'details' ? 'جزئیات سیستم' : 'ویرایش سیستم'}
                    </h2>
                    <p className="text-gray-500 font-medium">{selectedSystem.CaseAssetCode}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalMode(null)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {modalMode === 'details' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4" /> مشخصات کیس
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                          <div className="text-xs text-gray-500 mb-1">کد اموال</div>
                          <div className="font-bold">{selectedSystem.CaseAssetCode}</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                          <div className="text-xs text-gray-500 mb-1">کد IT</div>
                          <div className="font-bold">{selectedSystem.CaseITCode || '-'}</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl col-span-2">
                          <div className="text-xs text-gray-500 mb-1">برند کیس</div>
                          <div className="font-bold">{selectedSystem.CaseBrand || '-'}</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl col-span-2">
                          <div className="text-xs text-gray-500 mb-1">پردازنده</div>
                          <div className="font-bold">{selectedSystem.CPU}</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl col-span-2">
                          <div className="text-xs text-gray-500 mb-1">مادربرد</div>
                          <div className="font-bold">{selectedSystem.Mainboard}</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                          <div className="text-xs text-gray-500 mb-1">پاور</div>
                          <div className="font-bold">{selectedSystem.Power}</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                          <div className="text-xs text-gray-500 mb-1">گرافیک آنبرد</div>
                          <div className="font-bold">{selectedSystem.onboardVGA || 'ندارد'}</div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <HardDrive className="w-4 h-4" /> حافظه و رم
                      </h3>
                      <div className="space-y-3">
                        {selectedSystem.rams?.map((ram: any, i: number) => (
                          <div key={i} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex justify-between items-center">
                            <span className="font-bold">RAM {i+1}: {ram.size} {ram.type}</span>
                            <span className="text-xs bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded-lg">{ram.count} عدد</span>
                          </div>
                        ))}
                        {selectedSystem.hardDrives?.map((hdd: any, i: number) => (
                          <div key={i} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex justify-between items-center">
                            <span className="font-bold">هارد {i+1}: {hdd.size} {hdd.type}</span>
                            <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded-lg">{hdd.count} عدد</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <History className="w-4 h-4" /> تاریخچه تحویل
                      </h3>
                      <div className="space-y-3">
                        {lifecycleEvents
                          .filter(e => e.deviceType === 'System' && e.deviceAssetCode === selectedSystem.CaseAssetCode && e.eventType === 'Transfer')
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map(event => (
                            <div key={event.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{event.date}</span>
                                <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-lg">انتقال</span>
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-300">
                                از <span className="font-bold">{event.previousUser || 'نامشخص'}</span> به <span className="font-bold">{event.newUser}</span>
                              </div>
                              {event.details && <div className="text-xs text-gray-500 mt-1">{event.details}</div>}
                            </div>
                          ))}
                        {lifecycleEvents.filter(e => e.deviceType === 'System' && e.deviceAssetCode === selectedSystem.CaseAssetCode && e.eventType === 'Transfer').length === 0 && (
                          <div className="text-center text-gray-500 text-sm py-4">هیچ سابقه انتقالی ثبت نشده است.</div>
                        )}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section>
                      <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User className="w-4 h-4" /> تحویل گیرنده
                      </h3>
                      <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-emerald-200 dark:bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                            <User className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="text-xl font-black">{selectedSystem.FullName}</div>
                            <div className="text-emerald-600 dark:text-emerald-400 font-bold">کد پرسنلی: {selectedSystem.PersonnelCode}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" /> {selectedSystem.Unit}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" /> {selectedSystem.DeliveryDate || '-'}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Monitor className="w-4 h-4" /> مانیتور و جانبی
                      </h3>
                      <div className="space-y-3">
                        {selectedSystem.monitors?.map((mon: any, i: number) => (
                          <div key={i} className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                            <div className="font-bold">{mon.brand} {mon.model} - {mon.size} اینچ</div>
                            <div className="text-xs text-amber-700">کد اموال: {mon.assetCode}</div>
                          </div>
                        ))}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm">
                            <span className="text-gray-500">ماوس:</span> {selectedSystem.Mouse || '-'}
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm">
                            <span className="text-gray-500">کیبورد:</span> {selectedSystem.Keyboard || '-'}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Edit Steps/Tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        onClick={() => setEditStep(s)}
                        className={cn(
                          "px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap",
                          editStep === s ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        )}
                      >
                        مرحله {s}
                      </button>
                    ))}
                  </div>

                  {editStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                      <div>
                        <label className="block text-sm font-bold mb-2">کد اموال</label>
                        <input value={editData.CaseAssetCode} onChange={(e) => setEditData({...editData, CaseAssetCode: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">کد IT</label>
                        <input value={editData.CaseITCode} onChange={(e) => setEditData({...editData, CaseITCode: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">برند کیس</label>
                        <select value={editData.CaseBrand} onChange={(e) => setEditData({...editData, CaseBrand: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="">انتخاب برند...</option>
                          {definitions.caseBrands.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">پردازنده</label>
                        <select value={editData.processor} onChange={(e) => setEditData({...editData, processor: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                          {definitions.processors.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">نسل پردازنده</label>
                        <select value={editData.processorGen} onChange={(e) => setEditData({...editData, processorGen: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                          {definitions.processorGens.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {editStep === 2 && (
                    <div className="space-y-6 animate-in fade-in">
                      <div>
                        <label className="block text-sm font-bold mb-2">گرافیک آنبرد *</label>
                        <select 
                          required
                          value={editData.onboardVGA} 
                          onChange={(e) => setEditData({...editData, onboardVGA: e.target.value})} 
                          className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">انتخاب مدل...</option>
                          {definitions.onboardVGAs.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <label className="font-bold">کارت گرافیک مجزا</label>
                          <button onClick={() => setEditData({...editData, externalVGAs: [...(editData.externalVGAs || []), {model: '', memory: ''}]})} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200">افزودن</button>
                        </div>
                        <div className="space-y-3">
                          {editData.externalVGAs?.map((vga: any, i: number) => (
                            <div key={i} className="flex flex-col gap-2 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 relative">
                              <select 
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm mb-2"
                                onChange={(e) => {
                                  const part = parts.find(p => p.id === Number(e.target.value));
                                  if (part) {
                                    const newVgas = [...editData.externalVGAs];
                                    newVgas[i].model = part.model || part.name;
                                    newVgas[i].memory = part.memory || part.spec || '';
                                    setEditData({...editData, externalVGAs: newVgas});
                                  }
                                }}
                              >
                                <option value="">انتخاب از انبار (اختیاری)...</option>
                                {parts.filter(p => ['VGA', 'Graphics Card', 'GPU'].includes(p.category)).map(p => (
                                  <option key={p.id} value={p.id}>{p.name} - موجودی: {p.stock}</option>
                                ))}
                              </select>
                              <div className="flex gap-2 items-center">
                                <input value={vga.model} onChange={(e) => {
                                  const newVgas = [...editData.externalVGAs];
                                  newVgas[i].model = e.target.value;
                                  setEditData({...editData, externalVGAs: newVgas});
                                }} className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm" placeholder="مدل" />
                                <select value={vga.memory} onChange={(e) => {
                                  const newVgas = [...editData.externalVGAs];
                                  newVgas[i].memory = e.target.value;
                                  setEditData({...editData, externalVGAs: newVgas});
                                }} className="w-24 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
                                  <option value="2GB">2GB</option><option value="4GB">4GB</option><option value="8GB">8GB</option>
                                </select>
                                <button onClick={() => setEditData({...editData, externalVGAs: editData.externalVGAs.filter((_:any, idx:number) => idx !== i)})} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {editStep === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <label className="font-bold">RAM</label>
                          <button onClick={() => setEditData({...editData, rams: [...(editData.rams || []), {type: 'DDR4', size: '8GB', count: 1}]})} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200">افزودن</button>
                        </div>
                        <div className="space-y-3">
                          {editData.rams?.map((ram: any, i: number) => (
                            <div key={i} className="flex flex-col gap-2 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 relative">
                              <select 
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm mb-2"
                                onChange={(e) => {
                                  const part = parts.find(p => p.id === Number(e.target.value));
                                  if (part) {
                                    const newRams = [...editData.rams];
                                    newRams[i].type = part.type || '';
                                    newRams[i].size = part.memory || part.spec || '';
                                    setEditData({...editData, rams: newRams});
                                  }
                                }}
                              >
                                <option value="">انتخاب از انبار (اختیاری)...</option>
                                {parts.filter(p => ['RAM', 'Memory'].includes(p.category)).map(p => (
                                  <option key={p.id} value={p.id}>{p.name} - موجودی: {p.stock}</option>
                                ))}
                              </select>
                              <div className="flex gap-2 items-center">
                                <select value={ram.type} onChange={(e) => {
                                  const newRams = [...editData.rams];
                                  newRams[i].type = e.target.value;
                                  setEditData({...editData, rams: newRams});
                                }} className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
                                  <option value="DDR3">DDR3</option><option value="DDR4">DDR4</option><option value="DDR5">DDR5</option>
                                </select>
                                <select value={ram.size} onChange={(e) => {
                                  const newRams = [...editData.rams];
                                  newRams[i].size = e.target.value;
                                  setEditData({...editData, rams: newRams});
                                }} className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
                                  <option value="4GB">4GB</option><option value="8GB">8GB</option><option value="16GB">16GB</option>
                                </select>
                                <button onClick={() => setEditData({...editData, rams: editData.rams.filter((_:any, idx:number) => idx !== i)})} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <label className="font-bold">Hard Drive</label>
                          <button onClick={() => setEditData({...editData, hardDrives: [...(editData.hardDrives || []), {type: 'SSD', size: '512GB', count: 1}]})} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200">افزودن</button>
                        </div>
                        <div className="space-y-3">
                          {editData.hardDrives?.map((hdd: any, i: number) => (
                            <div key={i} className="flex flex-col gap-2 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 relative">
                              <select 
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm mb-2"
                                onChange={(e) => {
                                  const part = parts.find(p => p.id === Number(e.target.value));
                                  if (part) {
                                    const newHdds = [...editData.hardDrives];
                                    newHdds[i].type = part.type || '';
                                    newHdds[i].size = part.memory || part.spec || '';
                                    setEditData({...editData, hardDrives: newHdds});
                                  }
                                }}
                              >
                                <option value="">انتخاب از انبار (اختیاری)...</option>
                                {parts.filter(p => ['Hard Drive', 'Storage', 'HDD', 'SSD'].includes(p.category)).map(p => (
                                  <option key={p.id} value={p.id}>{p.name} - موجودی: {p.stock}</option>
                                ))}
                              </select>
                              <div className="flex gap-2 items-center">
                                <select value={hdd.type} onChange={(e) => {
                                  const newHdds = [...editData.hardDrives];
                                  newHdds[i].type = e.target.value;
                                  setEditData({...editData, hardDrives: newHdds});
                                }} className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
                                  <option value="SSD">SSD</option><option value="HDD">HDD</option><option value="NVMe">NVMe</option>
                                </select>
                                <select value={hdd.size} onChange={(e) => {
                                  const newHdds = [...editData.hardDrives];
                                  newHdds[i].size = e.target.value;
                                  setEditData({...editData, hardDrives: newHdds});
                                }} className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
                                  <option value="256GB">256GB</option><option value="512GB">512GB</option><option value="1TB">1TB</option>
                                </select>
                                <button onClick={() => setEditData({...editData, hardDrives: editData.hardDrives.filter((_:any, idx:number) => idx !== i)})} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {editStep === 4 && (
                    <div className="space-y-6 animate-in fade-in">
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <label className="font-bold">مانیتورها</label>
                          <button onClick={() => setEditData({...editData, monitors: [...(editData.monitors || []), {assetCode: '', itCode: '', brand: '', model: '', size: ''}]})} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200">افزودن</button>
                        </div>
                        <div className="space-y-4">
                          {editData.monitors?.map((mon: any, i: number) => (
                            <div key={i} className="grid grid-cols-2 gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 relative">
                              <input value={mon.assetCode} onChange={(e) => {
                                const newMons = [...editData.monitors];
                                newMons[i].assetCode = e.target.value;
                                setEditData({...editData, monitors: newMons});
                              }} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs" placeholder="کد اموال" />
                              <input value={mon.brand} onChange={(e) => {
                                const newMons = [...editData.monitors];
                                newMons[i].brand = e.target.value;
                                setEditData({...editData, monitors: newMons});
                              }} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs" placeholder="برند" />
                              <button onClick={() => setEditData({...editData, monitors: editData.monitors.filter((_:any, idx:number) => idx !== i)})} className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-500 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <input value={editData.Mouse} onChange={(e) => setEditData({...editData, Mouse: e.target.value})} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border outline-none text-sm" placeholder="ماوس" />
                        <input value={editData.Keyboard} onChange={(e) => setEditData({...editData, Keyboard: e.target.value})} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border outline-none text-sm" placeholder="کیبورد" />
                        <input value={editData.Other} onChange={(e) => setEditData({...editData, Other: e.target.value})} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border outline-none text-sm" placeholder="سایر" />
                      </div>
                    </div>
                  )}

                  {editStep === 5 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                      <div>
                        <label className="block text-sm font-bold mb-2">نام تحویل گیرنده</label>
                        <input value={editData.FullName} onChange={(e) => setEditData({...editData, FullName: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">کد پرسنلی</label>
                        <input value={editData.PersonnelCode} onChange={(e) => setEditData({...editData, PersonnelCode: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">واحد</label>
                        <input value={editData.Unit} onChange={(e) => setEditData({...editData, Unit: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">وضعیت</label>
                        <select value={editData.Status} onChange={(e) => setEditData({...editData, Status: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="Active">فعال</option><option value="Repair">در تعمیر</option><option value="Broken">خراب</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button type="button" onClick={() => setModalMode(null)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold">انصراف</button>
                    <button 
                      type="button"
                      onClick={() => {
                        if (!editData.onboardVGA) {
                          alert('لطفاً گرافیک آنبرد را انتخاب کنید.');
                          setEditStep(2);
                          return;
                        }
                        try {
                          updateSystem({
                            ...editData,
                            CPU: `${editData.processor} - ${editData.processorGen}`,
                            Mainboard: `${editData.motherboardBrand} - ${editData.motherboardModel}`,
                            hasOnboardVGA: !!editData.onboardVGA
                          });
                          setModalMode(null);
                          alert('تغییرات با موفقیت ذخیره شد.');
                        } catch (error: any) {
                          alert(error.message);
                        }
                      }}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                    >
                      ذخیره نهایی تغییرات
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
