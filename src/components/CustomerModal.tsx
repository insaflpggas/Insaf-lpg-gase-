import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { Customer } from '../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (customer: Customer) => void;
  existingCustomer?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomer,
  existingCustomer,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(existingCustomer?.name || '');
  const [shopName, setShopName] = useState(existingCustomer?.shopName || '');
  const [phone, setPhone] = useState(existingCustomer?.phone || '');
  const [address, setAddress] = useState(existingCustomer?.address || '');
  const [currentBalance, setCurrentBalance] = useState<number>(existingCustomer?.currentBalance || 0);
  const [empty11k, setEmpty11k] = useState<number>(existingCustomer?.emptyCylindersDue['11.8kg'] || 0);
  const [empty45k, setEmpty45k] = useState<number>(existingCustomer?.emptyCylindersDue['45.4kg'] || 0);
  const [emptyMini, setEmptyMini] = useState<number>(existingCustomer?.emptyCylindersDue['mini'] || 0);
  const [notes, setNotes] = useState(existingCustomer?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const customer: Customer = {
      id: existingCustomer?.id || `CUST-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      shopName: shopName.trim() || undefined,
      phone: phone.trim() || '0300-0000000',
      address: address.trim() || 'لاہور',
      currentBalance: Number(currentBalance) || 0,
      emptyCylindersDue: {
        '11.8kg': Number(empty11k) || 0,
        '45.4kg': Number(empty45k) || 0,
        mini: Number(emptyMini) || 0,
      },
      totalBilled: existingCustomer?.totalBilled || 0,
      totalPaid: existingCustomer?.totalPaid || 0,
      notes: notes.trim() || undefined,
      createdAt: existingCustomer?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSaveCustomer(customer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-urdu text-xl font-bold">
              {existingCustomer ? 'گاہک کھاتہ تبدیل کریں' : 'نیا گاہک رجسٹر کریں'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">گاہک کا نام *</label>
              <input
                type="text"
                required
                placeholder="مثلاً: ملک عثمان / حاجی اسلم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-urdu"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">دکان / ہوٹل کا نام</label>
              <input
                type="text"
                placeholder="مثلاً: عثمان ہوٹل اینڈ کیفے"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-urdu"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">موبائل فون نمبر *</label>
              <input
                type="text"
                required
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">پتہ / علاقہ</label>
              <input
                type="text"
                placeholder="مین بازار، لاہور"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-urdu"
              />
            </div>
          </div>

          {/* Initial Balances */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-urdu font-bold text-slate-800 text-xs">
              ابتدائی ادھار و خالی سلنڈر بیلنس (Opening Balances):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">
                  پہلے سے بقایا ادھار رقم (PKR)
                </label>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">
                  11.8 کلو گھریلو خالی سلنڈر
                </label>
                <input
                  type="number"
                  min="0"
                  value={empty11k}
                  onChange={(e) => setEmpty11k(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">
                  45.4 کلو کمرشل خالی سلنڈر
                </label>
                <input
                  type="number"
                  min="0"
                  value={empty45k}
                  onChange={(e) => setEmpty45k(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">
                  چھوٹا سلنڈر (4-6 کلو)
                </label>
                <input
                  type="number"
                  min="0"
                  value={emptyMini}
                  onChange={(e) => setEmptyMini(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-urdu block mb-1">خصوصی نوٹس</label>
            <input
              type="text"
              placeholder="مثلاً: ہفتہ وار بل، یا صرف کیش ڈلیوری"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-urdu"
            />
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
              <span>گاہک محفوظ کریں</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
