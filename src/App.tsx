import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SystemsList } from './pages/SystemsList';
import { RegisterSystem } from './pages/RegisterSystem';
import { PrintersList } from './pages/PrintersList';
import { RegisterPrinter } from './pages/RegisterPrinter';
import { InventoryParts } from './pages/InventoryParts';
import { InventoryConsumables } from './pages/InventoryConsumables';
import { InventoryAlerts } from './pages/InventoryAlerts';
import { ReportsAssets } from './pages/ReportsAssets';
import { Users } from './pages/Users';
import { Definitions } from './pages/Definitions';
import { ImportData } from './pages/ImportData';
import { RepairsSystems } from './pages/RepairsSystems';
import { RepairsPrinters } from './pages/RepairsPrinters';
import { Lifecycle } from './pages/Lifecycle';
import { AuditLogs } from './pages/AuditLogs';
import { PrintHandover } from './pages/PrintHandover';
import { Help } from './pages/Help';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="list/systems" element={<SystemsList />} />
        <Route path="register/system" element={<RegisterSystem />} />
        <Route path="list/printers" element={<PrintersList />} />
        <Route path="register/printer" element={<RegisterPrinter />} />
        <Route path="inventory/parts" element={<InventoryParts />} />
        <Route path="inventory/consumables" element={<InventoryConsumables />} />
        <Route path="inventory/alerts" element={<InventoryAlerts />} />
        <Route path="reports/assets" element={<ReportsAssets />} />
        <Route path="users" element={<Users />} />
        <Route path="definitions" element={<Definitions />} />
        <Route path="import" element={<ImportData />} />
        <Route path="repairs/systems" element={<RepairsSystems />} />
        <Route path="repairs/printers" element={<RepairsPrinters />} />
        <Route path="lifecycle" element={<Lifecycle />} />
        <Route path="reports/handover" element={<PrintHandover />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="help" element={<Help />} />
        {/* Add more routes here */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <DataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
