import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Printer, Search, FileText, User } from 'lucide-react';

export const PrintHandover = () => {
  const { systems, printers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ name: string, code: string, unit: string } | null>(null);

  // Extract unique users from both systems and printers
  const usersList = useMemo(() => {
    const usersMap = new Map<string, { name: string, code: string, unit: string }>();
    
    systems.forEach(s => {
      if (s.FullName) {
        usersMap.set(s.FullName, { name: s.FullName, code: s.PersonnelCode || '', unit: s.Unit || '' });
      }
    });
    
    printers.forEach(p => {
      if (p.Receiver) {
        usersMap.set(p.Receiver, { name: p.Receiver, code: p.PersonnelCode || '', unit: p.Unit || '' });
      }
    });

    return Array.from(usersMap.values());
  }, [systems, printers]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return [];
    return usersList.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usersList, searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  // Prepare data for the selected user
  const userSystem = useMemo(() => systems.find(s => s.FullName === selectedUser?.name), [systems, selectedUser]);
  const userPrinters = useMemo(() => printers.filter(p => p.Receiver === selectedUser?.name), [printers, selectedUser]);

  // Monitors
  const monitors = userSystem?.monitors || [];
  const monitorSpecs = monitors.map(m => `${m.brand || ''} ${m.model || ''} ${m.size ? m.size + '"' : ''}`).join(' / ');
  const monitorCount = monitors.length > 0 ? monitors.length : '';
  const monitorAssets = monitors.map(m => m.assetCode).join(' / ');

  // Case
  const caseAsset = userSystem?.CaseAssetCode || '';
  const caseBrand = userSystem?.CaseBrand || '';
  const mainboard = userSystem?.Mainboard || '';
  const cpu = userSystem?.CPU || '';
  
  const rams = userSystem?.rams || [];
  const ram = rams.map(r => `${r.size} ${r.type}`).join(' + ');
  const ramCount = rams.reduce((acc, r) => acc + (Number(r.count) || 1), 0) || '';

  const hdds = userSystem?.hardDrives || [];
  const hdd = hdds.map(h => `${h.size} ${h.type}`).join(' + ');
  const hddCount = hdds.reduce((acc, h) => acc + (Number(h.count) || 1), 0) || '';

  const vgas = userSystem?.externalVGAs || [];
  const vga = vgas.length > 0 ? vgas.map(v => `${v.model} ${v.memory}`).join(' + ') : (userSystem?.onboardVGA || '');
  
  const keyboard = userSystem?.Keyboard || '';
  const mouse = userSystem?.Mouse || '';

  // Printers
  const singlePrinters = userPrinters.filter(p => !p.DeviceNameModel?.includes('چندکاره'));
  const multiPrinters = userPrinters.filter(p => p.DeviceNameModel?.includes('چندکاره'));

  const printerSingleSpecs = singlePrinters.map(p => p.DeviceNameModel).join(' / ');
  const printerSingleCount = singlePrinters.length > 0 ? singlePrinters.length : '';
  const printerSingleAssets = singlePrinters.map(p => p.AssetCode).join(' / ');

  const printerMultiSpecs = multiPrinters.map(p => p.DeviceNameModel).join(' / ');
  const printerMultiCount = multiPrinters.length > 0 ? multiPrinters.length : '';
  const printerMultiAssets = multiPrinters.map(p => p.AssetCode).join(' / ');

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Search and Selection Area (Hidden during print) */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/50 dark:border-gray-800/50 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">چاپ شناسنامه سیستم‌ها</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">جستجوی پرسنل و چاپ فرم تحویلی</p>
            </div>
          </div>
          
          {selectedUser && (
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
            >
              <Printer className="w-5 h-5" />
              چاپ فرم (A4)
            </button>
          )}
        </div>

        <div className="relative max-w-md mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="جستجوی نام یا کد پرسنلی..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedUser(null);
            }}
            className="w-full pr-12 pl-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
          />
        </div>

        {!selectedUser && searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedUser(user)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-right"
                >
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-gray-500 mt-1">کد پرسنلی: {user.code || '-'} | واحد: {user.unit || '-'}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                کاربری با این مشخصات یافت نشد.
              </div>
            )}
          </div>
        )}
      </div>

      {/* A4 Print Preview Area */}
      {selectedUser && (
        <div className="flex justify-center print:fixed print:inset-0 print:z-[9999] print:bg-white print:w-screen print:h-screen print:overflow-visible print:flex print:items-start print:justify-center">
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-8 shadow-2xl print:shadow-none print:p-0 print:m-0 mx-auto relative border border-gray-200 print:border-none font-sans">
            
            {/* Outer Border Box */}
            <div className="border-2 border-black h-full flex flex-col min-h-[280mm]">
              
              {/* Header Table */}
              <div className="flex border-b-2 border-black">
                {/* Right: Logo */}
                <div className="w-48 border-l-2 border-black flex flex-col items-center justify-center p-2">
                  <div className="w-12 h-14 border-2 border-red-800 rounded-t-full flex items-center justify-center mb-1 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-red-800 font-bold text-3xl font-serif">A</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-red-800 tracking-tighter">عمران آذرستان</div>
                  <div className="text-[8px] text-red-800 tracking-tighter">OMRAN AZARESTAN</div>
                </div>
                
                {/* Center: Title */}
                <div className="flex-1 flex items-center justify-center">
                  <h1 className="text-2xl font-bold">شناسنامه سیستم‌ها</h1>
                </div>
                
                {/* Left: Doc Info */}
                <div className="w-56 border-r-2 border-black flex flex-col text-xs font-medium">
                  <div className="flex border-b border-black flex-1">
                    <div className="w-24 p-1 border-l border-black flex items-center justify-center">کد سند:</div>
                    <div className="flex-1 p-1 flex items-center justify-center font-bold" dir="ltr">37-FO-IT-01-01</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-24 p-1 border-l border-black flex items-center justify-center">تاریخ ایجاد:</div>
                    <div className="flex-1 p-1 flex items-center justify-center">1399/03/20</div>
                  </div>
                  <div className="flex flex-1">
                    <div className="w-24 p-1 border-l border-black flex items-center justify-center">تاریخ بازنگری:</div>
                    <div className="flex-1 p-1 flex items-center justify-center">1400/03/09</div>
                  </div>
                </div>
              </div>

              {/* Sub Header */}
              <div className="flex border-b-2 border-black text-sm font-medium">
                <div className="flex-1 p-2 flex items-center">
                  <span className="w-24">شماره مدرک:</span>
                  <span className="flex-1"></span>
                </div>
                <div className="flex-1 p-2 flex items-center border-r-2 border-black">
                  <span className="w-24">تاریخ تحویل:</span>
                  <span className="flex-1"></span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex border-b border-black text-sm font-medium">
                <div className="flex-1 p-2 flex items-center">
                  <span className="w-24">نام پروژه:</span>
                  <span className="flex-1 font-bold">نیروگاه بوشهر</span>
                </div>
                <div className="flex-1 p-2 flex items-center border-r-2 border-black">
                  <span className="w-28">نام بخش / واحد:</span>
                  <span className="flex-1 font-bold">{selectedUser.unit}</span>
                </div>
              </div>
              <div className="flex border-b-2 border-black text-sm font-medium">
                <div className="flex-1 p-2 flex items-center">
                  <span className="w-32">نام و نام خانوادگی:</span>
                  <span className="flex-1 font-bold">{selectedUser.name}</span>
                </div>
                <div className="flex-1 p-2 flex items-center border-r-2 border-black">
                  <span className="w-28">شماره پرسنلی:</span>
                  <span className="flex-1 font-bold">{selectedUser.code}</span>
                </div>
              </div>

              {/* Main Table */}
              <table className="w-full text-[13px] text-center border-collapse">
                <thead>
                  <tr className="bg-gray-100 font-bold border-b-2 border-black">
                    <th className="border-l-2 border-black p-2 w-12">ردیف</th>
                    <th className="border-l-2 border-black p-2 w-32">نوع</th>
                    <th className="border-l-2 border-black p-2">مشخصات سخت افزار</th>
                    <th className="border-l-2 border-black p-2 w-16">تعداد</th>
                    <th className="p-2 w-48">شماره اموال</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {/* Row 1: Monitor */}
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">1</td>
                    <td className="border-l-2 border-black p-1.5">مانیتور</td>
                    <td className="border-l-2 border-black p-1.5">{monitorSpecs}</td>
                    <td className="border-l-2 border-black p-1.5">{monitorCount}</td>
                    <td className="p-1.5 font-bold" dir="ltr">{monitorAssets}</td>
                  </tr>

                  {/* Row 2: Case */}
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5" rowSpan={11}>2</td>
                    <td className="border-l-2 border-black p-1.5">برند کیس</td>
                    <td className="border-l-2 border-black p-1.5">{caseBrand}</td>
                    <td className="border-l-2 border-black p-1.5">{userSystem ? '1' : ''}</td>
                    <td className="p-1.5 align-top pt-4 font-bold" rowSpan={11} dir="ltr">{caseAsset}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">مادربرد</td>
                    <td className="border-l-2 border-black p-1.5" dir="ltr">{mainboard}</td>
                    <td className="border-l-2 border-black p-1.5">{mainboard ? '1' : ''}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">پردازنده</td>
                    <td className="border-l-2 border-black p-1.5" dir="ltr">{cpu}</td>
                    <td className="border-l-2 border-black p-1.5">{cpu ? '1' : ''}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">رم</td>
                    <td className="border-l-2 border-black p-1.5" dir="ltr">{ram}</td>
                    <td className="border-l-2 border-black p-1.5">{ramCount}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">هارد</td>
                    <td className="border-l-2 border-black p-1.5" dir="ltr">{hdd}</td>
                    <td className="border-l-2 border-black p-1.5">{hddCount}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">گرافیک</td>
                    <td className="border-l-2 border-black p-1.5" dir="ltr">{vga}</td>
                    <td className="border-l-2 border-black p-1.5">{vga ? '1' : ''}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">منبع تغذیه</td>
                    <td className="border-l-2 border-black p-1.5" dir="ltr">{userSystem?.Power || ''}</td>
                    <td className="border-l-2 border-black p-1.5">{userSystem?.Power ? '1' : ''}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">دی وی دی رام و رایتر</td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="border-l-2 border-black p-1.5"></td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">کیبورد</td>
                    <td className="border-l-2 border-black p-1.5">{keyboard}</td>
                    <td className="border-l-2 border-black p-1.5">{keyboard ? '1' : ''}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">ماوس</td>
                    <td className="border-l-2 border-black p-1.5">{mouse}</td>
                    <td className="border-l-2 border-black p-1.5">{mouse ? '1' : ''}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">سایر</td>
                    <td className="border-l-2 border-black p-1.5">{userSystem?.Other || ''}</td>
                    <td className="border-l-2 border-black p-1.5">{userSystem?.Other ? '1' : ''}</td>
                  </tr>

                  {/* Row 3: Copier */}
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">3</td>
                    <td className="border-l-2 border-black p-1.5">دستگاه کپی</td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="p-1.5 font-bold" dir="ltr"></td>
                  </tr>
                  {/* Row 4: Printer Single */}
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">4</td>
                    <td className="border-l-2 border-black p-1.5">پرینتر تک کاره</td>
                    <td className="border-l-2 border-black p-1.5">{printerSingleSpecs}</td>
                    <td className="border-l-2 border-black p-1.5">{printerSingleCount}</td>
                    <td className="p-1.5 font-bold" dir="ltr">{printerSingleAssets}</td>
                  </tr>
                  {/* Row 5: Printer Multi */}
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">5</td>
                    <td className="border-l-2 border-black p-1.5">پرینتر چند کاره</td>
                    <td className="border-l-2 border-black p-1.5">{printerMultiSpecs}</td>
                    <td className="border-l-2 border-black p-1.5">{printerMultiCount}</td>
                    <td className="p-1.5 font-bold" dir="ltr">{printerMultiAssets}</td>
                  </tr>
                  {/* Row 6: Scanner */}
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">6</td>
                    <td className="border-l-2 border-black p-1.5">اسکنر</td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="p-1.5"></td>
                  </tr>
                  {/* Row 7: Phone */}
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">7</td>
                    <td className="border-l-2 border-black p-1.5">گوشی تلفن</td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="p-1.5"></td>
                  </tr>
                  {/* Row 8: Walkie Talkie */}
                  <tr className="border-b border-black">
                    <td className="border-l-2 border-black p-1.5">8</td>
                    <td className="border-l-2 border-black p-1.5">بی سیم واکی تاکی</td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="p-1.5"></td>
                  </tr>
                  {/* Row 9: Other */}
                  <tr className="border-b-2 border-black">
                    <td className="border-l-2 border-black p-1.5">9</td>
                    <td className="border-l-2 border-black p-1.5">سایر</td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="border-l-2 border-black p-1.5"></td>
                    <td className="p-1.5"></td>
                  </tr>
                </tbody>
              </table>

              {/* Descriptions */}
              <div className="flex-1 border-b-2 border-black p-3 min-h-[100px]">
                <div className="font-bold text-sm mb-1">توضیحات:</div>
              </div>

              {/* Signatures */}
              <div className="flex h-32">
                <div className="flex-1 p-4 flex flex-col items-center">
                  <div className="font-bold text-sm mb-1">سرپرست واحد فناوری اطلاعات و ارتباطات</div>
                  <div className="text-xs text-gray-700">(نام و نام خانوادگی، تاریخ و امضاء)</div>
                </div>
                <div className="flex-1 border-r-2 border-black p-4 flex flex-col items-center">
                  <div className="font-bold text-sm mb-1">استفاده کننده</div>
                  <div className="text-xs text-gray-700">(نام و نام خانوادگی، تاریخ و امضاء)</div>
                </div>
              </div>

            </div>
            
            {/* Footer Text */}
            <div className="text-[10px] mt-2 text-left font-bold text-gray-600">
              توزیع نسخ : واحد فناوری اطلاعات و ارتباطات
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

