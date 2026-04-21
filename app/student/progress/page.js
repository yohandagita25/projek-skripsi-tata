"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import { 
  BookOpen, CheckCircle2, Clock, AlertCircle, 
  Trophy, Loader2, ChevronDown, Layout
} from "lucide-react";

export default function StudentProgressPage() {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    fetch(`${API}/student/overall-progress`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Data Progress Diterima:", data); // Debugging: Cek isi data di F12 Console
        setProgressData(data);
        
        // Pastikan kita mengambil ID yang benar untuk inisialisasi
        if (data && data.length > 0) {
          const initialId = data[0].course_id || data[0].id;
          setSelectedCourseId(String(initialId)); 
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error load progress:", err);
        setLoading(false);
      });
  }, []);

  // Perbaikan logika find: Mendukung course_id maupun id
  const selectedCourse = progressData.find(c => 
    String(c.course_id || c.id) === String(selectedCourseId)
  );

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="p-2 space-y-10 bg-slate-950 min-h-screen text-slate-200">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">Learning Progress</h1>
          <p className="text-slate-500 text-sm font-medium">Pilih kursus untuk melihat laporan capaian belajarmu.</p>
        </div>

        {/* DROPDOWN SELECTOR */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
            <Layout size={18} />
          </div>
          <select 
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-2xl py-4 pl-12 pr-10 appearance-none outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="" disabled>Pilih Kursus...</option>
            {progressData.map((course) => (
              <option key={course.course_id || course.id} value={course.course_id || course.id}>
                {course.course_title}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      {selectedCourse ? (
        <div key={selectedCourseId} className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-8 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-blue-600/20 p-5 rounded-3xl">
                  <BookOpen className="text-blue-500" size={30} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase italic">{selectedCourse.course_title}</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Laporan Belajar Aktif</p>
                </div>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                <TestBadge label="Pre-test" data={selectedCourse.pretest} color="blue" />
                <TestBadge label="Post-test" data={selectedCourse.posttest} color="orange" />
              </div>
            </div>

            <div className="h-px bg-slate-800/50 mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCourse.assignments_progress && selectedCourse.assignments_progress.length > 0 ? (
                selectedCourse.assignments_progress.map((task, idx) => (
                  <div key={idx} className="bg-slate-950/50 border border-slate-800 p-6 rounded-[35px] flex flex-col justify-between hover:border-blue-500/50 transition-all group">
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Sub-Bab</p>
                      <h3 className="font-bold text-slate-200 text-lg leading-tight group-hover:text-white transition-colors uppercase">
                        {task.materi_title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                      <StatusIndicator status={task.submission_status} score={task.submission_score} />
                      {task.submission_score !== null && (
                        <div className="text-2xl font-black text-blue-500">
                          {task.submission_score}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center opacity-40 italic">
                  <p>Tidak ada tugas di kursus ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-slate-700">
          <p className="italic font-black text-xs uppercase tracking-[0.3em]">Pilih salah satu kursus di atas</p>
        </div>
      )}
    </div>
  );
}

// Komponen Pendukung Tetap Sama...
function TestBadge({ label, data, color }) {
  const hasScore = data?.score !== null && data?.score !== undefined;
  return (
    <div className={`flex-1 md:w-36 px-6 py-4 rounded-[25px] border ${color === "blue" ? 'border-blue-500/20 bg-blue-500/5' : 'border-orange-500/20 bg-orange-500/5'}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <Trophy size={16} className={hasScore ? (color === "blue" ? 'text-blue-500' : 'text-orange-500') : 'text-slate-800'} />
        <span className={`font-black text-2xl ${hasScore ? 'text-white' : 'text-slate-800'}`}>
          {hasScore ? data.score : "—"}
        </span>
      </div>
    </div>
  );
}

function StatusIndicator({ status, score }) {
  if (!status) return (
    <div className="flex items-center gap-2 text-slate-600 text-[9px] font-black uppercase italic">
      <AlertCircle size={12} /> <span>Belum Dikerjakan</span>
    </div>
  );
  if (status === 'submitted') return (
    <div className="flex items-center gap-2 text-orange-500 text-[9px] font-black uppercase italic animate-pulse">
      <Clock size={12} /> <span>Menunggu Nilai</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 text-green-500 text-[9px] font-black uppercase italic">
      <CheckCircle2 size={12} /> <span>Sudah Dinilai</span>
    </div>
  );
}