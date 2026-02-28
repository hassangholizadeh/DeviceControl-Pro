import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Settings, Plus, Trash2, Save, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Definitions = () => {
  const { definitions, updateDefinitions } = useData();
  const [localDefs, setLocalDefs] = useState(definitions);
  const [activeTab, setActiveTab] = useState<keyof typeof definitions>('processors');
  const [newItemValue, setNewItemValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const tabs: { id: keyof typeof definitions; label: string }[] = [
    { id: 'caseBrands', label: 'برند کیس' },
    { id: 'processors', label: 'پردازنده' },
    { id: 'processorGens', label: 'نسل پردازنده' },
    { id: 'motherboardBrands', label: 'برند مادربرد' },
    { id: 'motherboardModels', label: 'مدل مادربرد' },
    { id: 'powers', label: 'منبع تغذیه' },
    { id: 'onboardVGAs', label: 'گرافیک آنبرد' },
    { id: 'printerTypes', label: 'نوع دستگاه (پرینتر)' },
    { id: 'printerBrands', label: 'برند (پرینتر)' },
    { id: 'printerModels', label: 'مدل (پرینتر)' },
    { id: 'printTypes', label: 'نوع چاپ' },
    { id: 'printerColors', label: 'رنگ' },
  ];

  const handleAdd = () => {
    if (newItemValue.trim()) {
      setLocalDefs({
        ...localDefs,
        [activeTab]: [...localDefs[activeTab], newItemValue.trim()]
      });
      setNewItemValue('');
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    const newList = [...localDefs[activeTab]];
    newList.splice(index, 1);
    setLocalDefs({
      ...localDefs,
      [activeTab]: newList
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newList = [...localDefs[activeTab]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setLocalDefs({
      ...localDefs,
      [activeTab]: newList
    });
  };

  const handleSave = () => {
    updateDefinitions(localDefs);
    alert('تغییرات با موفقیت ذخیره شد.');
  };

  const handleReset = () => {
    if (confirm('آیا از بازنشانی تغییرات اطمینان دارید؟')) {
      setLocalDefs(definitions);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">تعاریف سیستم</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">مدیریت مقادیر لیست‌های کشویی</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            بازنشانی
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all active:scale-95"
          >
            <Save className="w-5 h-5" />
            ذخیره تغییرات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1 space-y-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-4 rounded-3xl border border-white/50 dark:border-gray-800/50 h-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              لیست {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            {!isAdding ? (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                افزودن مورد جدید
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-in slide-in-from-left-2">
                <input
                  autoFocus
                  type="text"
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="مقدار جدید..."
                  className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                />
                <button
                  onClick={handleAdd}
                  className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setIsAdding(false); setNewItemValue(''); }}
                  className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {localDefs[activeTab].map((item, index) => (
                <motion.div
                  key={`${activeTab}-${item}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-2xl group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <span className="font-bold text-gray-700 dark:text-gray-300 flex-1">{item}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === localDefs[activeTab].length - 1}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {localDefs[activeTab].length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Settings className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold">هیچ موردی در این لیست وجود ندارد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
