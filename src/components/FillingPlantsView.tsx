import React, { useState } from 'react';
import {
  Factory,
  Plus,
  Send,
  Layers,
  ArrowUpRight,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { FillingPlant, PlantTransaction } from '../types';

interface FillingPlantsViewProps {
  plants: FillingPlant[];
  plantTransactions: PlantTransaction[];
  onOpenSendPlant: () => void;
  onOpenReceivePlant: () => void;
  onAddPlant: (plant: FillingPlant) => void;
  onPlantPayment: (plantId: string, amount: number, notes: string) => void;
}

export const FillingPlantsView: React.FC<FillingPlantsViewProps> = ({
  plants,
  plantTransactions,
  onOpenSendPlant,
  onOpenReceivePlant,
  onAddPlant,
  onPlantPayment,
}) => {
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantPhone, setNewPlantPhone] = useState('');
  const [newPlantLocation, setNewPlantLocation] = useState('');
  const [newPlantContact, setNewPlantContact] = useState('');
  const [newPlantRate, setNewPlantRate] = useState<number>(245);

  // Payment to plant state
  const [payingPlantId, setPayingPlantId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState<string>('پلانٹ کو ادائیگی');

  // Totals
  const totalCylindersAtPlants = plants.reduce(
    (s, p) =>
      s +
      (p.cylindersPending['11.8kg'] || 0) +
      (p.cylindersPending['45.4kg'] || 0) +
      (p.cylindersPending['mini'] || 0),
    0
  );
  const totalPlantPayables = plants.reduce((s, p) => s + p.currentPayable, 0);

  const handleAddPlantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlantName.trim()) return;

    const plant: FillingPlant = {
      id: `PLANT-${Date.now().toString().slice(-4)}`,
      name: newPlantName.trim(),
      phone: newPlantPhone.trim() || '042-0000000',
      location: newPlantLocation.trim() || 'لاہور / جی ٹی روڈ',
      contactPerson: newPlantContact.trim() || 'مینیجر',
      currentPayable: 0,
      cylindersPending: {
        '11.8kg': 0,
        '45.4kg': 0,
        mini: 0,
      },
      ratePerKg: Number(newPlantRate) || 245,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddPlant(plant);
    setIsAddingPlant(false);
    setNewPlantName('');
    setNewPlantPhone('');
    setNewPlantLocation('');
    setNewPlantContact('');
  };

  const handlePayPlantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingPlantId || paymentAmount <= 0) return;
    onPlantPayment(payingPlantId, Number(paymentAmount), paymentNotes);
    setPayingPlantId(null);
    setPaymentAmount(0);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Factory className="w-6 h-6 text-emerald-600" />
            <h2 className="font-urdu text-2xl font-bold text-slate-900">
              ایل پی جی فلنگ پلانٹس و ٹرمینلز (Filling Plants Management)
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-urdu mt-0.5">
            بھرائی کے لیے گئے خالی سلنڈر، پلانٹس کے بل اور ادائیگیوں کا ریکارڈ
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-cyan-50 border border-cyan-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-cyan-800 font-urdu block">پلانٹس پر زیرِ بھرائی سلنڈر:</span>
            <span className="text-lg font-bold font-mono text-cyan-700">
              {totalCylindersAtPlants} <span className="text-xs font-urdu">سلنڈر</span>
            </span>
          </div>

          <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-purple-800 font-urdu block">پلانٹس کو کل قابلِ ادا رقم:</span>
            <span className="text-lg font-bold font-mono text-purple-700">
              Rs. {totalPlantPayables.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setIsAddingPlant(!isAddingPlant)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>نیا پلانٹ شامل کریں</span>
          </button>
        </div>
      </div>

      {/* Add New Plant Form */}
      {isAddingPlant && (
        <form onSubmit={handleAddPlantSubmit} className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-lg space-y-3">
          <h3 className="font-urdu text-base font-bold text-slate-900">
            نیا ایل پی جی فلنگ پلانٹ درج کریں:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">پلانٹ کا نام *</label>
              <input
                type="text"
                required
                placeholder="مثلاً: PSO LPG Plant / پارکو ٹرمینل"
                value={newPlantName}
                onChange={(e) => setNewPlantName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-urdu"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">فون نمبر / رابطہ</label>
              <input
                type="text"
                placeholder="042-35889900"
                value={newPlantPhone}
                onChange={(e) => setNewPlantPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">مقام / پتہ</label>
              <input
                type="text"
                placeholder="جی ٹی روڈ، کالا شاہ کاکو"
                value={newPlantLocation}
                onChange={(e) => setNewPlantLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-urdu"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">رابطہ کار (Person)</label>
              <input
                type="text"
                placeholder="مینیجر ارشد صاحب"
                value={newPlantContact}
                onChange={(e) => setNewPlantContact(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-urdu"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">گیس ریٹ فی کلو (روپے)</label>
              <input
                type="number"
                value={newPlantRate}
                onChange={(e) => setNewPlantRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsAddingPlant(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-urdu"
            >
              کینسل
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-urdu shadow"
            >
              پلانٹ محفوظ کریں
            </button>
          </div>
        </form>
      )}

      {/* Pay Plant Modal / Popup */}
      {payingPlantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handlePayPlantSubmit} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-3">
            <h3 className="font-urdu text-lg font-bold text-slate-900">
              پلانٹ کو ادائیگی ریکارڈ کریں (Pay Plant)
            </h3>
            <div>
              <label className="text-xs text-slate-600 font-urdu block mb-1">رقم (روپے):</label>
              <input
                type="number"
                min="1"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border-2 border-purple-400 rounded-xl p-2.5 font-mono font-bold text-lg text-purple-950"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-urdu block mb-1">تفصیل / بینک حوالہ:</label>
              <input
                type="text"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-urdu"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPayingPlantId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 font-urdu"
              >
                کینسل
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold font-urdu shadow"
              >
                ادائیگی درج کریں
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plants.map((plant) => {
          const totalAtThisPlant =
            (plant.cylindersPending['11.8kg'] || 0) +
            (plant.cylindersPending['45.4kg'] || 0) +
            (plant.cylindersPending['mini'] || 0);

          return (
            <div
              key={plant.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-cyan-300 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-urdu text-xl font-bold text-slate-900">{plant.name}</h3>
                    <p className="text-xs text-slate-500 font-urdu mt-0.5">{plant.contactPerson}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded">
                    {plant.id}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1 mt-2">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span dir="ltr">{plant.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{plant.location}</span>
                  </p>
                </div>
              </div>

              {/* Counts & Ledger */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                
                {/* Pending Cylinders */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-700 font-urdu mb-1">
                    <span className="font-bold">اس پلانٹ پر خالی سلنڈر:</span>
                    <span className="font-mono font-bold text-cyan-800">{totalAtThisPlant} سلنڈر</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[9px] font-urdu">11.8k</span>
                      <strong className="text-slate-900">{plant.cylindersPending['11.8kg']}</strong>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[9px] font-urdu">45.4k</span>
                      <strong className="text-slate-900">{plant.cylindersPending['45.4kg']}</strong>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[9px] font-urdu">چھوٹے</span>
                      <strong className="text-slate-900">{plant.cylindersPending['mini']}</strong>
                    </div>
                  </div>
                </div>

                {/* Payable to Plant */}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-urdu">پلانٹ کا بقایا کھاتہ:</span>
                  <span className="text-base font-mono font-extrabold text-purple-700">
                    Rs. {plant.currentPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Plant Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setPayingPlantId(plant.id);
                    setPaymentAmount(plant.currentPayable > 0 ? plant.currentPayable : 0);
                  }}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 py-1.5 px-2 rounded-xl text-xs font-bold font-urdu flex items-center justify-center gap-1 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>ادائیگی درج کریں</span>
                </button>

                <button
                  onClick={onOpenSendPlant}
                  className="bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-2 rounded-xl text-xs font-bold font-urdu flex items-center justify-center gap-1 shadow transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>خالی بھیجیں</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Recent Plant Transactions Log */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-urdu text-lg font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          <span>پلانٹ آمد و روانگی ریکارڈ (Plant Dispatches & Receipts Log)</span>
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b">
                <th className="py-2.5 px-3 text-right font-urdu">تاریخ و وقت</th>
                <th className="py-2.5 px-3 text-right font-urdu">پلانٹ کا نام</th>
                <th className="py-2.5 px-3 text-center font-urdu">عمل (Action)</th>
                <th className="py-2.5 px-3 text-right font-urdu">سلنڈر تفصیل</th>
                <th className="py-2.5 px-3 text-left font-urdu">بل رقم</th>
                <th className="py-2.5 px-3 text-left font-urdu">ادا شدہ رقم</th>
                <th className="py-2.5 px-3 text-right font-urdu">گاڑی / نوٹ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {plantTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono">
                    <span className="font-bold text-slate-800">{tx.date}</span>
                    <span className="text-[10px] text-slate-400 block">{tx.time}</span>
                  </td>
                  <td className="py-2.5 px-3 font-urdu font-medium text-slate-900">
                    {tx.plantName}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {tx.action === 'send_empty' ? (
                      <span className="bg-amber-100 text-amber-900 font-urdu font-bold px-2 py-0.5 rounded text-[11px]">
                        خالی سلنڈر بھیجے
                      </span>
                    ) : tx.action === 'receive_filled' ? (
                      <span className="bg-emerald-100 text-emerald-900 font-urdu font-bold px-2 py-0.5 rounded text-[11px]">
                        بھرے سلنڈر وصول
                      </span>
                    ) : (
                      <span className="bg-purple-100 text-purple-900 font-urdu font-bold px-2 py-0.5 rounded text-[11px]">
                        رقم کی ادائیگی
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {tx.action === 'send_empty' && (
                      <span>
                        11.8k: {tx.cylindersSent['11.8kg']} | 45.4k: {tx.cylindersSent['45.4kg']} | Mini: {tx.cylindersSent['mini']}
                      </span>
                    )}
                    {tx.action === 'receive_filled' && (
                      <span>
                        11.8k: {tx.cylindersReceived['11.8kg']} | 45.4k: {tx.cylindersReceived['45.4kg']} | Mini: {tx.cylindersReceived['mini']}
                      </span>
                    )}
                    {tx.action === 'payment_made' && (
                      <span className="text-slate-400 font-urdu">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-900">
                    Rs. {tx.billAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-left font-mono font-bold text-emerald-700">
                    Rs. {tx.amountPaid.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-urdu">
                    {tx.driverOrBowsar || tx.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
