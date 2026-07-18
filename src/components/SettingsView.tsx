/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Settings,
  Building,
  Globe,
  DollarSign,
  Palette,
  Shield,
  Save,
  Check,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, theme, toggleTheme } = useApp();

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [currency, setCurrency] = useState(settings.currency);
  const [gstRate, setGstRate] = useState(settings.gstRate);
  const [language, setLanguage] = useState(settings.language);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [brandColor, setBrandColor] = useState(settings.brandColors);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      currency,
      gstRate: Number(gstRate),
      language,
      timezone,
      brandColors: brandColor,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6" id="settings-view-container">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Customize corporate brand elements, set active regional locales, and adjust tax brackets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Brand Configurations */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-gray-50 dark:border-gray-800 pb-2.5">
              <Building className="w-4 h-4 text-indigo-500" /> Agency Identity & Brand
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Agency Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Brand Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-10 h-9 p-0 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1 text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-gray-50 dark:border-gray-800 pb-2.5">
              <Globe className="w-4 h-4 text-blue-500" /> Localizations & Regional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">System Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                  <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
                  <option value="PST (UTC-8:00)">PST (UTC-8:00)</option>
                  <option value="GMT (UTC+0:00)">GMT (UTC+0:00)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Display Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish (ES)">Spanish (ES)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Currency and Tax */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-gray-50 dark:border-gray-800 pb-2.5">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Currency & Tax Audit
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Base Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Default GST / Tax Rate (%)</label>
                <input
                  type="number"
                  required
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Trigger button */}
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-indigo-500/10"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Branding Settings Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save System Settings
              </>
            )}
          </button>
        </form>

        {/* Visual appearance adjustments */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4 text-xs">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-gray-50 dark:border-gray-800 pb-2.5">
              <Palette className="w-4 h-4 text-indigo-500" /> Interface Style
            </h3>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Cosmic Palette (Default)</p>
                <p className="text-[10px] text-gray-400 mt-0.5">The agency uses the unified premium dark cosmic theme.</p>
              </div>

              <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold font-mono text-[10px]">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4 text-xs">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-gray-50 dark:border-gray-800 pb-2.5">
              <Shield className="w-4 h-4 text-red-500" /> Security Shaders
            </h3>

            <p className="text-gray-400 text-[11px] leading-relaxed">
              AgencyOS operates fully secure tenants utilizing local storage persistence matrices and sandboxed frames encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
