import { GoogleGenAI } from "@google/genai";
import { Project, Material } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateConstructionInsight = async (projects: Project[], materials: Material[], query: string): Promise<string> => {
  const projectSummary = projects.map(p => {
    const balance = p.budget - p.spent;
    const balanceText = balance < 0 ? `Dana Kurang Rp${Math.abs(balance).toLocaleString()}` : `Sisa Dana Rp${balance.toLocaleString()}`;
    return `- ${p.name} (${p.status}): Dana Masuk Rp${p.budget.toLocaleString()}, Terpakai Rp${p.spent.toLocaleString()}, ${balanceText}, Progress ${p.progress}%`;
  }).join('\n');

  const materialSummary = materials.map(m =>
    `- ${m.name}: Stok ${m.quantity} ${m.unit} @ Rp${m.unitPrice.toLocaleString()}`
  ).join('\n');

  const prompt = `
    Anda adalah Konsultan Senior Manajemen Konstruksi AI yang ahli.
    
    Data Proyek Saat Ini:
    ${projectSummary}

    Data Material Saat Ini:
    ${materialSummary}

    Pertanyaan User: "${query}"

    Berikan analisis singkat, tajam, dan profesional seperti laporan perusahaan besar.
    Fokus pada "Dana Masuk" vs "Dana Terpakai". Jika ada "Dana Kurang" (Defisit), berikan peringatan risiko.
    Gunakan Bahasa Indonesia yang formal dan korporat.
    Jangan gunakan markdown bold/italic yang berlebihan, cukup teks bersih.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Maaf, tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi nanti.";
  }
};