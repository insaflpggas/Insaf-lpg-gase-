import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KpiSummary } from './components/KpiSummary';
import { InvoicesListView } from './components/InvoicesListView';
import { CustomerKhataView } from './components/CustomerKhataView';
import { StockManagementView } from './components/StockManagementView';
import { FillingPlantsView } from './components/FillingPlantsView';
import { NewInvoiceModal } from './components/NewInvoiceModal';
import { InvoicePrintView } from './components/InvoicePrintView';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { QuickPaymentModal } from './components/QuickPaymentModal';
import { StockEditModal } from './components/StockEditModal';
import { PlantSendEmptyModal } from './components/PlantSendEmptyModal';
import { PlantReceiveFilledModal } from './components/PlantReceiveFilledModal';
import { SettingsModal } from './components/SettingsModal';
import { CustomerModal } from './components/CustomerModal';

import {
  Customer,
  CylinderSize,
  FillingPlant,
  Invoice,
  PlantTransaction,
  ShopProfile,
  StockState,
} from './types';

import {
  exportAllDataJSON,
  importAllDataJSON,
  loadCustomers,
  loadInvoices,
  loadPlants,
  loadPlantTransactions,
  loadProfile,
  loadStock,
  resetAllData,
  saveCustomers,
  saveInvoices,
  savePlants,
  savePlantTransactions,
  saveProfile,
  saveStock,
} from './data/storage';

export default function App() {
  // Primary persistent state
  const [profile, setProfile] = useState<ShopProfile>(loadProfile);
  const [stock, setStock] = useState<StockState>(loadStock);
  const [customers, setCustomers] = useState<Customer[]>(loadCustomers);
  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices);
  const [plants, setPlants] = useState<FillingPlant[]>(loadPlants);
  const [plantTransactions, setPlantTransactions] = useState<PlantTransaction[]>(loadPlantTransactions);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'invoices' | 'customers' | 'stock' | 'plants'>('invoices');

  // Modals state
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState<boolean>(false);
  const [newInvoicePreselectedCustomerId, setNewInvoicePreselectedCustomerId] = useState<string | undefined>(undefined);
  const [activePrintingInvoice, setActivePrintingInvoice] = useState<Invoice | null>(null);

  const [activeCustomerDetail, setActiveCustomerDetail] = useState<Customer | null>(null);
  const [activeQuickPayCustomer, setActiveQuickPayCustomer] = useState<Customer | null>(null);

  const [isStockEditOpen, setIsStockEditOpen] = useState<boolean>(false);
  const [isSendPlantOpen, setIsSendPlantOpen] = useState<boolean>(false);
  const [isReceivePlantOpen, setIsReceivePlantOpen] = useState<boolean>(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Customer filter flags from KPI clicks
  const [filterBalanceOnly, setFilterBalanceOnly] = useState<boolean>(false);
  const [filterCylindersOnly, setFilterCylindersOnly] = useState<boolean>(false);

  // Keep state in sync with localStorage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStock(stock);
  }, [stock]);

  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    savePlants(plants);
  }, [plants]);

  useEffect(() => {
    savePlantTransactions(plantTransactions);
  }, [plantTransactions]);

  // Handle Saving New Invoice
  const handleSaveInvoice = (newInvoice: Invoice, printImmediately: boolean) => {
    // 1. Add to invoices list
    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);

    // 2. Update Stock:
    // - Deduct filled cylinders given
    // - Add empty cylinders returned to shop empty stock
    const updatedStock: StockState = JSON.parse(JSON.stringify(stock));

    newInvoice.items.forEach((item) => {
      if (item.cylinderSize === 'loose') {
        const kg = item.weightKg || 0;
        updatedStock.loose.stockKg = Math.max(0, updatedStock.loose.stockKg - kg);
      } else {
        const size = item.cylinderSize as '11.8kg' | '45.4kg' | 'mini';
        // Reduce filled stock at shop
        updatedStock[size].filledShop = Math.max(0, updatedStock[size].filledShop - item.quantityFilled);
        // Increase empty stock at shop
        updatedStock[size].emptyShop = updatedStock[size].emptyShop + (item.emptyReturned || 0);
        // Increase withCustomers
        updatedStock[size].withCustomers = Math.max(
          0,
          updatedStock[size].withCustomers + item.quantityFilled - (item.emptyReturned || 0)
        );
      }
    });
    setStock(updatedStock);

    // 3. Update Customer Balance and Empty Cylinders Due
    const updatedCustomers = customers.map((cust) => {
      if (cust.id === newInvoice.customerId) {
        return {
          ...cust,
          currentBalance: newInvoice.remainingBalance,
          emptyCylindersDue: { ...newInvoice.newEmptyDue },
          totalBilled: cust.totalBilled + newInvoice.totalAmount,
          totalPaid: cust.totalPaid + newInvoice.cashReceived,
        };
      }
      return cust;
    });
    setCustomers(updatedCustomers);

    // Close invoice modal
    setIsNewInvoiceOpen(false);
    setNewInvoicePreselectedCustomerId(undefined);

    // If print requested, trigger print view
    if (printImmediately) {
      setActivePrintingInvoice(newInvoice);
    }
  };

  // Quick Customer Cash & Cylinder Return Receipt
  const handleQuickCustomerPayment = (
    customerId: string,
    amount: number,
    emptyReturned: { '11.8kg': number; '45.4kg': number; mini: number },
    notes: string
  ) => {
    // 1. Update customer balance and empty cylinders
    const updatedCustomers = customers.map((c) => {
      if (c.id === customerId) {
        const newBal = c.currentBalance - amount;
        const new11 = Math.max(0, (c.emptyCylindersDue['11.8kg'] || 0) - emptyReturned['11.8kg']);
        const new45 = Math.max(0, (c.emptyCylindersDue['45.4kg'] || 0) - emptyReturned['45.4kg']);
        const newMini = Math.max(0, (c.emptyCylindersDue['mini'] || 0) - emptyReturned['mini']);

        return {
          ...c,
          currentBalance: newBal,
          emptyCylindersDue: {
            '11.8kg': new11,
            '45.4kg': new45,
            mini: newMini,
          },
          totalPaid: c.totalPaid + amount,
        };
      }
      return c;
    });
    setCustomers(updatedCustomers);

    // 2. Add returned empties to shop stock
    const updatedStock: StockState = JSON.parse(JSON.stringify(stock));
    updatedStock['11.8kg'].emptyShop += emptyReturned['11.8kg'];
    updatedStock['11.8kg'].withCustomers = Math.max(0, updatedStock['11.8kg'].withCustomers - emptyReturned['11.8kg']);

    updatedStock['45.4kg'].emptyShop += emptyReturned['45.4kg'];
    updatedStock['45.4kg'].withCustomers = Math.max(0, updatedStock['45.4kg'].withCustomers - emptyReturned['45.4kg']);

    updatedStock['mini'].emptyShop += emptyReturned['mini'];
    updatedStock['mini'].withCustomers = Math.max(0, updatedStock['mini'].withCustomers - emptyReturned['mini']);

    setStock(updatedStock);
  };

  // Dispatch Empties to Filling Plant
  const handleSendEmptiesToPlant = (
    plantId: string,
    sent: { '11.8kg': number; '45.4kg': number; mini: number },
    vehicle: string,
    driver: string,
    notes: string
  ) => {
    const targetPlant = plants.find((p) => p.id === plantId);
    if (!targetPlant) return;

    // 1. Reduce shop empties, increase atPlant
    const updatedStock: StockState = JSON.parse(JSON.stringify(stock));
    updatedStock['11.8kg'].emptyShop = Math.max(0, updatedStock['11.8kg'].emptyShop - sent['11.8kg']);
    updatedStock['11.8kg'].atPlant += sent['11.8kg'];

    updatedStock['45.4kg'].emptyShop = Math.max(0, updatedStock['45.4kg'].emptyShop - sent['45.4kg']);
    updatedStock['45.4kg'].atPlant += sent['45.4kg'];

    updatedStock['mini'].emptyShop = Math.max(0, updatedStock['mini'].emptyShop - sent['mini']);
    updatedStock['mini'].atPlant += sent['mini'];

    setStock(updatedStock);

    // 2. Increase target plant pending cylinders
    const updatedPlants = plants.map((p) => {
      if (p.id === plantId) {
        return {
          ...p,
          cylindersPending: {
            '11.8kg': p.cylindersPending['11.8kg'] + sent['11.8kg'],
            '45.4kg': p.cylindersPending['45.4kg'] + sent['45.4kg'],
            mini: p.cylindersPending['mini'] + sent['mini'],
          },
        };
      }
      return p;
    });
    setPlants(updatedPlants);

    // 3. Log transaction
    const newTx: PlantTransaction = {
      id: `PT-${Date.now().toString().slice(-4)}`,
      plantId,
      plantName: targetPlant.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      action: 'send_empty',
      cylindersSent: sent,
      cylindersReceived: { '11.8kg': 0, '45.4kg': 0, mini: 0 },
      billAmount: 0,
      amountPaid: 0,
      driverOrBowsar: `${driver} (${vehicle})`,
      notes,
    };
    setPlantTransactions([newTx, ...plantTransactions]);
  };

  // Receive Filled Cylinders from Plant
  const handleReceiveFilledFromPlant = (
    plantId: string,
    received: { '11.8kg': number; '45.4kg': number; mini: number },
    totalGasKg: number,
    billAmount: number,
    amountPaid: number,
    notes: string
  ) => {
    const targetPlant = plants.find((p) => p.id === plantId);
    if (!targetPlant) return;

    // 1. Decrease atPlant & plant pending; increase shop filled
    const updatedStock: StockState = JSON.parse(JSON.stringify(stock));
    updatedStock['11.8kg'].atPlant = Math.max(0, updatedStock['11.8kg'].atPlant - received['11.8kg']);
    updatedStock['11.8kg'].filledShop += received['11.8kg'];

    updatedStock['45.4kg'].atPlant = Math.max(0, updatedStock['45.4kg'].atPlant - received['45.4kg']);
    updatedStock['45.4kg'].filledShop += received['45.4kg'];

    updatedStock['mini'].atPlant = Math.max(0, updatedStock['mini'].atPlant - received['mini']);
    updatedStock['mini'].filledShop += received['mini'];

    setStock(updatedStock);

    // 2. Update plant
    const unpaidBill = billAmount - amountPaid;
    const updatedPlants = plants.map((p) => {
      if (p.id === plantId) {
        return {
          ...p,
          currentPayable: p.currentPayable + unpaidBill,
          cylindersPending: {
            '11.8kg': Math.max(0, p.cylindersPending['11.8kg'] - received['11.8kg']),
            '45.4kg': Math.max(0, p.cylindersPending['45.4kg'] - received['45.4kg']),
            mini: Math.max(0, p.cylindersPending['mini'] - received['mini']),
          },
        };
      }
      return p;
    });
    setPlants(updatedPlants);

    // 3. Log transaction
    const newTx: PlantTransaction = {
      id: `PT-${Date.now().toString().slice(-4)}`,
      plantId,
      plantName: targetPlant.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      action: 'receive_filled',
      cylindersSent: { '11.8kg': 0, '45.4kg': 0, mini: 0 },
      cylindersReceived: received,
      totalGasKg,
      billAmount,
      amountPaid,
      notes,
    };
    setPlantTransactions([newTx, ...plantTransactions]);
  };

  // Payment Made to Plant
  const handlePlantPayment = (plantId: string, amount: number, notes: string) => {
    const targetPlant = plants.find((p) => p.id === plantId);
    if (!targetPlant) return;

    const updatedPlants = plants.map((p) => {
      if (p.id === plantId) {
        return {
          ...p,
          currentPayable: Math.max(0, p.currentPayable - amount),
        };
      }
      return p;
    });
    setPlants(updatedPlants);

    const newTx: PlantTransaction = {
      id: `PT-${Date.now().toString().slice(-4)}`,
      plantId,
      plantName: targetPlant.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      action: 'payment_made',
      cylindersSent: { '11.8kg': 0, '45.4kg': 0, mini: 0 },
      cylindersReceived: { '11.8kg': 0, '45.4kg': 0, mini: 0 },
      billAmount: 0,
      amountPaid: amount,
      notes,
    };
    setPlantTransactions([newTx, ...plantTransactions]);
  };

  // Add / Edit Customer
  const handleSaveCustomer = (customer: Customer) => {
    const existingIndex = customers.findIndex((c) => c.id === customer.id);
    if (existingIndex >= 0) {
      const updated = [...customers];
      updated[existingIndex] = customer;
      setCustomers(updated);
    } else {
      setCustomers([customer, ...customers]);
    }
  };

  // Export & Import Handlers
  const handleExportData = () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insaf-lpg-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    const success = importAllDataJSON(jsonStr);
    if (success) {
      setProfile(loadProfile());
      setStock(loadStock());
      setCustomers(loadCustomers());
      setInvoices(loadInvoices());
      setPlants(loadPlants());
      setPlantTransactions(loadPlantTransactions());
      alert('ڈیٹا کامیابی سے بحال ہو گیا!');
    } else {
      alert('فائل فارمیٹ درست نہیں ہے!');
    }
  };

  const handleResetData = () => {
    resetAllData();
    setProfile(loadProfile());
    setStock(loadStock());
    setCustomers(loadCustomers());
    setInvoices(loadInvoices());
    setPlants(loadPlants());
    setPlantTransactions(loadPlantTransactions());
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Header with Quranic Verse & Insaf LPG Agency Branding */}
      <Header
        profile={profile}
        onNewInvoice={() => {
          setNewInvoicePreselectedCustomerId(undefined);
          setIsNewInvoiceOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefreshData={() => {
          setProfile(loadProfile());
          setStock(loadStock());
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        
        {/* KPI Metrics Summary Ribbon */}
        <KpiSummary
          stock={stock}
          customers={customers}
          plants={plants}
          onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
          onFilterCustomersWithBalance={() => {
            setFilterBalanceOnly(true);
            setFilterCylindersOnly(false);
            setActiveTab('customers');
          }}
          onFilterCustomersWithCylinders={() => {
            setFilterBalanceOnly(false);
            setFilterCylindersOnly(true);
            setActiveTab('customers');
          }}
        />

        {/* Tab Views */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          
          {/* Tab 1: Invoices */}
          {activeTab === 'invoices' && (
            <InvoicesListView
              invoices={invoices}
              onOpenNewInvoice={() => {
                setNewInvoicePreselectedCustomerId(undefined);
                setIsNewInvoiceOpen(true);
              }}
              onViewInvoice={(inv) => setActivePrintingInvoice(inv)}
            />
          )}

          {/* Tab 2: Customers & Khata */}
          {activeTab === 'customers' && (
            <CustomerKhataView
              customers={customers}
              onOpenNewCustomerModal={() => {
                setEditingCustomer(null);
                setIsCustomerModalOpen(true);
              }}
              onOpenQuickPay={(cust) => setActiveQuickPayCustomer(cust)}
              onOpenCustomerDetail={(cust) => setActiveCustomerDetail(cust)}
              onOpenNewInvoiceForCustomer={(custId) => {
                setNewInvoicePreselectedCustomerId(custId);
                setIsNewInvoiceOpen(true);
              }}
              filterBalanceOnly={filterBalanceOnly}
              filterCylindersOnly={filterCylindersOnly}
            />
          )}

          {/* Tab 3: Stock Management */}
          {activeTab === 'stock' && (
            <StockManagementView
              stock={stock}
              customers={customers}
              plants={plants}
              onOpenEditStock={() => setIsStockEditOpen(true)}
              onOpenSendPlant={() => setIsSendPlantOpen(true)}
              onOpenReceivePlant={() => setIsReceivePlantOpen(true)}
            />
          )}

          {/* Tab 4: Filling Plants */}
          {activeTab === 'plants' && (
            <FillingPlantsView
              plants={plants}
              plantTransactions={plantTransactions}
              onOpenSendPlant={() => setIsSendPlantOpen(true)}
              onOpenReceivePlant={() => setIsReceivePlantOpen(true)}
              onAddPlant={(p) => setPlants([p, ...plants])}
              onPlantPayment={handlePlantPayment}
            />
          )}

        </div>
      </main>

      {/* Floating Action Button for Mobile: New Invoice */}
      <div className="fixed bottom-5 left-5 z-40 sm:hidden no-print">
        <button
          onClick={() => {
            setNewInvoicePreselectedCustomerId(undefined);
            setIsNewInvoiceOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-400"
        >
          <span className="font-urdu font-bold text-sm">نیا بل</span>
        </button>
      </div>

      {/* MODALS */}
      
      {/* 1. New Invoice Modal */}
      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => {
          setIsNewInvoiceOpen(false);
          setNewInvoicePreselectedCustomerId(undefined);
        }}
        customers={customers}
        stock={stock}
        profile={profile}
        onSaveInvoice={handleSaveInvoice}
        onQuickAddCustomer={handleSaveCustomer}
        preSelectedCustomerId={newInvoicePreselectedCustomerId}
      />

      {/* 2. Print Invoice View */}
      <InvoicePrintView
        invoice={activePrintingInvoice}
        profile={profile}
        onClose={() => setActivePrintingInvoice(null)}
      />

      {/* 3. Customer Ledger Modal */}
      <CustomerDetailModal
        isOpen={!!activeCustomerDetail}
        customer={activeCustomerDetail}
        invoices={invoices}
        profile={profile}
        onClose={() => setActiveCustomerDetail(null)}
        onNewInvoiceForCustomer={(custId) => {
          setNewInvoicePreselectedCustomerId(custId);
          setIsNewInvoiceOpen(true);
        }}
        onQuickPayForCustomer={(cust) => setActiveQuickPayCustomer(cust)}
        onViewInvoice={(inv) => setActivePrintingInvoice(inv)}
      />

      {/* 4. Customer Quick Payment / Empty Return */}
      <QuickPaymentModal
        isOpen={!!activeQuickPayCustomer}
        customer={activeQuickPayCustomer}
        onClose={() => setActiveQuickPayCustomer(null)}
        onSavePayment={handleQuickCustomerPayment}
      />

      {/* 5. Stock Edit Modal */}
      <StockEditModal
        isOpen={isStockEditOpen}
        stock={stock}
        onClose={() => setIsStockEditOpen(false)}
        onSaveStock={(updated) => setStock(updated)}
      />

      {/* 6. Send Empties to Plant */}
      <PlantSendEmptyModal
        isOpen={isSendPlantOpen}
        plants={plants}
        stock={stock}
        onClose={() => setIsSendPlantOpen(false)}
        onSendEmpties={handleSendEmptiesToPlant}
      />

      {/* 7. Receive Filled from Plant */}
      <PlantReceiveFilledModal
        isOpen={isReceivePlantOpen}
        plants={plants}
        onClose={() => setIsReceivePlantOpen(false)}
        onReceiveFilled={handleReceiveFilledFromPlant}
      />

      {/* 8. Customer Add / Edit Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        onSaveCustomer={handleSaveCustomer}
        existingCustomer={editingCustomer}
      />

      {/* 9. Agency Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        profile={profile}
        onClose={() => setIsSettingsOpen(false)}
        onSaveProfile={(p) => setProfile(p)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
      />

    </div>
  );
}
