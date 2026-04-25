"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// ✅ PERBAIKAN: Gunakan api (huruf kecil) dari lib
import { api } from "@/lib/api";
import { 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  Loader2, 
  Info,
  Trophy
} from "lucide-react";

export default function TestReviewPage() {
  const params = useParams(); // id di sini adalah test_id
  const router = useRouter();
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ PERBAIKAN: Gunakan api.get agar otomatis membawa cookie login online
    api.get(`/student/test-review/${params.id}`)
      .then((res) => {
        // Axios meletakkan data di properti .data
        setReviewData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching review:", err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white font-sans">
      {/* Tombol Kembali */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 group transition-all text-xs font-black uppercase tracking-widest"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Kembali ke Challenge
      </button>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-yellow-500" size={32} />
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Review Asesmen</h1>
        </div>
        <p className="text-slate-500 text-sm italic">
          Menganalisis hasil pengerjaan untuk memperkuat konsep yang belum dikuasai.
        </p>
      </header>

      <div className="space-y-10 max-w-5xl">
        {reviewData.length > 0 ? (
          reviewData.map((item, index) => (
            <div key={item.question_id} className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-8 relative overflow-hidden">
              
              {/* Nomor Soal & Pertanyaan */}
              <div className="flex items-start gap-6 mb-8">
                <span className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 shadow-lg shadow-blue-900/20">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold leading-relaxed text-slate-100">
                    {item.question_text}
                  </h3>
                  {item.question_image && (
                    <div className="mt-6 rounded-3xl overflow-hidden border border-slate-800 max-w-2xl bg-slate-950">
                      <img src={item.question_image} alt="Soal" className="w-full h-auto opacity-90" />
                    </div>
                  )}
                </div>
              </div>

              {/* Grid Opsi Jawaban */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-16">
                {item.options.map((opt) => {
                  const isCorrectKey = opt.is_correct; // Kunci asli
                  const isStudentChoice = opt.option_label === item.student_choice; // Pilihan siswa
                  
                  let borderStyle = "border-slate-800 bg-slate-950/50 text-slate-500";
                  let icon = null;

                  if (isCorrectKey) {
                    borderStyle = "border-green-500/40 bg-green-500/10 text-green-400 ring-1 ring-green-500/20";
                    icon = <CheckCircle2 size={20} />;
                  } else if (isStudentChoice && !item.is_student_correct) {
                    borderStyle = "border-red-500/40 bg-red-500/10 text-red-400 ring-1 ring-red-500/20";
                    icon = <XCircle size={20} />;
                  }

                  return (
                    <div 
                      key={opt.option_label}
                      className={`relative p-5 rounded-[25px] border flex items-center justify-between transition-all duration-300 ${borderStyle}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-black text-xl italic">{opt.option_label}</span>
                        <span className="font-medium text-sm md:text-base leading-snug">{opt.option_text}</span>
                      </div>
                      {icon}

                      {/* Penanda Jawaban Siswa */}
                      {isStudentChoice && (
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-300 shadow-md">
                          Pilihan Kamu
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              <div className={`mt-8 ml-0 md:ml-16 p-5 rounded-3xl flex items-center gap-4 text-xs font-bold italic
                ${item.is_student_correct ? 'bg-green-500/5 text-green-500/80 border border-green-500/10' : 'bg-red-500/5 text-red-500/80 border border-red-500/10'}`}>
                <Info size={18} />
                <span>
                  {item.is_student_correct 
                    ? "Jawaban tepat! Kamu sudah memahami poin ini dengan baik." 
                    : `Kurang tepat. Jawaban yang benar adalah (${item.options.find(o => o.is_correct)?.option_label}). Pelajari lagi materi terkait.`}
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-900/20 rounded-[40px] border border-dashed border-slate-800 text-slate-600">
            Data review tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}