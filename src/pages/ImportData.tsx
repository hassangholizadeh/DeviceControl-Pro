import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Upload, FileDown, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from '../utils/cn';

export const ImportData = () => {
  const { addSystem, addPrinter, systems, printers } = useData();
  const [activeSection, setActiveSection] = useState<'system' | 'printer'>('system');
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);

  const downloadSystemTemplate = () => {
    const headers = [
      'کد اموال کیس', 'کد IT کیس', 'پردازنده', 'نسل پردازنده', 'برند مادربرد', 'مدل مادربرد', 
      'منبع تغذیه', 'مدل گرافیک آنبورد', 'کارت گرافیک مجزا', 'نوع RAM', 'حجم RAM', 'تعداد RAM',
      'نوع هارد', 'حجم هارد', 'تعداد هارد', 'کد اموال مانیتور', 'کد IT مانیتور', 'برند مانیتور',
      'مدل مانیتور', 'سایز مانیتور', 'ماوس', 'کیبورد', 'سایر', 'نام و نام خانوادگی', 'کد پرسنلی', 'واحد', 'تاریخ تحویل'
    ];
    const example = [
      'PC-001', 'IT-101', 'Intel Core i5', 'نسل 12', 'ASUS', 'H610', 
      '480W', 'Intel UHD 770', 'RTX 3060 12GB', 'DDR4', '8GB', '2',
      'SSD', '512GB', '1', 'MON-001', 'IT-M101', 'Samsung',
      'G5', '27', 'Logitech G502', 'Logitech G213', 'Headset', 'علی علوی', '12345', 'فناوری اطلاعات', '1402/01/01'
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    XLSX.utils.book_append_sheet(wb, ws, "سیستم‌ها");
    XLSX.writeFile(wb, "System_Import_Template.xlsx");
  };

  const downloadPrinterTemplate = () => {
    const headers = [
      'کد اموال', 'کد IT', 'نوع دستگاه', 'وضعیت', 'برند', 'مدل دستگاه', 'نوع چاپ', 'رنگ', 'نام تحویل گیرنده', 'کد پرسنلی', 'واحد', 'تاریخ تحویل'
    ];
    const example = [
      'PR-001', 'IT-201', 'پرینتر', 'Active', 'HP', 'LaserJet Pro', 'لیزری', 'سیاه و سفید', 'رضا رضایی', '67890', 'اداری', '1402/02/15'
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    XLSX.utils.book_append_sheet(wb, ws, "پرینترها");
    XLSX.writeFile(wb, "Printer_Import_Template.xlsx");
  };

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        let successCount = 0;
        const errors: string[] = [];

        const sheetName = activeSection === 'system' ? "سیستم‌ها" : "پرینترها";
        const sheet = workbook.Sheets[sheetName] || workbook.Sheets[Object.keys(workbook.Sheets)[0]];
        
        if (!sheet) {
          setResults({ success: 0, errors: [`شیت مورد نظر (${sheetName}) یافت نشد.`] });
          return;
        }

        const rows = XLSX.utils.sheet_to_json(sheet) as any[];

        rows.forEach((row, index) => {
          try {
            if (activeSection === 'system') {
              const assetCode = row['کد اموال کیس'] || '';
              if (assetCode && systems.some(s => s.CaseAssetCode === assetCode)) {
                errors.push(`ردیف ${index + 2}: کد اموال ${assetCode} تکراری است.`);
                return;
              }

              addSystem({
                id: Date.now() + index,
                CaseAssetCode: assetCode,
                CaseITCode: row['کد IT کیس'] || '',
                processor: row['پردازنده'] || '',
                processorGen: row['نسل پردازنده'] || '',
                motherboardBrand: row['برند مادربرد'] || '',
                motherboardModel: row['مدل مادربرد'] || '',
                Power: row['منبع تغذیه'] || '',
                onboardVGA: row['مدل گرافیک آنبورد'] || '',
                hasOnboardVGA: !!row['مدل گرافیک آنبورد'],
                externalVGAs: row['کارت گرافیک مجزا'] ? [{ model: row['کارت گرافیک مجزا'], memory: '' }] : [],
                rams: row['حجم RAM'] ? [{ type: row['نوع RAM'] || 'DDR4', size: row['حجم RAM'], count: parseInt(row['تعداد RAM']) || 1 }] : [],
                hardDrives: row['حجم هارد'] ? [{ type: row['نوع هارد'] || 'SSD', size: row['حجم هارد'], count: parseInt(row['تعداد هارد']) || 1 }] : [],
                monitors: row['کد اموال مانیتور'] ? [{
                  assetCode: row['کد اموال مانیتور'],
                  itCode: row['کد IT مانیتور'] || '',
                  brand: row['برند مانیتور'] || '',
                  model: row['مدل مانیتور'] || '',
                  size: row['سایز مانیتور'] || ''
                }] : [],
                Mouse: row['ماوس'] || '',
                Keyboard: row['کیبورد'] || '',
                Other: row['سایر'] || '',
                FullName: row['نام و نام خانوادگی'] || '',
                PersonnelCode: row['کد پرسنلی'] || '',
                Unit: row['واحد'] || '',
                DeliveryDate: row['تاریخ تحویل'] || '',
                CPU: `${row['پردازنده'] || ''} - ${row['نسل پردازنده'] || ''}`,
                Mainboard: `${row['برند مادربرد'] || ''} - ${row['مدل مادربرد'] || ''}`,
                Position: '',
                Status: 'Active'
              });
            } else {
              const assetCode = row['کد اموال'] || '';
              if (assetCode && printers.some(p => p.AssetCode === assetCode)) {
                errors.push(`ردیف ${index + 2}: کد اموال ${assetCode} تکراری است.`);
                return;
              }

              addPrinter({
                id: Date.now() + index,
                AssetCode: assetCode,
                ITCode: row['کد IT'] || '',
                DeviceType: row['نوع دستگاه'] || '',
                Status: (row['وضعیت'] as any) || 'Active',
                brand: row['برند'] || '',
                DeviceNameModel: row['مدل دستگاه'] || '',
                printType: row['نوع چاپ'] || '',
                color: row['رنگ'] || '',
                Receiver: row['نام تحویل گیرنده'] || '',
                PersonnelCode: row['کد پرسنلی'] || '',
                Position: '',
                Unit: row['واحد'] || '',
                DeliveryDate: row['تاریخ تحویل'] || ''
              });
            }
            successCount++;
          } catch (err) {
            errors.push(`خطا در ردیف ${index + 2}`);
          }
        });

        setResults({ success: successCount, errors });
      } catch (err) {
        setResults({ success: 0, errors: ['فرمت فایل نامعتبر است'] });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.name.endsWith('.xlsx'))) {
      processFile(file);
    } else {
      alert("لطفاً فقط فایل اکسل (.xlsx) آپلود کنید.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700" dir="rtl">
      {/* Header & Tabs */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">آپلود گروهی اطلاعات</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">وارد کردن تجهیزات از طریق فایل اکسل</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
            <button
              onClick={() => { setActiveSection('system'); setResults(null); }}
              className={cn(
                "px-6 py-2.5 rounded-xl font-bold transition-all",
                activeSection === 'system' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              آپلود سیستم
            </button>
            <button
              onClick={() => { setActiveSection('printer'); setResults(null); }}
              className={cn(
                "px-6 py-2.5 rounded-xl font-bold transition-all",
                activeSection === 'printer' ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              آپلود کپی و پرینتر
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Instructions & Template */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-indigo-500" />
              دریافت تمپلیت
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              ابتدا فایل تمپلیت مربوط به {activeSection === 'system' ? 'سیستم‌ها' : 'پرینترها'} را دانلود کرده و اطلاعات را طبق ستون‌های آن تکمیل کنید.
            </p>
            <button 
              onClick={activeSection === 'system' ? downloadSystemTemplate : downloadPrinterTemplate}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                activeSection === 'system' ? "bg-indigo-600 shadow-indigo-500/30" : "bg-emerald-600 shadow-emerald-500/30"
              )}
            >
              <FileSpreadsheet className="w-5 h-5" />
              دانلود تمپلیت {activeSection === 'system' ? 'سیستم' : 'پرینتر'}
            </button>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-800/50">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              نکات مهم:
            </h4>
            <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-2 list-disc pr-4">
              <li>فرمت فایل حتماً باید .xlsx باشد.</li>
              <li>عناوین ستون‌ها را تغییر ندهید.</li>
              <li>فیلدهای ستاره‌دار در سیستم حتماً پر شوند.</li>
            </ul>
          </div>
        </div>

        {/* Right: Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "relative group cursor-pointer transition-all duration-500 h-[350px] flex flex-col items-center justify-center",
              "bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border-2 border-dashed rounded-[2.5rem] p-12 text-center",
              isDragging ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[0.98]" : "border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500"
            )}
          >
            <input 
              type="file" 
              accept=".xlsx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
            
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Upload className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">فایل اکسل {activeSection === 'system' ? 'سیستم‌ها' : 'پرینترها'} را اینجا رها کنید</p>
              <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-lg">یا برای انتخاب فایل کلیک کنید</p>
            </div>
          </div>

          {results && (
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">نتیجه عملیات</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                  <p className="text-emerald-800 dark:text-emerald-300 font-bold text-lg">تعداد رکوردهای موفق:</p>
                  <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{results.success}</p>
                </div>
                
                {results.errors.length > 0 && (
                  <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800/50">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-lg mb-2">
                      <AlertCircle className="w-5 h-5" />
                      خطاها:
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {results.errors.map((err, i) => (
                        <p key={i} className="text-sm text-red-600 dark:text-red-400 font-medium">• {err}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
