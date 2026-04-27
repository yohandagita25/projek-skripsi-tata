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
        // ✅ PERBAIKAN: Tambahkan prefix /api agar sinkron dengan rute Backend Railway
        const res = await api.get("/api/teacher/students-monitor");

        // Axios otomatis meletakkan response di property .data
        const data = res.data;

        // Validasi data adalah array untuk mencegah error .map
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch Error:", err.message);
        // Menangkap pesan error spesifik dari backend
        const errorMessage = err.response?.data?.error || err.message || "Gagal mengambil data dari server";
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
        <p className="uppercase tracking-[0.3em] text-xs font-black">Syncing Student Data...</p>
      </div>
    );
  }

  return (
    <div className="p-2 bg-slate-950 min-h-screen text-white">
      <header className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
          <Users className="text-blue-500" size={40} /> Student Management
        </h1>
        <p className="text-slate-500 mt-2">Pantau progres belajar dan materi terakhir yang diakses siswa.</p>
      </header>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-sm font-bold animate-pulse">
          ⚠️ Error: {error}
        </div>
      )}

      {/* TABEL MONITORING (UI TETAP) */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs font-black uppercase tracking-widest">
              <th className="p-8">Nama Siswa</th>
              <th className="p-8">Course Terakhir</th>
              <th className="p-8">Materi Terakhir</th>
              <th className="p-8 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s.student_id || s.id} className="hover:bg-blue-600/5 transition-all group">
                  {/* KOLOM NAMA */}
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {s.student_name || s.name}
                      </span>
                      <span className="text-xs text-slate-500">{s.student_email || s.email}</span>
                    </div>
                  </td>

                  {/* KOLOM COURSE */}
                  <td className="p-8">
                    <div className="flex items-center gap-3 text-slate-300">
                      <BookOpen size={16} className="text-blue-500" />
                      <span className="font-medium text-sm">
                        {s.last_course || "Belum Memilih Kursus"}
                      </span>
                    </div>
                  </td>

                  {/* KOLOM MATERI */}
                  <td className="p-8">
                    <div className="bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-blue-300 inline-block">
                      {s.last_materi || "Belum Ada Aktivitas"}
                    </div>
                  </td>

                  {/* KOLOM STATUS */}
                  <td className="p-8 text-right">
                    <div className="flex flex-col items-end gap-1">
                        <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                        Active
                        </span>
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                            Streak: {s.current_streak || 0} 🔥
                        </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <Users size={48} className="mb-4" />
                    <p className="text-slate-500 italic font-medium uppercase tracking-widest text-xs">Belum ada data siswa yang tersedia.</p>
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