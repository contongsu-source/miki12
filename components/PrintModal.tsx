import React, { useState, useEffect } from 'react';
import { X, Printer, FileText } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (title: string) => void;
  initialTitle?: string;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, onPrint, initialTitle }) => {
  const [title, setTitle] = useState('');

  // Reset judul setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || 'Laporan Keuangan Proyek - Konstruksi Pro Master');
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPrint(title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Printer size={20} className="text-blue-600" />
            Cetak Laporan PDF
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Judul Laporan
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                placeholder="Masukkan judul laporan..."
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Judul ini akan muncul di bagian paling atas file PDF.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 shadow-lg shadow-slate-500/30 transition-all text-sm flex items-center gap-2"
            >
              <Printer size={16} />
              Cetak Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};