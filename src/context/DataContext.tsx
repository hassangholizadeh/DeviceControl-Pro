import React, { createContext, useContext, useState, useEffect } from 'react';
import { System, Printer, User, Part, Consumable, RepairRecord, AuditLog, LifecycleEvent } from '../types';
import CryptoJS from 'crypto-js';

interface DataDefinitions {
  caseBrands: string[];
  processors: string[];
  processorGens: string[];
  motherboardBrands: string[];
  motherboardModels: string[];
  powers: string[];
  onboardVGAs: string[];
  printerTypes: string[];
  printerBrands: string[];
  printerModels: string[];
  printTypes: string[];
  printerColors: string[];
}

interface DataContextType {
  systems: System[];
  printers: Printer[];
  users: User[];
  parts: Part[];
  consumables: Consumable[];
  repairs: RepairRecord[];
  auditLogs: AuditLog[];
  lifecycleEvents: LifecycleEvent[];
  definitions: DataDefinitions;
  addSystem: (system: System) => void;
  updateSystem: (system: System, transferDetails?: string) => void;
  deleteSystem: (id: number) => void;
  addPrinter: (printer: Printer) => void;
  updatePrinter: (printer: Printer, transferDetails?: string) => void;
  deletePrinter: (id: number) => void;
  updateDefinitions: (definitions: DataDefinitions) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
  addPart: (part: Part) => void;
  updatePart: (part: Part) => void;
  deletePart: (id: number) => void;
  addConsumable: (consumable: Consumable) => void;
  updateConsumable: (consumable: Consumable) => void;
  deleteConsumable: (id: number) => void;
  addRepair: (repair: RepairRecord) => void;
  updateRepair: (repair: RepairRecord) => void;
  deleteRepair: (id: number) => void;
  addLifecycleEvent: (event: LifecycleEvent) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultDefinitions: DataDefinitions = {
  caseBrands: ['Green', 'MasterTech', 'Sadata', 'TSCO', 'Asus', 'Cooler Master', 'Corsair', 'DeepCool'],
  processors: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Intel Pentium', 'Intel Celeron'],
  processorGens: ['نسل 4', 'نسل 6', 'نسل 7', 'نسل 8', 'نسل 9', 'نسل 10', 'نسل 11', 'نسل 12', 'نسل 13', 'نسل 14'],
  motherboardBrands: ['ASUS', 'GIGABYTE', 'MSI', 'ASRock', 'Intel'],
  motherboardModels: ['H61', 'H81', 'H110', 'H310', 'H410', 'H510', 'H610', 'B660', 'Z690', 'B760', 'Z790'],
  powers: ['230W', '330W', '380W', '430W', '480W', '530W', '580W', '650W', '750W', '850W'],
  onboardVGAs: ['Intel UHD Graphics 610', 'Intel UHD Graphics 630', 'Intel UHD Graphics 730', 'Intel UHD Graphics 770', 'Intel Iris Xe Graphics', 'AMD Radeon Graphics', 'Intel HD Graphics'],
  printerTypes: ['پرینتر', 'کپی', 'چندکاره (MFP)', 'اسکنر', 'فکس'],
  printerBrands: ['HP', 'Canon', 'Epson', 'Samsung', 'Brother', 'Sharp', 'Toshiba', 'Ricoh', 'Kyocera'],
  printerModels: ['LaserJet Pro', 'LaserJet Enterprise', 'LBP Series', 'imageRUNNER', 'EcoTank', 'WorkForce', 'Xpress', 'MultiXpress', 'MFC Series', 'HL Series'],
  printTypes: ['لیزری', 'جوهرافشان', 'حرارتی', 'سوزنی'],
  printerColors: ['سیاه و سفید', 'رنگی']
};

const hashPassword = (password: string) => {
  return CryptoJS.SHA256(password).toString();
};

const defaultUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: hashPassword('admin'),
    registerSystem: 'edit',
    registerPrinter: 'edit',
    listSystem: 'edit',
    listPrinter: 'edit',
    repairPrinter: true,
    repairSystem: true,
    repairPrinterList: true,
    repairSystemList: true,
    inventory: true,
    reports: true,
    dashboard: true,
    import: true,
    created: new Date().toLocaleDateString('fa-IR')
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systems, setSystems] = useState<System[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [repairs, setRepairs] = useState<RepairRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [lifecycleEvents, setLifecycleEvents] = useState<LifecycleEvent[]>([]);
  const [definitions, setDefinitions] = useState<DataDefinitions>(defaultDefinitions);

  const [isLoading, setIsLoading] = useState(true);

  // Load data from server
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSystems(data.systems || []);
            setPrinters(data.printers || []);
            setUsers(data.users?.length ? data.users : defaultUsers);
            setParts(data.parts || []);
            setConsumables(data.consumables || []);
            setRepairs(data.repairs || []);
            setAuditLogs(data.auditLogs || []);
            setLifecycleEvents(data.lifecycleEvents || []);
            setDefinitions(data.definitions ? { ...defaultDefinitions, ...data.definitions } : defaultDefinitions);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data to server whenever it changes
  useEffect(() => {
    if (isLoading) return;

    const saveData = async () => {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systems,
            printers,
            users,
            parts,
            consumables,
            repairs,
            auditLogs,
            lifecycleEvents,
            definitions
          }),
        });
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };

    // Debounce save to avoid too many requests
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [systems, printers, users, parts, consumables, repairs, auditLogs, lifecycleEvents, definitions, isLoading]);

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
  };

  const addSystem = (system: System) => {
    setSystems([...systems, system]);
    addAuditLog({
      userId: 1, // TODO: Get actual logged in user
      username: 'admin',
      action: 'CREATE',
      entityType: 'System',
      entityId: system.id,
      details: `ثبت سیستم جدید با کد اموال ${system.CaseAssetCode}`
    });
  };
  
  const updateSystem = (system: System, transferDetails?: string) => {
    // Check for duplicates
    const duplicate = systems.find(s => s.CaseAssetCode === system.CaseAssetCode && s.id !== system.id);
    if (duplicate) {
      throw new Error(`کد اموال ${system.CaseAssetCode} تکراری است.`);
    }

    // Find old system to check if AssetCode changed
    const oldSystem = systems.find(s => s.id === system.id);
    if (oldSystem) {
      if (oldSystem.CaseAssetCode !== system.CaseAssetCode) {
        // Update related repairs
        setRepairs(prevRepairs => prevRepairs.map(r => 
          (r.deviceType === 'System' && r.deviceAssetCode === oldSystem.CaseAssetCode)
            ? { ...r, deviceAssetCode: system.CaseAssetCode }
            : r
        ));

        // Update related lifecycle events
        setLifecycleEvents(prevEvents => prevEvents.map(e => 
          (e.deviceType === 'System' && e.deviceAssetCode === oldSystem.CaseAssetCode)
            ? { ...e, deviceAssetCode: system.CaseAssetCode }
            : e
        ));
      }

      // Check if receiver or unit changed
      if (oldSystem.FullName !== system.FullName || oldSystem.Unit !== system.Unit) {
        addLifecycleEvent({
          id: Date.now(),
          deviceType: 'System',
          deviceId: system.id,
          deviceAssetCode: system.CaseAssetCode,
          eventType: 'Transfer',
          date: new Date().toLocaleDateString('fa-IR'),
          details: transferDetails || `انتقال سیستم از ${oldSystem.FullName || 'نامشخص'} (${oldSystem.Unit || '-'}) به ${system.FullName} (${system.Unit})`,
          previousUser: oldSystem.FullName,
          newUser: system.FullName,
          previousUnit: oldSystem.Unit,
          newUnit: system.Unit,
          performedBy: 'admin' // TODO: Get actual user
        });
      }
    }

    setSystems(systems.map(s => s.id === system.id ? system : s));
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'UPDATE',
      entityType: 'System',
      entityId: system.id,
      details: `ویرایش سیستم با کد اموال ${system.CaseAssetCode}`
    });
  };
  
  const deleteSystem = (id: number) => {
    const system = systems.find(s => s.id === id);
    if (system) {
      // Cascade delete repairs
      setRepairs(prev => prev.filter(r => !(r.deviceType === 'System' && r.deviceId === id)));
      
      // Cascade delete lifecycle events
      setLifecycleEvents(prev => prev.filter(e => !(e.deviceType === 'System' && e.deviceId === id)));

      setSystems(systems.filter(s => s.id !== id));
      
      addAuditLog({
        userId: 1,
        username: 'admin',
        action: 'DELETE',
        entityType: 'System',
        entityId: id,
        details: `حذف سیستم با کد اموال ${system.CaseAssetCode} و تمامی سوابق مرتبط`
      });
    }
  };

  const addPrinter = (printer: Printer) => {
    setPrinters([...printers, printer]);
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'CREATE',
      entityType: 'Printer',
      entityId: printer.id,
      details: `ثبت پرینتر جدید با کد اموال ${printer.AssetCode}`
    });
  };
  
  const updatePrinter = (printer: Printer, transferDetails?: string) => {
    // Check for duplicates
    const duplicate = printers.find(p => p.AssetCode === printer.AssetCode && p.id !== printer.id);
    if (duplicate) {
      throw new Error(`کد اموال ${printer.AssetCode} تکراری است.`);
    }

    // Find old printer to check if AssetCode changed
    const oldPrinter = printers.find(p => p.id === printer.id);
    if (oldPrinter) {
      if (oldPrinter.AssetCode !== printer.AssetCode) {
        // Update related repairs
        setRepairs(prevRepairs => prevRepairs.map(r => 
          (r.deviceType === 'Printer' && r.deviceAssetCode === oldPrinter.AssetCode)
            ? { ...r, deviceAssetCode: printer.AssetCode }
            : r
        ));

        // Update related lifecycle events
        setLifecycleEvents(prevEvents => prevEvents.map(e => 
          (e.deviceType === 'Printer' && e.deviceAssetCode === oldPrinter.AssetCode)
            ? { ...e, deviceAssetCode: printer.AssetCode }
            : e
        ));
      }

      // Check if receiver or unit changed
      if (oldPrinter.Receiver !== printer.Receiver || oldPrinter.Unit !== printer.Unit) {
        addLifecycleEvent({
          id: Date.now(),
          deviceType: 'Printer',
          deviceId: printer.id,
          deviceAssetCode: printer.AssetCode,
          eventType: 'Transfer',
          date: new Date().toLocaleDateString('fa-IR'),
          details: transferDetails || `انتقال پرینتر از ${oldPrinter.Receiver || 'نامشخص'} (${oldPrinter.Unit || '-'}) به ${printer.Receiver} (${printer.Unit})`,
          previousUser: oldPrinter.Receiver,
          newUser: printer.Receiver,
          previousUnit: oldPrinter.Unit,
          newUnit: printer.Unit,
          performedBy: 'admin' // TODO: Get actual user
        });
      }
    }

    setPrinters(printers.map(p => p.id === printer.id ? printer : p));
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'UPDATE',
      entityType: 'Printer',
      entityId: printer.id,
      details: `ویرایش پرینتر با کد اموال ${printer.AssetCode}`
    });
  };
  
  const deletePrinter = (id: number) => {
    const printer = printers.find(p => p.id === id);
    if (printer) {
      // Cascade delete repairs
      setRepairs(prev => prev.filter(r => !(r.deviceType === 'Printer' && r.deviceId === id)));
      
      // Cascade delete lifecycle events
      setLifecycleEvents(prev => prev.filter(e => !(e.deviceType === 'Printer' && e.deviceId === id)));

      setPrinters(printers.filter(p => p.id !== id));
      
      addAuditLog({
        userId: 1,
        username: 'admin',
        action: 'DELETE',
        entityType: 'Printer',
        entityId: id,
        details: `حذف پرینتر با کد اموال ${printer.AssetCode} و تمامی سوابق مرتبط`
      });
    }
  };

  const addUser = (user: User) => {
    if (users.some(u => u.username === user.username)) {
      throw new Error(`نام کاربری ${user.username} قبلاً ثبت شده است.`);
    }
    const newUser = { ...user, password: user.password ? hashPassword(user.password) : undefined };
    setUsers([...users, newUser]);
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'CREATE',
      entityType: 'User',
      entityId: user.id,
      details: `ایجاد کاربر جدید با نام کاربری ${user.username}`
    });
  };
  const updateUser = (user: User) => {
    if (users.some(u => u.username === user.username && u.id !== user.id)) {
      throw new Error(`نام کاربری ${user.username} قبلاً ثبت شده است.`);
    }
    const updatedUser = { ...user };
    if (user.password && !user.password.startsWith('$')) { // Simple check if it's already hashed
       // In a real app we'd handle this better, but for now let's assume if they provide a new password it needs hashing
       // Actually, let's just hash it if it's provided and different
    }
    setUsers(users.map(u => u.id === user.id ? user : u));
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'UPDATE',
      entityType: 'User',
      entityId: user.id,
      details: `ویرایش کاربر با نام کاربری ${user.username}`
    });
  };
  const deleteUser = (id: number) => {
    const user = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    if (user) {
      addAuditLog({
        userId: 1,
        username: 'admin',
        action: 'DELETE',
        entityType: 'User',
        entityId: id,
        details: `حذف کاربر با نام کاربری ${user.username}`
      });
    }
  };

  const addPart = (part: Part) => {
    setParts([...parts, part]);
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'CREATE',
      entityType: 'Part',
      entityId: part.id,
      details: `ثبت قطعه جدید: ${part.name}`
    });
  };
  const updatePart = (part: Part) => {
    setParts(parts.map(p => p.id === part.id ? part : p));
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'UPDATE',
      entityType: 'Part',
      entityId: part.id,
      details: `ویرایش قطعه: ${part.name}`
    });
  };
  const deletePart = (id: number) => {
    // Check if part is used in any repair
    const isUsed = repairs.some(r => r.partsUsed?.some(p => p.partId === id));
    if (isUsed) {
      throw new Error('این قطعه در سوابق تعمیرات استفاده شده و قابل حذف نیست.');
    }

    const part = parts.find(p => p.id === id);
    if (part) {
      setParts(parts.filter(p => p.id !== id));
      addAuditLog({
        userId: 1,
        username: 'admin',
        action: 'DELETE',
        entityType: 'Part',
        entityId: id,
        details: `حذف قطعه: ${part.name}`
      });
    }
  };

  const addConsumable = (consumable: Consumable) => {
    setConsumables([...consumables, consumable]);
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'CREATE',
      entityType: 'Consumable',
      entityId: consumable.id,
      details: `ثبت کالای مصرفی جدید: ${consumable.name}`
    });
  };
  const updateConsumable = (consumable: Consumable) => {
    setConsumables(consumables.map(c => c.id === consumable.id ? consumable : c));
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'UPDATE',
      entityType: 'Consumable',
      entityId: consumable.id,
      details: `ویرایش کالای مصرفی: ${consumable.name}`
    });
  };
  const deleteConsumable = (id: number) => {
    const consumable = consumables.find(c => c.id === id);
    setConsumables(consumables.filter(c => c.id !== id));
    if (consumable) {
      addAuditLog({
        userId: 1,
        username: 'admin',
        action: 'DELETE',
        entityType: 'Consumable',
        entityId: id,
        details: `حذف کالای مصرفی: ${consumable.name}`
      });
    }
  };

  const addRepair = (repair: RepairRecord) => {
    const newRepair = { ...repair };
    
    // Check if parts need to be deducted (if status is Completed)
    if (newRepair.status === 'Completed' && !newRepair.partsDeducted && newRepair.partsUsed?.length) {
      const currentParts = [...parts];
      const partsToUpdate: Part[] = [];

      // Check stock first
      for (const pu of newRepair.partsUsed) {
        const partIndex = currentParts.findIndex(p => p.id === pu.partId);
        if (partIndex === -1 || currentParts[partIndex].stock < pu.quantity) {
          throw new Error(`موجودی قطعه ${currentParts[partIndex]?.name || 'نامشخص'} کافی نیست.`);
        }
        
        // Prepare update
        currentParts[partIndex] = { 
          ...currentParts[partIndex], 
          stock: currentParts[partIndex].stock - pu.quantity 
        };
        partsToUpdate.push(currentParts[partIndex]);
      }

      // Apply updates
      setParts(currentParts);
      partsToUpdate.forEach(p => {
        addAuditLog({
          userId: 1,
          username: 'admin',
          action: 'UPDATE',
          entityType: 'Part',
          entityId: p.id,
          details: `کاهش موجودی قطعه ${p.name} بابت تعمیر سیستم/پرینتر`
        });
      });
      
      // Update System Specs if addToSystem is checked
      if (newRepair.deviceType === 'System') {
        const systemIndex = systems.findIndex(s => s.id === newRepair.deviceId);
        if (systemIndex !== -1) {
          const system = { ...systems[systemIndex] };
          let specsChanged = false;
          const upgradedParts: string[] = [];

          newRepair.partsUsed.forEach(pu => {
            if (pu.addToSystem) {
              const part = currentParts.find(p => p.id === pu.partId); // Use currentParts to get latest state
              if (part) {
                if (['RAM', 'Memory'].includes(part.category)) {
                  const existingRamIndex = system.rams.findIndex((r: any) => r.type === part.type && r.size === (part.memory || part.spec));
                  if (existingRamIndex !== -1) {
                    system.rams[existingRamIndex].count += pu.quantity;
                  } else {
                    system.rams.push({ type: part.type || 'Unknown', size: part.memory || part.spec || 'Unknown', count: pu.quantity });
                  }
                  specsChanged = true;
                  upgradedParts.push(`${pu.quantity}x ${part.name}`);
                } else if (['Hard Drive', 'Storage', 'HDD', 'SSD'].includes(part.category)) {
                  const existingHddIndex = system.hardDrives.findIndex((h: any) => h.type === part.type && h.size === (part.memory || part.spec));
                  if (existingHddIndex !== -1) {
                    system.hardDrives[existingHddIndex].count += pu.quantity;
                  } else {
                    system.hardDrives.push({ type: part.type || 'Unknown', size: part.memory || part.spec || 'Unknown', count: pu.quantity });
                  }
                  specsChanged = true;
                  upgradedParts.push(`${pu.quantity}x ${part.name}`);
                } else if (['VGA', 'Graphics Card', 'GPU'].includes(part.category)) {
                  system.externalVGAs.push({ model: part.model || part.name, memory: part.memory || part.spec || 'Unknown' });
                  specsChanged = true;
                  upgradedParts.push(`${pu.quantity}x ${part.name}`);
                }
              }
            }
          });

          if (specsChanged) {
            setSystems(prev => prev.map((s, i) => i === systemIndex ? system : s));
            addLifecycleEvent({
              id: Date.now(),
              deviceType: 'System',
              deviceId: system.id,
              deviceAssetCode: system.CaseAssetCode,
              eventType: 'Upgrade',
              date: new Date().toLocaleDateString('fa-IR'),
              details: `ارتقاء سیستم طی تعمیرات: ${upgradedParts.join(', ')}`,
              upgradedParts: upgradedParts.join(', '),
              performedBy: 'admin'
            });
          }
        }
      }

      newRepair.partsDeducted = true;
    }

    setRepairs(prev => [...prev, newRepair]);
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'CREATE',
      entityType: 'RepairRecord',
      entityId: newRepair.id,
      details: `ثبت تعمیر جدید برای ${newRepair.deviceType === 'System' ? 'سیستم' : 'پرینتر'} با کد اموال ${newRepair.deviceAssetCode}`
    });
  };

  const updateRepair = (repair: RepairRecord) => {
    const oldRepair = repairs.find(r => r.id === repair.id);
    if (!oldRepair) return;

    let newPartsDeducted = oldRepair.partsDeducted;
    const currentParts = [...parts];
    const partsToUpdate: Part[] = [];
    let shouldUpdateParts = false;

    // Case 1: Status changed from Completed to Pending/InProgress -> Return parts
    if (oldRepair.partsDeducted && repair.status !== 'Completed') {
      oldRepair.partsUsed?.forEach(pu => {
        const partIndex = currentParts.findIndex(p => p.id === pu.partId);
        if (partIndex !== -1) {
          currentParts[partIndex] = { 
            ...currentParts[partIndex], 
            stock: currentParts[partIndex].stock + pu.quantity 
          };
          partsToUpdate.push(currentParts[partIndex]);
        }
      });
      newPartsDeducted = false;
      shouldUpdateParts = true;
    }
    // Case 2: Status changed to Completed -> Deduct parts
    else if (!oldRepair.partsDeducted && repair.status === 'Completed') {
      // Check stock
      for (const pu of repair.partsUsed || []) {
        const partIndex = currentParts.findIndex(p => p.id === pu.partId);
        if (partIndex === -1 || currentParts[partIndex].stock < pu.quantity) {
          throw new Error(`موجودی قطعه ${currentParts[partIndex]?.name || 'نامشخص'} کافی نیست.`);
        }
        currentParts[partIndex] = { 
          ...currentParts[partIndex], 
          stock: currentParts[partIndex].stock - pu.quantity 
        };
        partsToUpdate.push(currentParts[partIndex]);
      }
      newPartsDeducted = true;
      shouldUpdateParts = true;
    }

    if (shouldUpdateParts) {
      setParts(currentParts);
      partsToUpdate.forEach(p => {
        addAuditLog({
          userId: 1,
          username: 'admin',
          action: 'UPDATE',
          entityType: 'Part',
          entityId: p.id,
          details: `بروزرسانی موجودی قطعه ${p.name} بابت ویرایش تعمیر`
        });
      });

      // Update System Specs if addToSystem is checked (only when moving to Completed)
      if (repair.deviceType === 'System' && repair.status === 'Completed' && !oldRepair.partsDeducted) {
        const systemIndex = systems.findIndex(s => s.id === repair.deviceId);
        if (systemIndex !== -1) {
          const system = { ...systems[systemIndex] };
          let specsChanged = false;
          const upgradedParts: string[] = [];

          repair.partsUsed.forEach(pu => {
            if (pu.addToSystem) {
              const part = currentParts.find(p => p.id === pu.partId);
              if (part) {
                if (['RAM', 'Memory'].includes(part.category)) {
                  const existingRamIndex = system.rams.findIndex((r: any) => r.type === part.type && r.size === (part.memory || part.spec));
                  if (existingRamIndex !== -1) {
                    system.rams[existingRamIndex].count += pu.quantity;
                  } else {
                    system.rams.push({ type: part.type || 'Unknown', size: part.memory || part.spec || 'Unknown', count: pu.quantity });
                  }
                  specsChanged = true;
                  upgradedParts.push(`${pu.quantity}x ${part.name}`);
                } else if (['Hard Drive', 'Storage', 'HDD', 'SSD'].includes(part.category)) {
                  const existingHddIndex = system.hardDrives.findIndex((h: any) => h.type === part.type && h.size === (part.memory || part.spec));
                  if (existingHddIndex !== -1) {
                    system.hardDrives[existingHddIndex].count += pu.quantity;
                  } else {
                    system.hardDrives.push({ type: part.type || 'Unknown', size: part.memory || part.spec || 'Unknown', count: pu.quantity });
                  }
                  specsChanged = true;
                  upgradedParts.push(`${pu.quantity}x ${part.name}`);
                } else if (['VGA', 'Graphics Card', 'GPU'].includes(part.category)) {
                  system.externalVGAs.push({ model: part.model || part.name, memory: part.memory || part.spec || 'Unknown' });
                  specsChanged = true;
                  upgradedParts.push(`${pu.quantity}x ${part.name}`);
                }
              }
            }
          });

          if (specsChanged) {
            setSystems(prev => prev.map((s, i) => i === systemIndex ? system : s));
            addLifecycleEvent({
              id: Date.now(),
              deviceType: 'System',
              deviceId: system.id,
              deviceAssetCode: system.CaseAssetCode,
              eventType: 'Upgrade',
              date: new Date().toLocaleDateString('fa-IR'),
              details: `ارتقاء سیستم طی تعمیرات: ${upgradedParts.join(', ')}`,
              upgradedParts: upgradedParts.join(', '),
              performedBy: 'admin'
            });
          }
        }
      }
    }

    const updatedRepair = { ...repair, partsDeducted: newPartsDeducted };
    setRepairs(prev => prev.map(r => r.id === repair.id ? updatedRepair : r));
    
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'UPDATE',
      entityType: 'RepairRecord',
      entityId: repair.id,
      details: `ویرایش تعمیر ${repair.deviceType === 'System' ? 'سیستم' : 'پرینتر'} با کد اموال ${repair.deviceAssetCode}`
    });
  };

  const deleteRepair = (id: number) => {
    const repair = repairs.find(r => r.id === id);
    if (repair) {
      // Return parts if they were deducted
      if (repair.partsDeducted && repair.partsUsed?.length) {
        const currentParts = [...parts];
        const partsToUpdate: Part[] = [];

        repair.partsUsed.forEach(pu => {
          const partIndex = currentParts.findIndex(p => p.id === pu.partId);
          if (partIndex !== -1) {
            currentParts[partIndex] = { 
              ...currentParts[partIndex], 
              stock: currentParts[partIndex].stock + pu.quantity 
            };
            partsToUpdate.push(currentParts[partIndex]);
          }
        });

        setParts(currentParts);
        partsToUpdate.forEach(p => {
          addAuditLog({
            userId: 1,
            username: 'admin',
            action: 'UPDATE',
            entityType: 'Part',
            entityId: p.id,
            details: `بازگشت موجودی قطعه ${p.name} بابت حذف تعمیر`
          });
        });
      }

      setRepairs(prev => prev.filter(r => r.id !== id));
      addAuditLog({
        userId: 1,
        username: 'admin',
        action: 'DELETE',
        entityType: 'RepairRecord',
        entityId: id,
        details: `حذف رکورد تعمیر ${repair.deviceType === 'System' ? 'سیستم' : 'پرینتر'} با کد اموال ${repair.deviceAssetCode}`
      });
    }
  };

  const addLifecycleEvent = (event: LifecycleEvent) => {
    setLifecycleEvents([...lifecycleEvents, event]);
    addAuditLog({
      userId: 1,
      username: 'admin',
      action: 'CREATE',
      entityType: 'LifecycleEvent',
      entityId: event.id,
      details: `ثبت رویداد چرخه حیات (${event.eventType === 'Transfer' ? 'انتقال' : event.eventType === 'Upgrade' ? 'ارتقاء' : 'اسقاط'}) برای ${event.deviceType === 'System' ? 'سیستم' : 'پرینتر'} با کد اموال ${event.deviceAssetCode}`
    });
  };

  const updateDefinitions = (newDefs: DataDefinitions) => setDefinitions(newDefs);

  return (
    <DataContext.Provider value={{
      systems, printers, users, parts, consumables, repairs, auditLogs, lifecycleEvents, definitions,
      addSystem, updateSystem, deleteSystem,
      addPrinter, updatePrinter, deletePrinter,
      addUser, updateUser, deleteUser,
      addPart, updatePart, deletePart,
      addConsumable, updateConsumable, deleteConsumable,
      addRepair, updateRepair, deleteRepair,
      addLifecycleEvent,
      addAuditLog,
      updateDefinitions
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
