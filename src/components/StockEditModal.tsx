import React, { useState } from 'react';
import { X, Save, Layers, Package, Check } from 'lucide-react';
import { StockState } from '../types';

interface StockEditModalProps {
  isOpen: boolean;
  stock: StockState;
  onClose: () => void;
  onSaveStock: (updatedStock: StockState) => void;
}

export const StockEditModal: React.FC<StockEditModalProps> = ({
  isOpen,
  stock,
  onClose,
  onSaveStock,
}) => {
  if (!isOpen) return null;

  const [localStock, setLocalStock] = useState<StockState>(JSON.parse(JSON.stringify(stock)));

  const handleUpdate = (
    category: '11.8kg' | '45.4kg' | 'mini',
    field: 'filledShop' | 'emptyShop' | 'defaultRate',
    val: number
  ) => {
    setLocalStock({
      ...localStock,
      [category]: {
        ...localStock[category],
        [field]: Number(val) || 0,
      },
    });
  };

  const handleUpdateLoose = (field: 'stockKg' | 'ratePerKg', val: number) => {
    setLocalStock({
      ...localStock,
      loose: {
        ...localStock.loose,
        [field]: Number(val) || 0,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStock(localStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-urdu text-xl font-bold">
              گودام سٹاک و ریٹ تبدیل کریں (Update Stock & Rates)
            </h3>
            <p className="text-xs text-slate-300 font-urdu mt-0.5">
              دکان پر موجود بھرے اور خالی سلنڈروں کی تعداد اور موجودہ سیل ریٹ
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* 11.8kg Domestic */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-urdu font-bold text-slate-900 text-base flex items-center justify-between">
              <span>11.8 کلو گھریلو سلنڈر (Domestic 11.8 Kg)</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                11.8 KG
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">دکان پر بھرے سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['11.8kg'].filledShop}
                  onChange={(e) => handleUpdate('11.8kg', 'filledShop', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">دکان پر خالی سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['11.8kg'].emptyShop}
                  onChange={(e) => handleUpdate('11.8kg', 'emptyShop', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-amber-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">سیل ریٹ (روپے)</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['11.8kg'].defaultRate}
                  onChange={(e) => handleUpdate('11.8kg', 'defaultRate', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 45.4kg Commercial */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-urdu font-bold text-slate-900 text-base flex items-center justify-between">
              <span>45.4 کلو کمرشل سلنڈر (Commercial 45.4 Kg)</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">
                45.4 KG
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">دکان پر بھرے سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['45.4kg'].filledShop}
                  onChange={(e) => handleUpdate('45.4kg', 'filledShop', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">دکان پر خالی سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['45.4kg'].emptyShop}
                  onChange={(e) => handleUpdate('45.4kg', 'emptyShop', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-amber-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">سیل ریٹ (روپے)</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['45.4kg'].defaultRate}
                  onChange={(e) => handleUpdate('45.4kg', 'defaultRate', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Mini Cylinders */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-urdu font-bold text-slate-900 text-base flex items-center justify-between">
              <span>چھوٹا سلنڈر 4 تا 6 کلو (Mini Cylinder)</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                MINI
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">دکان پر بھرے سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['mini'].filledShop}
                  onChange={(e) => handleUpdate('mini', 'filledShop', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">دکان پر خالی سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['mini'].emptyShop}
                  onChange={(e) => handleUpdate('mini', 'emptyShop', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-amber-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">سیل ریٹ (روپے)</label>
                <input
                  type="number"
                  min="0"
                  value={localStock['mini'].defaultRate}
                  onChange={(e) => handleUpdate('mini', 'defaultRate', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Loose Gas */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-urdu font-bold text-slate-900 text-base">
              کھلی ایل پی جی گیس (Loose Gas Tank Stock)
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">ٹینک میں کل گیس (کلوگرام)</label>
                <input
                  type="number"
                  min="0"
                  value={localStock.loose.stockKg}
                  onChange={(e) => handleUpdateLoose('stockKg', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-teal-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">ریٹ فی کلو (روپے)</label>
                <input
                  type="number"
                  min="0"
                  value={localStock.loose.ratePerKg}
                  onChange={(e) => handleUpdateLoose('ratePerKg', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl font-urdu"
            >
              کینسل
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-urdu flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              <span>تبدیلیاں محفوظ کریں</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
