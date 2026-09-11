import { Customer, FillingPlant, Invoice, PlantTransaction, ShopProfile, StockState } from '../types';

export const initialShopProfile: ShopProfile = {
  nameUrdu: 'انصاف ایل پی جی گیس',
  nameEn: 'INSAF LPG GAS AGENCY',
  ayatArabic: 'وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ',
  ayatUrdu: 'اور انصاف کے ساتھ وزن قائم کرو اور تول میں کمی نہ کرو (سورۃ الرحمن: 9)',
  ownerName: 'رضوان خان و سکندر خان',
  phone1: '+92 309 0007309',
  phone2: '+92 301 2786830',
  address: 'شیخوپورہ روڈ، دوساکو چوک خاکی، نزد تھانہ کوٹ عبدالمالک، لاہور',
  ograLicense: 'OGRA License No: LPG/DIST/2024-889',
};

// Clean, 100% Fresh Initial Stock (Zeroes, user sets their actual inventory)
export const initialStock: StockState = {
  '11.8kg': {
    filledShop: 0,
    emptyShop: 0,
    atPlant: 0,
    withCustomers: 0,
    defaultRate: 3350,
    unitWeightKg: 11.8,
    labelUrdu: '11.8 کلو گھریلو سلنڈر',
    labelEn: '11.8 Kg Domestic',
  },
  '45.4kg': {
    filledShop: 0,
    emptyShop: 0,
    atPlant: 0,
    withCustomers: 0,
    defaultRate: 12800,
    unitWeightKg: 45.4,
    labelUrdu: '45.4 کلو کمرشل سلنڈر',
    labelEn: '45.4 Kg Commercial',
  },
  'mini': {
    filledShop: 0,
    emptyShop: 0,
    atPlant: 0,
    withCustomers: 0,
    defaultRate: 1400,
    unitWeightKg: 5.0,
    labelUrdu: 'چھوٹا سلنڈر (4 تا 6 کلو)',
    labelEn: 'Mini Cylinder (4-6 Kg)',
  },
  'loose': {
    stockKg: 0,
    ratePerKg: 285,
    labelUrdu: 'کھلی ایل پی جی گیس (فی کلو)',
    labelEn: 'Loose LPG Gas (Per Kg)',
  },
};

// Clean, 100% Fresh Customers List (Empty, no preloaded dummy customer debt)
export const initialCustomers: Customer[] = [];

// Filling Plants (Ready to use with ZERO pending cylinders and ZERO debt)
export const initialPlants: FillingPlant[] = [
  {
    id: 'PLANT-01',
    name: 'پی ایس او ایل پی جی باؤزر و فلنگ پلانٹ',
    phone: '042-35889900',
    location: 'شیخوپورہ روڈ، انڈسٹریل زون',
    contactPerson: 'انجینیئر تنویر صاحب',
    currentPayable: 0,
    cylindersPending: {
      '11.8kg': 0,
      '45.4kg': 0,
      mini: 0,
    },
    ratePerKg: 245,
    notes: 'سرکاری کوٹہ اور برانڈڈ گیس',
    createdAt: '2026-01-01',
  },
  {
    id: 'PLANT-02',
    name: 'پارکو ایل پی جی ٹرمینل (Parco Gas)',
    phone: '042-37651234',
    location: 'قادر آباد، ملتان روڈ',
    contactPerson: 'ملک ارشد مینیجر',
    currentPayable: 0,
    cylindersPending: {
      '11.8kg': 0,
      '45.4kg': 0,
      mini: 0,
    },
    ratePerKg: 248,
    notes: 'اعلیٰ پریشر امپورٹڈ مکس گیس',
    createdAt: '2026-01-10',
  },
  {
    id: 'PLANT-03',
    name: 'فاؤنڈیشن گیس ڈسٹری بیوشن پلانٹ',
    phone: '051-4433221',
    location: 'جی ٹی روڈ راولپنڈی / گوجرانوالہ',
    contactPerson: 'صوبیدار طاہر',
    currentPayable: 0,
    cylindersPending: {
      '11.8kg': 0,
      '45.4kg': 0,
      mini: 0,
    },
    ratePerKg: 242,
    notes: 'بیک اپ پلانٹ',
    createdAt: '2026-02-05',
  },
];

// Clean, 100% Fresh Invoices (Empty, no preloaded mock invoices)
export const initialInvoices: Invoice[] = [];

// Clean, 100% Fresh Plant Transactions Log (Empty)
export const initialPlantTransactions: PlantTransaction[] = [];

// DEMO / SAMPLE DATA (Available on demand in settings for testing if needed)
export const sampleDemoCustomers: Customer[] = [
  {
    id: 'CUST-101',
    name: 'حاجی طارق تکہ شاپ',
    shopName: 'طارق باربی کیو اینڈ تکہ',
    phone: '0300-4123456',
    address: 'مین مارکیٹ، لبرٹی، لاہور',
    currentBalance: 18500,
    emptyCylindersDue: {
      '11.8kg': 0,
      '45.4kg': 6,
      mini: 0,
    },
    totalBilled: 124000,
    totalPaid: 105500,
    notes: 'روزانہ 2 کمرشل سلنڈر کی کھپت ہے',
    createdAt: '2026-01-15',
  },
  {
    id: 'CUST-102',
    name: 'عثمانیہ ہوٹل اینڈ ریسٹورنٹ',
    shopName: 'عثمانیہ شینواری ہوٹل',
    phone: '0321-8765432',
    address: 'جی ٹی روڈ، بالمقابل چوہنگ، لاہور',
    currentBalance: 42000,
    emptyCylindersDue: {
      '11.8kg': 2,
      '45.4kg': 12,
      mini: 0,
    },
    totalBilled: 290000,
    totalPaid: 248000,
    notes: 'ہفتہ وار بل کلیئر کرتے ہیں',
    createdAt: '2026-02-01',
  },
];

export const sampleDemoStock: StockState = {
  '11.8kg': {
    filledShop: 54,
    emptyShop: 38,
    atPlant: 20,
    withCustomers: 35,
    defaultRate: 3350,
    unitWeightKg: 11.8,
    labelUrdu: '11.8 کلو گھریلو سلنڈر',
    labelEn: '11.8 Kg Domestic',
  },
  '45.4kg': {
    filledShop: 22,
    emptyShop: 15,
    atPlant: 25,
    withCustomers: 48,
    defaultRate: 12800,
    unitWeightKg: 45.4,
    labelUrdu: '45.4 کلو کمرشل سلنڈر',
    labelEn: '45.4 Kg Commercial',
  },
  'mini': {
    filledShop: 35,
    emptyShop: 18,
    atPlant: 8,
    withCustomers: 22,
    defaultRate: 1400,
    unitWeightKg: 5.0,
    labelUrdu: 'چھوٹا سلنڈر (4 تا 6 کلو)',
    labelEn: 'Mini Cylinder (4-6 Kg)',
  },
  'loose': {
    stockKg: 650,
    ratePerKg: 285,
    labelUrdu: 'کھلی ایل پی جی گیس (فی کلو)',
    labelEn: 'Loose LPG Gas (Per Kg)',
  },
};
