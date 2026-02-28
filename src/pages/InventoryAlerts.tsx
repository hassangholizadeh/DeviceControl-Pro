import React from 'react';
import { useData } from '../context/DataContext';
import { AlertTriangle, Plus } from 'lucide-react';

export const InventoryAlerts = () => {
  const { parts, consumables } = useData();

  const lowStockItems = [
    ...parts.filter(p => p.stock <= p.minStock),
    ...consumables.filter(c => c.stock <= c.minStock)
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          هشدارهای موجودی
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        {lowStockItems.length > 0 ? (
          <div className="space-y-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-xl border-r-4 ${item.stock === 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'}`}>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    موجودی فعلی: <span className="font-bold">{item.stock}</span> | حداقل مجاز: {item.minStock}
                  </p>
                </div>
                <button 
                  onClick={() => alert(`درخواست سفارش برای ${item.name} ثبت شد.`)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  سفارش
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>هیچ هشداری برای کمبود موجودی وجود ندارد.</p>
          </div>
        )}
      </div>
    </div>
  );
};
