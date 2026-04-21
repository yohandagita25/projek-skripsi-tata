"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API } from "@/lib/api";
import { Star, BookOpen, ChevronRight, Loader2, GraduationCap } from "lucide-react";

export default function GradingDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API}/teacher/dashboard-stats`, { credentials: "include" });
        const data = await res.json();
        // Menggunakan courseList yang sudah Anda buat di controller
        setCourses(data.courseList || []);
      } catch (err) {
        console.error("Gagal memuat kursus:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="uppercase tracking-widest text-xs font-black">Memuat Daftar Kursus...</p>
    </div>
  );

  return (
    <div className="p-2 bg-slate-950 min-h-screen text-white">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-yellow-500/10 p-3 rounded-2xl border border-yellow-500/20">
            <Star className="text-yellow-500" size={28} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Grading Center</h1>
        </div>
        <p className="text-slate-500 mt-2">Pilih kursus untuk mulai melakukan penilaian tugas siswa.</p>
      </header>

      {/* GRID KURSUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Link 
              href={`/teacher/grading/${course.id}`} 
              key={course.id}
              className="group relative bg-slate-900/40 border border-slate-800 rounded-[40px] p-8 transition-all hover:bg-slate-900 hover:border-blue-500/50 hover:-translate-y-2 shadow-2xl overflow-hidden"
            >
              {/* Dekorasi Background */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all rounded-full"></div>

              <div className="relative z-10">
                <div className="mb-6 bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <BookOpen size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest">
                    <GraduationCap size={16} />
                    <span>Buka Penilaian</span>
                  </div>
                  <ChevronRight size={20} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[40px] flex flex-col items-center justify-center opacity-50">
            <BookOpen size={48} className="mb-4 text-slate-700" />
            <p className="italic text-slate-500">Belum ada kursus yang tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}