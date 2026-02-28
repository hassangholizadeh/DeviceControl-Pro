import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router';
import { Monitor, Cpu, HardDrive, Tv, UserCircle, Check, Plus, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

export const RegisterSystem = () => {
  const [step, setStep] = useState(1);
  const { addSystem, definitions, systems } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    CaseAssetCode: '',
    CaseITCode: '',
    CaseBrand: '',
    processor: '',
    processorGen: '',
    motherboardBrand: '',
    motherboardModel: '',
    Power: '',
    FullName: '',
    PersonnelCode: '',
    Unit: '',
    DeliveryDate: '',
    onboardVGA: '',
    Mouse: '',
    Keyboard: '',
    Other: ''
  });

  const [externalVGAs, setExternalVGAs] = useState<{model: string, memory: string}[]>([]);
  const [rams, setRams] = useState<{type: string, size: string, count: number}[]>([{ type: 'DDR4', size: '8GB', count: 1 }]);
  const [hardDrives, setHardDrives] = useState<{type: string, size: string, count: number}[]>([{ type: 'SSD', size: '512GB', count: 1 }]);
  const [monitors, setMonitors] = useState<{assetCode: string, itCode: string, brand: string, model: string, size: string}[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (systems.some(s => s.CaseAssetCode === formData.CaseAssetCode)) {
        alert(`کد اموال ${formData.CaseAssetCode} قبلاً ثبت شده است.`);
        return;
      }
    }
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    addSystem({
      id: Date.now(),
      ...formData,
      hasOnboardVGA: !!formData.onboardVGA,
      CPU: `${formData.processor} - ${formData.processorGen}`,
      Mainboard: `${formData.motherboardBrand} - ${formData.motherboardModel}`,
      externalVGAs,
      rams,
      hardDrives,
      monitors,
      Position: '',
      Status: 'Active'
    });
    
    navigate('/list/systems');
  };

  const steps = [
    { num: 1, title: 'مشخصات کیس', icon: Cpu },
    { num: 2, title: 'گرافیک', icon: Monitor },
    { num: 3, title: 'RAM و هارد', icon: HardDrive },
    { num: 4, title: 'مانیتور و جانبی', icon: Tv },
    { num: 5, title: 'تحویل گیرنده', icon: UserCircle },
  ];

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-gray-800/50 overflow-hidden">
      <div className="p-6 border-b border-white/50 dark:border-gray-800/50 flex justify-between items-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-md">
        <h2 className="text-xl font-black flex items-center gap-3 text-gray-900 dark:text-white">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Monitor className="w-6 h-6" />
          </div>
          ثبت مشخصات سیستم
        </h2>
        <span className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-bold shadow-sm">
          مرحله {step} از 5
        </span>
      </div>

      <div className="p-8">
        <div className="flex justify-between relative mb-12">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-200/50 dark:bg-gray-800/50 -z-10 -translate-y-1/2 rounded-full" />
          <div 
            className="absolute top-1/2 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
          
          {steps.map(s => (
            <div key={s.num} className="flex flex-col items-center gap-3 bg-transparent px-2">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500",
                step >= s.num ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transform scale-110" : "bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700"
              )}>
                {step > s.num ? <Check className="w-6 h-6" /> : s.num}
              </div>
              <span className={cn(
                "text-sm font-bold hidden md:block transition-colors duration-300",
                step >= s.num ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"
              )}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">کد اموال *</label>
                  <input required name="CaseAssetCode" value={formData.CaseAssetCode} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="مثال: PC-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">کد IT</label>
                  <input name="CaseITCode" value={formData.CaseITCode} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="مثال: IT-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">برند کیس *</label>
                  <select required name="CaseBrand" value={formData.CaseBrand} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">انتخاب برند...</option>
                    {definitions.caseBrands.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">پردازنده *</label>
                  <select required name="processor" value={formData.processor} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">انتخاب پردازنده...</option>
                    {definitions.processors.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نسل پردازنده *</label>
                  <select required name="processorGen" value={formData.processorGen} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">انتخاب نسل...</option>
                    {definitions.processorGens.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">برند مادربرد *</label>
                  <select required name="motherboardBrand" value={formData.motherboardBrand} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">انتخاب برند...</option>
                    {definitions.motherboardBrands.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">مدل مادربرد *</label>
                  <select required name="motherboardModel" value={formData.motherboardModel} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">انتخاب مدل...</option>
                    {definitions.motherboardModels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">منبع تغذیه *</label>
                  <select required name="Power" value={formData.Power} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">انتخاب توان...</option>
                    {definitions.powers.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <label className="font-bold text-gray-900 dark:text-white block mb-2">گرافیک آنبرد *</label>
                    <select required name="onboardVGA" value={formData.onboardVGA} onChange={handleChange} className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">انتخاب مدل...</option>
                      {definitions.onboardVGAs.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-bold text-gray-900 dark:text-white">کارت گرافیک مجزا</label>
                    <button 
                      type="button" 
                      onClick={() => setExternalVGAs([...externalVGAs, { model: '', memory: '' }])}
                      className="flex items-center gap-1 text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> افزودن
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {externalVGAs.map((vga, index) => (
                      <div key={index} className="flex gap-3 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                        <button 
                          type="button" 
                          onClick={() => setExternalVGAs(externalVGAs.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1">مدل</label>
                          <input 
                            value={vga.model} 
                            onChange={(e) => {
                              const newVgas = [...externalVGAs];
                              newVgas[index].model = e.target.value;
                              setExternalVGAs(newVgas);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                            placeholder="مثال: RTX 3060" 
                          />
                        </div>
                        <div className="w-1/3">
                          <label className="block text-xs font-medium mb-1">حافظه</label>
                          <select 
                            value={vga.memory} 
                            onChange={(e) => {
                              const newVgas = [...externalVGAs];
                              newVgas[index].memory = e.target.value;
                              setExternalVGAs(newVgas);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            <option value="">انتخاب...</option>
                            <option value="2GB">2GB</option>
                            <option value="4GB">4GB</option>
                            <option value="6GB">6GB</option>
                            <option value="8GB">8GB</option>
                            <option value="12GB">12GB</option>
                            <option value="16GB">16GB</option>
                            <option value="24GB">24GB</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    {externalVGAs.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        کارت گرافیک مجزا ثبت نشده است
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-indigo-600" />
                      ماژول‌های RAM
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setRams([...rams, { type: 'DDR4', size: '8GB', count: 1 }])}
                      className="flex items-center gap-1 text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> افزودن
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {rams.map((ram, index) => (
                      <div key={index} className="flex gap-3 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                        {rams.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setRams(rams.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1">نوع</label>
                          <select 
                            value={ram.type} 
                            onChange={(e) => {
                              const newRams = [...rams];
                              newRams[index].type = e.target.value;
                              setRams(newRams);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            <option value="DDR3">DDR3</option>
                            <option value="DDR4">DDR4</option>
                            <option value="DDR5">DDR5</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1">حجم</label>
                          <select 
                            value={ram.size} 
                            onChange={(e) => {
                              const newRams = [...rams];
                              newRams[index].size = e.target.value;
                              setRams(newRams);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            <option value="4GB">4GB</option>
                            <option value="8GB">8GB</option>
                            <option value="16GB">16GB</option>
                            <option value="32GB">32GB</option>
                            <option value="64GB">64GB</option>
                          </select>
                        </div>
                        <div className="w-20">
                          <label className="block text-xs font-medium mb-1">تعداد</label>
                          <input 
                            type="number"
                            min="1"
                            value={ram.count} 
                            onChange={(e) => {
                              const newRams = [...rams];
                              newRams[index].count = parseInt(e.target.value) || 1;
                              setRams(newRams);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-purple-600" />
                      هارد دیسک‌ها
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setHardDrives([...hardDrives, { type: 'SSD', size: '512GB', count: 1 }])}
                      className="flex items-center gap-1 text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> افزودن
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {hardDrives.map((hdd, index) => (
                      <div key={index} className="flex gap-3 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                        {hardDrives.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setHardDrives(hardDrives.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1">نوع</label>
                          <select 
                            value={hdd.type} 
                            onChange={(e) => {
                              const newHdds = [...hardDrives];
                              newHdds[index].type = e.target.value;
                              setHardDrives(newHdds);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            <option value="HDD">HDD</option>
                            <option value="SSD">SSD</option>
                            <option value="NVMe">NVMe</option>
                            <option value="M.2">M.2</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1">حجم</label>
                          <select 
                            value={hdd.size} 
                            onChange={(e) => {
                              const newHdds = [...hardDrives];
                              newHdds[index].size = e.target.value;
                              setHardDrives(newHdds);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            <option value="128GB">128GB</option>
                            <option value="256GB">256GB</option>
                            <option value="512GB">512GB</option>
                            <option value="1TB">1TB</option>
                            <option value="2TB">2TB</option>
                            <option value="4TB">4TB</option>
                          </select>
                        </div>
                        <div className="w-20">
                          <label className="block text-xs font-medium mb-1">تعداد</label>
                          <input 
                            type="number"
                            min="1"
                            value={hdd.count} 
                            onChange={(e) => {
                              const newHdds = [...hardDrives];
                              newHdds[index].count = parseInt(e.target.value) || 1;
                              setHardDrives(newHdds);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Tv className="w-5 h-5 text-indigo-600" />
                      مانیتورها
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setMonitors([...monitors, { assetCode: '', itCode: '', brand: '', model: '', size: '' }])}
                      className="flex items-center gap-1 text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> افزودن مانیتور
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {monitors.map((monitor, index) => (
                      <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                        <button 
                          type="button" 
                          onClick={() => setMonitors(monitors.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div>
                          <label className="block text-xs font-medium mb-1">کد اموال</label>
                          <input 
                            value={monitor.assetCode} 
                            onChange={(e) => {
                              const newMonitors = [...monitors];
                              newMonitors[index].assetCode = e.target.value;
                              setMonitors(newMonitors);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">کد IT</label>
                          <input 
                            value={monitor.itCode} 
                            onChange={(e) => {
                              const newMonitors = [...monitors];
                              newMonitors[index].itCode = e.target.value;
                              setMonitors(newMonitors);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">برند</label>
                          <input 
                            value={monitor.brand} 
                            onChange={(e) => {
                              const newMonitors = [...monitors];
                              newMonitors[index].brand = e.target.value;
                              setMonitors(newMonitors);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">مدل</label>
                          <input 
                            value={monitor.model} 
                            onChange={(e) => {
                              const newMonitors = [...monitors];
                              newMonitors[index].model = e.target.value;
                              setMonitors(newMonitors);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">سایز</label>
                          <input 
                            value={monitor.size} 
                            onChange={(e) => {
                              const newMonitors = [...monitors];
                              newMonitors[index].size = e.target.value;
                              setMonitors(newMonitors);
                            }} 
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                            placeholder="مثال: 24"
                          />
                        </div>
                      </div>
                    ))}
                    {monitors.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        مانیتوری ثبت نشده است
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <label className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Monitor className="w-5 h-5 text-emerald-600" />
                    تجهیزات جانبی
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">ماوس</label>
                      <input name="Mouse" value={formData.Mouse} onChange={handleChange} className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="مدل ماوس" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">کیبورد</label>
                      <input name="Keyboard" value={formData.Keyboard} onChange={handleChange} className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="مدل کیبورد" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">سایر</label>
                      <input name="Other" value={formData.Other} onChange={handleChange} className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="سایر تجهیزات" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">نام و نام خانوادگی *</label>
                  <input required name="FullName" value={formData.FullName} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="نام تحویل گیرنده" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">کد پرسنلی *</label>
                  <input required name="PersonnelCode" value={formData.PersonnelCode} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="کد پرسنلی" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">واحد *</label>
                  <input required name="Unit" value={formData.Unit} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="نام واحد" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">تاریخ تحویل *</label>
                  <input required name="DeliveryDate" value={formData.DeliveryDate} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500" placeholder="1402/01/01" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-medium disabled:opacity-50"
            >
              مرحله قبل
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/30 transition-all"
            >
              {step === 5 ? 'ثبت نهایی سیستم' : 'مرحله بعد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

