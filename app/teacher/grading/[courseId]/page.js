"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// ✅ PERBAIKAN: Gunakan api (huruf kecil) agar sinkron dengan lib/api.js
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
        // ✅ PERBAIKAN: Gunakan api.get (Otomatis membawa cookie online)
        const res = await api.get(`/teacher/grading/course/${params.courseId}`);
        
        // Axios meletakkan hasil data di properti .data
        const data = res.data;
        setModules(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal load sub-bab:", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.courseId) fetchSubBab();
  }, [params.courseId]);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="uppercase tracking-widest text-xs font-black">Menganalisis Tugas Siswa...</p>
    </div>
  );

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-white">
      {/* Back Button & Header */}
      <button 
        onClick={() => router.push("/teacher/grading")}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Kembali ke Daftar Kursus</span>
      </button>

      <header className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Pilih Sub-Bab</h1>
        <p className="text-slate-500 italic">Materi yang memiliki indikator <span className="text-orange-500 font-bold underline">Orange</span> memerlukan penilaian segera.</p>
      </header>

      {/* LIST SUB-BAB */}
      <div className="grid grid-cols-1 gap-4">
        {modules.length > 0 ? (
          modules.map((m) => {
            const hasPending = parseInt(m.pending_count) > 0;
            return (
              <div 
                key={m.id}
                onClick={() => router.push(`/teacher/grading/${params.courseId}/${m.id}`)}
                className={`group flex items-center justify-between p-6 rounded-[32px] border-2 transition-all cursor-pointer ${
                  hasPending 
                  ? "bg-orange-500/5 border-orange-500/20 hover:border-orange-500" 
                  : "bg-slate-900/40 border-slate-800 hover:border-blue-500"
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Icon Tipe Materi */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    hasPending ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white"
                  }`}>
                    {m.type === 'code' ? <FileCode size={24} /> : <GitGraph size={24} />}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold group-hover:text-white transition-colors">
                      {m.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Type: {m.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Statistik */}
                <div className="flex items-center gap-8">
                  <div className="hidden md:flex flex-col items-end">
                    <div className="flex items-center gap-2 text-orange-500 mb-1">
                      <Clock size={14} />
                      <span className="text-xs font-bold">{m.pending_count} Pending</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 size={14} />
                      <span className="text-xs font-bold">{m.graded_count} Dinilai</span>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[40px] text-center">
            <ClipboardList size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-slate-500 italic">Tidak ada tugas yang ditemukan pada kursus ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}