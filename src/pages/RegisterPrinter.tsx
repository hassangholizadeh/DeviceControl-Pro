import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router';
import { Printer, Settings, UserCircle, Check } from 'lucide-react';
import { cn } from '../utils/cn';

export const RegisterPrinter = () => {
  const [step, setStep] = useState(1);
  const { addPrinter, definitions, printers } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    AssetCode: '',
    ITCode: '',
    DeviceType: '',
    Status: 'Active' as 'Active' | 'Repair' | 'Broken',
    brand: '',
    DeviceNameModel: '',
    printType: '',
    color: '',
    Receiver: '',
    PersonnelCode: '',
    Position: '',
    Unit: '',
    DeliveryDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (printers.some(p => p.AssetCode === formData.AssetCode)) {
        alert(`کد اموال ${formData.AssetCode} قبلاً ثبت شده است.`);
        return;
      }
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    addPrinter({
      id: Date.now(),
      ...formData
    });
    
    navigate('/list/printers');
  };

  const steps = [
    { num: 1, title: 'مشخصات دستگاه', icon: Printer },
    { num: 2, title: 'مشخصات فنی', icon: Settings },
    { num: 3, title: 'تحویل گیرنده', icon: UserCircle },
  ];

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-gray-800/50 overflow-hidden">
      <div className="p-6 border-b border-white/50 dark:border-gray-800/50 flex justify-between items-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-md">
        <h2 className="text-xl font-black flex items-center gap-3 text-gray-900 dark:text-white">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Printer className="w-6 h-6" />
          </div>
          ثبت مشخصات دستگاه کپی و پرینتر
        </h2>
        <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-bold shadow-sm">
          مرحله {step} از 3
        </span>
      </div>

      <div className="p-8">
        <div className="flex justify-between relative mb-12 max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-200/50 dark:bg-gray-800/50 -z-10 -translate-y-1/2 rounded-full" />
          <div 
            className="absolute top-1/2 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          
          {steps.map(s => (
            <div key={s.num} className="flex flex-col items-center gap-3 bg-transparent px-2">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500",
                step >= s.num ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 transform scale-110" : "bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700"
              )}>
                {step > s.num ? <Check className="w-6 h-6" /> : s.num}
              </div>
              <span className={cn(
                "text-sm font-bold hidden md:block transition-colors duration-300",
                step >= s.num ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
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
                  <input required name="AssetCode" value={formData.AssetCode} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" placeholder="مثال: PR-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">کد IT</label>
                  <input name="ITCode" value={formData.ITCode} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" placeholder="مثال: IT-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع دستگاه *</label>
                  <select required name="DeviceType" value={formData.DeviceType} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">انتخاب نوع...</option>
                    {definitions.printerTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">وضعیت *</label>
                  <select required name="Status" value={formData.Status} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="Active">فعال</option>
                    <option value="Repair">در تعمیر</option>
                    <option value="Broken">خراب</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">برند *</label>
                  <select required name="brand" value={formData.brand} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">انتخاب برند...</option>
                    {definitions.printerBrands.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">مدل دستگاه *</label>
                  <select required name="DeviceNameModel" value={formData.DeviceNameModel} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">انتخاب مدل...</option>
                    {definitions.printerModels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع چاپ *</label>
                  <select required name="printType" value={formData.printType} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">انتخاب نوع چاپ...</option>
                    {definitions.printTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رنگ *</label>
                  <select required name="color" value={formData.color} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">انتخاب رنگ...</option>
                    {definitions.printerColors.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">نام و نام خانوادگی *</label>
                  <input required name="Receiver" value={formData.Receiver} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" placeholder="نام تحویل گیرنده" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">کد پرسنلی *</label>
                  <input required name="PersonnelCode" value={formData.PersonnelCode} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" placeholder="کد پرسنلی" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">واحد *</label>
                  <input required name="Unit" value={formData.Unit} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" placeholder="نام واحد" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">تاریخ تحویل *</label>
                  <input required name="DeliveryDate" value={formData.DeliveryDate} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-emerald-500" placeholder="1402/01/01" />
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
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all"
            >
              {step === 3 ? 'ثبت نهایی پرینتر' : 'مرحله بعد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
