"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, BookOpen, AlertCircle } from "lucide-react";

export default function CourseRedirect() {
  const router = useRouter();
  const params = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const goToFirstMateri = async () => {
      try {
        // Menggunakan API Full Course agar struktur data terpantau jelas
        const res = await fetch(`http://localhost:5000/api/courses/courses-full`);
        const allCourses = await res.json();
        
        // Cari course yang spesifik dari list
        const currentCourse = allCourses.find(c => c.id === parseInt(params.id));

        if (!currentCourse || !currentCourse.modules || currentCourse.modules.length === 0) {
          setError(true);
          return;
        }
        
        // Ambil materi pertama dari modul pertama
        const firstModule = currentCourse.modules[0];
        if (!firstModule.materi || firstModule.materi.length === 0) {
          setError(true);
          return;
        }
        
        const firstMateriId = firstModule.materi[0].id;

        if (firstMateriId) {
          router.push(`/student/courses/${params.id}/materi/${firstMateriId}`);
        }
      } catch (err) {
        console.error("Redirect Error:", err);
        setError(true);
      }
    };

    if (params?.id) {
      goToFirstMateri();
    }
  }, [params, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-400 p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Ups! Kursus Kosong</h2>
        <p className="max-w-xs">Belum ada materi yang diunggah untuk kursus ini oleh Bapak/Ibu Guru.</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="relative flex flex-col items-center">
        {/* Spinner Animasi */}
        <div className="relative">
          <Loader2 className="text-blue-500 animate-spin" size={64} strokeWidth={1} />
          <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400/50" size={24} />
        </div>
        
        <div className="mt-8 text-center animate-pulse">
          <h2 className="text-xl font-bold text-white tracking-tight">Menyiapkan Ruang Belajar</h2>
          <p className="text-slate-500 text-sm mt-1">Sesaat lagi kamu akan diarahkan ke materi pertama...</p>
        </div>
      </div>
      
      {/* Background Glow agar lebih mewah */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
    </div>
  );
}