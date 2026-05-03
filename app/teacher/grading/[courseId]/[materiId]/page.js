"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { 
  ChevronLeft, Send, Loader2, User, 
  Terminal, FileCode, CheckCircle, MessageSquare,
  BrainCircuit
} from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ✅ TAMBAHAN: Import ReactFlow untuk menampilkan hasil kerja siswa
import ReactFlow, { ReactFlowProvider, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { StartNode, ProcessNode, DecisionNode, InputOutputNode, TextNode } from "@/components/student/FlowchartNodes";

const nodeTypes = { 
  start: StartNode, 
  process: ProcessNode, 
  decision: DecisionNode, 
  input: InputOutputNode,
  text: TextNode 
};

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
      const res = await api.get(`/api/teacher/grading/materi/${params.materiId}`);
      const dataResult = res.data?.data || res.data || [];
      setSubmissions(Array.isArray(dataResult) ? dataResult : []);
    } catch (err) {
      console.error("Gagal load:", err);
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
      await api.put(`/api/teacher/grading/submit/${subId}`, { 
        score: parseInt(score), 
        feedback 
      });
      alert("✅ Nilai berhasil diperbarui!");
      fetchSubmissions();
    } catch (err) {
      alert("Gagal menyimpan nilai.");
    } finally {
      setSubmittingId(null);
    }
  };

  // ✅ PERBAIKAN: Fungsi render yang bisa menampilkan diagram asli
  const renderStudentWork = (content) => {
    if (!content) return <p className="text-slate-500 italic text-xs">Tidak ada jawaban.</p>;

    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      
      // 1. RENDER FLOWCHART ASLI
      if (parsed?.task?.nodes || parsed?.nodes) {
        const flowData = parsed.task || parsed;
        return (
          <div className="h-[400px] w-full bg-slate-950 rounded-[32px] border border-slate-800 relative overflow-hidden shadow-2xl">
             <ReactFlowProvider>
                <ReactFlow
                  nodes={flowData.nodes || []}
                  edges={flowData.edges || []}
                  nodeTypes={nodeTypes}
                  fitView
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  panOnDrag={true}
                  zoomOnScroll={true}
                >
                  <Background color="#1e293b" variant="dots" />
                  <Controls showInteractive={false} />
                </ReactFlow>
             </ReactFlowProvider>
             <div className="absolute top-4 right-4 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 pointer-events-none">
                <p className="text-[8px] font-black uppercase text-blue-400 tracking-widest">Interactive Diagram View</p>
             </div>
          </div>
        );
      }

      // 2. RENDER CODING
      const code = parsed?.task?.code || parsed?.code || "";
      const output = parsed?.task?.output || parsed?.output || "No output.";

      return (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400"><FileCode size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">Source Code</span></div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 text-xs shadow-2xl">
              <SyntaxHighlighter language="cpp" style={vscDarkPlus} customStyle={{ margin: 0, padding: '24px', fontSize: '13px', backgroundColor: '#020617' }}>
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-500"><Terminal size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">Last Console Output</span></div>
            <div className="bg-[#050505] p-6 rounded-2xl border border-slate-800 font-mono text-xs text-green-400 min-h-[100px] shadow-inner relative overflow-hidden">
              <pre className="whitespace-pre-wrap leading-relaxed">{output.replace("✅ Output:\n", "").replace("❌ Error:\n", "")}</pre>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      return <pre className="bg-slate-950 p-6 rounded-3xl text-green-400 text-sm whitespace-pre-wrap font-mono">{content}</pre>;
    }
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="animate-spin mb-4" size={40} /><p className="uppercase tracking-widest text-[10px] font-black italic opacity-50">Menganalisis Jawaban...</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-slate-950 min-h-screen text-white selection:bg-blue-500/30">
      <button onClick={() => router.push(`/teacher/grading/${params.courseId}`)} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 group transition-all">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Sub-Bab</span>
      </button>

      <div className="max-w-6xl mx-auto space-y-10">
        {submissions.map((sub) => (
          <div key={sub.submission_id} className="bg-slate-900/40 border border-slate-800 rounded-[45px] overflow-hidden shadow-2xl transition-all hover:border-slate-700/50">
            <div className="p-8 border-b border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/20">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[22px] flex items-center justify-center shadow-lg"><User size={28} className="text-white" /></div>
                <div><h3 className="text-2xl font-black tracking-tight uppercase italic">{sub.student_name}</h3><span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${sub.status === 'graded' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>{sub.status}</span></div>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-6 bg-slate-700 rounded-full"></div><p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Instruksi Tugas</p></div>
                  <div className="bg-slate-950/50 p-7 rounded-[32px] border border-slate-800/50 text-sm leading-relaxed text-slate-400 italic">"{sub.task_instruction}"</div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-6 bg-blue-600 rounded-full animate-pulse"></div><p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Hasil Pekerjaan Siswa</p></div>
                  {renderStudentWork(sub.content)}
                </div>
              </div>

              <div className="mt-12 bg-slate-800/20 p-8 md:p-10 rounded-[40px] border border-slate-700/30">
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="flex-1 space-y-5">
                    <div className="flex items-center gap-2"><MessageSquare size={16} className="text-slate-500" /><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teacher's Feedback</p></div>
                    <textarea id={`feedback-${sub.submission_id}`} defaultValue={sub.feedback || ""} className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-sm text-slate-200 outline-none min-h-[120px]" placeholder="Feedback..." />
                    <div className="flex flex-wrap gap-2">
                      {quickFeedbacks.map((text, idx) => (
                        <button key={idx} onClick={() => { document.getElementById(`feedback-${sub.submission_id}`).value = text; }} className="text-[9px] bg-slate-900 hover:bg-blue-600/20 text-slate-500 px-4 py-2 rounded-full border border-slate-800 font-bold">+ {text}</button>
                      ))}
                    </div>
                  </div>
                  <div className="w-full lg:w-64 flex flex-col justify-between space-y-6">
                    <div className="space-y-5 text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Final Score</p>
                      <div className="relative"><input id={`score-${sub.submission_id}`} type="number" defaultValue={sub.score || ""} className="w-full bg-slate-900 border border-slate-800 rounded-[32px] py-8 text-center text-5xl font-black text-blue-500 outline-none" /><span className="absolute bottom-4 right-8 text-slate-700 font-black text-xs">/ 100</span></div>
                    </div>
                    <button disabled={submittingId === sub.submission_id} onClick={() => { const score = document.getElementById(`score-${sub.submission_id}`).value; const feedback = document.getElementById(`feedback-${sub.submission_id}`).value; handleUpdateGrade(sub.submission_id, score, feedback); }} className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                      {submittingId === sub.submission_id ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} Simpan Nilai
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}