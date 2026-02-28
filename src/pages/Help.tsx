import React, { useState } from 'react';
import { 
  Book, Monitor, Printer, Wrench, Package, FileBarChart, 
  LayoutDashboard, Users, RefreshCw, Upload, Search, ChevronDown, ChevronUp, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Help = () => {
  const [openSection, setOpenSection] = useState<string | null>('intro');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const guides = [
    {
      id: 'intro',
      title: 'مقدمه و آشنایی کلی',
      icon: HelpCircle,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            به سامانه جامع مدیریت اموال و تجهیزات IT خوش آمدید. این سامانه جهت یکپارچه‌سازی فرآیندهای ثبت، نگهداری، تعمیرات و گزارش‌گیری تجهیزات سخت‌افزاری طراحی شده است.
          </p>
          <p>
            در این راهنما، نحوه کار با بخش‌های مختلف سیستم به صورت گام‌به‌گام توضیح داده شده است. شما می‌توانید با کلیک بر روی هر بخش، توضیحات مربوط به آن را مشاهده کنید.
          </p>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'داشبورد مدیریتی',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            داشبورد اولین صفحه‌ای است که پس از ورود مشاهده می‌کنید. در این صفحه نمایی کلی از وضعیت سیستم نمایش داده می‌شود:
          </p>
          <ul className="list-disc list-inside space-y-2 marker:text-blue-500">
            <li><strong>کارت‌های آمار سریع:</strong> تعداد کل سیستم‌ها، پرینترها، تعمیرات جاری و هشدارهای موجودی انبار.</li>
            <li><strong>نمودار وضعیت تجهیزات:</strong> نمایش گرافیکی وضعیت سلامت تجهیزات (فعال، خراب، در تعمیر).</li>
            <li><strong>آخرین فعالیت‌ها:</strong> لیستی از آخرین تغییرات انجام شده در سیستم توسط کاربران.</li>
            <li><strong>دسترسی سریع:</strong> دکمه‌های میانبر برای انجام عملیات‌های پرکاربرد مانند ثبت سیستم جدید.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'register',
      title: 'ثبت مشخصات (سیستم و پرینتر)',
      icon: Monitor,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            برای اضافه کردن تجهیزات جدید به سامانه از منوی «ثبت مشخصات» استفاده کنید.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold mb-2 text-emerald-600">نکات مهم در ثبت سیستم:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>وارد کردن <strong>کد اموال</strong> الزامی است و باید یکتا باشد.</li>
              <li>مشخصات سخت‌افزاری (CPU, RAM, HDD) را با دقت انتخاب کنید.</li>
              <li>در صورت وجود کارت گرافیک مجزا، آن را در بخش مربوطه اضافه کنید.</li>
              <li>نام تحویل‌گیرنده و واحد سازمانی برای پیگیری‌های بعدی حیاتی است.</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold mb-2 text-emerald-600">نکات مهم در ثبت پرینتر:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>نوع دستگاه (پرینتر، کپی، اسکنر) را مشخص کنید.</li>
              <li>نوع چاپ (لیزری، جوهرافشان) و رنگ (سیاه و سفید، رنگی) را تعیین کنید.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'lists',
      title: 'لیست تجهیزات و جستجو',
      icon: Search,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            در بخش «لیست تجهیزات» می‌توانید تمامی اموال ثبت شده را مشاهده و مدیریت کنید.
          </p>
          <ul className="list-disc list-inside space-y-2 marker:text-purple-500">
            <li><strong>جستجو:</strong> از نوار جستجو برای یافتن سریع تجهیز بر اساس کد اموال، نام کاربر یا مشخصات فنی استفاده کنید.</li>
            <li><strong>مشاهده جزئیات:</strong> با کلیک روی آیکون چشم (👁️)، تمامی اطلاعات و تاریخچه تجهیز نمایش داده می‌شود.</li>
            <li><strong>ویرایش:</strong> با کلیک روی آیکون مداد (✏️)، می‌توانید مشخصات تجهیز را تغییر دهید.</li>
            <li><strong>حذف:</strong> با کلیک روی آیکون سطل زباله، تجهیز حذف می‌شود (این عمل در لاگ سیستم ثبت می‌شود).</li>
            <li><strong>ویرایش گروهی:</strong> در لیست سیستم‌ها می‌توانید چند مورد را انتخاب کرده و به صورت همزمان ویرایش کنید.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'lifecycle',
      title: 'مدیریت چرخه عمر (نقل و انتقالات)',
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            این بخش برای مدیریت رویدادهای مهم در طول عمر یک تجهیز طراحی شده است.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 border border-orange-200 dark:border-orange-900/30 rounded-xl bg-orange-50 dark:bg-orange-900/10">
              <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-2">انتقال (Transfer)</h4>
              <p className="text-sm">جابجایی تجهیز بین کاربران یا واحدها. تاریخچه این جابجایی‌ها به صورت خودکار ذخیره می‌شود.</p>
            </div>
            <div className="p-3 border border-emerald-200 dark:border-emerald-900/30 rounded-xl bg-emerald-50 dark:bg-emerald-900/10">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">ارتقاء (Upgrade)</h4>
              <p className="text-sm">ثبت تغییرات سخت‌افزاری مانند اضافه کردن رم یا هارد دیسک جدید.</p>
            </div>
            <div className="p-3 border border-red-200 dark:border-red-900/30 rounded-xl bg-red-50 dark:bg-red-900/10">
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">اسقاط (Scrap)</h4>
              <p className="text-sm">خارج کردن تجهیز از چرخه مصرف به دلیل خرابی غیرقابل تعمیر یا فرسودگی.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'repairs',
      title: 'مدیریت تعمیرات',
      icon: Wrench,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            تمامی خرابی‌ها و تعمیرات انجام شده باید در این بخش ثبت شوند.
          </p>
          <ul className="list-disc list-inside space-y-2 marker:text-amber-500">
            <li><strong>ثبت تعمیر جدید:</strong> انتخاب دستگاه، شرح مشکل و وضعیت فعلی (در انتظار، در حال انجام).</li>
            <li><strong>مصرف قطعه:</strong> اگر در تعمیر قطعه‌ای تعویض شود، می‌توانید آن را از انبار انتخاب کنید تا به صورت خودکار از موجودی کسر شود.</li>
            <li><strong>تکمیل تعمیر:</strong> پس از رفع مشکل، وضعیت را به «تکمیل شده» تغییر دهید و اقدامات انجام شده را ثبت کنید.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'inventory',
      title: 'انبارداری',
      icon: Package,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            مدیریت موجودی قطعات یدکی و مواد مصرفی در این بخش انجام می‌شود.
          </p>
          <ul className="list-disc list-inside space-y-2 marker:text-pink-500">
            <li><strong>قطعات یدکی:</strong> ثبت قطعات سخت‌افزاری مانند رم، هارد، پاور و...</li>
            <li><strong>مواد مصرفی:</strong> ثبت کارتریج، تونر، کاغذ و سایر اقلام مصرفی.</li>
            <li><strong>هشدار موجودی:</strong> مشاهده اقلامی که موجودی آن‌ها به کمتر از حد تعیین شده رسیده است.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'reports',
      title: 'گزارش‌گیری',
      icon: FileBarChart,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            در این بخش می‌توانید گزارش‌های متنوعی از وضعیت سیستم تهیه کنید.
          </p>
          <ul className="list-disc list-inside space-y-2 marker:text-cyan-500">
            <li><strong>گزارش اموال:</strong> لیست کامل تجهیزات به تفکیک واحد با امکان خروجی اکسل.</li>
            <li><strong>گزارش انبار:</strong> لیست موجودی و ارزش ریالی انبار.</li>
            <li><strong>گزارش تعمیرات:</strong> آمار خرابی‌ها و تعمیرات انجام شده.</li>
            <li><strong>چاپ فرم تحویل:</strong> امکان جستجوی کاربر و چاپ فرم استاندارد تحویل اموال (شناسنامه سیستم).</li>
          </ul>
        </div>
      )
    },
    {
      id: 'users',
      title: 'مدیریت کاربران (مخصوص مدیر)',
      icon: Users,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            مدیر سیستم (Admin) می‌تواند در این بخش کاربران جدید تعریف کرده و سطح دسترسی آن‌ها را مشخص کند.
          </p>
          <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            توجه: نام کاربری باید یکتا باشد. دسترسی‌ها شامل مشاهده، ویرایش و حذف در بخش‌های مختلف است.
          </p>
        </div>
      )
    },
    {
      id: 'import',
      title: 'ورود اطلاعات (Import)',
      icon: Upload,
      color: 'text-lime-600',
      bgColor: 'bg-lime-100',
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            برای ورود سریع اطلاعات اولیه، می‌توانید از فایل اکسل استفاده کنید.
          </p>
          <ul className="list-disc list-inside space-y-2 marker:text-lime-500">
            <li>ابتدا فایل نمونه را دانلود کنید.</li>
            <li>اطلاعات را طبق فرمت نمونه وارد کنید.</li>
            <li>فایل را آپلود کنید تا اطلاعات به صورت گروهی ثبت شوند.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      <div className="flex justify-between items-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
            <Book className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">راهنمای استفاده از سامانه</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">آموزش گام‌به‌گام بخش‌های مختلف</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {guides.map((guide) => (
          <div 
            key={guide.id}
            className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-sm overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleSection(guide.id)}
              className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${guide.bgColor} ${guide.color}`}>
                  <guide.icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-200">{guide.title}</span>
              </div>
              {openSection === guide.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {openSection === guide.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-800/50">
                    <div className="mt-4">
                      {guide.content}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
