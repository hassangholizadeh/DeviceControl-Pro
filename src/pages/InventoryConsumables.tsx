import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Package, Plus, Minus, Trash2, Droplet, FileText, X, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { Consumable } from '../types';

export const InventoryConsumables = () => {
  const { consumables, addConsumable, updateConsumable, deleteConsumable } = useData();
  const [activeTab, setActiveTab] = useState('toner');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Consumable | null>(null);
  const [formData, setFormData] = useState<Partial<Consumable>>({
    name: '',
    model: '',
    color: '',
    type: '',
    size: '',
    stock: 0,
    minStock: 5,
    price: 0
  });

  const getStatusBadge = (stock: number, minStock: number) => {
    if (stock <= 0) return <span className="px-3 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700">تمام شده</span>;
    if (stock <= minStock) return <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">کمبود</span>;
    return <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">مناسب</span>;
  };

  const filteredConsumables = consumables.filter(c => c.category === activeTab);

  const handleOpenModal = (item?: Consumable) => {
    if (item) {
      setSelectedItem(item);
      setFormData(item);
    } else {
      setSelectedItem(null);
      setFormData({
        category: activeTab,
        name: '',
        model: '',
        color: '',
        type: '',
        size: '',
        stock: 0,
        minStock: 5,
        price: 0
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateConsumable({ ...formData, id: selectedItem.id } as Consumable);
    } else {
      addConsumable({ 
        ...formData, 
        id: Date.now(), 
        category: activeTab,
        created: new Date().toLocaleDateString('fa-IR') 
      } as Consumable);
    }
    setModalOpen(false);
  };

  const adjustStock = (item: Consumable, amount: number) => {
    updateConsumable({ ...item, stock: Math.max(0, item.stock + amount) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-600 dark:text-blue-400">
            <Droplet className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">مدیریت مواد مصرفی</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">موجودی کارتریج، تونر و کاغذ</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          ماده مصرفی جدید
        </button>
      </div>

      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-gray-800/50 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          {[
            { id: 'toner', label: 'تونر پرینتر', icon: Droplet },
            { id: 'paper', label: 'کاغذ', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-5 flex items-center justify-center gap-2 font-black transition-all relative",
                activeTab === tab.id 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabConsumable" 
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
                  <th className="p-4">مدل / نوع</th>
                  <th className="p-4">رنگ / اندازه</th>
                  <th className="p-4">موجودی</th>
                  <th className="p-4">حداقل</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredConsumables.length > 0 ? filteredConsumables.map(item => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-black text-gray-900 dark:text-white">{item.model || item.type || item.name || '-'}</div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 font-medium">{item.color || item.size || '-'}</td>
                    <td className="p-4">
                      <div className="text-lg font-black text-gray-900 dark:text-white">{item.stock}</div>
                    </td>
                    <td className="p-4 text-gray-400 font-bold">{item.minStock}</td>
                    <td className="p-4">{getStatusBadge(item.stock, item.minStock)}</td>
                    <td className="p-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => adjustStock(item, 1)}
                          className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => adjustStock(item, -1)}
                          className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { if(confirm('آیا از حذف این مورد اطمینان دارید؟')) deleteConsumable(item.id); }}
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
                      <Droplet className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                      <div className="text-gray-400 font-bold">هیچ موردی در این دسته‌بندی یافت نشد</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Consumable Modal */}
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
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-600 dark:text-blue-400">
                    {selectedItem ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">
                    {selectedItem ? 'ویرایش ماده مصرفی' : 'افزودن ماده مصرفی جدید'}
                  </h2>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2">نام / شرح</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: کارتریج HP 85A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">مدل</label>
                    <input 
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">{activeTab === 'toner' ? 'رنگ' : 'اندازه'}</label>
                    <input 
                      value={activeTab === 'toner' ? formData.color : formData.size}
                      onChange={(e) => setFormData({...formData, [activeTab === 'toner' ? 'color' : 'size']: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">موجودی فعلی</label>
                    <input 
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">حداقل موجودی</label>
                    <input 
                      type="number"
                      required
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30"
                  >
                    {selectedItem ? 'ذخیره تغییرات' : 'ایجاد مورد'}
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
