import React, { useState } from 'react';
import { X, Check, Layers, Factory, DollarSign } from 'lucide-react';
import { FillingPlant, StockState } from '../types';

interface PlantReceiveFilledModalProps {
  isOpen: boolean;
  plants: FillingPlant[];
  onClose: () => void;
  onReceiveFilled: (
    plantId: string,
    received: { '11.8kg': number; '45.4kg': number; mini: number },
    totalGasKg: number,
    billAmount: number,
    amountPaid: number,
    notes: string
  ) => void;
}

export const PlantReceiveFilledModal: React.FC<PlantReceiveFilledModalProps> = ({
  isOpen,
  plants,
  onClose,
  onReceiveFilled,
}) => {
  if (!isOpen) return null;

  const [selectedPlantId, setSelectedPlantId] = useState<string>(plants[0]?.id || '');
  const [rec11k, setRec11k] = useState<number>(0);
  const [rec45k, setRec45k] = useState<number>(0);
  const [recMini, setRecMini] = useState<number>(0);
  const [totalGasKg, setTotalGasKg] = useState<number>(0);
  const [ratePerKg, setRatePerKg] = useState<number>(plants[0]?.ratePerKg || 245);
  const [billAmount, setBillAmount] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [notes, setNotes] = useState<string>('بھرے سلنڈر پلانٹ سے وصول کیے');

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  // Auto-calculate weight when cylinder counts change
  const handleRecChange = (size: '11k' | '45k' | 'mini', val: number) => {
    const num = Math.max(0, Number(val) || 0);
    let n11 = size === '11k' ? num : rec11k;
    let n45 = size === '45k' ? num : rec45k;
    let nMini = size === 'mini' ? num : recMini;

    if (size === '11k') setRec11k(num);
    if (size === '45k') setRec45k(num);
    if (size === 'mini') setRecMini(num);

    const calcKg = Math.round(n11 * 11.8 + n45 * 45.4 + nMini * 5);
    setTotalGasKg(calcKg);
    const calculatedBill = calcKg * (ratePerKg || 245);
    setBillAmount(calculatedBill);
    setAmountPaid(calculatedBill);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlantId) return;

    onReceiveFilled(
      selectedPlantId,
      {
        '11.8kg': Number(rec11k) || 0,
        '45.4kg': Number(rec45k) || 0,
        mini: Number(recMini) || 0,
      },
      Number(totalGasKg) || 0,
      Number(billAmount) || 0,
      Number(amountPaid) || 0,
      notes
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-urdu text-xl font-bold">
              پلانٹ سے بھرے سلنڈر وصول کریں (Receive Filled)
            </h3>
            <p className="text-xs text-emerald-300 font-urdu mt-0.5">
              سٹاک میں بھرے سلنڈروں کا اضافہ اور پلانٹ بل کی انٹری
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Select Plant */}
          <div>
            <label className="text-xs font-bold text-slate-800 font-urdu block mb-1">
              کس پلانٹ سے سلنڈر آئے ہیں؟
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => {
                setSelectedPlantId(e.target.value);
                const pl = plants.find((p) => p.id === e.target.value);
                if (pl?.ratePerKg) setRatePerKg(pl.ratePerKg);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-urdu font-semibold"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (بھرائی کے منتظر: 11.8k:{p.cylindersPending['11.8kg']}, 45.4k:{p.cylindersPending['45.4kg']})
                </option>
              ))}
            </select>
          </div>

          {/* Quantities Received */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 font-urdu block">
              وصول شدہ بھرے سلنڈروں کی تعداد:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-600 font-urdu block mb-1">11.8 کلو گھریلو</label>
                <input
                  type="number"
                  min="0"
                  value={rec11k}
                  onChange={(e) => handleRecChange('11k', Number(e.target.value))}
                  className="w-full bg-emerald-50/50 border border-emerald-400 rounded-lg p-2 font-mono font-bold text-emerald-900 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-urdu block mb-1">45.4 کلو کمرشل</label>
                <input
                  type="number"
                  min="0"
                  value={rec45k}
                  onChange={(e) => handleRecChange('45k', Number(e.target.value))}
                  className="w-full bg-emerald-50/50 border border-emerald-400 rounded-lg p-2 font-mono font-bold text-emerald-900 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-urdu block mb-1">چھوٹا سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  value={recMini}
                  onChange={(e) => handleRecChange('mini', Number(e.target.value))}
                  className="w-full bg-emerald-50/50 border border-emerald-400 rounded-lg p-2 font-mono font-bold text-emerald-900 text-center"
                />
              </div>
            </div>
          </div>

          {/* Gas Weight & Plant Rate */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">کل گیس وزن (کلوگرام)</label>
              <input
                type="number"
                value={totalGasKg}
                onChange={(e) => {
                  const kg = Number(e.target.value);
                  setTotalGasKg(kg);
                  setBillAmount(kg * ratePerKg);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">پلانٹ ریٹ فی کلو (روپے)</label>
              <input
                type="number"
                value={ratePerKg}
                onChange={(e) => {
                  const r = Number(e.target.value);
                  setRatePerKg(r);
                  setBillAmount(totalGasKg * r);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Bill & Payment */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-700 font-urdu font-bold block mb-1">پلانٹ کا کل بل (روپے)</label>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-emerald-700 font-urdu font-bold block mb-1">ادا کردہ رقم (روپے)</label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full bg-emerald-50 border border-emerald-500 rounded-lg p-2 font-mono font-bold text-emerald-900"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] text-slate-600 font-urdu block mb-1">نوٹ / تفصیل</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-urdu"
            />
          </div>

          {/* Footer */}
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
              <span>سٹاک میں شامل کریں (Add to Stock)</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
