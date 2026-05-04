"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { 
  ChevronLeft, Book, ChevronDown, ChevronRight, 
  Loader2, FileCode, GitGraph, Layers
} from "lucide-react";

export default function ModuleGradingSelector() {
  const params = useParams();
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModuleId, setOpenModuleId] = useState(null); // Untuk mengontrol accordion modul

  useEffect(() => {
    const fetchGradingData = async () => {
      try {
        setLoading(true);
        // Kita gunakan endpoint yang mengambil struktur Course -> Module -> Materi
        const res = await api.get(`/api/teacher/grading/course/${params.courseId}`);
        const dataResult = res.data?.data || [];
        
        // Kelompokkan materi berdasarkan modulnya secara manual di frontend
        const grouped = dataResult.reduce((acc, curr) => {
          const modName = curr.module_name || "Lainnya";
          if (!acc[modName]) acc[modName] = { name: modName, items: [] };
          acc[modName].items.push(curr);
          return acc;
        }, {});

        setModules(Object.values(grouped));
      } catch (err) {
        console.error("Gagal load data grading:", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.courseId) fetchGradingData();
  }, [params.courseId]);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="uppercase tracking-widest text-[10px] font-black italic opacity-50">Menyiapkan Struktur Modul...</p>
    </div>
  );

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-white font-sans">
      <button 
        onClick={() => router.push("/teacher/grading")}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Kembali</span>
      </button>

      <header className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Penilaian Per Modul</h1>
        <p className="text-slate-500 text-sm font-medium">Klik pada modul untuk melihat materi praktik di dalamnya.</p>
      </header>

      <div className="space-y-6">
        {modules.map((mod, idx) => (
          <div key={idx} className="bg-slate-900/20 border border-slate-800 rounded-[35px] overflow-hidden transition-all">
            {/* Header Modul (Pilih Modul) */}
            <button 
              onClick={() => setOpenModuleId(openModuleId === idx ? null : idx)}
              className="w-full flex items-center justify-between p-8 hover:bg-slate-800/30 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight">{mod.name}</h3>
              </div>
              {openModuleId === idx ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
            </button>

            {/* Daftar Materi (Pilih Materi) */}
            {openModuleId === idx && (
              <div className="px-8 pb-8 space-y-3 animate-in slide-in-from-top-2 duration-300">
                {mod.items.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => router.push(`/teacher/grading/${params.courseId}/${m.id}`)}
                    className="flex items-center justify-between p-5 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-blue-500 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {m.type === 'code' ? <FileCode size={18} className="text-blue-400" /> : <GitGraph size={18} className="text-purple-400" />}
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white uppercase">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {parseInt(m.pending_count) > 0 && (
                        <span className="bg-orange-500/10 text-orange-500 text-[9px] font-black px-3 py-1 rounded-full border border-orange-500/20 uppercase">
                          {m.pending_count} Perlu Dinilai
                        </span>
                      )}
                      <ChevronRight size={16} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}