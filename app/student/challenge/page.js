"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { 
  Trophy, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Loader2,
  Gamepad2
} from "lucide-react";

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}/student/challenges`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching challenges:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="p-2 text-white space-y-8 bg-slate-950 min-h-screen text-slate-200">
      {/* Header Halaman */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Initial Challenges</h1>
        </div>
        <p className="text-slate-500 text-sm max-w-xl">
          Selesaikan <span className="">Challenge awal</span> untuk setiap kursus untuk mengukur sejauh mana pengetahuan dasarmu sebelum memulai pembelajaran.
        </p>
      </header>

      {/* Grid Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.length > 0 ? (
          challenges.map((item) => (
            <div 
              key={item.test_id} 
              className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-2 hover:border-blue-500/50 transition-all group relative overflow-hidden"
            >
              {/* Thumbnail Area */}
              <div className="relative h-48 w-full rounded-[35px] overflow-hidden">
                <img 
                  src={item.thumbnail || "/placeholder-course.jpg"} 
                  alt={item.course_title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                
                {/* Badge Asesmen Awal */}
                <div className="absolute top-4 left-4 bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Asesmen Awal
                </div>

                {/* Ikon Ceklis Jika Selesai */}
                {item.is_completed && (
                  <div className="absolute top-4 right-4 bg-green-500 p-2 rounded-full shadow-lg animate-in zoom-in duration-300">
                    <CheckCircle2 size={18} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-blue-400 transition-colors uppercase italic">
                  {item.course_title}
                </h3>
                
                <div className="flex items-center gap-6 mb-8 text-slate-500">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">{item.total_questions} Soal</span>
                  </div>
                </div>

                {/* Button Action */}
                <Link 
                    href={
                        item.is_completed 
                        ? `/student/test/review/${item.test_id}` // Jika sudah selesai, ke halaman Review
                        : `/student/test/${item.course_id}/pretest/${item.test_id}` // Jika belum, ke halaman Pengerjaan
                    }
                    >
                    <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all
                        ${item.is_completed 
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}
                    >
                        {item.is_completed ? "Lihat Hasil" : "Uji Kemampuan"}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-700 bg-slate-900/10 rounded-[50px] border border-dashed border-slate-800">
            <Trophy size={48} className="mx-auto mb-4 opacity-20" />
            <p className="italic font-black text-xs uppercase tracking-[0.3em]">Belum ada tantangan tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}