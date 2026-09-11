import React, { useState } from 'react';
import { X, Check, ArrowDownLeft, Layers, DollarSign } from 'lucide-react';
import { Customer, CustomerTransaction } from '../types';

interface QuickPaymentModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSavePayment: (
    customerId: string,
    amount: number,
    emptyReturned: { '11.8kg': number; '45.4kg': number; mini: number },
    notes: string
  ) => void;
}

export const QuickPaymentModal: React.FC<QuickPaymentModalProps> = ({
  isOpen,
  customer,
  onClose,
  onSavePayment,
}) => {
  if (!isOpen || !customer) return null;

  const [cashAmount, setCashAmount] = useState<number>(customer.currentBalance > 0 ? customer.currentBalance : 0);
  const [return11k, setReturn11k] = useState<number>(0);
  const [return45k, setReturn45k] = useState<number>(0);
  const [returnMini, setReturnMini] = useState<number>(0);
  const [notes, setNotes] = useState<string>('رقم و خالی سلنڈر وصولی');

  const newBalance = customer.currentBalance - (Number(cashAmount) || 0);

  const newEmpty11k = Math.max(0, customer.emptyCylindersDue['11.8kg'] - (Number(return11k) || 0));
  const newEmpty45k = Math.max(0, customer.emptyCylindersDue['45.4kg'] - (Number(return45k) || 0));
  const newEmptyMini = Math.max(0, customer.emptyCylindersDue['mini'] - (Number(returnMini) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePayment(
      customer.id,
      Number(cashAmount) || 0,
      {
        '11.8kg': Number(return11k) || 0,
        '45.4kg': Number(return45k) || 0,
        mini: Number(returnMini) || 0,
      },
      notes
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-urdu text-xl font-bold">
              رقم و خالی سلنڈر وصولی (Payment & Empty Return)
            </h3>
            <p className="text-xs text-emerald-300 font-urdu mt-0.5">
              {customer.name} {customer.shopName ? `(${customer.shopName})` : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Current Status Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-urdu block">موجودہ بقایا کھاتہ:</span>
              <span className={`text-lg font-bold font-mono ${customer.currentBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                Rs. {customer.currentBalance.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-urdu block">کسٹمر کے پاس خالی سلنڈر:</span>
              <span className="text-xs font-mono font-bold text-slate-800">
                11.8k: {customer.emptyCylindersDue['11.8kg']} | 45.4k: {customer.emptyCylindersDue['45.4kg']} | چھوٹے: {customer.emptyCylindersDue['mini']}
              </span>
            </div>
          </div>

          {/* Cash Received Input */}
          <div>
            <label className="text-xs font-bold text-slate-800 font-urdu block mb-1">
              نقد وصول رقم (Cash Amount Received - PKR):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">Rs.</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={cashAmount ? cashAmount : ''}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const raw = e.target.value.trim();
                  setCashAmount(raw === '' ? 0 : Math.max(0, Number(raw)));
                }}
                className="w-full pl-9 pr-3 py-2 bg-emerald-50/50 border-2 border-emerald-500 rounded-xl text-lg font-mono font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-urdu mt-1">
              وصولی کے بعد نیا بقایا: <strong className="font-mono text-slate-800">Rs. {newBalance.toLocaleString()}</strong>
            </p>
          </div>

          {/* Empty Cylinders Returned */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <label className="text-xs font-bold text-amber-950 font-urdu block">
              خالی سلنڈر واپس موصول ہوئے (Empty Cylinders Returned):
            </label>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-600 font-urdu block">11.8 کلو گھریلو</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={return11k ? return11k : ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const raw = e.target.value.trim();
                    setReturn11k(raw === '' ? 0 : Math.max(0, Number(raw)));
                  }}
                  className="w-full bg-white border border-amber-300 rounded-lg p-1.5 text-center font-mono font-bold text-amber-950"
                />
                <span className="text-[9px] text-slate-500 font-urdu block text-center mt-0.5">
                  باقی: {newEmpty11k}
                </span>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-urdu block">45.4 کلو کمرشل</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={return45k ? return45k : ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const raw = e.target.value.trim();
                    setReturn45k(raw === '' ? 0 : Math.max(0, Number(raw)));
                  }}
                  className="w-full bg-white border border-amber-300 rounded-lg p-1.5 text-center font-mono font-bold text-amber-950"
                />
                <span className="text-[9px] text-slate-500 font-urdu block text-center mt-0.5">
                  باقی: {newEmpty45k}
                </span>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-urdu block">چھوٹا سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={returnMini ? returnMini : ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const raw = e.target.value.trim();
                    setReturnMini(raw === '' ? 0 : Math.max(0, Number(raw)));
                  }}
                  className="w-full bg-white border border-amber-300 rounded-lg p-1.5 text-center font-mono font-bold text-amber-950"
                />
                <span className="text-[9px] text-slate-500 font-urdu block text-center mt-0.5">
                  باقی: {newEmptyMini}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-600 font-urdu block mb-1">نوٹ / تفصیل:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-urdu"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl font-urdu"
            >
              کینسل
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-urdu flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
            >
              <Check className="w-4 h-4" />
              <span>وصولی اندراج کریں (Save Receipt)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
