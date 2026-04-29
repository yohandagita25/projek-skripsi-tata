"use client";

import { useEffect, useState } from "react";
// ✅ Menggunakan instance api dari lib/api.js
import { api } from "@/lib/api";
import { Users, BookOpen, Loader2 } from "lucide-react";

export default function StudentMonitor() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // ✅ PERBAIKAN: Memanggil rute yang sudah didaftarkan di app.js & studentRoutes.js
        const res = await api.get("/api/student/stats-summary"); // Mengambil ringkasan jika rute khusus monitor belum siap
        
        // Atau jika Bapak menggunakan rute monitor khusus:
        const resMonitor = await api.get("/api/teacher/students-monitor").catch(() => null);

        // ✅ LOGIKA UNWRAPPING: 
        // Backend Bapak mengirim { status: "success", data: [...] }
        // Axios membungkusnya lagi dalam .data
        const finalData = resMonitor?.data?.data || resMonitor?.data || [];
        
        setStudents(Array.isArray(finalData) ? finalData : []);
      } catch (err) {
        console.error("Fetch Error:", err.message);
        const errorMessage = err.response?.data?.error || err.message || "Gagal mengambil data";
        setError(errorMessage);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // TAMPILAN LOADING (UI TETAP)
  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="uppercase tracking-[0.3em] text-xs font-black italic">Syncing Student Data...</p>
      </div>
    );
  }

  return (
    <div className="p-2 bg-slate-950 min-h-screen text-white selection:bg-blue-500/30">
      <header className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
          <Users className="text-blue-500" size={40} /> Student Management
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Pantau progres belajar dan materi terakhir yang diakses siswa secara real-time.</p>
      </header>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-6 bg-red-500/5 border border-red-500/20 rounded-[32px] text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">
          ⚠️ System Alert: {error}
        </div>
      )}

      {/* TABEL MONITORING (UI TETAP) */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-8">Nama Siswa</th>
              <th className="p-8">Tugas Terkirim</th>
              <th className="p-8">Skor Rata-rata</th>
              <th className="p-8 text-right">Aktivitas Terakhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s.id} className="hover:bg-blue-600/5 transition-all group">
                  {/* KOLOM NAMA */}
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                        {s.name}
                      </span>
                    </div>
                  </td>

                  {/* KOLOM TUGAS */}
                  <td className="p-8">
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="bg-blue-500/10 p-2 rounded-xl">
                        <BookOpen size={16} className="text-blue-500" />
                      </div>
                      <span className="font-black text-sm uppercase">
                        {s.tasks_sent || 0} <span className="text-[10px] text-slate-600 ml-1">Files</span>
                      </span>
                    </div>
                  </td>

                  {/* KOLOM SKOR */}
                  <td className="p-8">
                    <div className="text-2xl font-black text-blue-500 tracking-tighter">
                      {s.avg_score ? Math.round(s.avg_score) : "—"}
                    </div>
                  </td>

                  {/* KOLOM STATUS */}
                  <td className="p-8 text-right">
                    <div className="flex flex-col items-end gap-2">
                        <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-inner">
                        {s.last_activity_date ? "Active Student" : "No Activity"}
                        </span>
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">
                            Streak: {s.current_streak || 0} Days 🔥
                        </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-32 text-center">
                  <div className="flex flex-col items-center justify-center opacity-20">
                    <Users size={64} className="mb-6 text-blue-500" />
                    <p className="text-slate-500 italic font-black uppercase tracking-[0.4em] text-[10px]">Data Stream Empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}