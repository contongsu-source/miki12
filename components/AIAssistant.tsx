import React, { useState } from 'react';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';
import { Project, Material } from '../types';
import { generateConstructionInsight } from '../services/geminiService';

interface AIAssistantProps {
  projects: Project[];
  materials: Material[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ projects, materials }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse(null);
    try {
      const result = await generateConstructionInsight(projects, materials, query);
      setResponse(result);
    } catch (err) {
      setResponse("Maaf, terjadi kesalahan saat memproses permintaan Anda.");
    } finally {
      setLoading(false);
    }
  };

  const predefinedPrompts = [
    "Analisa risiko keterlambatan proyek",
    "Bagaimana efisiensi penggunaan anggaran saat ini?",
    "Buatkan ringkasan laporan untuk CEO",
    "Material apa yang stoknya menipis?"
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 rounded-2xl shadow-xl mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Bot size={120} />
        </div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-300" />
          AI Construction Consultant
        </h2>
        <p className="text-blue-100 max-w-2xl text-lg">
          Gunakan kecerdasan buatan Google Gemini untuk menganalisis data proyek, memprediksi risiko, dan mengoptimalkan anggaran perusahaan Anda secara real-time.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          {response ? (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
                <Bot size={20} />
                <span>Analisis AI</span>
              </div>
              <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700 leading-relaxed">
                {response}
              </div>
              <button 
                onClick={() => setResponse(null)}
                className="mt-6 text-sm text-slate-500 hover:text-blue-600 underline"
              >
                Reset Analisis
              </button>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <Bot size={64} className="mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">Siap Membantu Anda</h3>
                <p className="max-w-md mb-8">Pilih pertanyaan cepat di bawah atau ketik pertanyaan spesifik mengenai data konstruksi Anda.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {predefinedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(prompt)}
                      className="p-3 text-left text-sm border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-slate-600"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
             </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tanyakan sesuatu tentang proyek Anda..."
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
            />
            <button
              onClick={handleAnalysis}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              <span>Analisa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};