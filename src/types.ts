export type CylinderSize = '11.8kg' | '45.4kg' | 'mini' | 'loose';

export interface CylinderStockInfo {
  filledShop: number; // بھرے ہوئے سلنڈر دکان پر
  emptyShop: number;  // خالی سلنڈر دکان پر
  atPlant: number;    // پلانٹ پر بھرائی کے لیے گئے ہوئے
  withCustomers: number; // گاہکوں کے پاس خالی سلنڈر
  defaultRate: number; // فی سلنڈر قیمت
  unitWeightKg: number;
  labelUrdu: string;
  labelEn: string;
}

export interface StockState {
  '11.8kg': CylinderStockInfo;
  '45.4kg': CylinderStockInfo;
  'mini': CylinderStockInfo;
  'loose': {
    stockKg: number;
    ratePerKg: number;
    labelUrdu: string;
    labelEn: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  shopName?: string;
  phone: string;
  address: string;
  currentBalance: number; // مثبت = کسٹمر نے پیسے دینے ہیں (Receivable)
  emptyCylindersDue: {
    '11.8kg': number;
    '45.4kg': number;
    'mini': number;
  };
  totalBilled: number;
  totalPaid: number;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  cylinderSize: CylinderSize;
  quantityFilled: number; // بھرے سلنڈر دیے
  rate: number; // فی سلنڈر یا فی کلو ریٹ
  weightKg?: number; // کلو کے حساب سے
  emptyReturned: number; // اسی وقت خالی سلنڈر واپس لیے
  subtotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: number;
  date: string; // YYYY-MM-DD
  time: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  totalAmount: number; // اس بل کی کل رقم
  previousBalance: number; // پچھلا ادھار/بقایا
  netTotal: number; // کل واجب الادا رقم
  cashReceived: number; // نقد وصولی
  remainingBalance: number; // نیا بقایا
  previousEmptyDue: {
    '11.8kg': number;
    '45.4kg': number;
    'mini': number;
  };
  emptyReturnedNow: {
    '11.8kg': number;
    '45.4kg': number;
    'mini': number;
  };
  newEmptyDue: {
    '11.8kg': number;
    '45.4kg': number;
    'mini': number;
  };
  paymentMethod: 'cash' | 'credit' | 'bank_transfer' | 'cheque';
  vehicleNumber?: string;
  driverName?: string;
  notes?: string;
}

export interface CustomerTransaction {
  id: string;
  date: string;
  time: string;
  customerId: string;
  customerName: string;
  type: 'payment' | 'cylinder_return' | 'manual_adjustment';
  amountReceived: number; // نقد وصولی
  emptyReturned: {
    '11.8kg': number;
    '45.4kg': number;
    'mini': number;
  };
  previousBalance: number;
  newBalance: number;
  notes?: string;
}

export interface FillingPlant {
  id: string;
  name: string;
  phone: string;
  location: string;
  contactPerson: string;
  currentPayable: number; // پلانٹ کو ادا کرنے والی رقم
  cylindersPending: {
    '11.8kg': number;
    '45.4kg': number;
    'mini': number;
  };
  ratePerKg?: number;
  notes?: string;
  createdAt: string;
}

export interface PlantTransaction {
  id: string;
  plantId: string;
  plantName: string;
  date: string;
  time: string;
  action: 'send_empty' | 'receive_filled' | 'payment_made';
  cylindersSent: {
    '11.8kg': number;
    '45.4kg': number;
    'mini': number;
  };
  cylindersReceived: {
    '11.8kg': number;
    '45.4kg': number;
    'mini': number;
  };
  totalGasKg?: number;
  ratePerKg?: number;
  billAmount: number;
  amountPaid: number;
  driverOrBowsar?: string;
  notes?: string;
}

export interface ShopProfile {
  nameUrdu: string;
  nameEn: string;
  ayatArabic: string;
  ayatUrdu: string;
  ownerName: string;
  phone1: string;
  phone2: string;
  address: string;
  ograLicense: string;
}
