import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ArrowDownLeft,
  Phone,
  MapPin,
  FileText,
  Package,
  Layers,
  TrendingDown,
  UserCheck,
} from 'lucide-react';
import { Customer } from '../types';

interface CustomerKhataViewProps {
  customers: Customer[];
  onOpenNewCustomerModal: () => void;
  onOpenQuickPay: (customer: Customer) => void;
  onOpenCustomerDetail: (customer: Customer) => void;
  onOpenNewInvoiceForCustomer: (customerId: string) => void;
  filterBalanceOnly?: boolean;
  filterCylindersOnly?: boolean;
}

export const CustomerKhataView: React.FC<CustomerKhataViewProps> = ({
  customers,
  onOpenNewCustomerModal,
  onOpenQuickPay,
  onOpenCustomerDetail,
  onOpenNewInvoiceForCustomer,
  filterBalanceOnly = false,
  filterCylindersOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'debt' | 'cylinders' | 'clean'>(
    filterBalanceOnly ? 'debt' : filterCylindersOnly ? 'cylinders' : 'all'
  );

  // Totals
  const totalMarketDebt = customers.reduce((sum, c) => sum + (c.currentBalance > 0 ? c.currentBalance : 0), 0);
  const totalEmptiesWithCustomers = customers.reduce(
    (sum, c) =>
      sum +
      (c.emptyCylindersDue['11.8kg'] || 0) +
      (c.emptyCylindersDue['45.4kg'] || 0) +
      (c.emptyCylindersDue['mini'] || 0),
    0
  );

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.shopName && c.shopName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.phone.includes(searchTerm) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'debt') return c.currentBalance > 0;
    if (activeFilter === 'cylinders') {
      return (
        (c.emptyCylindersDue['11.8kg'] || 0) +
          (c.emptyCylindersDue['45.4kg'] || 0) +
          (c.emptyCylindersDue['mini'] || 0) >
        0
      );
    }
    if (activeFilter === 'clean') {
      return (
        c.currentBalance <= 0 &&
        (c.emptyCylindersDue['11.8kg'] || 0) +
          (c.emptyCylindersDue['45.4kg'] || 0) +
          (c.emptyCylindersDue['mini'] || 0) ===
          0
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <h2 className="font-urdu text-2xl font-bold text-slate-900">
              گاہک و ادھار کھاتہ (Customers & Credit Khata)
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-urdu mt-0.5">
            کسٹمر کا بقایا ادھار، خالی سلنڈر کا حساب کتاب اور وصولی کی ہسٹری
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-rose-800 font-urdu block">مارکیٹ سے کل وصولی طلب رقم:</span>
            <span className="text-lg font-bold font-mono text-rose-700">
              Rs. {totalMarketDebt.toLocaleString()}
            </span>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-indigo-800 font-urdu block">مارکیٹ میں کل خالی سلنڈر:</span>
            <span className="text-lg font-bold font-mono text-indigo-700">
              {totalEmptiesWithCustomers} <span className="text-xs font-urdu">سلنڈر</span>
            </span>
          </div>

          <button
            onClick={onOpenNewCustomerModal}
            id="add-new-customer-btn"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>نیا گاہک رجسٹر کریں</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="گاہک، دکان یا فون سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-3 py-2 text-xs font-urdu focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'تمام گاہک', count: customers.length },
            {
              id: 'debt',
              label: 'جن سے پیسے لینے ہیں',
              count: customers.filter((c) => c.currentBalance > 0).length,
            },
            {
              id: 'cylinders',
              label: 'جن کے پاس سلنڈر ہیں',
              count: customers.filter(
                (c) =>
                  (c.emptyCylindersDue['11.8kg'] || 0) +
                    (c.emptyCylindersDue['45.4kg'] || 0) +
                    (c.emptyCylindersDue['mini'] || 0) >
                  0
              ).length,
            },
            {
              id: 'clean',
              label: 'صاف کھاتے (Clear)',
              count: customers.filter(
                (c) =>
                  c.currentBalance <= 0 &&
                  (c.emptyCylindersDue['11.8kg'] || 0) +
                    (c.emptyCylindersDue['45.4kg'] || 0) +
                    (c.emptyCylindersDue['mini'] || 0) ===
                    0
              ).length,
            },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-urdu font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === f.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{f.label}</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
                {f.count}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Customer Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 text-slate-400">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="font-urdu text-base font-bold text-slate-700">ابھی کوئی گاہک موجود نہیں ہے</p>
          <p className="text-xs text-slate-400 mt-1">اپنا پہلا کسٹمر رجسٹر کرنے کے لیے نیچے بٹن دبائیں یا نیا بل بناتے وقت اندراج کریں۔</p>
          <button
            onClick={onOpenNewCustomerModal}
            className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs font-urdu shadow shadow-emerald-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>نیا گاہک شامل کریں (Add Customer)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => {
            const hasCylinders =
              (cust.emptyCylindersDue['11.8kg'] || 0) +
                (cust.emptyCylindersDue['45.4kg'] || 0) +
                (cust.emptyCylindersDue['mini'] || 0) >
              0;

            return (
              <div
                key={cust.id}
                id={`customer-card-${cust.id}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-300 flex flex-col justify-between space-y-4"
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-urdu text-lg font-bold text-slate-900">
                        {cust.name}
                      </h3>
                      {cust.shopName && (
                        <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-urdu inline-block mt-0.5">
                          {cust.shopName}
                        </p>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                      {cust.id}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span dir="ltr">{cust.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cust.address}</span>
                    </p>
                  </div>
                </div>

                {/* Status Badges: Balance & Cylinders */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  
                  {/* Balance Owed */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-urdu">پیسے لینے ہیں (Balance):</span>
                    <span
                      className={`font-mono font-extrabold text-base ${
                        cust.currentBalance > 0
                          ? 'text-rose-600'
                          : cust.currentBalance < 0
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    >
                      Rs. {cust.currentBalance.toLocaleString()}
                    </span>
                  </div>

                  {/* Empty Cylinders Due */}
                  <div className="border-t border-slate-200/80 pt-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-urdu mb-1">
                      <span>خالی سلنڈر کسٹمر کے پاس:</span>
                      <span className={`font-mono font-bold ${hasCylinders ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {(cust.emptyCylindersDue['11.8kg'] || 0) +
                          (cust.emptyCylindersDue['45.4kg'] || 0) +
                          (cust.emptyCylindersDue['mini'] || 0)}{' '}
                        سلنڈر
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                      <div className="bg-white p-1 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[9px] font-urdu">11.8k گھریلو</span>
                        <strong className="text-slate-900">{cust.emptyCylindersDue['11.8kg']}</strong>
                      </div>
                      <div className="bg-white p-1 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[9px] font-urdu">45.4k کمرشل</span>
                        <strong className="text-slate-900">{cust.emptyCylindersDue['45.4kg']}</strong>
                      </div>
                      <div className="bg-white p-1 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[9px] font-urdu">چھوٹا</span>
                        <strong className="text-slate-900">{cust.emptyCylindersDue['mini']}</strong>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => onOpenQuickPay(cust)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-1.5 px-2 rounded-xl text-xs font-bold font-urdu flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                    <span>وصولی</span>
                  </button>

                  <button
                    onClick={() => onOpenNewInvoiceForCustomer(cust.id)}
                    className="bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-2 rounded-xl text-xs font-bold font-urdu flex items-center justify-center gap-1 shadow transition-colors"
                  >
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    <span>نیا بل</span>
                  </button>

                  <button
                    onClick={() => onOpenCustomerDetail(cust)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-2 rounded-xl text-xs font-bold font-urdu flex items-center justify-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>کھاتہ لیجر</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
