"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronRight } from "lucide-react";
// ✅ IMPORT instance api (huruf kecil)
import { api } from "@/lib/api";

export default function StepModule({ courseId, setStep, modules, setModules }) {  
  const [moduleName, setModuleName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addModule = () => {
    if (!moduleName.trim()) return;
    setModules([
      ...modules, 
      { tempId: Date.now(), title: moduleName, module_order: modules.length + 1 }
    ]);
    setModuleName("");
  };

  const removeModule = (tempId) => {
    const updated = modules.filter((mod) => mod.tempId !== tempId);
    const reordered = updated.map((mod, i) => ({ ...mod, module_order: i + 1 }));
    setModules(reordered);
  };

  const handleNext = async () => {
    if (modules.length === 0) return alert("Tambah minimal satu modul!");
    
    setIsLoading(true);
    const savedModules = [];

    try {
      // ✅ Gunakan loop untuk menyimpan modul satu per satu ke database
      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        
        // ✅ PERBAIKAN: Gunakan api.post (Otomatis kirim cookie & tembak URL online)
        // Tidak perlu lagi manual ambil token atau set Authorization header
        const res = await api.post("/teacher/modules", {
          title: mod.title,
          course_id: courseId,
          module_order: i + 1 
        });
      
        // Axios meletakkan data di properti .data
        savedModules.push(res.data); 
      }

      // SETELAH SEMUA BERHASIL:
      setModules(savedModules); // Update dengan data asli dari DB (yang sudah punya ID asli)
      setStep(3); 
    } catch (error) {
      console.error("Error Detail:", error);
      // Tangani pesan error dari response backend jika ada
      const errorMessage = error.response?.data?.error || "Gagal simpan modul";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl animate-in fade-in">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">Struktur Modul</h2>
        <p className="text-sm text-slate-500">Masukkan bab materi untuk kursus ini.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addModule()}
          placeholder="Nama modul (Contoh: Pengenalan HTML)..."
          className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button onClick={addModule} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2">
          <Plus size={20} /> Tamb <span className="hidden md:inline">bah</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {modules.map((m, index) => (
          <div 
            key={m.id || m.tempId || `mod-${index}`} 
            className="flex items-center justify-between bg-slate-800/30 p-5 rounded-2xl border border-slate-700"
          >
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 bg-slate-950 text-blue-500 rounded-lg flex items-center justify-center font-bold italic">{index + 1}</span>
              <span className="text-white font-medium text-lg">{m.title}</span>
            </div>
            <button onClick={() => removeModule(m.tempId)} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end">
        <button 
          onClick={handleNext} 
          disabled={isLoading || modules.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? "Menyimpan..." : "Lanjut Isi Materi"} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}