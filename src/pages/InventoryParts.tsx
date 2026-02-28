import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Package, AlertTriangle, Activity, Plus, Minus, Trash2, X, Monitor, Printer as PrinterIcon, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { Part } from '../types';

export const InventoryParts = () => {
  const { parts, addPart, updatePart, deletePart } = useData();
  const [deviceType, setDeviceType] = useState<'System' | 'Printer'>('System');
  const [activeTab, setActiveTab] = useState('ram');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<Partial<Part>>({
    name: '',
    spec: '',
    type: '',
    model: '',
    brand: '',
    stock: 0,
    minStock: 5,
    price: 0 // Keep in data but hide in UI as requested
  });

  const totalParts = parts.filter(p => (p.deviceType || 'System') === deviceType).length;
  const lowStock = parts.filter(p => (p.deviceType || 'System') === deviceType && p.stock <= p.minStock).length;

  const getStatusBadge = (stock: number, minStock: number) => {
    if (stock <= 0) return <span className="px-3 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700">تمام شده</span>;
    if (stock <= minStock) return <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">کمبود</span>;
    return <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">مناسب</span>;
  };

  const systemTabs = [
    { id: 'ram', label: 'رم (RAM)' },
    { id: 'hdd', label: 'هارد دیسک' },
    { id: 'vga', label: 'کارت گرافیک' },
    { id: 'power', label: 'منبع تغذیه' },
    { id: 'motherboard', label: 'مادربرد' },
    { id: 'cpu', label: 'پردازنده' }
  ];

  const printerTabs = [
    { id: 'roller', label: 'غلطک / پیکاپ' },
    { id: 'fuser', label: 'فیوزر' },
    { id: 'board', label: 'برد اصلی' },
    { id: 'other', label: 'سایر قطعات' }
  ];

  const currentTabs = deviceType === 'System' ? systemTabs : printerTabs;
  
  // Ensure activeTab is valid for current deviceType
  const filteredParts = parts.filter(p => (p.deviceType || 'System') === deviceType && p.category === activeTab);

  const handleOpenModal = (part?: Part) => {
    if (part) {
      setSelectedPart(part);
      setFormData(part);
    } else {
      setSelectedPart(null);
      setFormData({
        deviceType,
        category: activeTab,
        name: '',
        spec: '',
        type: '',
        model: '',
        brand: '',
        stock: 0,
        minStock: 5,
        price: 0
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPart) {
      updatePart({ ...formData, id: selectedPart.id } as Part);
    } else {
      addPart({ 
        ...formData, 
        id: Date.now(), 
        deviceType, 
        category: activeTab,
        created: new Date().toLocaleDateString('fa-IR') 
      } as Part);
    }
    setModalOpen(false);
  };

  const adjustStock = (part: Part, amount: number) => {
    updatePart({ ...part, stock: Math.max(0, part.stock + amount) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      {/* Header & Device Type Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600 dark:text-purple-400">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">مدیریت قطعات یدکی</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">موجودی انبار قطعات فنی</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
          <button 
            onClick={() => { setDeviceType('System'); setActiveTab('ram'); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all",
              deviceType === 'System' ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Monitor className="w-4 h-4" />
            قطعات سیستم
          </button>
          <button 
            onClick={() => { setDeviceType('Printer'); setActiveTab('roller'); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all",
              deviceType === 'Printer' ? "bg-white dark:bg-gray-700 text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <PrinterIcon className="w-4 h-4" />
            قطعات پرینتر
          </button>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          افزودن قطعه جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 dark:border-gray-800/50 flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{totalParts}</div>
            <div className="text-sm text-gray-500 font-bold">تعداد کل قطعات {deviceType === 'System' ? 'سیستم' : 'پرینتر'}</div>
          </div>
        </div>
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 dark:border-gray-800/50 flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{lowStock}</div>
            <div className="text-sm text-gray-500 font-bold">کمبود موجودی</div>
          </div>
        </div>
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 dark:border-gray-800/50 flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">0</div>
            <div className="text-sm text-gray-500 font-bold">مصرف ماه اخیر</div>
          </div>
        </div>
      </div>

      {/* Tabs & Table */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-gray-800/50 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800 scrollbar-hide">
          {currentTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-8 py-5 text-sm font-black transition-all whitespace-nowrap relative",
                activeTab === tab.id 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-gray-400 text-xs font-black uppercase tracking-wider">
                  <th className="p-4">مدل / برند</th>
                  <th className="p-4">مشخصات فنی</th>
                  <th className="p-4">موجودی</th>
                  <th className="p-4">حداقل</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredParts.length > 0 ? filteredParts.map(part => (
                  <tr key={part.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-black text-gray-900 dark:text-white">{part.model || part.brand || '-'}</div>
                      <div className="text-[10px] text-gray-400 font-bold">{part.type || 'قطعه عمومی'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{part.spec || part.name || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-lg font-black text-gray-900 dark:text-white">{part.stock}</div>
                    </td>
                    <td className="p-4 text-gray-400 font-bold">{part.minStock}</td>
                    <td className="p-4">{getStatusBadge(part.stock, part.minStock)}</td>
                    <td className="p-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => adjustStock(part, 1)}
                          className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => adjustStock(part, -1)}
                          className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(part)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { if(confirm('آیا از حذف این قطعه اطمینان دارید؟')) deletePart(part.id); }}
                          className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                      <div className="text-gray-400 font-bold">هیچ قطعه‌ای در این دسته‌بندی یافت نشد</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Part Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600 dark:text-purple-400">
                    {selectedPart ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">
                    {selectedPart ? 'ویرایش قطعه' : 'افزودن قطعه جدید'}
                  </h2>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2">نام قطعه / شرح</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="مثال: رم 8 گیگ کینگستون"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">برند</label>
                    <input 
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">مدل</label>
                    <input 
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2">مشخصات فنی</label>
                    <input 
                      value={formData.spec}
                      onChange={(e) => setFormData({...formData, spec: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="مثال: DDR4 3200MHz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">موجودی فعلی</label>
                    <input 
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">حداقل موجودی</label>
                    <input 
                      type="number"
                      required
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold"
                  >
                    انصراف
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30"
                  >
                    {selectedPart ? 'ذخیره تغییرات' : 'ایجاد قطعه'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
