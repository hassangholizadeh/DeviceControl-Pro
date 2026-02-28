import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldAlert, Sun, Moon, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isLoading } = useData();
  const { theme, setTheme } = useTheme();

  // Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["-30deg", "30deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["30deg", "-30deg"]);
  
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["20px", "-20px"]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["20px", "-20px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setError('');
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 relative overflow-hidden" 
      dir="rtl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg shadow-black/5"
          title={theme === 'dark' ? 'تم روشن' : 'تم تاریک'}
        >
          {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-purple-400/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-pink-400/30 dark:bg-pink-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <motion.div 
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
        className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-[30px] p-10 w-full max-w-md shadow-2xl border border-white/50 dark:border-gray-800/50 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10"
      >
        <div className="text-center mb-8" style={{ transform: "translateZ(80px)" }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-lg shadow-indigo-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-1">خوش آمدید!</p>
          <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">سامانه مدیریت اموال IT</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">لطفاً برای ورود اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" style={{ transform: "translateZ(50px)" }}>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white shadow-inner"
              placeholder="نام کاربری را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رمز عبور</label>
            <div className="relative group/input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white shadow-inner pr-4 pl-12"
                placeholder="رمز عبور را وارد کنید"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-400'}`}>
                {rememberMe && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-gray-600 dark:text-gray-400 font-medium select-none">مرا به خاطر بسپار</span>
            </label>
            <button 
              type="button" 
              onClick={() => {
                alert('لطفاً با مدیر سیستم تماس بگیرید.');
              }}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all"
            >
              فراموشی رمز عبور؟
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] group flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                در حال بارگذاری...
              </>
            ) : (
              <>
                ورود به سیستم
                <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 space-y-4" style={{ transform: "translateZ(30px)" }}>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              حساب کاربری ندارید؟{' '}
              <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                همین حالا ثبت نام کنید
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
