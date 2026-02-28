import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Layers } from 'lucide-react';

export const Layout = () => {
  return (
    <div className="min-h-screen font-sans relative overflow-hidden print:overflow-visible print:bg-white" dir="rtl">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none print:hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-pink-400/20 dark:bg-pink-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>
      
      <Sidebar />
      
      <main className="mr-72 p-8 h-screen overflow-y-auto relative z-10 print:m-0 print:p-0 print:h-auto print:overflow-visible">
        <div className="flex justify-between items-center mb-8 bg-gray-100/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm print:hidden">
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <Layers className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            سامانه مدیریت اموال IT
          </h2>
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 print:animate-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
