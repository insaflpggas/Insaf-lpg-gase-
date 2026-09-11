import React, { useState } from 'react';
import {
  FileText,
  Search,
  Printer,
  Plus,
  Calendar,
  DollarSign,
  Package,
  Layers,
  ArrowDownLeft,
  Truck,
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoicesListViewProps {
  invoices: Invoice[];
  onOpenNewInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const InvoicesListView: React.FC<InvoicesListViewProps> = ({
  invoices,
  onOpenNewInvoice,
  onViewInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Calculations for summary
  const todayStr = new Date().toISOString().split('T')[0];
  const todayInvoices = invoices.filter((inv) => inv.date === todayStr);

  const totalAllSales = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalAllCash = invoices.reduce((s, i) => s + i.cashReceived, 0);

  const todaySales = todayInvoices.reduce((s, i) => s + i.totalAmount, 0);
  const todayCash = todayInvoices.reduce((s, i) => s + i.cashReceived, 0);

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toString().includes(searchTerm) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerPhone.includes(searchTerm) ||
      (inv.vehicleNumber && inv.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDate = !dateFilter || inv.date === dateFilter;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h2 className="font-urdu text-2xl font-bold text-slate-900">
              انوائسز و بل ریکارڈ (Invoices & Sales Record)
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-urdu mt-0.5">
            تمام گاہکوں کے بلز، نقد وصولی، ادھار اور خالی سلنڈر واپسی کا مکمل ریکارڈ
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-emerald-800 font-urdu block">آج کی کل سیل (Today Sales):</span>
            <span className="text-lg font-bold font-mono text-emerald-700">
              Rs. {todaySales.toLocaleString()}
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-amber-800 font-urdu block">آج کی کیش وصولی:</span>
            <span className="text-lg font-bold font-mono text-amber-700">
              Rs. {todayCash.toLocaleString()}
            </span>
          </div>

          <button
            onClick={onOpenNewInvoice}
            id="list-new-invoice-btn"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs font-urdu flex items-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>نیا بل بنائیں (New Bill)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="بل نمبر، گاہک، فون یا گاڑی نمبر سے تلاش کریں..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-3 py-2 text-xs font-urdu focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-sans text-slate-700"
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-rose-600 font-urdu hover:underline"
            >
              فلٹر ختم
            </button>
          )}
        </div>

        <span className="text-xs text-slate-500 font-urdu">
          کل انوائسز: <strong className="font-mono">{filteredInvoices.length}</strong>
        </span>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-urdu">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-bold text-slate-700">ابھی کوئی انوائس یا بل درج نہیں ہے</p>
            <p className="text-xs text-slate-400 mt-1">نیا بل بنانے کے لیے نیچے بٹن پر کلک کریں۔ تمام ڈیٹا فریش اور ریڈی ہے۔</p>
            <button
              onClick={onOpenNewInvoice}
              className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs font-urdu shadow shadow-emerald-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>پہلا بل بنائیں (Create First Bill)</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 text-right font-urdu">بل # و تاریخ</th>
                  <th className="py-3 px-4 text-right font-urdu">گاہک کا نام</th>
                  <th className="py-3 px-4 text-right font-urdu">سلنڈر دیے</th>
                  <th className="py-3 px-4 text-center font-urdu bg-amber-50">خالی واپسی</th>
                  <th className="py-3 px-4 text-left font-urdu">موجودہ بل</th>
                  <th className="py-3 px-4 text-left font-urdu">وصول رقم</th>
                  <th className="py-3 px-4 text-left font-urdu">باقی ادھار</th>
                  <th className="py-3 px-4 text-center font-urdu">ایکشن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInvoices.map((invoice) => {
                  const totalFilled = invoice.items.reduce(
                    (s, it) => s + (it.cylinderSize === 'loose' ? 0 : (Number(it.quantityFilled) || 0)),
                    0
                  );
                  const totalEmpty = invoice.items.reduce(
                    (s, it) => s + (Number(it.emptyReturned) || 0),
                    0
                  );

                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => onViewInvoice(invoice)}
                    >
                      {/* Invoice # and Date */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-sm text-slate-900 block">
                          #{invoice.invoiceNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {invoice.date} • {invoice.time}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <span className="font-urdu font-bold text-slate-900 text-sm block">
                          {invoice.customerName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {invoice.customerPhone}
                        </span>
                      </td>

                      {/* Filled Cylinders */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {invoice.items.map((it, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-urdu font-medium"
                            >
                              {it.cylinderSize === 'loose'
                                ? `${it.weightKg} کلو گیس`
                                : `${it.quantityFilled} x ${
                                    it.cylinderSize === '11.8kg'
                                      ? '11.8k'
                                      : it.cylinderSize === '45.4kg'
                                      ? '45.4k'
                                      : 'چھوٹا'
                                  }`}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Empty Returned */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-900 bg-amber-50/50">
                        {totalEmpty} <span className="text-[10px] font-urdu font-normal">سلنڈر</span>
                      </td>

                      {/* Bill Total */}
                      <td className="py-3 px-4 text-left font-mono font-bold text-slate-900">
                        Rs. {invoice.totalAmount.toLocaleString()}
                      </td>

                      {/* Cash Received */}
                      <td className="py-3 px-4 text-left font-mono font-bold text-emerald-700">
                        Rs. {invoice.cashReceived.toLocaleString()}
                      </td>

                      {/* Remaining Balance */}
                      <td className="py-3 px-4 text-left font-mono font-bold text-rose-600">
                        Rs. {invoice.remainingBalance.toLocaleString()}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onViewInvoice(invoice)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-urdu font-bold flex items-center gap-1 mx-auto transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600" />
                          <span>پرنٹ بل</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
