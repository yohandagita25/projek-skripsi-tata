"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// ✅ PERBAIKAN: Gunakan api (huruf kecil) agar sinkron dengan lib/api.js
import { api } from "@/lib/api";
import { BookOpen, ChevronRight, Loader2, ClipboardCheck, Award } from "lucide-react";

export default function SelectCourseResults() {
  const params = useParams(); // Mengambil 'pretest' atau 'posttest' dari URL
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isPretest = params.testType === "pretest";

  useEffect(() => {
    // ✅ PERBAIKAN: Gunakan api.get (Otomatis membawa cookie online)
    api.get("/teacher/dashboard-stats")
      .then((res) => {
        // Axios meletakkan hasil data di properti .data
        const data = res.data;
        setCourses(data.courseList || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil daftar kursus:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="p-2 bg-slate-950 min-h-screen text-white">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className={`p-3 rounded-2xl ${isPretest ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"}`}>
            {isPretest ? <Award size={28} /> : <Award size={28} />}
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
             Nilai {params.testType}
          </h1>
        </div>
        <p className="text-slate-500 mt-2">Pilih kursus untuk melihat rekapitulasi nilai siswa.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link href={`/teacher/results/${params.testType}/${course.id}`} key={course.id}>
            <div className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full group-hover:bg-blue-500/10 transition-all"></div>
              
              <BookOpen className="text-slate-600 group-hover:text-blue-500 mb-6 transition-colors" size={32} />
              <h3 className="text-xl font-bold mb-6 leading-tight">{course.title}</h3>
              
              <div className="flex items-center justify-between text-blue-500 text-[10px] font-black uppercase tracking-widest pt-4 border-t border-slate-800/50">
                <span>Lihat Rekapitulasi</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}