import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Save, Building, Type } from 'lucide-react';
import { UserProfile, AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  appSettings: AppSettings;
  onSave: (profile: UserProfile, settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, userProfile, appSettings, onSave }) => {
  const [profileData, setProfileData] = useState<UserProfile>(userProfile);
  const [settingsData, setSettingsData] = useState<AppSettings>(appSettings);

  useEffect(() => {
    if (isOpen) {
      setProfileData(userProfile);
      setSettingsData(appSettings);
    }
  }, [isOpen, userProfile, appSettings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profileData, settingsData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            Pengaturan Aplikasi
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Section: Profil Pengguna */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Profil Pengguna
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                  placeholder="Nama Anda"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                  placeholder="email@perusahaan.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan / Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  disabled
                  value={profileData.role}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section: Branding Aplikasi */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              Branding Dashboard
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Utama (Baris 1)</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={settingsData.appName}
                  onChange={(e) => setSettingsData({...settingsData, appName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                  placeholder="Contoh: KONSTRUKSI"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-judul (Baris 2)</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={settingsData.companyName}
                  onChange={(e) => setSettingsData({...settingsData, companyName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                  placeholder="Contoh: PRO MASTER"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all text-sm flex items-center gap-2"
            >
              <Save size={16} />
              Simpan Semua
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};