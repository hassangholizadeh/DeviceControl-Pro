import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { RefreshCw, ArrowRightLeft, ArrowUpCircle, Trash2, Search, Monitor, Printer as PrinterIcon, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LifecycleEvent } from '../types';
import { cn } from '../utils/cn';

export const Lifecycle = () => {
  const { systems, printers, lifecycleEvents, addLifecycleEvent, updateSystem, updatePrinter, parts, updatePart } = useData();
  const [activeTab, setActiveTab] = useState<'System' | 'Printer'>('System');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [actionModal, setActionModal] = useState<'Transfer' | 'Upgrade' | 'Scrap' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [transferData, setTransferData] = useState({ newUser: '', newUnit: '', date: new Date().toLocaleDateString('fa-IR'), details: '' });
  const [upgradeData, setUpgradeData] = useState({ 
    upgradedParts: '', 
    date: new Date().toLocaleDateString('fa-IR'), 
    details: '',
    selectedPartId: 0,
    quantity: 1
  });
  const [compatibilityWarning, setCompatibilityWarning] = useState<string | null>(null);
  const [scrapData, setScrapData] = useState({ reason: '', date: new Date().toLocaleDateString('fa-IR'), details: '' });

  const filteredDevices = useMemo(() => {
    const list = activeTab === 'System' ? systems : printers;
    return list.filter(item => {
      const assetCode = activeTab === 'System' ? item.CaseAssetCode : item.AssetCode;
      const name = activeTab === 'System' ? item.FullName : item.DeviceNameModel;
      return (assetCode?.toLowerCase().includes(searchTerm.toLowerCase()) || 
              name?.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [systems, printers, activeTab, searchTerm]);

  const deviceHistory = useMemo(() => {
    if (!selectedDevice) return [];
    const assetCode = activeTab === 'System' ? selectedDevice.CaseAssetCode : selectedDevice.AssetCode;
    return lifecycleEvents.filter(e => e.deviceAssetCode === assetCode).sort((a, b) => b.id - a.id);
  }, [selectedDevice, lifecycleEvents, activeTab]);

  const handleAction = () => {
    if (!selectedDevice || !actionModal) return;

    const assetCode = activeTab === 'System' ? selectedDevice.CaseAssetCode : selectedDevice.AssetCode;
    
    const baseEvent = {
      id: Date.now(),
      deviceType: activeTab,
      deviceId: selectedDevice.id,
      deviceAssetCode: assetCode,
      eventType: actionModal,
      performedBy: 'admin', // TODO: Get actual user
    };

    let event: LifecycleEvent;

    if (actionModal === 'Transfer') {
      if (!transferData.newUser || !transferData.newUnit) {
        alert('لطفاً نام تحویل گیرنده و واحد جدید را وارد کنید.');
        return;
      }
      
      // Update device - this will trigger automatic event creation in DataContext
      if (activeTab === 'System') {
        updateSystem(
          { ...selectedDevice, FullName: transferData.newUser, Unit: transferData.newUnit, DeliveryDate: transferData.date },
          transferData.details
        );
      } else {
        updatePrinter(
          { ...selectedDevice, Receiver: transferData.newUser, Unit: transferData.newUnit, DeliveryDate: transferData.date },
          transferData.details
        );
      }

    } else if (actionModal === 'Upgrade') {
      if (!upgradeData.upgradedParts && !upgradeData.selectedPartId) {
        alert('لطفاً قطعات ارتقاء یافته را وارد کنید یا از انبار انتخاب کنید.');
        return;
      }

      let finalUpgradedParts = upgradeData.upgradedParts;
      
      // Handle inventory part selection
      if (upgradeData.selectedPartId) {
        const part = parts.find(p => p.id === upgradeData.selectedPartId);
        if (part) {
          if (part.stock < upgradeData.quantity) {
             alert(`موجودی قطعه ${part.name} کافی نیست.`);
             return;
          }
          
          finalUpgradedParts = `${upgradeData.quantity}x ${part.name} ${finalUpgradedParts ? `+ ${finalUpgradedParts}` : ''}`;

          // Update System Specs
          if (activeTab === 'System') {
            const system = { ...selectedDevice };
            if (['RAM', 'Memory'].includes(part.category)) {
              const existingRamIndex = system.rams.findIndex((r: any) => r.type === part.type && r.size === (part.memory || part.spec));
              if (existingRamIndex !== -1) {
                system.rams[existingRamIndex].count += upgradeData.quantity;
              } else {
                system.rams.push({ type: part.type || 'Unknown', size: part.memory || part.spec || 'Unknown', count: upgradeData.quantity });
              }
            } else if (['Hard Drive', 'Storage', 'HDD', 'SSD'].includes(part.category)) {
              const existingHddIndex = system.hardDrives.findIndex((h: any) => h.type === part.type && h.size === (part.memory || part.spec));
              if (existingHddIndex !== -1) {
                system.hardDrives[existingHddIndex].count += upgradeData.quantity;
              } else {
                system.hardDrives.push({ type: part.type || 'Unknown', size: part.memory || part.spec || 'Unknown', count: upgradeData.quantity });
              }
            } else if (['VGA', 'Graphics Card', 'GPU'].includes(part.category)) {
              system.externalVGAs.push({ model: part.model || part.name, memory: part.memory || part.spec || 'Unknown' });
            }
            updateSystem(system);
          }

          // Deduct from inventory
          const newStock = part.stock - upgradeData.quantity;
          updatePart({ ...part, stock: newStock });
          
          // Log the inventory usage
          // This is handled by updatePart's internal audit log, but we can add a specific note here if needed.
        }
      }

      event = {
        ...baseEvent,
        eventType: 'Upgrade',
        date: upgradeData.date,
        details: upgradeData.details,
        upgradedParts: finalUpgradedParts,
      };
      addLifecycleEvent(event!);
      setSuccessMessage('ارتقاء سیستم با موفقیت ثبت شد و موجودی انبار بروزرسانی گردید.');
    } else if (actionModal === 'Scrap') {
      if (!scrapData.reason) {
        alert('لطفاً دلیل اسقاط را وارد کنید.');
        return;
      }
      event = {
        ...baseEvent,
        eventType: 'Scrap',
        date: scrapData.date,
        details: scrapData.details,
        reason: scrapData.reason,
      };

      // Update device status
      if (activeTab === 'System') {
        updateSystem({ ...selectedDevice, Status: 'Broken' });
      } else {
        updatePrinter({ ...selectedDevice, Status: 'Broken' });
      }
      addLifecycleEvent(event!);
      setSuccessMessage('تجهیز با موفقیت اسقاط شد.');
    } else if (actionModal === 'Transfer') {
      // ... (Transfer logic handled above)
      setSuccessMessage('انتقال تجهیز با موفقیت انجام شد.');
    }

    setActionModal(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
    
    // Reset forms
    setTransferData({ newUser: '', newUnit: '', date: new Date().toLocaleDateString('fa-IR'), details: '' });
    setUpgradeData({ upgradedParts: '', date: new Date().toLocaleDateString('fa-IR'), details: '' });
    setScrapData({ reason: '', date: new Date().toLocaleDateString('fa-IR'), details: '' });
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'Transfer': return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      case 'Upgrade': return <ArrowUpCircle className="w-5 h-5 text-emerald-500" />;
      case 'Scrap': return <Trash2 className="w-5 h-5 text-red-500" />;
      default: return <History className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEventName = (type: string) => {
    switch(type) {
      case 'Transfer': return 'انتقال';
      case 'Upgrade': return 'ارتقاء';
      case 'Scrap': return 'اسقاط';
      default: return type;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      <div className="flex justify-between items-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">مدیریت چرخه حیات (Lifecycle)</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">انتقال، ارتقاء و اسقاط تجهیزات</p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center shrink-0">
            <ArrowUpCircle className="w-5 h-5" />
          </div>
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Selection Column */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50 flex flex-col h-[calc(100vh-12rem)]">
          <div className="flex border-b border-gray-200/50 dark:border-gray-700/50 mb-4">
            <button 
              onClick={() => { setActiveTab('System'); setSelectedDevice(null); }}
              className={`flex-1 py-3 text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'System' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Monitor className="w-4 h-4" /> سیستم‌ها
            </button>
            <button 
              onClick={() => { setActiveTab('Printer'); setSelectedDevice(null); }}
              className={`flex-1 py-3 text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'Printer' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <PrinterIcon className="w-4 h-4" /> پرینترها
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="جستجوی کد اموال یا نام..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2">
            {filteredDevices.map(item => {
              const assetCode = activeTab === 'System' ? item.CaseAssetCode : item.AssetCode;
              const name = activeTab === 'System' ? item.FullName : item.DeviceNameModel;
              const isSelected = selectedDevice?.id === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedDevice(item)}
                  className={`w-full text-right p-3 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' 
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{assetCode}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{name} - {item.Unit}</div>
                  <div className="mt-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold",
                      item.Status === 'Active' ? "bg-emerald-100 text-emerald-700" :
                      item.Status === 'Repair' ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {item.Status === 'Active' ? 'فعال' : item.Status === 'Repair' ? 'در حال تعمیر' : 'اسقاط/خراب'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions and History Column */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDevice ? (
            <>
              {/* Actions Card */}
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  عملیات چرخه حیات برای {activeTab === 'System' ? selectedDevice.CaseAssetCode : selectedDevice.AssetCode}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActionModal('Transfer')}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-800/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRightLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-bold text-blue-700 dark:text-blue-300">انتقال تجهیز</span>
                  </button>
                  
                  <button 
                    onClick={() => setActionModal('Upgrade')}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowUpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">ارتقاء قطعات</span>
                  </button>

                  <button 
                    onClick={() => setActionModal('Scrap')}
                    disabled={selectedDevice.Status === 'Broken'}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-800/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-bold text-red-700 dark:text-red-300">اسقاط / خروج</span>
                  </button>
                </div>
              </div>

              {/* History Timeline */}
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-500" />
                  تاریخچه رویدادها
                </h2>
                
                {deviceHistory.length > 0 ? (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                    {deviceHistory.map((event, index) => (
                      <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {getEventIcon(event.eventType)}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-gray-900 dark:text-white">{getEventName(event.eventType)}</span>
                            <span className="text-xs text-gray-500">{event.date}</span>
                          </div>
                          
                          {event.eventType === 'Transfer' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                <span>از: {event.previousUser} ({event.previousUnit})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span>به: {event.newUser} ({event.newUnit})</span>
                              </div>
                            </div>
                          )}

                          {event.eventType === 'Upgrade' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <span className="font-semibold">قطعات ارتقاء یافته:</span> {event.upgradedParts}
                            </div>
                          )}

                          {event.eventType === 'Scrap' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <span className="font-semibold text-red-500">دلیل اسقاط:</span> {event.reason}
                            </div>
                          )}

                          {event.details && (
                            <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                              توضیحات: {event.details}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    هیچ رویدادی برای این تجهیز ثبت نشده است.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-12 shadow-sm border border-white/50 dark:border-gray-800/50 flex flex-col items-center justify-center h-full text-gray-500">
              <RefreshCw className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="font-medium">برای مشاهده تاریخچه و انجام عملیات، یک تجهیز را از لیست انتخاب کنید.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      <AnimatePresence>
        {actionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActionModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800/50 p-8"
            >
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                {getEventIcon(actionModal)}
                {getEventName(actionModal)} تجهیز
              </h2>

              <div className="space-y-4">
                {actionModal === 'Transfer' && (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4 text-sm">
                      <div className="font-bold mb-2">اطلاعات فعلی:</div>
                      <div>تحویل گیرنده: {activeTab === 'System' ? selectedDevice.FullName : selectedDevice.Receiver}</div>
                      <div>واحد: {selectedDevice.Unit}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">تحویل گیرنده جدید *</label>
                      <input 
                        value={transferData.newUser} onChange={e => setTransferData({...transferData, newUser: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">واحد جدید *</label>
                      <input 
                        value={transferData.newUnit} onChange={e => setTransferData({...transferData, newUnit: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">تاریخ</label>
                      <input 
                        value={transferData.date} onChange={e => setTransferData({...transferData, date: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">توضیحات</label>
                      <textarea 
                        value={transferData.details} onChange={e => setTransferData({...transferData, details: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3}
                      />
                    </div>
                  </>
                )}

                {actionModal === 'Upgrade' && (
                  <>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl mb-4 border border-emerald-100 dark:border-emerald-800/30">
                      <label className="block text-sm font-bold mb-2 text-emerald-800 dark:text-emerald-300">انتخاب قطعه از انبار (اختیاری)</label>
                      <div className="flex gap-2">
                        <select 
                          value={upgradeData.selectedPartId} 
                          onChange={e => {
                            const partId = Number(e.target.value);
                            setUpgradeData({...upgradeData, selectedPartId: partId});
                            setCompatibilityWarning(null);

                            if (activeTab === 'System' && selectedDevice && partId) {
                              const part = parts.find(p => p.id === partId);
                              if (part && ['RAM', 'Memory'].includes(part.category)) {
                                const systemRams = selectedDevice.rams || [];
                                if (systemRams.length > 0) {
                                  const getGen = (s: string) => {
                                    if (!s) return null;
                                    const normalized = s.toLowerCase();
                                    if (normalized.includes('ddr5')) return 'DDR5';
                                    if (normalized.includes('ddr4')) return 'DDR4';
                                    if (normalized.includes('ddr3')) return 'DDR3';
                                    if (normalized.includes('ddr2')) return 'DDR2';
                                    return null;
                                  };

                                  const existingGen = getGen(systemRams[0].type) || getGen(systemRams[0].size); // Fallback to size/spec if type is empty
                                  const newGen = getGen(part.type || '') || getGen(part.spec || '') || getGen(part.name || '');

                                  if (existingGen && newGen && existingGen !== newGen) {
                                    setCompatibilityWarning(`هشدار: رم انتخاب شده (${newGen}) با رم‌های فعلی سیستم (${existingGen}) همخوانی ندارد.`);
                                  }
                                }
                              }
                            }
                          }}
                          className="flex-1 p-3 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        >
                          <option value={0}>انتخاب کنید...</option>
                          {parts.filter(p => ['RAM', 'Memory', 'Hard Drive', 'Storage', 'HDD', 'SSD', 'VGA', 'Graphics Card', 'GPU'].includes(p.category) && p.stock > 0).map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.category}) - موجودی: {p.stock}</option>
                          ))}
                        </select>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          value={upgradeData.quantity} 
                          onChange={e => setUpgradeData({...upgradeData, quantity: Number(e.target.value)})}
                          className="w-20 p-3 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                        />
                      </div>
                      {compatibilityWarning && (
                        <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                          <span className="font-bold">⚠️ توجه:</span> {compatibilityWarning}
                        </div>
                      )}
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                        با انتخاب قطعه، مشخصات سیستم به صورت خودکار بروزرسانی می‌شود.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">شرح ارتقاء (دستی)</label>
                      <textarea 
                        value={upgradeData.upgradedParts} onChange={e => setUpgradeData({...upgradeData, upgradedParts: e.target.value})}
                        placeholder="مثال: ارتقاء رم از 8 به 16 گیگابایت"
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500 resize-none" rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">تاریخ</label>
                      <input 
                        value={upgradeData.date} onChange={e => setUpgradeData({...upgradeData, date: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">توضیحات تکمیلی</label>
                      <textarea 
                        value={upgradeData.details} onChange={e => setUpgradeData({...upgradeData, details: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500 resize-none" rows={2}
                      />
                    </div>
                  </>
                )}

                {actionModal === 'Scrap' && (
                  <>
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl mb-4 text-sm font-bold">
                      توجه: با ثبت این رویداد، وضعیت این تجهیز به «اسقاط/خراب» تغییر خواهد کرد.
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">دلیل اسقاط *</label>
                      <textarea 
                        value={scrapData.reason} onChange={e => setScrapData({...scrapData, reason: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-red-500 resize-none" rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">تاریخ</label>
                      <input 
                        value={scrapData.date} onChange={e => setScrapData({...scrapData, date: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">توضیحات تکمیلی</label>
                      <textarea 
                        value={scrapData.details} onChange={e => setScrapData({...scrapData, details: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-red-500 resize-none" rows={2}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => setActionModal(null)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    انصراف
                  </button>
                  <button 
                    onClick={handleAction}
                    className={cn(
                      "px-8 py-3 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95",
                      actionModal === 'Transfer' ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30" :
                      actionModal === 'Upgrade' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30" :
                      "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                    )}
                  >
                    ثبت رویداد
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