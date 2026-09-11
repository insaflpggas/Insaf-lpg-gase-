import React from 'react';
import {
  Layers,
  Package,
  Factory,
  Users,
  Edit3,
  Flame,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { Customer, FillingPlant, StockState } from '../types';

interface StockManagementViewProps {
  stock: StockState;
  customers: Customer[];
  plants: FillingPlant[];
  onOpenEditStock: () => void;
  onOpenSendPlant: () => void;
  onOpenReceivePlant: () => void;
}

export const StockManagementView: React.FC<StockManagementViewProps> = ({
  stock,
  customers,
  plants,
  onOpenEditStock,
  onOpenSendPlant,
  onOpenReceivePlant,
}) => {
  // Calculate dynamic counts for customers
  const customersEmpty11k = customers.reduce((s, c) => s + (c.emptyCylindersDue['11.8kg'] || 0), 0);
  const customersEmpty45k = customers.reduce((s, c) => s + (c.emptyCylindersDue['45.4kg'] || 0), 0);
  const customersEmptyMini = customers.reduce((s, c) => s + (c.emptyCylindersDue['mini'] || 0), 0);

  // Calculate dynamic counts at plants
  const plantPending11k = plants.reduce((s, p) => s + (p.cylindersPending['11.8kg'] || 0), 0);
  const plantPending45k = plants.reduce((s, p) => s + (p.cylindersPending['45.4kg'] || 0), 0);
  const plantPendingMini = plants.reduce((s, p) => s + (p.cylindersPending['mini'] || 0), 0);

  // Total cylinder wealth
  const total11kWealth =
    stock['11.8kg'].filledShop +
    stock['11.8kg'].emptyShop +
    plantPending11k +
    customersEmpty11k;

  const total45kWealth =
    stock['45.4kg'].filledShop +
    stock['45.4kg'].emptyShop +
    plantPending45k +
    customersEmpty45k;

  const totalMiniWealth =
    stock['mini'].filledShop +
    stock['mini'].emptyShop +
    plantPendingMini +
    customersEmptyMini;

  const grandTotalCylinders = total11kWealth + total45kWealth + totalMiniWealth;
  const grandTotalFilled =
    stock['11.8kg'].filledShop + stock['45.4kg'].filledShop + stock['mini'].filledShop;
  const grandTotalEmptyShop =
    stock['11.8kg'].emptyShop + stock['45.4kg'].emptyShop + stock['mini'].emptyShop;

  // Approximate inventory value in PKR
  const totalStockWorth =
    stock['11.8kg'].filledShop * stock['11.8kg'].defaultRate +
    stock['45.4kg'].filledShop * stock['45.4kg'].defaultRate +
    stock['mini'].filledShop * stock['mini'].defaultRate +
    stock.loose.stockKg * stock.loose.ratePerKg;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <h2 className="font-urdu text-2xl font-bold text-slate-900">
              سلنڈر و گیس سٹاک کا مکمل حساب (LPG Stock Inventory)
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-urdu mt-0.5">
            دکان پر موجود بھرے و خالی سلنڈر، پلانٹ پر گئے ہوئے اور گاہکوں کے پاس سلنڈروں کی تفصیلی رپورٹ
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenEditStock}
            id="edit-stock-btn"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>سٹاک و ریٹ ایڈٹ کریں</span>
          </button>

          <button
            onClick={onOpenSendPlant}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow"
          >
            <Factory className="w-3.5 h-3.5" />
            <span>پلانٹ پر سلنڈر بھیجیں</span>
          </button>

          <button
            onClick={onOpenReceivePlant}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>پلانٹ سے بھرے وصول کریں</span>
          </button>
        </div>
      </div>

      {/* Overall Agency Cylinder Wealth Card */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-emerald-500/30">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border-r border-slate-700/60 pr-3">
            <span className="text-xs text-emerald-300 font-urdu block">کل سلنڈر اثاثہ (Total Cylinders):</span>
            <span className="text-3xl font-extrabold font-mono text-white">
              {grandTotalCylinders}{' '}
              <span className="text-sm font-normal font-urdu text-emerald-200">سلنڈر</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-urdu">دکان، مارکیٹ اور پلانٹ پر موجود</p>
          </div>

          <div className="border-r border-slate-700/60 pr-3">
            <span className="text-xs text-emerald-300 font-urdu block">دکان پر بھرے ہوئے (Filled):</span>
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {grandTotalFilled}{' '}
              <span className="text-sm font-normal font-urdu text-emerald-200">سلنڈر</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-urdu">فروخت کے لیے تیار</p>
          </div>

          <div className="border-r border-slate-700/60 pr-3">
            <span className="text-xs text-amber-300 font-urdu block">دکان پر خالی پڑے ہوئے (Empty):</span>
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {grandTotalEmptyShop}{' '}
              <span className="text-sm font-normal font-urdu text-amber-200">سلنڈر</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-urdu">پلانٹ روانگی کے منتظر</p>
          </div>

          <div>
            <span className="text-xs text-emerald-300 font-urdu block">بھرے سٹاک کی مالی مالیت:</span>
            <span className="text-2xl font-extrabold font-mono text-amber-300">
              Rs. {totalStockWorth.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-urdu">گیس کی موجودہ قیمت</p>
          </div>
        </div>
      </div>

      {/* Grid of Cylinder Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 1. 11.8 KG Domestic */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">
                11.8 KG
              </span>
              <h3 className="font-urdu text-xl font-bold text-slate-900 mt-1">
                11.8 کلو گھریلو سلنڈر
              </h3>
              <p className="text-xs text-slate-400 font-urdu">گھریلو صارفین کا معیاری سلنڈر</p>
            </div>
            <div className="text-left" dir="ltr">
              <span className="text-[10px] text-slate-400 block font-urdu">سیل ریٹ:</span>
              <span className="text-lg font-mono font-extrabold text-emerald-700">
                Rs. {stock['11.8kg'].defaultRate.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Counts Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-slate-600 font-urdu block">دکان پر بھرے ہوئے:</span>
              <span className="text-xl font-mono font-bold text-emerald-800">
                {stock['11.8kg'].filledShop}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="text-slate-600 font-urdu block">دکان پر خالی پڑے:</span>
              <span className="text-xl font-mono font-bold text-amber-800">
                {stock['11.8kg'].emptyShop}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200">
              <span className="text-slate-600 font-urdu block">پلانٹ پر گئے ہوئے:</span>
              <span className="text-xl font-mono font-bold text-cyan-800">
                {plantPending11k}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              <span className="text-slate-600 font-urdu block">گاہکوں کے پاس:</span>
              <span className="text-xl font-mono font-bold text-indigo-800">
                {customersEmpty11k}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs">
            <span className="font-urdu font-bold text-slate-700">کل 11.8 کلو سلنڈر اثاثہ:</span>
            <span className="font-mono font-extrabold text-sm text-slate-900">
              {total11kWealth} سلنڈر
            </span>
          </div>
        </div>

        {/* 2. 45.4 KG Commercial */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded font-mono">
                45.4 KG
              </span>
              <h3 className="font-urdu text-xl font-bold text-slate-900 mt-1">
                45.4 کلو کمرشل سلنڈر
              </h3>
              <p className="text-xs text-slate-400 font-urdu">ہوٹل، نان بائی، فیکٹریاں و باربی کیو</p>
            </div>
            <div className="text-left" dir="ltr">
              <span className="text-[10px] text-slate-400 block font-urdu">سیل ریٹ:</span>
              <span className="text-lg font-mono font-extrabold text-indigo-700">
                Rs. {stock['45.4kg'].defaultRate.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Counts Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-slate-600 font-urdu block">دکان پر بھرے ہوئے:</span>
              <span className="text-xl font-mono font-bold text-emerald-800">
                {stock['45.4kg'].filledShop}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="text-slate-600 font-urdu block">دکان پر خالی پڑے:</span>
              <span className="text-xl font-mono font-bold text-amber-800">
                {stock['45.4kg'].emptyShop}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200">
              <span className="text-slate-600 font-urdu block">پلانٹ پر گئے ہوئے:</span>
              <span className="text-xl font-mono font-bold text-cyan-800">
                {plantPending45k}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              <span className="text-slate-600 font-urdu block">گاہکوں کے پاس:</span>
              <span className="text-xl font-mono font-bold text-indigo-800">
                {customersEmpty45k}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs">
            <span className="font-urdu font-bold text-slate-700">کل 45.4 کلو سلنڈر اثاثہ:</span>
            <span className="font-mono font-extrabold text-sm text-slate-900">
              {total45kWealth} سلنڈر
            </span>
          </div>
        </div>

        {/* 3. Mini Cylinders (4-6 Kg) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono">
                MINI
              </span>
              <h3 className="font-urdu text-xl font-bold text-slate-900 mt-1">
                چھوٹا سلنڈر (4 تا 6 کلو)
              </h3>
              <p className="text-xs text-slate-400 font-urdu">چھوٹے دکاندار اور گھریلو چولہے</p>
            </div>
            <div className="text-left" dir="ltr">
              <span className="text-[10px] text-slate-400 block font-urdu">سیل ریٹ:</span>
              <span className="text-lg font-mono font-extrabold text-amber-700">
                Rs. {stock['mini'].defaultRate.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Counts Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-slate-600 font-urdu block">دکان پر بھرے ہوئے:</span>
              <span className="text-xl font-mono font-bold text-emerald-800">
                {stock['mini'].filledShop}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="text-slate-600 font-urdu block">دکان پر خالی پڑے:</span>
              <span className="text-xl font-mono font-bold text-amber-800">
                {stock['mini'].emptyShop}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200">
              <span className="text-slate-600 font-urdu block">پلانٹ پر گئے ہوئے:</span>
              <span className="text-xl font-mono font-bold text-cyan-800">
                {plantPendingMini}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>

            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              <span className="text-slate-600 font-urdu block">گاہکوں کے پاس:</span>
              <span className="text-xl font-mono font-bold text-indigo-800">
                {customersEmptyMini}{' '}
                <span className="text-xs font-urdu font-normal">سلنڈر</span>
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs">
            <span className="font-urdu font-bold text-slate-700">کل چھوٹے سلنڈر اثاثہ:</span>
            <span className="font-mono font-extrabold text-sm text-slate-900">
              {totalMiniWealth} سلنڈر
            </span>
          </div>
        </div>

      </div>

      {/* Loose Gas Bowser / Tank Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-urdu text-lg font-bold text-slate-900">
              کھلی ایل پی جی گیس سٹاک (Loose Gas Tank Stock)
            </h3>
            <p className="text-xs text-slate-500 font-urdu">
              دکان پر موجود اسٹوریج ٹینک یا باؤزر میں گیس کا وزن
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 font-urdu block">ٹینک میں موجود وزن:</span>
            <span className="text-xl font-mono font-extrabold text-teal-700">
              {stock.loose.stockKg}{' '}
              <span className="text-xs font-urdu text-slate-600">کلوگرام (KG)</span>
            </span>
          </div>

          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 font-urdu block">سیل ریٹ فی کلو:</span>
            <span className="text-xl font-mono font-extrabold text-slate-900">
              Rs. {stock.loose.ratePerKg} / kg
            </span>
          </div>

          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-right">
            <span className="text-[10px] text-emerald-800 font-urdu block">کل مالیت:</span>
            <span className="text-xl font-mono font-extrabold text-emerald-700">
              Rs. {(stock.loose.stockKg * stock.loose.ratePerKg).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
