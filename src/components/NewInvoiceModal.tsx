import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Printer,
  Save,
  UserPlus,
  Search,
  CheckCircle,
  Truck,
  Phone,
  AlertCircle,
  Package,
} from 'lucide-react';
import { Customer, CylinderSize, Invoice, InvoiceItem, ShopProfile, StockState } from '../types';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  stock: StockState;
  profile: ShopProfile;
  onSaveInvoice: (invoice: Invoice, printImmediately: boolean) => void;
  onQuickAddCustomer: (customer: Customer) => void;
  preSelectedCustomerId?: string;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  customers,
  stock,
  profile,
  onSaveInvoice,
  onQuickAddCustomer,
  preSelectedCustomerId,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState<boolean>(false);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustShop, setNewCustShop] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustInitialBalance, setNewCustInitialBalance] = useState<number>(0);
  const [newCustInitial11k, setNewCustInitial11k] = useState<number>(0);
  const [newCustInitial45k, setNewCustInitial45k] = useState<number>(0);
  const [newCustInitialMini, setNewCustInitialMini] = useState<number>(0);

  // Invoice Details
  const [invoiceDate, setInvoiceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [invoiceTime, setInvoiceTime] = useState<string>(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  );
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'bank_transfer' | 'cheque'>('cash');

  // Invoice items - Default starts with 0 cylinders (Clean & Fresh, no sticking 1!)
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      cylinderSize: '11.8kg',
      quantityFilled: 0,
      rate: stock['11.8kg']?.defaultRate || 3350,
      emptyReturned: 0,
      subtotal: 0,
    },
  ]);

  const [cashReceived, setCashReceived] = useState<number>(0);

  // When modal opens, completely reset to a clean fresh slate
  useEffect(() => {
    if (isOpen) {
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setInvoiceTime(
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setItems([
        {
          cylinderSize: '11.8kg',
          quantityFilled: 0,
          rate: stock['11.8kg']?.defaultRate || 3350,
          emptyReturned: 0,
          subtotal: 0,
        },
      ]);
      setCashReceived(0);
      setVehicleNumber('');
      setDriverName('');
      setNotes('');
      setPaymentMethod('cash');

      if (preSelectedCustomerId) {
        setSelectedCustomerId(preSelectedCustomerId);
        setIsAddingNewCustomer(false);
      } else if (customers.length > 0) {
        setSelectedCustomerId(customers[0].id);
        setIsAddingNewCustomer(false);
      } else {
        setSelectedCustomerId('');
        setIsAddingNewCustomer(true); // Guide user to enter their customer
      }
    }
  }, [isOpen, preSelectedCustomerId, customers, stock]);

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Update item
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    // Update rate when cylinder size changes
    if (field === 'cylinderSize') {
      const size = value as CylinderSize;
      if (size === '11.8kg') item.rate = stock['11.8kg']?.defaultRate || 3350;
      else if (size === '45.4kg') item.rate = stock['45.4kg']?.defaultRate || 12800;
      else if (size === 'mini') item.rate = stock['mini']?.defaultRate || 1400;
      else if (size === 'loose') {
        item.rate = stock.loose?.ratePerKg || 285;
        item.weightKg = item.weightKg || 0;
      }
    }

    // Recalculate subtotal
    if (item.cylinderSize === 'loose') {
      item.subtotal = (Number(item.weightKg) || 0) * (Number(item.rate) || 0);
    } else {
      item.subtotal = (Number(item.quantityFilled) || 0) * (Number(item.rate) || 0);
    }

    updated[index] = item;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        cylinderSize: '45.4kg',
        quantityFilled: 0,
        rate: stock['45.4kg']?.defaultRate || 12800,
        emptyReturned: 0,
        subtotal: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const billTotalAmount = items.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
  const previousBalance = currentCustomer ? currentCustomer.currentBalance : 0;
  const netTotal = billTotalAmount + previousBalance;
  const remainingBalance = netTotal - (Number(cashReceived) || 0);

  // Calculate new empty cylinders due for each size
  const emptyReturnedNow = {
    '11.8kg': items
      .filter((i) => i.cylinderSize === '11.8kg')
      .reduce((sum, i) => sum + (Number(i.emptyReturned) || 0), 0),
    '45.4kg': items
      .filter((i) => i.cylinderSize === '45.4kg')
      .reduce((sum, i) => sum + (Number(i.emptyReturned) || 0), 0),
    'mini': items
      .filter((i) => i.cylinderSize === 'mini')
      .reduce((sum, i) => sum + (Number(i.emptyReturned) || 0), 0),
  };

  const filledGivenNow = {
    '11.8kg': items
      .filter((i) => i.cylinderSize === '11.8kg')
      .reduce((sum, i) => sum + (Number(i.quantityFilled) || 0), 0),
    '45.4kg': items
      .filter((i) => i.cylinderSize === '45.4kg')
      .reduce((sum, i) => sum + (Number(i.quantityFilled) || 0), 0),
    'mini': items
      .filter((i) => i.cylinderSize === 'mini')
      .reduce((sum, i) => sum + (Number(i.quantityFilled) || 0), 0),
  };

  const previousEmptyDue = currentCustomer
    ? { ...currentCustomer.emptyCylindersDue }
    : { '11.8kg': 0, '45.4kg': 0, mini: 0 };

  const newEmptyDue = {
    '11.8kg': Math.max(0, previousEmptyDue['11.8kg'] + filledGivenNow['11.8kg'] - emptyReturnedNow['11.8kg']),
    '45.4kg': Math.max(0, previousEmptyDue['45.4kg'] + filledGivenNow['45.4kg'] - emptyReturnedNow['45.4kg']),
    'mini': Math.max(0, previousEmptyDue['mini'] + filledGivenNow['mini'] - emptyReturnedNow['mini']),
  };

  const handleQuickAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const newCustomer: Customer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: newCustName.trim(),
      shopName: newCustShop.trim() || undefined,
      phone: newCustPhone.trim() || '0300-0000000',
      address: newCustAddress.trim() || 'لاہور',
      currentBalance: Number(newCustInitialBalance) || 0,
      emptyCylindersDue: {
        '11.8kg': Number(newCustInitial11k) || 0,
        '45.4kg': Number(newCustInitial45k) || 0,
        mini: Number(newCustInitialMini) || 0,
      },
      totalBilled: 0,
      totalPaid: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onQuickAddCustomer(newCustomer);
    setSelectedCustomerId(newCustomer.id);
    setIsAddingNewCustomer(false);

    // reset
    setNewCustName('');
    setNewCustShop('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustInitialBalance(0);
    setNewCustInitial11k(0);
    setNewCustInitial45k(0);
    setNewCustInitialMini(0);
  };

  const handleSubmit = (printImmediately: boolean) => {
    if (!currentCustomer) {
      alert('براہ کرم پہلے گاہک منتخب کریں یا "نیا گاہک درج کریں" پر کلک کر کے نیا گاہک شامل کریں۔');
      return;
    }

    const hasAnyQuantity = items.some(
      (i) => (i.cylinderSize === 'loose' ? (Number(i.weightKg) || 0) > 0 : (Number(i.quantityFilled) || 0) > 0)
    );

    if (!hasAnyQuantity && (Number(cashReceived) || 0) <= 0) {
      alert('براہ کرم سلنڈروں کی تعداد یا وصول شدہ رقم درج کریں۔');
      return;
    }

    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-5)}`,
      invoiceNumber: Math.floor(1001 + Math.random() * 8999),
      date: invoiceDate,
      time: invoiceTime,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name + (currentCustomer.shopName ? ` (${currentCustomer.shopName})` : ''),
      customerPhone: currentCustomer.phone,
      customerAddress: currentCustomer.address,
      items,
      totalAmount: billTotalAmount,
      previousBalance,
      netTotal,
      cashReceived: Number(cashReceived) || 0,
      remainingBalance,
      previousEmptyDue,
      emptyReturnedNow,
      newEmptyDue,
      paymentMethod,
      vehicleNumber: vehicleNumber.trim() || undefined,
      driverName: driverName.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onSaveInvoice(newInvoice, printImmediately);
  };

  if (!isOpen) return null;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.shopName && c.shopName.toLowerCase().includes(customerSearch.toLowerCase())) ||
      c.phone.includes(customerSearch)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-500/30 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-500/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h2 className="font-urdu text-2xl font-bold text-white">
                نیا بل و انوائس بنائیں (New LPG Invoice)
              </h2>
            </div>
            <p className="text-xs text-emerald-300 font-urdu mt-0.5">
              سلنڈر فروخت، گیس ڈلیوری، خالی سلنڈر واپسی اور ادھار کھاتہ اندراج
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
          
          {/* Customer Selection Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-urdu text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>گاہک کا انتخاب کریں (Select Customer): *</span>
              </label>

              <button
                type="button"
                onClick={() => setIsAddingNewCustomer(!isAddingNewCustomer)}
                className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl font-urdu font-bold flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isAddingNewCustomer ? 'فہرست سے چنیں' : 'نیا گاہک درج کریں'}</span>
              </button>
            </div>

            {/* Quick Add Customer Panel */}
            {isAddingNewCustomer && (
              <form
                onSubmit={handleQuickAddCustomerSubmit}
                className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-300 space-y-3 animate-in fade-in"
              >
                <h4 className="font-urdu text-xs font-bold text-emerald-950">
                  نیا گاہک فوری رجسٹر کریں:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-600 font-urdu block mb-1">گاہک کا نام *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: حاجی اصغر"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 font-urdu"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-urdu block mb-1">دکان / ہوٹل کا نام</label>
                    <input
                      type="text"
                      placeholder="مثلاً: سلیم تکہ شاپ"
                      value={newCustShop}
                      onChange={(e) => setNewCustShop(e.target.value)}
                      className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 font-urdu"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-urdu block mb-1">موبائل فون نمبر *</label>
                    <input
                      type="text"
                      placeholder="0300-1234567"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-urdu block mb-1">پتہ / علاقہ</label>
                    <input
                      type="text"
                      placeholder="مین مارکیٹ، لاہور"
                      value={newCustAddress}
                      onChange={(e) => setNewCustAddress(e.target.value)}
                      className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 font-urdu"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-emerald-200/60">
                  <div>
                    <label className="text-[10px] text-slate-600 font-urdu block">پہلے سے ادھار (روپے)</label>
                    <input
                      type="number"
                      min="0"
                      value={newCustInitialBalance}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setNewCustInitialBalance(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-urdu block">11.8k سلنڈر پہلے سے</label>
                    <input
                      type="number"
                      min="0"
                      value={newCustInitial11k}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setNewCustInitial11k(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-urdu block">45.4k کمرشل پہلے سے</label>
                    <input
                      type="number"
                      min="0"
                      value={newCustInitial45k}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setNewCustInitial45k(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 font-urdu block">چھوٹے سلنڈر پہلے سے</label>
                    <input
                      type="number"
                      min="0"
                      value={newCustInitialMini}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setNewCustInitialMini(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCustomer(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800 font-urdu"
                  >
                    کینسل
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold font-urdu shadow"
                  >
                    گاہک محفوظ کریں
                  </button>
                </div>
              </form>
            )}

            {/* Select Dropdown with search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                {customers.length === 0 ? (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-amber-900 text-xs font-urdu flex items-center justify-between">
                    <span>ابھی کوئی گاہک موجود نہیں ہے۔ براہ کرم "نیا گاہک درج کریں" پر کلک کریں۔</span>
                  </div>
                ) : (
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-urdu focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.shopName ? `(${c.shopName})` : ''} - {c.phone}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Delivery Details */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ڈرائیور / رکشہ نمبر (مثلاً: LEB-4521)"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-urdu"
                />
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 font-mono"
                />
              </div>
            </div>

            {/* Selected Customer Snapshot Card */}
            {currentCustomer && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-3.5 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-urdu font-bold text-emerald-950 text-base">
                      {currentCustomer.name}
                    </span>
                    {currentCustomer.shopName && (
                      <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-urdu">
                        {currentCustomer.shopName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-urdu mt-0.5">
                    {currentCustomer.address} • <span dir="ltr">{currentCustomer.phone}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-urdu">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">سابقہ بقایا ادھار:</span>
                    <span className={`text-base font-bold font-mono ${currentCustomer.currentBalance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      Rs. {currentCustomer.currentBalance.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-r border-slate-300 pr-3 text-right">
                    <span className="text-[10px] text-slate-500 block">گاہک کے ذمے خالی سلنڈر:</span>
                    <span className="text-xs font-bold text-indigo-900 font-mono">
                      11.8k: <strong className="text-indigo-600">{currentCustomer.emptyCylindersDue['11.8kg']}</strong> | 
                      45.4k: <strong className="text-indigo-600"> {currentCustomer.emptyCylindersDue['45.4kg']}</strong> | 
                      چھوٹے: <strong className="text-indigo-600"> {currentCustomer.emptyCylindersDue['mini']}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Items Table (سلنڈرز و گیس اشیاء) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-urdu text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <span>گیس سلنڈرز کا اندراج (Gas & Cylinders Delivered)</span>
                </h3>
                <p className="text-xs text-slate-500 font-urdu mt-0.5">
                  تعداد لکھیں، مٹائیں یا 0 کریں۔ + اور - کے بٹن سے فوری تبدیلی بھی کر سکتے ہیں
                </p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-xl border border-slate-300 flex items-center gap-1 font-urdu"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>مزید سلنڈر شامل کریں</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                >
                  {/* Cylinder Type */}
                  <div className="md:col-span-4">
                    <label className="text-[11px] text-slate-500 font-urdu block mb-1">
                      سلنڈر کی قسم / سائز
                    </label>
                    <select
                      value={item.cylinderSize}
                      onChange={(e) => updateItem(idx, 'cylinderSize', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-urdu font-semibold"
                    >
                      <option value="11.8kg">11.8 کلو گھریلو (Domestic) - سٹاک: {stock['11.8kg']?.filledShop ?? 0}</option>
                      <option value="45.4kg">45.4 کلو کمرشل (Commercial) - سٹاک: {stock['45.4kg']?.filledShop ?? 0}</option>
                      <option value="mini">چھوٹا سلنڈر 4 تا 6 کلو (Mini) - سٹاک: {stock['mini']?.filledShop ?? 0}</option>
                      <option value="loose">کھلی گیس فی کلو (Loose Gas KG)</option>
                    </select>
                  </div>

                  {/* Filled Quantity Given - CLEAN, ZERO-FRICTION, NO STICKING 1 */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-emerald-700 font-bold font-urdu block mb-1">
                      {item.cylinderSize === 'loose' ? 'وزن (کلو)' : 'بھرے سلنڈر دیے *'}
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => {
                          if (item.cylinderSize === 'loose') {
                            updateItem(idx, 'weightKg', Math.max(0, (Number(item.weightKg) || 0) - 1));
                          } else {
                            updateItem(idx, 'quantityFilled', Math.max(0, (Number(item.quantityFilled) || 0) - 1));
                          }
                        }}
                        className="w-7 h-7 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center text-sm font-bold active:scale-95"
                        title="ایک کم کریں"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.cylinderSize === 'loose' ? (item.weightKg ? item.weightKg : '') : (item.quantityFilled ? item.quantityFilled : '')}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const raw = e.target.value.trim();
                          const val = raw === '' ? 0 : Math.max(0, Number(raw));
                          if (item.cylinderSize === 'loose') {
                            updateItem(idx, 'weightKg', val);
                          } else {
                            updateItem(idx, 'quantityFilled', val);
                          }
                        }}
                        className="w-full bg-white border border-emerald-400 font-mono font-bold text-emerald-900 rounded-lg px-2 py-1 text-xs text-center focus:ring-2 focus:ring-emerald-500"
                      />

                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => {
                          if (item.cylinderSize === 'loose') {
                            updateItem(idx, 'weightKg', (Number(item.weightKg) || 0) + 1);
                          } else {
                            updateItem(idx, 'quantityFilled', (Number(item.quantityFilled) || 0) + 1);
                          }
                        }}
                        className="w-7 h-7 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg flex items-center justify-center text-sm font-bold active:scale-95"
                        title="ایک زیادہ کریں"
                      >
                        +
                      </button>
                    </div>

                    {/* Quick Preset Buttons for Filled */}
                    <div className="flex gap-1 mt-1 justify-center">
                      {[0, 1, 2, 5].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          tabIndex={-1}
                          onClick={() => {
                            if (item.cylinderSize === 'loose') {
                              updateItem(idx, 'weightKg', preset);
                            } else {
                              updateItem(idx, 'quantityFilled', preset);
                            }
                          }}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                            (item.cylinderSize === 'loose' ? item.weightKg : item.quantityFilled) === preset
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-slate-500 font-urdu block mb-1">
                      ریٹ (روپے)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.rate}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        const val = raw === '' ? 0 : Math.max(0, Number(raw));
                        updateItem(idx, 'rate', val);
                      }}
                      className="w-full bg-white border border-slate-300 font-mono font-semibold rounded-lg px-2.5 py-1 text-xs text-center"
                    />
                  </div>

                  {/* Empty Returned Right Now - Starts at 0 */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-amber-800 font-bold font-urdu block mb-1">
                      خالی سلنڈر لیے (واپسی)
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => updateItem(idx, 'emptyReturned', Math.max(0, (Number(item.emptyReturned) || 0) - 1))}
                        className="w-7 h-7 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center text-sm font-bold active:scale-95"
                        title="ایک کم کریں"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.emptyReturned ? item.emptyReturned : ''}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const raw = e.target.value.trim();
                          const val = raw === '' ? 0 : Math.max(0, Number(raw));
                          updateItem(idx, 'emptyReturned', val);
                        }}
                        className="w-full bg-amber-50 border border-amber-400 font-mono font-bold text-amber-900 rounded-lg px-2 py-1 text-xs text-center focus:ring-2 focus:ring-amber-500"
                      />

                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => updateItem(idx, 'emptyReturned', (Number(item.emptyReturned) || 0) + 1)}
                        className="w-7 h-7 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg flex items-center justify-center text-sm font-bold active:scale-95"
                        title="ایک زیادہ کریں"
                      >
                        +
                      </button>
                    </div>

                    {/* Quick presets for empty returned */}
                    <div className="flex gap-1 mt-1 justify-center">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => updateItem(idx, 'emptyReturned', 0)}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-urdu font-bold transition-all ${
                          (Number(item.emptyReturned) || 0) === 0
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                      >
                        0 (کوئی نہیں)
                      </button>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => updateItem(idx, 'emptyReturned', Number(item.quantityFilled) || 0)}
                        className="text-[9px] px-1.5 py-0.5 rounded font-urdu font-bold bg-amber-100 hover:bg-amber-200 text-amber-900"
                        title="جتنے بھرے دیے اتنے ہی خالی واپس لیے"
                      >
                        برابر ({item.quantityFilled || 0})
                      </button>
                    </div>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="md:col-span-2 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-urdu block">رقم:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        Rs. {item.subtotal.toLocaleString()}
                      </span>
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="سلنڈر سطر ختم کریں"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing & Balance Calculation Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-emerald-500/40 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-slate-700/80">
              
              <div>
                <span className="text-xs text-slate-400 font-urdu block">اس بل کی رقم (Current Bill):</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  Rs. {billTotalAmount.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-urdu block">پچھلا ادھار (Old Balance):</span>
                <span className={`text-xl font-bold font-mono ${previousBalance > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                  Rs. {previousBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-urdu block">کل واجب الادا (Net Total):</span>
                <span className="text-2xl font-extrabold font-mono text-white">
                  Rs. {netTotal.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="text-xs text-amber-300 font-bold font-urdu block mb-1">
                  نقد وصولی (Cash Received) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={cashReceived ? cashReceived : ''}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setCashReceived(raw === '' ? 0 : Math.max(0, Number(raw)));
                    }}
                    className="w-full bg-slate-800 border-2 border-amber-400 rounded-xl px-3 py-1.5 text-lg font-mono font-bold text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setCashReceived(billTotalAmount)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 px-2 py-0.5 rounded font-urdu active:scale-95"
                    >
                      مکمل بل (Rs. {billTotalAmount.toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashReceived(0)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 px-2 py-0.5 rounded font-urdu active:scale-95"
                    >
                      0 روپے (مکمل ادھار)
                    </button>
                    {netTotal > billTotalAmount && (
                      <button
                        type="button"
                        onClick={() => setCashReceived(netTotal)}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2 py-0.5 rounded font-urdu active:scale-95"
                      >
                        سابقہ سمیت کل
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Remaining Balance & Empty Cylinders Impact */}
            <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Cash Balance Result */}
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${remainingBalance > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}>
                  <span className="text-xs font-urdu block">بقایا رقم (Balance Owed):</span>
                  <span className="text-xl font-bold font-mono">
                    Rs. {remainingBalance.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-urdu space-y-0.5">
                  <p>ادائیگی کا طریقہ:</p>
                  <div className="flex gap-1.5">
                    {(['cash', 'credit', 'bank_transfer'] as const).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`px-2 py-1 rounded text-[11px] font-urdu ${paymentMethod === m ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                      >
                        {m === 'cash' ? 'نقد (Cash)' : m === 'credit' ? 'ادھار (Credit)' : 'بینک ٹرانسفر'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cylinders Due After This Invoice */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-right">
                <span className="text-[11px] text-amber-300 font-urdu block font-bold">
                  اس بل کے بعد گاہک کے پاس کل خالی سلنڈر:
                </span>
                <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-200 mt-1">
                  <span>11.8k: <strong className="text-amber-400">{newEmptyDue['11.8kg']}</strong></span>
                  <span>45.4k: <strong className="text-amber-400">{newEmptyDue['45.4kg']}</strong></span>
                  <span>Mini: <strong className="text-amber-400">{newEmptyDue['mini']}</strong></span>
                </div>
              </div>

            </div>
          </div>

          {/* Optional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="ڈرائیور کا نام (اختیاری)"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 font-urdu"
            />
            <input
              type="text"
              placeholder="بل پر نوٹ یا خصوصی ہدایت (مثلاً: کیش شام کو وصول کریں گے)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 font-urdu"
            />
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold font-urdu text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            بند کریں (Cancel)
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>صرف محفوظ کریں (Save Only)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs font-urdu flex items-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>محفوظ کریں اور پرنٹ نکالیں (Save & Print)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
