import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  HardHat, 
  Package, 
  BrainCircuit, 
  Building2, 
  Plus, 
  Search, 
  Bell, 
  Settings, 
  ChevronRight,
  Pencil,
  Trash2,
  DollarSign,
  TrendingUp,
  Printer,
  Wallet,
  Menu
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Project, Material, ViewState, ProjectStatus, UserProfile, AppSettings } from './types';
import { INITIAL_PROJECTS, INITIAL_MATERIALS } from './constants';
import { StatsCard } from './components/StatsCard';
import { ProjectModal } from './components/ProjectModal';
import { PrintModal } from './components/PrintModal';
import { SettingsModal } from './components/SettingsModal';
import { AIAssistant } from './components/AIAssistant';

const App: React.FC = () => {
  // --- STATE INITIALIZATION WITH LOCALSTORAGE ---
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('konstruksi_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('konstruksi_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('konstruksi_user');
    return saved ? JSON.parse(saved) : {
      name: 'Admin Utama',
      email: 'admin@promaster.id',
      role: 'Administrator'
    };
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('konstruksi_settings');
    return saved ? JSON.parse(saved) : {
      appName: 'KONSTRUKSI',
      companyName: 'PRO MASTER'
    };
  });

  // --- AUTO-SAVE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('konstruksi_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('konstruksi_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('konstruksi_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('konstruksi_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  // --- UI STATES ---
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [printingProject, setPrintingProject] = useState<Project | null>(null);

  // Helper untuk inisial nama
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase();
  };

  // Derived Statistics
  const stats = useMemo(() => {
    const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
    const totalSpent = projects.reduce((acc, curr) => acc + curr.spent, 0);
    const totalBalance = totalBudget - totalSpent;
    const activeProjects = projects.filter(p => p.status === ProjectStatus.ONGOING).length;
    return { totalBudget, totalSpent, totalBalance, activeProjects };
  }, [projects]);

  const chartData = useMemo(() => {
    return projects.map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      'Dana Masuk': p.budget,
      'Terpakai': p.spent
    }));
  }, [projects]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const statusData = useMemo(() => {
    const counts = {
      [ProjectStatus.ONGOING]: 0,
      [ProjectStatus.COMPLETED]: 0,
      [ProjectStatus.PLANNING]: 0,
      [ProjectStatus.ON_HOLD]: 0,
    };
    projects.forEach(p => counts[p.status]++);
    return Object.keys(counts).map(key => ({ name: key, value: counts[key as ProjectStatus] }));
  }, [projects]);

  // CRUD Handlers
  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    } else {
      setProjects(prev => [...prev, project]);
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data proyek ini? Data yang dihapus tidak dapat dikembalikan.')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveSettings = (newProfile: UserProfile, newAppSettings: AppSettings) => {
    setUserProfile(newProfile);
    setAppSettings(newAppSettings);
  };

  const handleViewChange = (view: ViewState) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const handleExportPDF = (customTitle: string) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(customTitle, 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 30);
    doc.text(`Dicetak oleh: ${userProfile.name}`, 14, 35);

    if (printingProject) {
      const p = printingProject;
      const balance = p.budget - p.spent;
      let periodStr = (p.startDate || p.endDate) ? `${p.startDate || '?'} s/d ${p.endDate || '?'}` : '-';

      autoTable(doc, {
        startY: 40,
        head: [['Atribut', 'Detail Informasi']],
        body: [
            ['ID Proyek', p.id], ['Nama Proyek', p.name], ['Klien', p.client],
            ['Manajer', p.manager], ['Lokasi', p.location], ['Periode', periodStr],
            ['Status', p.status], ['Progress', `${p.progress}%`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });

      const finalY = (doc as any).lastAutoTable.finalY;
      autoTable(doc, {
        startY: finalY + 10,
        head: [['Kategori', 'Nominal']],
        body: [
            ['Dana Masuk', formatRupiah(p.budget)],
            ['Terpakai', formatRupiah(p.spent)],
            ['Sisa / (Kurang)', formatRupiah(balance)]
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59] }
      });
    } else {
      const tableColumn = ["Nama Proyek", "Dana Masuk", "Terpakai", "Sisa", "Progress"];
      const tableRows = projects.map(p => [
        p.name, formatRupiah(p.budget), formatRupiah(p.spent), formatRupiah(p.budget - p.spent), `${p.progress}%`
      ]);
      autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40, theme: 'grid', headStyles: { fillColor: [59, 130, 246] } });
    }
    doc.save(`${customTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    setPrintingProject(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex overflow-hidden">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-30 w-72 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg"><Building2 size={24} /></div>
            <div>
              <h1 className="font-bold text-lg tracking-tight uppercase">{appSettings.appName}</h1>
              <span className="text-xs text-blue-400 font-medium tracking-widest uppercase">{appSettings.companyName}</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <button onClick={() => handleViewChange('DASHBOARD')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
          </button>
          <button onClick={() => handleViewChange('PROJECTS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'PROJECTS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <HardHat size={20} /> <span className="font-medium">Data Proyek</span>
          </button>
          <button onClick={() => handleViewChange('INVENTORY')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'INVENTORY' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Package size={20} /> <span className="font-medium">Inventaris</span>
          </button>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button onClick={() => handleViewChange('AI_INSIGHTS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeView === 'AI_INSIGHTS' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <BrainCircuit size={20} /> <span className="font-medium">AI Consultant</span>
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">{getInitials(userProfile.name)}</div>
            <div className="overflow-hidden"><p className="text-sm font-medium text-white truncate">{userProfile.name}</p></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-500 rounded-lg lg:hidden"><Menu className="w-6 h-6" /></button>
            <h2 className="text-lg lg:text-xl font-bold text-slate-800">
              {activeView === 'DASHBOARD' && 'Ringkasan'}
              {activeView === 'PROJECTS' && 'Manajemen Proyek'}
              {activeView === 'INVENTORY' && 'Stok Material'}
              {activeView === 'AI_INSIGHTS' && 'AI Intelligence'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full hover:text-blue-600 transition-colors"><Settings className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {activeView === 'DASHBOARD' && (
            <div className="space-y-6 lg:space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatsCard title="Total Dana Masuk" value={formatRupiah(stats.totalBudget)} icon={<DollarSign />} color="blue" />
                <StatsCard title="Dana Terpakai" value={formatRupiah(stats.totalSpent)} icon={<TrendingUp />} color="orange" />
                <StatsCard title="Sisa Dana" value={formatRupiah(stats.totalBalance)} icon={<Wallet />} color={stats.totalBalance < 0 ? "red" : "green"} />
                <StatsCard title="Proyek Aktif" value={stats.activeProjects.toString()} icon={<HardHat />} color="blue" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
                  <h3 className="text-lg font-bold mb-6">Analisis Dana</h3>
                  <ResponsiveContainer width="100%" height="90%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis tickFormatter={(val) => `Rp${val/1000000}jt`} /><Tooltip formatter={(v) => formatRupiah(v as number)} /><Bar dataKey="Dana Masuk" fill="#3b82f6" /><Bar dataKey="Terpakai" fill="#f59e0b" /></BarChart></ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6">Status</h3>
                  <div className="h-64 relative"><ResponsiveContainer><PieChart><Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{statusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'PROJECTS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-lg font-semibold">Semua Proyek</h3>
                <div className="flex gap-2">
                  <button onClick={() => {setPrintingProject(null); setIsPrintModalOpen(true);}} className="bg-slate-100 p-2.5 rounded-lg"><Printer size={18} /></button>
                  <button onClick={() => {setEditingProject(null); setIsModalOpen(true);}} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"><Plus size={18} /><span>Tambah</span></button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr><th className="px-6 py-4">Proyek</th><th className="px-6 py-4">Dana Masuk</th><th className="px-6 py-4">Terpakai</th><th className="px-6 py-4">Sisa</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 group">
                        <td className="px-6 py-4 font-medium">{p.name}<div className="text-xs text-slate-500">{p.location}</div></td>
                        <td className="px-6 py-4 text-blue-700 font-semibold">{formatRupiah(p.budget)}</td>
                        <td className="px-6 py-4">{formatRupiah(p.spent)}</td>
                        <td className={`px-6 py-4 font-bold ${p.budget - p.spent < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatRupiah(p.budget - p.spent)}</td>
                        <td className="px-6 py-4 text-xs font-medium uppercase">{p.status}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => {setPrintingProject(p); setIsPrintModalOpen(true);}} className="p-2 text-slate-400 hover:text-slate-800"><Printer size={16} /></button>
                          <button onClick={() => {setEditingProject(p); setIsModalOpen(true);}} className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={16} /></button>
                          <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'INVENTORY' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {materials.map(m => (
                <div key={m.id} className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="flex justify-between mb-4"><Package className="text-slate-400" /><span className="text-xs px-2 py-1 bg-slate-100 rounded">{m.category}</span></div>
                  <h4 className="font-bold">{m.name}</h4><p className="text-2xl font-bold text-blue-600">{m.quantity} <span className="text-sm font-normal text-slate-400">{m.unit}</span></p>
                </div>
              ))}
            </div>
          )}

          {activeView === 'AI_INSIGHTS' && <AIAssistant projects={projects} materials={materials} />}
        </div>
      </main>

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProject} initialData={editingProject} />
      <PrintModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} onPrint={handleExportPDF} initialTitle={printingProject ? `Laporan: ${printingProject.name}` : undefined} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} userProfile={userProfile} appSettings={appSettings} onSave={handleSaveSettings} />
    </div>
  );
};

export default App;