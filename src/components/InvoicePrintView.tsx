import React from 'react';
import { Printer, X, Download, Share2, Check } from 'lucide-react';
import { Invoice, ShopProfile } from '../types';

interface InvoicePrintViewProps {
  invoice: Invoice | null;
  profile: ShopProfile;
  onClose: () => void;
}

export const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({
  invoice,
  profile,
  onClose,
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-urdu text-base font-bold">انوائس پرنٹ منظر (Print Invoice)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="print-invoice-action-btn"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>پرنٹ کریں (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 overflow-y-auto print-receipt bg-white text-slate-900" id="printable-invoice">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <p className="text-xs font-semibold text-slate-600 font-arabic">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Prominent App Name as requested */}
            <h1 className="font-urdu text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-1">
              {profile.nameUrdu}
            </h1>
            <p className="text-xs font-bold text-slate-700 tracking-wider uppercase font-sans">
              {profile.nameEn}
            </p>

            {/* Quranic Verse directly below name as requested */}
            <div className="mt-1.5 py-1 px-2 bg-slate-100 rounded-lg border border-slate-300">
              <p className="font-arabic text-sm sm:text-base font-bold text-slate-900">
                « {profile.ayatArabic} »
              </p>
              <p className="font-urdu text-[11px] text-slate-700 mt-0.5">
                {profile.ayatUrdu}
              </p>
            </div>

            <p className="font-urdu text-xs font-bold text-slate-800 mt-1.5">
              پروپرائیٹر: {profile.ownerName}
            </p>

            <div className="flex items-center justify-center gap-3 text-xs text-slate-700 mt-1 flex-wrap">
              <span dir="ltr"><strong>فون:</strong> {profile.phone1} (رضوان خان) • {profile.phone2} (سکندر خان)</span>
              <span>•</span>
              <span><strong>پتہ:</strong> {profile.address}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              {profile.ograLicense}
            </p>
          </div>

          {/* Invoice Meta Bar */}
          <div className="grid grid-cols-2 gap-2 py-2.5 border-b border-dashed border-slate-300 text-xs">
            <div>
              <p><strong>بل نمبر (Invoice #):</strong> <span className="font-mono font-bold text-sm">#{invoice.invoiceNumber}</span></p>
              <p><strong>گاہک کا نام:</strong> <span className="font-urdu font-bold text-sm">{invoice.customerName}</span></p>
              <p><strong>فون نمبر:</strong> <span className="font-mono">{invoice.customerPhone}</span></p>
              <p><strong>پتہ / علاقہ:</strong> {invoice.customerAddress}</p>
            </div>

            <div className="text-left sm:text-right" dir="ltr">
              <p><strong>Date:</strong> {invoice.date} {invoice.time}</p>
              {invoice.vehicleNumber && (
                <p><strong>Vehicle/Delivery:</strong> {invoice.vehicleNumber}</p>
              )}
              {invoice.driverName && (
                <p><strong>Salesman/Driver:</strong> {invoice.driverName}</p>
              )}
              <p><strong>Payment:</strong> <span className="uppercase font-semibold">{invoice.paymentMethod}</span></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-3">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 bg-slate-100 text-slate-900 font-bold">
                  <th className="py-1.5 px-2 text-right font-urdu">تفصیل سلنڈر / گیس</th>
                  <th className="py-1.5 px-2 text-center font-urdu">بھرے دیے</th>
                  <th className="py-1.5 px-2 text-center font-urdu">ریٹ</th>
                  <th className="py-1.5 px-2 text-center font-urdu bg-amber-50">خالی لیے</th>
                  <th className="py-1.5 px-2 text-left font-urdu">رقم (روپے)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-2 font-urdu font-medium">
                      {item.cylinderSize === '11.8kg' && '11.8 کلو گھریلو سلنڈر (Domestic)'}
                      {item.cylinderSize === '45.4kg' && '45.4 کلو کمرشل سلنڈر (Commercial)'}
                      {item.cylinderSize === 'mini' && 'چھوٹا سلنڈر 4 تا 6 کلو (Mini)'}
                      {item.cylinderSize === 'loose' && `کھلی گیس (${item.weightKg} کلو)`}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-emerald-800">
                      {item.cylinderSize === 'loose' ? `${item.weightKg} kg` : item.quantityFilled}
                    </td>
                    <td className="py-2 px-2 text-center font-mono">
                      Rs. {item.rate.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold bg-amber-50 text-amber-900">
                      {item.emptyReturned || 0}
                    </td>
                    <td className="py-2 px-2 text-left font-mono font-bold">
                      Rs. {item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="border-t-2 border-slate-900 pt-2 space-y-1 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="font-urdu">اس بل کی کل رقم (Current Bill):</span>
              <span className="font-mono font-bold">Rs. {invoice.totalAmount.toLocaleString()}</span>
            </div>

            {invoice.previousBalance !== 0 && (
              <div className="flex justify-between py-0.5 text-slate-700">
                <span className="font-urdu">پچھلا بقایا / ادھار (Old Khata Balance):</span>
                <span className="font-mono font-bold text-rose-600">
                  Rs. {invoice.previousBalance.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 bg-slate-100 px-2 rounded font-bold text-sm">
              <span className="font-urdu">کل واجب الادا رقم (Net Total Amount):</span>
              <span className="font-mono text-slate-950">
                Rs. {invoice.netTotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-0.5 text-emerald-800">
              <span className="font-urdu font-semibold">موقع پر نقد وصولی (Cash Received):</span>
              <span className="font-mono font-bold">
                - Rs. {invoice.cashReceived.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-t border-b border-slate-400 font-bold text-base bg-rose-50 px-2 rounded">
              <span className="font-urdu text-rose-900">موجودہ بقایا رقم (Remaining Balance):</span>
              <span className="font-mono text-rose-700">
                Rs. {invoice.remainingBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Empty Cylinder Accountability Section */}
          <div className="mt-3 p-2.5 bg-amber-50/80 border border-amber-300 rounded-xl text-xs">
            <p className="font-urdu font-bold text-amber-950 mb-1">
              خالی سلنڈرز کا حساب کتاب (Empty Cylinders Accountability):
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="bg-white p-1 rounded border border-amber-200">
                <span className="text-slate-500 font-urdu block">11.8 کلو گھریلو:</span>
                <strong className="font-mono text-sm text-slate-900">
                  {invoice.newEmptyDue['11.8kg']} سلنڈر
                </strong>
                <span className="text-[9px] text-slate-400 block font-urdu">گاہک کے پاس بقایا</span>
              </div>

              <div className="bg-white p-1 rounded border border-amber-200">
                <span className="text-slate-500 font-urdu block">45.4 کلو کمرشل:</span>
                <strong className="font-mono text-sm text-slate-900">
                  {invoice.newEmptyDue['45.4kg']} سلنڈر
                </strong>
                <span className="text-[9px] text-slate-400 block font-urdu">گاہک کے پاس بقایا</span>
              </div>

              <div className="bg-white p-1 rounded border border-amber-200">
                <span className="text-slate-500 font-urdu block">چھوٹا سلنڈر:</span>
                <strong className="font-mono text-sm text-slate-900">
                  {invoice.newEmptyDue['mini']} سلنڈر
                </strong>
                <span className="text-[9px] text-slate-400 block font-urdu">گاہک کے پاس بقایا</span>
              </div>
            </div>
          </div>

          {/* Notes / Special Instructions */}
          {invoice.notes && (
            <div className="mt-2 text-xs font-urdu text-slate-700 bg-slate-50 p-2 rounded border">
              <strong>نوٹ:</strong> {invoice.notes}
            </div>
          )}

          {/* Safety Notice & Signatures */}
          <div className="mt-5 pt-3 border-t border-slate-300">
            <p className="text-[10px] text-slate-500 font-urdu text-center leading-relaxed">
              نوٹ: خالی سلنڈر گیس ایجنسی کی ملکیت ہیں۔ سلنڈر وصول کرتے وقت سیل اور لیکج لازمی چیک فرمائیں۔ گیس کے جلتے ہوئے سلنڈر کے قریب تمباکو نوشی ممنوع ہے۔
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-4 text-xs font-urdu text-center">
              <div className="border-t border-slate-400 pt-1">
                دستخط و مہر دکاندار (Proprietor)
              </div>
              <div className="border-t border-slate-400 pt-1">
                دستخط وصول کنندہ گاہک (Receiver Signature)
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="bg-slate-100 px-5 py-3 border-t flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl font-urdu"
          >
            بند کریں (Close)
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl font-urdu flex items-center gap-1.5 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>پرنٹ کریں (Print)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
