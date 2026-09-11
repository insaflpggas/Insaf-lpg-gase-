import React, { useState } from 'react';
import { X, Send, Truck, Factory, AlertCircle } from 'lucide-react';
import { FillingPlant, StockState } from '../types';

interface PlantSendEmptyModalProps {
  isOpen: boolean;
  plants: FillingPlant[];
  stock: StockState;
  onClose: () => void;
  onSendEmpties: (
    plantId: string,
    sent: { '11.8kg': number; '45.4kg': number; mini: number },
    vehicle: string,
    driver: string,
    notes: string
  ) => void;
}

export const PlantSendEmptyModal: React.FC<PlantSendEmptyModalProps> = ({
  isOpen,
  plants,
  stock,
  onClose,
  onSendEmpties,
}) => {
  if (!isOpen) return null;

  const [selectedPlantId, setSelectedPlantId] = useState<string>(plants[0]?.id || '');
  const [count11k, setCount11k] = useState<number>(Math.min(10, stock['11.8kg'].emptyShop));
  const [count45k, setCount45k] = useState<number>(Math.min(5, stock['45.4kg'].emptyShop));
  const [countMini, setCountMini] = useState<number>(0);
  const [vehicle, setVehicle] = useState<string>('مزدہ ٹرک LHR-3142');
  const [driver, setDriver] = useState<string>('شاہد ڈرائیور');
  const [notes, setNotes] = useState<string>('بھرائی کے لیے خالی سلنڈر بھیجے');

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlantId) return;

    onSendEmpties(
      selectedPlantId,
      {
        '11.8kg': Number(count11k) || 0,
        '45.4kg': Number(count45k) || 0,
        mini: Number(countMini) || 0,
      },
      vehicle,
      driver,
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
              پلانٹ پر خالی سلنڈر بھیجیں (Send Empties to Plant)
            </h3>
            <p className="text-xs text-amber-300 font-urdu mt-0.5">
              بھرائی کے لیے گودام سے پلانٹ روانگی
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
              فلنگ پلانٹ کا انتخاب کریں (Select Plant): *
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-urdu font-semibold"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.location}
                </option>
              ))}
            </select>
          </div>

          {/* Shop Available Empties Reminder */}
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs font-urdu">
            <p className="font-bold text-amber-950">دکان پر موجود خالی سلنڈر:</p>
            <p className="text-amber-800 font-mono mt-0.5">
              11.8k دستیاب: <strong>{stock['11.8kg'].emptyShop}</strong> | 
              45.4k دستیاب: <strong>{stock['45.4kg'].emptyShop}</strong> | 
              چھوٹے دستیاب: <strong>{stock['mini'].emptyShop}</strong>
            </p>
          </div>

          {/* Quantities to Send */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 font-urdu block">
              کتنے خالی سلنڈر بھیج رہے ہیں؟
            </label>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-600 font-urdu block mb-1">11.8 کلو گھریلو</label>
                <input
                  type="number"
                  min="0"
                  value={count11k}
                  onChange={(e) => setCount11k(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-urdu block mb-1">45.4 کلو کمرشل</label>
                <input
                  type="number"
                  min="0"
                  value={count45k}
                  onChange={(e) => setCount45k(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-urdu block mb-1">چھوٹا سلنڈر</label>
                <input
                  type="number"
                  min="0"
                  value={countMini}
                  onChange={(e) => setCountMini(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 text-center"
                />
              </div>
            </div>
          </div>

          {/* Vehicle and Driver */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">گاڑی / ٹرک نمبر</label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-urdu"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">ڈرائیور کا نام</label>
              <input
                type="text"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-urdu"
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
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold font-urdu flex items-center gap-1.5 shadow"
            >
              <Send className="w-4 h-4" />
              <span>روانگی محفوظ کریں (Record Dispatch)</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
