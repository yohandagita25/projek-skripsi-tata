"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, Send, ArrowRight, CheckCircle2, 
  ClipboardCheck, ChevronRight, ChevronLeft, Award 
} from "lucide-react";
// ✅ IMPORT instance api (Axios)
import { api } from "@/lib/api";

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const isPostTest = params.type === 'posttest';
  const themeColor = isPostTest ? "bg-orange-600" : "bg-blue-600";
  const themeBorder = isPostTest ? "border-orange-500/50" : "border-blue-500/50";

  // URL Backend Bapak (Railway) untuk memanggil folder uploads
  const BACKEND_URL = "https://projek-skripsi-tata-backend-production.up.railway.app";

  const STORAGE_KEY = `test_progress_${params.testId}`;

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true); 
      try {
        const res = await api.get(`/api/student/test-data/${params.testId}`);
        const data = res.data; 
        setQuestions(Array.isArray(data) ? data : []);
  
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          setAnswers(JSON.parse(savedProgress));
        }
      } catch (err) {
        console.error("Gagal load data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.testId) fetchTestData();
  }, [params.testId]);

  const handleSelectOption = (qId, label) => {
    if (isFinished) return;
    const newAnswers = { ...answers, [qId]: label };
    setAnswers(newAnswers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      return alert(`Harap isi semua soal! (${answeredCount}/${questions.length} terjawab)`);
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/student/submit-test", {
        test_id: params.testId,
        course_id: params.courseId,
        test_type: params.type,
        answers: answers
      });

      if (res.status === 200 || res.status === 201) {
        setIsFinished(true);
        localStorage.removeItem(STORAGE_KEY); 
      }
    } catch (err) {
      alert("Koneksi bermasalah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    if (isPostTest) return router.push(`/student/courses`);
    router.push(`/student/courses/${params.courseId}`);
  };

  // Helper fungsi untuk menangani URL Gambar
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; // Jika sudah link lengkap (Google/Cloudinary)
    return `${BACKEND_URL}/uploads/${path}`; // Jika hanya nama file, arahkan ke Railway
  };

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: isPostTest ? '#f59e0b' : '#3b82f6' }}>
      <Loader2 className="animate-spin mb-4" size={32} />
      <p className="uppercase tracking-[0.3em] text-[10px] font-black italic">Syncing Soal...</p>
    </div>
  );

  const currentQ = questions[currentIndex];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: '#020617', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* HEADER */}
      <nav className="shrink-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-10 py-5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className={`${themeColor} p-2.5 rounded-2xl`}>
              {isPostTest ? <Award size={24} className="text-white" /> : <ClipboardCheck size={24} className="text-white" />}
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{params.type}</h2>
          </div>
          <div className="flex items-center gap-2">
            {questions.map((_, idx) => (
               <button key={idx} onClick={() => setCurrentIndex(idx)} className={`w-9 h-9 rounded-xl text-[11px] font-black transition-all border ${currentIndex === idx ? `${themeColor} text-white` : answers[questions[idx].id] ? "bg-green-500/20 border-green-500/50 text-green-500" : "bg-slate-800 border-slate-700 text-slate-500"}`}>{idx + 1}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto bg-slate-950 scroll-smooth">
        <main className="max-w-4xl mx-auto py-12 px-6">
          {currentQ && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[48px] backdrop-blur-md mb-8 shadow-2xl">
                <div className="flex items-start gap-8">
                  <div className={`h-14 w-14 shrink-0 ${themeColor} text-white rounded-2xl flex items-center justify-center text-xl font-black`}>{currentIndex + 1}</div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-white mb-8">{currentQ.question_text}</h3>

                    {/* ✅ PERBAIKAN: Tampilan Gambar Soal */}
                    {currentQ.question_image && (
                      <div className="mb-10 flex justify-center bg-slate-950/50 p-4 rounded-[32px] border border-slate-800">
                        <img 
                          src={getImageUrl(currentQ.question_image)} 
                          alt="Visual Soal"
                          className="max-h-[300px] w-auto rounded-2xl object-contain shadow-2xl" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-5">
                      {currentQ.options?.map((opt, idx) => {
                        const label = opt.option_label || opt.label;
                        const text = opt.option_text || opt.text;
                        const image = opt.option_image;

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(currentQ.id, label)}
                            className={`group flex flex-col p-6 rounded-[32px] border-2 transition-all duration-300 text-left relative overflow-hidden ${answers[currentQ.id] === label ? `${themeColor} ${themeBorder} text-white scale-[1.02]` : "bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-600"}`}
                          >
                            <div className="flex items-center w-full gap-6">
                              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${answers[currentQ.id] === label ? "bg-white text-blue-600" : "bg-slate-800 text-slate-500"}`}>{label}</div>
                              <span className="text-base md:text-lg font-semibold flex-1">{text}</span>
                            </div>

                            {/* ✅ PERBAIKAN: Tampilan Gambar Opsi */}
                            {image && (
                              <div className="mt-5 ml-16 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 inline-block self-start">
                                <img 
                                  src={getImageUrl(image)} 
                                  alt={`Opsi ${label}`} 
                                  className="max-h-40 w-auto object-contain p-2"
                                  onError={(e) => { e.target.style.display = 'none'; }} 
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center bg-slate-900/50 p-6 rounded-[32px] border border-slate-800/50 backdrop-blur-sm">
            <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(prev => prev - 1)} className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-20 transition-all">
              <ChevronLeft size={20} /> Sebelumnya
            </button>

            {currentIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentIndex(prev => prev + 1)} className={`flex items-center gap-4 ${themeColor} text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg`}>
                Selanjutnya <ChevronRight size={20} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-500 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Selesai
              </button>
            )}
          </div>
        </main>
      </div>

      {isFinished && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-8 animate-in fade-in">
          <div className="relative text-center bg-slate-900 border border-slate-800 p-14 rounded-[56px] shadow-2xl max-w-lg w-full">
            <div className="relative bg-gradient-to-b from-green-400 to-green-600 text-white p-7 rounded-full inline-flex mb-10 shadow-xl shadow-green-500/20"><CheckCircle2 size={72} strokeWidth={3} /></div>
            <h4 className="text-4xl font-black text-white uppercase italic mb-5">Success <span className="text-green-500">!</span></h4>
            <p className="text-slate-400 text-base mb-12">{isPostTest ? "Ujian Akhir berhasil diselesaikan!" : "Pre-test berhasil dikirim. Selamat belajar!"}</p>
            <button onClick={handleFinish} className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all">
              {isPostTest ? "Selesai & Keluar" : "Masuk ke Materi"} <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}