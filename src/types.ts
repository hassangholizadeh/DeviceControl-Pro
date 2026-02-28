export interface User {
  id: number;
  username: string;
  fullName?: string;
  role?: string;
  department?: string;
  status?: 'Active' | 'Inactive';
  password?: string;
  registerSystem: string;
  registerPrinter: string;
  listSystem: string;
  listPrinter: string;
  repairPrinter: boolean;
  repairSystem: boolean;
  repairPrinterList: boolean;
  repairSystemList: boolean;
  inventory: boolean;
  reports: boolean;
  dashboard: boolean;
  import: boolean;
  created: string;
}

export interface System {
  id: number;
  CaseAssetCode: string;
  CaseITCode: string;
  CaseBrand: string;
  processor: string;
  processorGen: string;
  CPU: string;
  motherboardBrand: string;
  motherboardModel: string;
  Mainboard: string;
  Power: string;
  hasOnboardVGA: boolean;
  onboardVGA: string;
  externalVGAs: any[];
  rams: any[];
  hardDrives: any[];
  monitors: any[];
  Mouse: string;
  Keyboard: string;
  Other: string;
  FullName: string;
  PersonnelCode: string;
  Position: string;
  Unit: string;
  DeliveryDate: string;
  Status: 'Active' | 'Repair' | 'Broken';
}

export interface Printer {
  id: number;
  AssetCode: string;
  ITCode: string;
  DeviceType: string;
  Status: 'Active' | 'Repair' | 'Broken';
  brand: string;
  DeviceNameModel: string;
  printType: string;
  color: string;
  DeliveryDate: string;
  PersonnelCode: string;
  Receiver: string;
  Position: string;
  Unit: string;
}

export interface Part {
  id: number;
  deviceType: 'System' | 'Printer';
  category: string;
  name: string;
  spec: string;
  type?: string;
  model?: string;
  memory?: string;
  brand?: string;
  stock: number;
  minStock: number;
  price: number;
  created: string;
}

export interface Consumable {
  id: number;
  category: string;
  name: string;
  spec?: string;
  model?: string;
  color?: string;
  type?: string;
  size?: string;
  stock: number;
  minStock: number;
  price: number;
  created: string;
}

export interface RepairRecord {
  id: number;
  deviceType: 'System' | 'Printer';
  deviceId: number;
  deviceAssetCode: string;
  date: string;
  problem: string;
  actionsTaken: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  technician: string;
  partsUsed: { partId: number; quantity: number; addToSystem?: boolean }[];
  partsDeducted?: boolean;
}

export interface AuditLog {
  id: number;
  userId: number;
  username: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entityType: 'System' | 'Printer' | 'User' | 'Part' | 'Consumable' | 'RepairRecord' | 'LifecycleEvent';
  entityId?: number;
  details: string;
  timestamp: string;
}

export interface LifecycleEvent {
  id: number;
  deviceType: 'System' | 'Printer';
  deviceId: number;
  deviceAssetCode: string;
  eventType: 'Transfer' | 'Upgrade' | 'Scrap';
  date: string;
  details: string;
  previousUser?: string;
  newUser?: string;
  previousUnit?: string;
  newUnit?: string;
  upgradedParts?: string;
  reason?: string;
  performedBy: string;
}
