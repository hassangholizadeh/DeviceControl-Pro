import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Users as UsersIcon, Plus, Edit, Trash2, X, Shield, User as UserIcon, Briefcase, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

export const Users = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    username: '',
    password: '',
    fullName: '',
    role: '',
    department: '',
    status: 'Active',
    registerSystem: 'view',
    registerPrinter: 'view',
    listSystem: 'view',
    listPrinter: 'view',
    inventory: false,
    reports: false,
    dashboard: false,
    import: false
  });

  if (currentUser?.username !== 'admin') {
    return (
      <div className="text-center py-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-gray-800/50">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500 opacity-50" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">عدم دسترسی</h2>
        <p className="text-gray-500 font-medium">شما دسترسی به بخش مدیریت کاربران را ندارید.</p>
      </div>
    );
  }

  const handleOpenModal = (user?: any) => {
    if (user) {
      setSelectedUser(user);
      setFormData({ ...user, password: '' });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        password: '',
        fullName: '',
        role: '',
        department: '',
        status: 'Active',
        registerSystem: 'view',
        registerPrinter: 'view',
        listSystem: 'view',
        listPrinter: 'view',
        inventory: false,
        reports: false,
        dashboard: false,
        import: false
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        updateUser({ ...formData, id: selectedUser.id });
      } else {
        addUser({ ...formData, id: Date.now(), created: new Date().toLocaleDateString('fa-IR') });
      }
      setModalOpen(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <UsersIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">مدیریت کاربران</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">تعریف و مدیریت سطوح دسترسی پرسنل</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          افزودن کاربر جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-110",
              u.status === 'Inactive' ? "bg-red-500" : "bg-indigo-500"
            )} />
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <UserIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {u.fullName || u.username}
                    {u.username === 'admin' && <Shield className="w-4 h-4 text-amber-500" />}
                  </h3>
                  <div className="text-sm text-gray-500 font-medium">@{u.username}</div>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                u.status === 'Inactive' ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
              )}>
                {u.status === 'Inactive' ? 'غیرفعال' : 'فعال'}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Briefcase className="w-4 h-4" /> {u.role || 'بدون نقش'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Building className="w-4 h-4" /> {u.department || 'بدون واحد'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <div className="text-[10px] text-gray-400 font-bold mb-1">دسترسی سیستم</div>
                <div className="text-xs font-black text-indigo-600">{u.registerSystem === 'edit' ? 'کامل' : 'مشاهده'}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <div className="text-[10px] text-gray-400 font-bold mb-1">دسترسی پرینتر</div>
                <div className="text-xs font-black text-purple-600">{u.registerPrinter === 'edit' ? 'کامل' : 'مشاهده'}</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="text-[10px] text-gray-400">ایجاد شده: {u.created}</div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(u)}
                  className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl transition-all"
                >
                  <Edit className="w-5 h-5" />
                </button>
                {u.username !== currentUser?.username && u.username !== 'admin' && (
                  <button 
                    onClick={() => { if(confirm('آیا از حذف این کاربر اطمینان دارید؟')) deleteUser(u.id); }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
                    {selectedUser ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">
                    {selectedUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
                  </h2>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">نام کاربری *</label>
                    <input 
                      required
                      disabled={!!selectedUser}
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">کلمه عبور {selectedUser && '(خالی بماند تغییر نمی‌کند)'}</label>
                    <input 
                      type="password"
                      required={!selectedUser}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">نام و نام خانوادگی</label>
                    <input 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">نقش / سمت</label>
                    <input 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">واحد / دپارتمان</label>
                    <input 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">وضعیت</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Active">فعال</option>
                      <option value="Inactive">غیرفعال</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">سطوح دسترسی</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <label className="block text-xs font-bold mb-2 text-indigo-600">دسترسی سیستم‌ها</label>
                      <select 
                        value={formData.registerSystem}
                        onChange={(e) => setFormData({...formData, registerSystem: e.target.value, listSystem: e.target.value})}
                        className="w-full p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm"
                      >
                        <option value="view">فقط مشاهده</option>
                        <option value="edit">ثبت و ویرایش</option>
                      </select>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <label className="block text-xs font-bold mb-2 text-purple-600">دسترسی پرینترها</label>
                      <select 
                        value={formData.registerPrinter}
                        onChange={(e) => setFormData({...formData, registerPrinter: e.target.value, listPrinter: e.target.value})}
                        className="w-full p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm"
                      >
                        <option value="view">فقط مشاهده</option>
                        <option value="edit">ثبت و ویرایش</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['inventory', 'reports', 'dashboard', 'import'].map(key => (
                      <label key={key} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <input 
                          type="checkbox"
                          checked={formData[key]}
                          onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                          className="w-4 h-4 rounded text-indigo-600"
                        />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {key === 'inventory' ? 'انبار' : key === 'reports' ? 'گزارشات' : key === 'dashboard' ? 'داشبورد' : 'آپلود'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold"
                  >
                    انصراف
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30"
                  >
                    {selectedUser ? 'ذخیره تغییرات' : 'ایجاد کاربر'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
