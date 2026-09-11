import {
  Customer,
  FillingPlant,
  Invoice,
  PlantTransaction,
  ShopProfile,
  StockState,
} from '../types';
import {
  initialCustomers,
  initialInvoices,
  initialPlants,
  initialPlantTransactions,
  initialShopProfile,
  initialStock,
  sampleDemoCustomers,
  sampleDemoStock,
} from './initialData';

const KEYS = {
  PROFILE: 'insaf_lpg_profile_v4',
  STOCK: 'insaf_lpg_stock_v4',
  CUSTOMERS: 'insaf_lpg_customers_v4',
  INVOICES: 'insaf_lpg_invoices_v4',
  PLANTS: 'insaf_lpg_plants_v4',
  PLANT_TXNS: 'insaf_lpg_plant_txns_v4',
};

// Auto-clean previous session's old data versions
try {
  ['v1', 'v2', 'v3'].forEach((ver) => {
    localStorage.removeItem(`insaf_lpg_profile_${ver}`);
    localStorage.removeItem(`insaf_lpg_stock_${ver}`);
    localStorage.removeItem(`insaf_lpg_customers_${ver}`);
    localStorage.removeItem(`insaf_lpg_invoices_${ver}`);
    localStorage.removeItem(`insaf_lpg_plants_${ver}`);
    localStorage.removeItem(`insaf_lpg_plant_txns_${ver}`);
  });
} catch (e) {
  // ignore in non-browser env
}

export const loadProfile = (): ShopProfile => {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return initialShopProfile;
};

export const saveProfile = (profile: ShopProfile) => {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {}
};

export const loadStock = (): StockState => {
  try {
    const raw = localStorage.getItem(KEYS.STOCK);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return initialStock;
};

export const saveStock = (stock: StockState) => {
  try {
    localStorage.setItem(KEYS.STOCK, JSON.stringify(stock));
  } catch (e) {}
};

export const loadCustomers = (): Customer[] => {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOMERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return initialCustomers;
};

export const saveCustomers = (customers: Customer[]) => {
  try {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (e) {}
};

export const loadInvoices = (): Invoice[] => {
  try {
    const raw = localStorage.getItem(KEYS.INVOICES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return initialInvoices;
};

export const saveInvoices = (invoices: Invoice[]) => {
  try {
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
  } catch (e) {}
};

export const loadPlants = (): FillingPlant[] => {
  try {
    const raw = localStorage.getItem(KEYS.PLANTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return initialPlants;
};

export const savePlants = (plants: FillingPlant[]) => {
  try {
    localStorage.setItem(KEYS.PLANTS, JSON.stringify(plants));
  } catch (e) {}
};

export const loadPlantTransactions = (): PlantTransaction[] => {
  try {
    const raw = localStorage.getItem(KEYS.PLANT_TXNS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return initialPlantTransactions;
};

export const savePlantTransactions = (txns: PlantTransaction[]) => {
  try {
    localStorage.setItem(KEYS.PLANT_TXNS, JSON.stringify(txns));
  } catch (e) {}
};

// 100% Reset / Fresh Clean Start
export const resetAllData = () => {
  try {
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.STOCK);
    localStorage.removeItem(KEYS.CUSTOMERS);
    localStorage.removeItem(KEYS.INVOICES);
    localStorage.removeItem(KEYS.PLANTS);
    localStorage.removeItem(KEYS.PLANT_TXNS);
  } catch (e) {}
};

// Export all application data as JSON
export const exportAllDataJSON = (): string => {
  const data = {
    profile: loadProfile(),
    stock: loadStock(),
    customers: loadCustomers(),
    invoices: loadInvoices(),
    plants: loadPlants(),
    plantTransactions: loadPlantTransactions(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

// Import and restore from JSON
export const importAllDataJSON = (jsonStr: string): boolean => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.profile) saveProfile(parsed.profile);
    if (parsed.stock) saveStock(parsed.stock);
    if (parsed.customers) saveCustomers(parsed.customers);
    if (parsed.invoices) saveInvoices(parsed.invoices);
    if (parsed.plants) savePlants(parsed.plants);
    if (parsed.plantTransactions) savePlantTransactions(parsed.plantTransactions);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
};
