import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Wrench, Plus, Search, Edit, Trash2, Check, X, Printer as PrinterIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RepairRecord } from '../types';
import { cn } from '../utils/cn';

export const RepairsPrinters = () => {
  const { repairs, printers, parts, addRepair, updateRepair, deleteRepair } = useData();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<RepairRecord | null>(null);
  
  const printerRepairs = useMemo(() => repairs.filter(r => r.deviceType === 'Printer'), [repairs]);
  
  const filteredRepairs = useMemo(() => {
    return printerRepairs.filter(r => 
      r.deviceAssetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.technician.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [printerRepairs, searchTerm]);

  const [formData, setFormData] = useState<Partial<RepairRecord>>({
    deviceId: 0,
    deviceAssetCode: '',
    date: new Date().toLocaleDateString('fa-IR'),
    problem: '',
    actionsTaken: '',
    status: 'Pending',
    technician: '',
    partsUsed: []
  });

  const handleOpenModal = (repair?: RepairRecord) => {
    if (repair) {
      setEditingRepair(repair);
      setFormData(repair);
    } else {
      setEditingRepair(null);
      setFormData({
        deviceId: printers[0]?.id || 0,
        deviceAssetCode: printers[0]?.AssetCode || '',
        date: new Date().toLocaleDateString('fa-IR'),
        problem: '',
        actionsTaken: '',
        status: 'Pending',
        technician: '',
        partsUsed: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.deviceAssetCode || !formData.problem) {
      addToast('لطفاً کد اموال و شرح مشکل را وارد کنید.', 'error');
      return;
    }

    try {
      if (editingRepair) {
        updateRepair(formData as RepairRecord);
        addToast('رکورد تعمیر با موفقیت ویرایش شد.', 'success');
      } else {
        addRepair({
          ...formData,
          id: Date.now(),
          deviceType: 'Printer'
        } as RepairRecord);
        addToast('رکورد تعمیر جدید با موفقیت ثبت شد.', 'success');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      addToast(error.message, 'error');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از حذف این رکورد اطمینان دارید؟')) {
      try {
        deleteRepair(id);
        addToast('رکورد تعمیر با موفقیت حذف شد.', 'success');
      } catch (error: any) {
        addToast(error.message, 'error');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">در انتظار</span>;
      case 'In Progress': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">در حال انجام</span>;
      case 'Completed': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">تکمیل شده</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      <div className="flex justify-between items-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center">
            <PrinterIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">تعمیرات پرینترها</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">مدیریت و پیگیری سوابق تعمیرات</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          ثبت تعمیر جدید
        </button>
      </div>

      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="جستجو بر اساس کد اموال، تکنسین یا مشکل..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">کد اموال</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">تاریخ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">شرح مشکل</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">تکنسین</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">وضعیت</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredRepairs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    هیچ رکورد تعمیری یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredRepairs.map(repair => (
                  <tr key={repair.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{repair.deviceAssetCode}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{repair.date}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 truncate max-w-xs">{repair.problem}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{repair.technician || '-'}</td>
                    <td className="p-4">{getStatusBadge(repair.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenModal(repair)}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(repair.id)} 
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800/50 p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {editingRepair ? 'ویرایش رکورد تعمیر' : 'ثبت تعمیر جدید'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">پرینتر (کد اموال) *</label>
                    <select 
                      value={formData.deviceAssetCode}
                      onChange={(e) => {
                        const printer = printers.find(p => p.AssetCode === e.target.value);
                        setFormData({...formData, deviceAssetCode: e.target.value, deviceId: printer?.id || 0});
                      }}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">انتخاب پرینتر...</option>
                      {printers.map(p => (
                        <option key={p.id} value={p.AssetCode}>{p.AssetCode} ({p.DeviceNameModel})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">تاریخ *</label>
                    <input 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">شرح مشکل *</label>
                  <textarea 
                    value={formData.problem}
                    onChange={(e) => setFormData({...formData, problem: e.target.value})}
                    rows={3}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="مشکل پرینتر را به طور کامل شرح دهید..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">اقدامات انجام شده</label>
                  <textarea 
                    value={formData.actionsTaken}
                    onChange={(e) => setFormData({...formData, actionsTaken: e.target.value})}
                    rows={3}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="کارهایی که برای رفع مشکل انجام شد..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">تکنسین</label>
                    <input 
                      value={formData.technician}
                      onChange={(e) => setFormData({...formData, technician: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">وضعیت تعمیر</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Pending">در انتظار</option>
                      <option value="In Progress">در حال انجام</option>
                      <option value="Completed">تکمیل شده</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-bold text-gray-700 dark:text-gray-300">قطعات مصرفی</label>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, partsUsed: [...(formData.partsUsed || []), { partId: 0, quantity: 1 }]})}
                      className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200"
                    >
                      افزودن قطعه
                    </button>
                  </div>
                  
                  {formData.partsDeducted && (
                    <div className="mb-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                      <Check className="w-4 h-4" />
                      موجودی این قطعات از انبار کسر شده است و قابل تغییر نیست.
                    </div>
                  )}

                  <div className="space-y-3">
                    {formData.partsUsed?.map((pu, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <select 
                          value={pu.partId}
                          onChange={(e) => {
                            const newParts = [...(formData.partsUsed || [])];
                            newParts[index].partId = Number(e.target.value);
                            setFormData({...formData, partsUsed: newParts});
                          }}
                          disabled={formData.partsDeducted}
                          className="flex-1 p-2 rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 border outline-none text-sm disabled:opacity-50"
                        >
                          <option value={0}>انتخاب قطعه...</option>
                          {parts.filter(p => p.deviceType === 'Printer').map(p => (
                            <option key={p.id} value={p.id}>{p.name} (موجودی: {p.stock})</option>
                          ))}
                        </select>
                        <input 
                          type="number" 
                          min="1"
                          value={pu.quantity}
                          onChange={(e) => {
                            const newParts = [...(formData.partsUsed || [])];
                            newParts[index].quantity = Number(e.target.value);
                            setFormData({...formData, partsUsed: newParts});
                          }}
                          disabled={formData.partsDeducted}
                          className="w-20 p-2 rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 border outline-none text-sm text-center disabled:opacity-50"
                        />
                        {!formData.partsDeducted && (
                          <button 
                            type="button"
                            onClick={() => {
                              const newParts = [...(formData.partsUsed || [])];
                              newParts.splice(index, 1);
                              setFormData({...formData, partsUsed: newParts});
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {(!formData.partsUsed || formData.partsUsed.length === 0) && (
                      <p className="text-sm text-gray-500 text-center py-2">قطعه‌ای ثبت نشده است.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    انصراف
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                  >
                    ذخیره اطلاعات
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
