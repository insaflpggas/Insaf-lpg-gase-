import React from 'react';
import { X, Printer, Phone, MapPin, Calendar, ArrowDownLeft, Package, FileText, CheckCircle2 } from 'lucide-react';
import { Customer, Invoice, ShopProfile } from '../types';

interface CustomerDetailModalProps {
  isOpen: boolean;
  customer: Customer | null;
  invoices: Invoice[];
  profile: ShopProfile;
  onClose: () => void;
  onNewInvoiceForCustomer: (customerId: string) => void;
  onQuickPayForCustomer: (customer: Customer) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  customer,
  invoices,
  profile,
  onClose,
  onNewInvoiceForCustomer,
  onQuickPayForCustomer,
  onViewInvoice,
}) => {
  if (!isOpen || !customer) return null;

  const customerInvoices = invoices.filter((i) => i.customerId === customer.id);

  const handlePrintLedger = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <h3 className="font-urdu text-2xl font-bold">
                گاہک کھاتہ و تفصیلی لیجر (Customer Khata Ledger)
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-urdu mt-0.5">
              {customer.name} {customer.shopName ? `• ${customer.shopName}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintLedger}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>لیجر پرنٹ کریں</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 print-receipt">
          
          {/* Printable Shop Mini Header */}
          <div className="text-center pb-3 border-b-2 border-slate-900">
            <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-950">
              {profile.nameUrdu}
            </h1>
            <p className="font-arabic text-xs text-slate-700 mt-0.5 font-bold">
              « {profile.ayatArabic} »
            </p>
            <p className="text-xs text-slate-600 mt-1">
              گاہک کھاتہ اسٹیٹمنٹ • {profile.phone1} • {profile.address}
            </p>
          </div>

          {/* Customer Profile Banner */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-urdu text-xl font-bold text-slate-900">{customer.name}</h4>
              {customer.shopName && (
                <span className="text-xs bg-slate-200 text-slate-800 font-urdu px-2 py-0.5 rounded font-semibold">
                  {customer.shopName}
                </span>
              )}
              <div className="text-xs text-slate-600 space-y-1 mt-2">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span dir="ltr">{customer.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.address}</span>
                </p>
              </div>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-3 text-right sm:text-left">
              <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-sm">
                <span className="text-[10px] text-slate-500 font-urdu block">گاہک سے واجب الادا رقم:</span>
                <span className={`text-xl font-mono font-extrabold ${customer.currentBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  Rs. {customer.currentBalance.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 font-urdu block">
                  {customer.currentBalance > 0 ? 'بقایا ادھار' : 'کھاتہ صاف'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-sm">
                <span className="text-[10px] text-slate-500 font-urdu block">خالی سلنڈر کسٹمر کے پاس:</span>
                <div className="text-xs font-mono font-bold text-indigo-950 mt-1 space-y-0.5">
                  <p>11.8k: <strong className="text-indigo-600">{customer.emptyCylindersDue['11.8kg']}</strong></p>
                  <p>45.4k: <strong className="text-indigo-600">{customer.emptyCylindersDue['45.4kg']}</strong></p>
                  <p>چھوٹے: <strong className="text-indigo-600">{customer.emptyCylindersDue['mini']}</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons (Hidden on print) */}
          <div className="flex gap-2 justify-end no-print">
            <button
              onClick={() => {
                onClose();
                onQuickPayForCustomer(customer);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-urdu flex items-center gap-1.5 shadow"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>رقم و خالی سلنڈر وصولی</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNewInvoiceForCustomer(customer.id);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-urdu flex items-center gap-1.5 shadow"
            >
              <Package className="w-4 h-4" />
              <span>اس گاہک کا نیا بل بنائیں</span>
            </button>
          </div>

          {/* Invoices History Table */}
          <div>
            <h4 className="font-urdu text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>پچھلے بل و ٹرانزیکشن ہسٹری (Transaction History)</span>
            </h4>

            {customerInvoices.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 font-urdu text-sm">
                اس گاہک کے لیے ابھی تک کوئی بل یا انوائس نہیں بنائی گئی۔
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b">
                      <th className="py-2.5 px-3 text-right font-urdu">بل # و تاریخ</th>
                      <th className="py-2.5 px-3 text-right font-urdu">سلنڈر دیے</th>
                      <th className="py-2.5 px-3 text-right font-urdu bg-amber-50">خالی لیے</th>
                      <th className="py-2.5 px-3 text-left font-urdu">کل بل رقم</th>
                      <th className="py-2.5 px-3 text-left font-urdu">وصول رقم</th>
                      <th className="py-2.5 px-3 text-left font-urdu">نیا بقایا</th>
                      <th className="py-2.5 px-3 text-center font-urdu no-print">ایکشن</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {customerInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono">
                          <span className="font-bold text-slate-900 block">#{inv.invoiceNumber}</span>
                          <span className="text-[10px] text-slate-500">{inv.date} {inv.time}</span>
                        </td>
                        <td className="py-2.5 px-3 font-urdu">
                          {inv.items.map((it, i) => (
                            <span key={i} className="inline-block bg-slate-100 px-1.5 py-0.5 rounded text-[11px] ml-1">
                              {it.quantityFilled} x {it.cylinderSize}
                            </span>
                          ))}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-900 bg-amber-50/50">
                          {inv.items.reduce((s, it) => s + (it.emptyReturned || 0), 0)} سلنڈر
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-900">
                          Rs. {inv.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold text-emerald-700">
                          Rs. {inv.cashReceived.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold text-rose-600">
                          Rs. {inv.remainingBalance.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center no-print">
                          <button
                            onClick={() => onViewInvoice(inv)}
                            className="text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded text-[11px] font-urdu font-bold"
                          >
                            بل دیکھیں
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl font-urdu"
          >
            بند کریں (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
