"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// ✅ SINKRONISASI: Menggunakan instance api (Axios) agar token & baseURL Railway konsisten
import { api } from "@/lib/api";
import { 
  ChevronLeft, 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Loader2,
  FileCode,
  GitGraph
} from "lucide-react";

export default function SubBabGrading() {
  const params = useParams();
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubBab = async () => {
      try {
        setLoading(true);
        // ✅ PERBAIKAN: Menembak rute /api/teacher/grading/course/:id
        // Rute ini di backend menjalankan getGradingModules (query SQL JOIN assignments)
        const res = await api.get(`/api/teacher/grading/course/${params.courseId}`);
        
        // Unwrapping data: Axios (res.data) -> Backend Wrap (data)
        const dataResult = res.data?.data || res.data || [];
        setModules(Array.isArray(dataResult) ? dataResult : []);
      } catch (err) {
        console.error("Gagal load sub-bab penilaian:", err);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };
    if (params.courseId) fetchSubBab();
  }, [params.courseId]);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="uppercase tracking-widest text-[10px] font-black italic opacity-50">Menganalisis Tugas Siswa...</p>
    </div>
  );

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-white font-sans">
      {/* Back Button */}
      <button 
        onClick={() => router.push("/teacher/grading")}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Kembali ke Daftar Kursus</span>
      </button>

      <header className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Pilih Sub-Bab</h1>
        <p className="text-slate-500 italic text-sm">Materi dengan indikator <span className="text-orange-500 font-bold underline">Orange</span> memerlukan penilaian segera.</p>
      </header>

      {/* LIST SUB-BAB */}
      <div className="grid grid-cols-1 gap-4">
        {modules.length > 0 ? (
          modules.map((m) => {
            // Konversi nilai count agar aman saat pengecekan logic
            const pendingVal = parseInt(m.pending_count) || 0;
            const gradedVal = parseInt(m.graded_count) || 0;
            const hasPending = pendingVal > 0;

            return (
              <div 
                key={m.id}
                onClick={() => router.push(`/teacher/grading/${params.courseId}/${m.id}`)}
                className={`group flex items-center justify-between p-6 rounded-[32px] border-2 transition-all cursor-pointer ${
                  hasPending 
                  ? "bg-orange-500/5 border-orange-500/20 hover:border-orange-500 shadow-lg shadow-orange-950/10" 
                  : "bg-slate-900/40 border-slate-800 hover:border-blue-500"
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Icon Tipe Materi: Code untuk Coding, GitGraph untuk Flowchart */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-lg ${
                    hasPending ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white"
                  }`}>
                    {m.type === 'code' ? <FileCode size={24} /> : <GitGraph size={24} />}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold group-hover:text-white transition-colors uppercase tracking-tight">
                      {m.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400">
                        Work Type: {m.type === 'code' ? 'Coding Assignment' : 'Flowchart Logic'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Statistik di sebelah kanan */}
                <div className="flex items-center gap-8">
                  <div className="hidden md:flex flex-col items-end">
                    <div className={`flex items-center gap-2 mb-1 ${hasPending ? "text-orange-500" : "text-slate-600"}`}>
                      <Clock size={14} />
                      <span className="text-xs font-bold">{pendingVal} Pending</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600/50">
                      <CheckCircle2 size={14} />
                      <span className="text-xs font-bold">{gradedVal} Dinilai</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full transition-all ${hasPending ? "bg-orange-500/20 text-orange-500" : "bg-slate-800 text-slate-600 group-hover:text-white"}`}>
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-20 bg-slate-900/10 border-2 border-dashed border-slate-800 rounded-[40px] text-center opacity-40">
            <ClipboardList size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tidak ada tugas aktif di sub-bab ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}