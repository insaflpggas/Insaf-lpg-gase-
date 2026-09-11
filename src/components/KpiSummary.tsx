import React from 'react';
import {
  Wallet,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Factory,
  Users,
  AlertCircle,
  Package,
} from 'lucide-react';
import { Customer, FillingPlant, StockState } from '../types';

interface KpiSummaryProps {
  stock: StockState;
  customers: Customer[];
  plants: FillingPlant[];
  onOpenNewInvoice: () => void;
  onFilterCustomersWithBalance: () => void;
  onFilterCustomersWithCylinders: () => void;
}

export const KpiSummary: React.FC<KpiSummaryProps> = ({
  stock,
  customers,
  plants,
  onOpenNewInvoice,
  onFilterCustomersWithBalance,
  onFilterCustomersWithCylinders,
}) => {
  // Total Money to collect from customers (گاہک سے کتنے پیسے لینے ہیں)
  const totalReceivables = customers.reduce((sum, c) => sum + (c.currentBalance > 0 ? c.currentBalance : 0), 0);
  const customersWithDebt = customers.filter((c) => c.currentBalance > 0).length;

  // Shop Filled Cylinders (بھرے ہوئے سلنڈر)
  const totalFilledShop =
    stock['11.8kg'].filledShop + stock['45.4kg'].filledShop + stock['mini'].filledShop;

  // Shop Empty Cylinders (دکان پر خالی سلنڈر)
  const totalEmptyShop =
    stock['11.8kg'].emptyShop + stock['45.4kg'].emptyShop + stock['mini'].emptyShop;

  // Empty Cylinders with Customers (گاہکوں کے پاس خالی سلنڈر)
  const totalWithCustomers = customers.reduce(
    (sum, c) =>
      sum +
      (c.emptyCylindersDue['11.8kg'] || 0) +
      (c.emptyCylindersDue['45.4kg'] || 0) +
      (c.emptyCylindersDue['mini'] || 0),
    0
  );
  const customersWithCylinders = customers.filter(
    (c) =>
      (c.emptyCylindersDue['11.8kg'] || 0) +
        (c.emptyCylindersDue['45.4kg'] || 0) +
        (c.emptyCylindersDue['mini'] || 0) >
      0
  ).length;

  // Cylinders currently at Plants (پلانٹ پر گئے ہوئے سلنڈر)
  const totalAtPlants = plants.reduce(
    (sum, p) =>
      sum +
      (p.cylindersPending['11.8kg'] || 0) +
      (p.cylindersPending['45.4kg'] || 0) +
      (p.cylindersPending['mini'] || 0),
    0
  );

  // Total payable to plants
  const totalPayablePlants = plants.reduce((sum, p) => sum + p.currentPayable, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2 no-print">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* 1. Market Udhaar / Total to Collect from Customers */}
        <div
          id="kpi-receivables-card"
          onClick={onFilterCustomersWithBalance}
          className="bg-white rounded-2xl p-3.5 border border-rose-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-rose-300 relative group overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Wallet className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
              {customersWithDebt} گاہک
            </span>
          </div>
          <div className="mt-2.5">
            <p className="font-urdu text-xs text-slate-500">گاہکوں سے لینے ہیں</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight text-rose-600">
              Rs. {totalReceivables.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">مارکیٹ ادھار / Khata</p>
          </div>
        </div>

        {/* 2. Shop Filled Stock */}
        <div
          id="kpi-filled-stock-card"
          className="bg-white rounded-2xl p-3.5 border border-emerald-100 shadow-sm hover:shadow-md transition-all hover:border-emerald-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Package className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              تیار برائے فروخت
            </span>
          </div>
          <div className="mt-2.5">
            <p className="font-urdu text-xs text-slate-500">دکان پر بھرے سلنڈر</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight text-emerald-600">
              {totalFilledShop}{' '}
              <span className="text-xs font-normal text-slate-500 font-urdu">سلنڈر</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              11.8k ({stock['11.8kg'].filledShop}) • 45.4k ({stock['45.4kg'].filledShop})
            </p>
          </div>
        </div>

        {/* 3. Shop Empty Stock */}
        <div
          id="kpi-empty-shop-card"
          className="bg-white rounded-2xl p-3.5 border border-amber-100 shadow-sm hover:shadow-md transition-all hover:border-amber-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Layers className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              پلانٹ روانگی
            </span>
          </div>
          <div className="mt-2.5">
            <p className="font-urdu text-xs text-slate-500">دکان پر خالی سلنڈر</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight text-amber-600">
              {totalEmptyShop}{' '}
              <span className="text-xs font-normal text-slate-500 font-urdu">سلنڈر</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              11.8k ({stock['11.8kg'].emptyShop}) • 45.4k ({stock['45.4kg'].emptyShop})
            </p>
          </div>
        </div>

        {/* 4. Cylinders with Customers */}
        <div
          id="kpi-with-customers-card"
          onClick={onFilterCustomersWithCylinders}
          className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-indigo-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              {customersWithCylinders} گاہکوں کے پاس
            </span>
          </div>
          <div className="mt-2.5">
            <p className="font-urdu text-xs text-slate-500">گاہکوں کے پاس خالی</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight text-indigo-600">
              {totalWithCustomers}{' '}
              <span className="text-xs font-normal text-slate-500 font-urdu">سلنڈر</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">واپس وصول کرنے ہیں</p>
          </div>
        </div>

        {/* 5. Cylinders at Filling Plants */}
        <div
          id="kpi-at-plants-card"
          className="bg-white rounded-2xl p-3.5 border border-cyan-100 shadow-sm hover:shadow-md transition-all hover:border-cyan-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Factory className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-semibold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
              {plants.length} پلانٹس
            </span>
          </div>
          <div className="mt-2.5">
            <p className="font-urdu text-xs text-slate-500">پلانٹ پر گئے ہوئے</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight text-cyan-700">
              {totalAtPlants}{' '}
              <span className="text-xs font-normal text-slate-500 font-urdu">سلنڈر</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">بھرائی پر ہیں (Refilling)</p>
          </div>
        </div>

        {/* 6. Payable to Plants */}
        <div
          id="kpi-payable-plants-card"
          className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-sm hover:shadow-md transition-all hover:border-purple-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ArrowUpRight className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              پلانٹ دینا ہے
            </span>
          </div>
          <div className="mt-2.5">
            <p className="font-urdu text-xs text-slate-500">پلانٹس کو قابلِ ادا</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight text-purple-700">
              Rs. {totalPayablePlants.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">فلنگ واجبات / Payable</p>
          </div>
        </div>

      </div>
    </div>
  );
};
