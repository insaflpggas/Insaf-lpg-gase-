import React, { useState } from 'react';
import { X, Save, Download, Upload, RotateCcw, ShieldCheck, Check, Database } from 'lucide-react';
import { ShopProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  profile: ShopProfile;
  onClose: () => void;
  onSaveProfile: (profile: ShopProfile) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile,
  onExportData,
  onImportData,
  onResetData,
}) => {
  if (!isOpen) return null;

  const [localProfile, setLocalProfile] = useState<ShopProfile>({ ...profile });
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(localProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    onImportData(importJsonText.trim());
    setShowImportArea(false);
    setImportJsonText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-urdu text-xl font-bold">
              ایجنسی سیٹنگز و بیک اپ (Agency Settings & Backup)
            </h3>
            <p className="text-xs text-emerald-300 font-urdu mt-0.5">
              دکان کا نام، قرآنی آیت، رابطہ نمبرز اور ڈیٹا محفوظ کرنے کا انتظام
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Shop Name & Verse */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-urdu font-bold text-slate-900 text-sm">
              ایجنسی کا نام و قرآنی آیت (Name & Quranic Verse)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">
                  ایجنسی کا نام (اردو) *
                </label>
                <input
                  type="text"
                  required
                  value={localProfile.nameUrdu}
                  onChange={(e) => setLocalProfile({ ...localProfile, nameUrdu: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-urdu font-bold text-base text-emerald-950"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">
                  نام (English)
                </label>
                <input
                  type="text"
                  value={localProfile.nameEn}
                  onChange={(e) => setLocalProfile({ ...localProfile, nameEn: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-sans font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">
                قرآنی آیت (عربی متن) *
              </label>
              <input
                type="text"
                required
                value={localProfile.ayatArabic}
                onChange={(e) => setLocalProfile({ ...localProfile, ayatArabic: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-arabic text-sm text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-urdu block mb-1">
                قرآنی آیت کا اردو ترجمہ و حوالہ *
              </label>
              <input
                type="text"
                required
                value={localProfile.ayatUrdu}
                onChange={(e) => setLocalProfile({ ...localProfile, ayatUrdu: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-urdu text-xs text-slate-700"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-urdu font-bold text-slate-900 text-sm">
              رابطہ و قانونی تفصیلات (Contact & License)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">مالک / پروپرائیٹر کا نام</label>
                <input
                  type="text"
                  value={localProfile.ownerName}
                  onChange={(e) => setLocalProfile({ ...localProfile, ownerName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-urdu"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">اوگرا لائسنس نمبر (OGRA Reg)</label>
                <input
                  type="text"
                  value={localProfile.ograLicense}
                  onChange={(e) => setLocalProfile({ ...localProfile, ograLicense: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">موبائل فون 1</label>
                <input
                  type="text"
                  value={localProfile.phone1}
                  onChange={(e) => setLocalProfile({ ...localProfile, phone1: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">موبائل فون 2</label>
                <input
                  type="text"
                  value={localProfile.phone2}
                  onChange={(e) => setLocalProfile({ ...localProfile, phone2: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-600 font-urdu block mb-1">ایجنسی کا پتہ / لوکیشن</label>
                <input
                  type="text"
                  value={localProfile.address}
                  onChange={(e) => setLocalProfile({ ...localProfile, address: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-urdu"
                />
              </div>
            </div>
          </div>

          {/* Backup & Restore Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-urdu font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>ڈیٹا بیک اپ و بحالی (Backup & Data Protection)</span>
            </h4>
            <p className="text-xs text-slate-500 font-urdu">
              اپنے تمام گاہکوں، بلز، سٹاک اور پلانٹس کے کھاتوں کی بیک اپ فائل محفوظ کریں یا بحال کریں۔
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={onExportData}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-urdu flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>بیک اپ فائل ڈاؤن لوڈ کریں (Export)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImportArea(!showImportArea)}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold font-urdu flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>بیک اپ بحال کریں (Restore)</span>
              </button>

              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold font-urdu flex items-center gap-1 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>سارا ڈیٹا صاف / فریش کریں</span>
                </button>
              ) : (
                <div className="bg-rose-50 border border-rose-300 p-2.5 rounded-xl flex items-center gap-2 ml-auto text-xs font-urdu animate-in fade-in">
                  <span className="text-rose-900 font-bold">کیا سارا ڈیٹا صاف کر کے بالکل فریش شروع کرنا ہے؟</span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetData();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                  >
                    ہاں، صاف کریں
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-2.5 py-1 rounded-lg text-xs"
                  >
                    کینسل
                  </button>
                </div>
              )}
            </div>

            {showImportArea && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <label className="text-xs font-urdu font-bold text-slate-700 block">
                  بیک اپ JSON متن یہاں پیسٹ کریں:
                </label>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='{"stock": ..., "customers": ...}'
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={handleImport}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold font-urdu"
                >
                  ڈیٹا لوڈ کریں
                </button>
              </div>
            )}
          </div>

          {/* Footer Save Button */}
          <div className="flex items-center justify-between pt-2 border-t">
            {savedSuccess ? (
              <span className="text-xs font-bold font-urdu text-emerald-700 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>تبدیلیاں کامیابی سے محفوظ ہو گئیں!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-urdu">
                یہ معلومات انوائس پرنٹ پر بھی ظاہر ہوں گی۔
              </span>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl font-urdu"
              >
                بند کریں
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-urdu flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" />
                <span>سیٹنگز محفوظ کریں</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
