import React from 'react';
import { Flame, Phone, MapPin, Printer, ShieldCheck, Plus, RefreshCw, Settings, Database } from 'lucide-react';
import { ShopProfile } from '../types';

interface HeaderProps {
  profile: ShopProfile;
  onNewInvoice: () => void;
  onOpenSettings: () => void;
  onRefreshData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onNewInvoice,
  onOpenSettings,
  onRefreshData,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border-b border-emerald-500/20 no-print">
      {/* Top Quranic Verse Banner - Prominent & Beautiful as requested */}
      <div className="bg-emerald-900/60 border-b border-emerald-500/30 py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-xs text-emerald-200/90 font-medium tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          </div>

          <div className="text-center px-2">
            <p className="font-arabic text-lg md:text-xl font-bold text-amber-300 tracking-wide drop-shadow-sm">
              « {profile.ayatArabic} »
            </p>
            <p className="font-urdu text-xs md:text-sm text-emerald-100/90 mt-0.5">
              {profile.ayatUrdu}
            </p>
          </div>

          <div className="text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-600/40 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{profile.ograLicense}</span>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-950/50 flex-shrink-0 mt-1 sm:mt-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Flame className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              {/* Main Agency Name in Clean Urdu Typography */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-urdu text-2xl sm:text-3xl font-bold tracking-normal text-white drop-shadow-sm leading-normal pt-0.5">
                  {profile.nameUrdu}
                </h1>
                <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/40 font-urdu">
                  ایل پی جی گیس ایجنسی
                </span>
              </div>

              {/* English Name & Proprietors */}
              <div className="text-xs sm:text-sm text-emerald-200 font-medium flex items-center gap-2 flex-wrap font-urdu">
                <span className="font-sans font-bold tracking-wider text-emerald-300 uppercase text-[11px] sm:text-xs">
                  {profile.nameEn}
                </span>
                <span className="text-emerald-400/60">•</span>
                <span className="text-amber-200/90 font-semibold">
                  پروپرائیٹر: {profile.ownerName}
                </span>
              </div>

              {/* Phone Numbers & Location */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs text-slate-300 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/70">
                    <Phone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span dir="ltr" className="font-mono text-emerald-300 font-bold">{profile.phone1}</span>
                    <span className="text-[10px] text-slate-400 font-urdu">(رضوان خان)</span>
                  </span>

                  <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/70">
                    <Phone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span dir="ltr" className="font-mono text-emerald-300 font-bold">{profile.phone2}</span>
                    <span className="text-[10px] text-slate-400 font-urdu">(سکندر خان)</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-300 font-urdu">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{profile.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 self-end md:self-center flex-wrap">
            <button
              onClick={onNewInvoice}
              id="header-new-bill-btn"
              className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Plus className="w-5 h-5 text-slate-950" />
              <span className="font-urdu text-base font-bold">نیا بل بنائیں</span>
              <span className="text-xs bg-slate-950/20 px-1.5 py-0.5 rounded font-mono">Invoice</span>
            </button>

            <button
              onClick={onOpenSettings}
              id="header-settings-btn"
              title="Shop Settings & Data Backup"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors flex items-center gap-1.5 text-xs"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">سیٹنگز</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-5 border-t border-slate-800/80 pt-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-1.5 sm:space-x-2">
            {[
              { id: 'invoices', labelUrdu: 'انوائسز و بل لسٹ', labelEn: 'Invoices', badge: 'بل' },
              { id: 'customers', labelUrdu: 'گاہک و ادھار کھاتہ', labelEn: 'Customers Khata', badge: 'کھاتہ' },
              { id: 'stock', labelUrdu: 'سلنڈر و گیس سٹاک', labelEn: 'Stock Inventory', badge: 'سٹاک' },
              { id: 'plants', labelUrdu: 'فلنگ پلانٹس کھاتہ', labelEn: 'Filling Plants', badge: 'پلانٹ' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-urdu text-sm sm:text-base">{tab.labelUrdu}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                    isActive ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.labelEn}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
