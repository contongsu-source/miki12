import React, { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import { Project, ProjectStatus } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initialData?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    client: '',
    location: '',
    budget: 0,
    spent: 0,
    startDate: '',
    endDate: '',
    progress: 0,
    status: ProjectStatus.PLANNING,
    manager: ''
  });

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        client: '',
        location: '',
        budget: 0,
        spent: 0,
        startDate: '',
        endDate: '',
        progress: 0,
        status: ProjectStatus.PLANNING,
        manager: ''
      });
    }
  }, [initialData, isOpen]);

  // Hitung total otomatis setiap kali budget atau spent berubah
  useEffect(() => {
    const budget = Number(formData.budget) || 0;
    const spent = Number(formData.spent) || 0;
    setBalance(budget - spent);
  }, [formData.budget, formData.spent]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.client) return;

    const newProject: Project = {
      id: initialData?.id || `PRJ-${Math.floor(Math.random() * 10000)}`,
      name: formData.name!,
      client: formData.client!,
      location: formData.location!,
      budget: Number(formData.budget),
      spent: Number(formData.spent),
      startDate: formData.startDate || '', // Allow empty string
      endDate: formData.endDate || '',     // Allow empty string
      progress: Number(formData.progress),
      status: formData.status as ProjectStatus,
      manager: formData.manager!
    };
    onSave(newProject);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            {initialData ? 'Edit Data Proyek' : 'Tambah Proyek Baru'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Proyek <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Contoh: Pembangunan Menara A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Klien <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="client"
              required
              value={formData.client}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Dana Masuk (Rp)</label>
            <input
              type="number"
              name="budget"
              min="0"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-blue-700 bg-blue-50"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dana Terpakai (Rp)</label>
            <input
              type="number"
              name="spent"
              min="0"
              value={formData.spent}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-orange-700"
              placeholder="0"
            />
          </div>

          {/* Kolom Perhitungan Otomatis */}
          <div className="col-span-1 md:col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 text-slate-600">
              <Calculator size={20} />
              <span className="font-medium text-sm">Total Otomatis (Sisa / Kurang):</span>
            </div>
            <div className={`text-xl font-bold ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
               {balance < 0 ? `Kurang: ${formatRupiah(Math.abs(balance))}` : `Sisa: ${formatRupiah(balance)}`}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tanggal Mulai <span className="text-slate-400 font-normal text-xs">(Opsional)</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estimasi Selesai <span className="text-slate-400 font-normal text-xs">(Opsional)</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.values(ProjectStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Progress (%)</label>
            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
           <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Manajer Proyek</label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};