import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import CryptoJS from 'crypto-js';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (module: keyof User, action?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const hashPassword = (password: string) => {
    return CryptoJS.SHA256(password).toString();
  };

  const login = (username: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('tblUsers') || '[]');
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser && foundUser.password === hashPassword(password)) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (module: keyof User, action?: string) => {
    if (!user) return false;
    if (user.username === 'admin') return true;

    const permission = user[module];
    if (permission === 'edit' || permission === true) return true;
    if (permission === 'view' && action === 'view') return true;
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
