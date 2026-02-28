import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Printer as PrinterIcon, Search, Grid, List, Eye, Edit, Trash2, Droplet, Tag, X, Check, Settings, UserCircle, History } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';

export const PrintersList = () => {
  const { printers, deletePrinter, updatePrinter, definitions, lifecycleEvents } = useData();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState<'details' | 'edit' | null>(null);
  const [selectedPrinter, setSelectedPrinter] = useState<any | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [editStep, setEditStep] = useState(1);

  const filteredPrinters = printers.filter(p => 
    p.AssetCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.DeviceNameModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Receiver?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">فعال</span>;
      case 'Repair': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">در تعمیر</span>;
      case 'Broken': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">خراب</span>;
      default: return null;
    }
  };

  const handleEdit = (printer: any) => {
    setSelectedPrinter(printer);
    setEditData({ ...printer });
    setEditStep(1);
    setModalMode('edit');
  };

  const handleView = (printer: any) => {
    setSelectedPrinter(printer);
    setModalMode('details');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('آیا از حذف این پرینتر اطمینان دارید؟')) {
      deletePrinter(id);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input 
                type="text" 
                placeholder="جستجو در پرینترها..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 focus:ring-2 focus:ring-emerald-500 outline-none shadow-inner text-gray-900 dark:text-white transition-all"
              />
            </div>
            <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1.5 rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-inner">
              <button onClick={() => setView('grid')} className={cn("p-2.5 rounded-xl transition-all", view === 'grid' ? "bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300")}>
                <Grid className="w-5 h-5" />
              </button>
              <button onClick={() => setView('list')} className={cn("p-2.5 rounded-xl transition-all", view === 'list' ? "bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300")}>
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-5 py-2.5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
            تعداد نتایج: {filteredPrinters.length}
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrinters.map(printer => (
            <div key={printer.id} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-gray-800/50 overflow-hidden hover:shadow-xl transition-all duration-500 group relative hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center">
                      <PrinterIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{printer.AssetCode || 'بدون کد'}</h3>
                      <div className="text-sm text-gray-500">کد IT: {printer.ITCode || '-'}</div>
                    </div>
                  </div>
                  {getStatusBadge(printer.Status)}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">نام دستگاه</div>
                      <div className="font-medium text-gray-900 dark:text-white">{printer.DeviceNameModel || '-'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">نوع چاپ</div>
                      <div className="font-medium text-gray-900 dark:text-white">{printer.printType || '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <PrinterIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{printer.Receiver || 'بدون تحویل گیرنده'}</div>
                      <div className="text-xs text-gray-500">{printer.Unit || '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex gap-2">
                    <button onClick={() => handleView(printer)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleEdit(printer)} className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(printer.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">کد اموال دستگاه</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">نوع دستگاه</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">نوع چاپ</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">رنگ</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">تاریخ تحویل</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredPrinters.map(printer => (
                  <tr key={printer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{printer.PersonnelCode || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{printer.Receiver || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{printer.Unit || '-'}</td>
                    <td className="p-4 font-medium whitespace-nowrap">{printer.AssetCode}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{printer.DeviceType}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{printer.printType}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{printer.color || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{printer.DeliveryDate || '-'}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(printer)} className="p-1.5 text-gray-500 hover:text-emerald-600 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(printer)} className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(printer.id)} className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modalMode && selectedPrinter && (
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
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
                    <PrinterIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                      {modalMode === 'details' ? 'جزئیات دستگاه' : 'ویرایش مشخصات'}
                    </h2>
                    <p className="text-gray-500 font-medium">{selectedPrinter.AssetCode}</p>
                  </div>
                </div>
                <button onClick={() => setModalMode(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {modalMode === 'details' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
                  <div className="space-y-6">
                    <h3 className="font-black text-lg border-r-4 border-emerald-500 pr-3 mb-4">مشخصات اصلی</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">کد اموال</div>
                        <div className="font-bold">{selectedPrinter.AssetCode}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">کد IT</div>
                        <div className="font-bold">{selectedPrinter.ITCode || '-'}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">نوع دستگاه</div>
                        <div className="font-bold">{selectedPrinter.DeviceType}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-black text-lg border-r-4 border-teal-500 pr-3 mb-4">مشخصات فنی</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">برند و مدل</div>
                        <div className="font-bold">{selectedPrinter.brand} - {selectedPrinter.DeviceNameModel}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">نوع چاپ</div>
                        <div className="font-bold">{selectedPrinter.printType}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">رنگ</div>
                        <div className="font-bold">{selectedPrinter.color}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-black text-lg border-r-4 border-indigo-500 pr-3 mb-4">اطلاعات تحویل</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">تحویل گیرنده</div>
                        <div className="font-bold">{selectedPrinter.Receiver}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">واحد</div>
                        <div className="font-bold">{selectedPrinter.Unit}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="text-xs text-gray-400 font-bold mb-1">تاریخ تحویل</div>
                        <div className="font-bold">{selectedPrinter.DeliveryDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 col-span-1 md:col-span-2 lg:col-span-3">
                    <h3 className="font-black text-lg border-r-4 border-blue-500 pr-3 mb-4 flex items-center gap-2">
                      <History className="w-5 h-5" /> تاریخچه تحویل
                    </h3>
                    <div className="space-y-3">
                      {lifecycleEvents
                        .filter(e => e.deviceType === 'Printer' && e.deviceAssetCode === selectedPrinter.AssetCode && e.eventType === 'Transfer')
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
                      {lifecycleEvents.filter(e => e.deviceType === 'Printer' && e.deviceAssetCode === selectedPrinter.AssetCode && e.eventType === 'Transfer').length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">هیچ سابقه انتقالی ثبت نشده است.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-center gap-4 mb-8">
                    {[1, 2, 3].map(s => (
                      <button
                        key={s}
                        onClick={() => setEditStep(s)}
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all",
                          editStep === s ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {editStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                      <div>
                        <label className="block text-sm font-bold mb-2">کد اموال</label>
                        <input value={editData.AssetCode} onChange={(e) => setEditData({...editData, AssetCode: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">کد IT</label>
                        <input value={editData.ITCode} onChange={(e) => setEditData({...editData, ITCode: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">نوع دستگاه</label>
                        <select value={editData.DeviceType} onChange={(e) => setEditData({...editData, DeviceType: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                          {definitions.printerTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">وضعیت</label>
                        <select value={editData.Status} onChange={(e) => setEditData({...editData, Status: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="Active">فعال</option><option value="Repair">در تعمیر</option><option value="Broken">خراب</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {editStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                      <div>
                        <label className="block text-sm font-bold mb-2">برند</label>
                        <select value={editData.brand} onChange={(e) => setEditData({...editData, brand: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                          {definitions.printerBrands.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">مدل دستگاه</label>
                        <select value={editData.DeviceNameModel} onChange={(e) => setEditData({...editData, DeviceNameModel: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                          {definitions.printerModels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">نوع چاپ</label>
                        <select value={editData.printType} onChange={(e) => setEditData({...editData, printType: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                          {definitions.printTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">رنگ</label>
                        <select value={editData.color} onChange={(e) => setEditData({...editData, color: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                          {definitions.printerColors.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {editStep === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                      <div>
                        <label className="block text-sm font-bold mb-2">نام تحویل گیرنده</label>
                        <input value={editData.Receiver} onChange={(e) => setEditData({...editData, Receiver: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">کد پرسنلی</label>
                        <input value={editData.PersonnelCode} onChange={(e) => setEditData({...editData, PersonnelCode: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">واحد</label>
                        <input value={editData.Unit} onChange={(e) => setEditData({...editData, Unit: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">تاریخ تحویل</label>
                        <input value={editData.DeliveryDate} onChange={(e) => setEditData({...editData, DeliveryDate: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => setModalMode(null)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold">انصراف</button>
                    <button 
                      onClick={() => {
                        try {
                          updatePrinter(editData);
                          setModalMode(null);
                          alert('تغییرات با موفقیت ذخیره شد.');
                        } catch (error: any) {
                          alert(error.message);
                        }
                      }}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
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
