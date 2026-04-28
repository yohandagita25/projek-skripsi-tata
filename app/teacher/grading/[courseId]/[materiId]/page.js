"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// ✅ SINKRONISASI: Menggunakan instance api (Axios) agar cookie online terbawa
import { api } from "@/lib/api";
import { 
  ChevronLeft, Send, Loader2, User, 
  Terminal, FileCode, CheckCircle, MessageSquare,
  BrainCircuit
} from "lucide-react";
// Import Syntax Highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function StudentSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  const quickFeedbacks = [
    "Logika percabangan sudah tepat, pertahankan!",
    "Sintaks sudah benar, tapi perhatikan kerapian indentasi.",
    "Flowchart mudah dipahami, simbol sudah sesuai.",
    "Masih ada kesalahan logika pada kondisi, silakan pelajari lagi.",
    "Output program belum sesuai dengan instruksi soal."
  ];

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      // ✅ SINKRONISASI: Menembak rute /api/teacher/grading/materi/:id
      // Sesuai teacherController: res.json({ status: "success", data: [...] })
      const res = await api.get(`/api/teacher/grading/materi/${params.materiId}`);
      const dataResult = res.data?.data || res.data || [];
      setSubmissions(Array.isArray(dataResult) ? dataResult : []);
    } catch (err) {
      console.error("Gagal load kiriman siswa:", err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.materiId) fetchSubmissions();
  }, [params.materiId]);

  const handleUpdateGrade = async (subId, score, feedback) => {
    if (!score) return alert("Berikan nilai terlebih dahulu!");
    setSubmittingId(subId);
    try {
      // ✅ SINKRONISASI: Menembak rute /api/teacher/grading/submit/:id dengan method PUT
      await api.put(`/api/teacher/grading/submit/${subId}`, { 
        score: parseInt(score), 
        feedback 
      });
      
      alert("✅ Nilai berhasil diperbarui!");
      fetchSubmissions(); // Refresh data agar status berubah jadi 'graded'
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan nilai: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmittingId(null);
    }
  };

  // Helper render konten (Coding / Flowchart) - UI TETAP
  const renderStudentWork = (content) => {
    if (!content) return <p className="text-slate-500 italic text-xs">Tidak ada jawaban.</p>;

    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      
      // 1. DETEKSI FLOWCHART
      if (parsed?.task?.nodes || parsed?.nodes) {
        return (
          <div className="bg-slate-950 p-8 rounded-[32px] border border-slate-800 text-center shadow-inner">
            <BrainCircuit size={40} className="mx-auto mb-3 text-purple-500 opacity-50" />
            <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest italic">Flowchart Logic Detected</p>
            <div className="text-xs text-slate-400 italic bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
              Siswa telah menyusun diagram alur logika.
            </div>
          </div>
        );
      }

      // 2. DETEKSI CODING
      const code = parsed?.task?.code || parsed?.code || "";
      const output = parsed?.task?.output || parsed?.output || "No output recorded.";

      return (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <FileCode size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Source Code (C/C++)</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 text-xs shadow-2xl">
              <SyntaxHighlighter 
                language="cpp" 
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '24px', fontSize: '13px', backgroundColor: '#020617' }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-500">
              <Terminal size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Console Output</span>
            </div>
            <div className="bg-[#050505] p-6 rounded-2xl border border-slate-800 font-mono text-xs text-green-400 min-h-[100px] shadow-inner relative overflow-hidden">
              <div className="flex gap-1.5 mb-4 opacity-30">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="flex gap-2 opacity-40 mb-2 italic select-none text-[10px]">
                <span>$ ./program</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">
                {output.replace("✅ Output:\n", "").replace("❌ Error:\n", "")}
              </pre>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      // 3. FALLBACK LINK GAMBAR ATAU PLAIN TEXT
      if (typeof content === 'string' && content.startsWith('http')) {
         return <img src={content} alt="Student Work" className="max-w-full rounded-2xl border border-slate-800 shadow-2xl" />;
      }
      return <pre className="bg-slate-950 p-6 rounded-3xl text-green-400 text-sm whitespace-pre-wrap font-mono">{content}</pre>;
    }
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="uppercase tracking-widest text-[10px] font-black italic opacity-50">Menganalisis Jawaban...</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* Back Button */}
      <button 
        onClick={() => router.push(`/teacher/grading/${params.courseId}`)}
        className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 group transition-all"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Sub-Bab</span>
      </button>

      <div className="max-w-6xl mx-auto space-y-10">
        {submissions.length > 0 ? (
          submissions.map((sub) => (
            <div key={sub.submission_id} className="bg-slate-900/40 border border-slate-800 rounded-[45px] overflow-hidden shadow-2xl transition-all hover:border-slate-700/50">
              
              {/* Header Submission */}
              <div className="p-8 border-b border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/20">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-900/30">
                    <User size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight uppercase italic">{sub.student_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${sub.status === 'graded' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Submission ID</p>
                   <p className="text-xs font-mono text-slate-500">#SUB-{sub.submission_id}</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Bagian Instruksi */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-slate-700 rounded-full"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Instruksi Tugas</p>
                    </div>
                    <div className="bg-slate-950/50 p-7 rounded-[32px] border border-slate-800/50 text-sm leading-relaxed text-slate-400 italic">
                      "{sub.task_instruction || 'Tidak ada instruksi khusus.'}"
                    </div>
                  </div>

                  {/* Bagian Pekerjaan Siswa */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full animate-pulse"></div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Hasil Pekerjaan Siswa</p>
                    </div>
                    {renderStudentWork(sub.content)}
                  </div>
                </div>

                {/* Grading Area */}
                <div className="mt-12 bg-slate-800/20 p-8 md:p-10 rounded-[40px] border border-slate-700/30 shadow-inner">
                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* Feedback Input */}
                    <div className="flex-1 space-y-5">
                      <div className="flex items-center gap-2 ml-2">
                        <MessageSquare size={16} className="text-slate-500" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teacher's Feedback</p>
                      </div>
                      <textarea 
                        id={`feedback-${sub.submission_id}`}
                        defaultValue={sub.feedback || ""}
                        className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] transition-all"
                        placeholder="Berikan apresiasi atau saran perbaikan..."
                      />
                      <div className="flex flex-wrap gap-2 pt-2">
                        {quickFeedbacks.map((text, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              document.getElementById(`feedback-${sub.submission_id}`).value = text;
                            }}
                            className="text-[9px] bg-slate-900 hover:bg-blue-600/20 text-slate-500 hover:text-blue-400 px-4 py-2 rounded-full border border-slate-800 hover:border-blue-500/50 transition-all font-bold"
                          >
                            + {text}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Score Input */}
                    <div className="w-full lg:w-64 flex flex-col justify-between space-y-6">
                      <div className="space-y-5 text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Final Score</p>
                        <div className="relative group">
                          <input 
                            id={`score-${sub.submission_id}`}
                            type="number" 
                            max="100"
                            defaultValue={sub.score || ""}
                            className="w-full bg-slate-900 border border-slate-800 rounded-[32px] py-8 text-center text-5xl font-black outline-none focus:ring-2 focus:ring-blue-500 text-blue-500 transition-all shadow-inner"
                            placeholder="0"
                          />
                          <span className="absolute bottom-4 right-8 text-slate-700 font-black text-xs">/ 100</span>
                        </div>
                      </div>

                      {/* Save Button */}
                      <button 
                        disabled={submittingId === sub.submission_id}
                        onClick={() => {
                          const score = document.getElementById(`score-${sub.submission_id}`).value;
                          const feedback = document.getElementById(`feedback-${sub.submission_id}`).value;
                          handleUpdateGrade(sub.submission_id, score, feedback);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/40 active:scale-95 disabled:opacity-50"
                      >
                        {submittingId === sub.submission_id ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        Simpan Nilai
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-slate-900/10 rounded-[60px] border border-dashed border-slate-800 opacity-40">
            <CheckCircle size={60} className="mx-auto mb-6 text-slate-800" />
            <h4 className="text-slate-500 uppercase tracking-[0.3em] font-black text-sm italic">All Work Reviewed</h4>
            <p className="text-slate-700 text-xs mt-2 font-medium">Belum ada kiriman tugas baru di materi ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}