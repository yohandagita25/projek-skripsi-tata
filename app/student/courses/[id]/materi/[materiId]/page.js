"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  PlayCircle, FileText, ArrowRight, ArrowLeft, 
  Loader2, X, BrainCircuit, Save, Code as CodeIcon, Terminal, Play,
  MessageSquareQuote, ChevronDown, ChevronRight, LogOut
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
// ✅ SINKRONISASI: Menggunakan instance api (Axios) agar cookie & baseURL online terbawa
import { api } from "@/lib/api";
import { getFullCourses } from "@/app/services/courseService";

// INTEGRASI EDITOR & FLOWCHART
import Editor from "@monaco-editor/react";
import ReactFlow, { ReactFlowProvider, addEdge, useNodesState, useEdgesState, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { StartNode, ProcessNode, DecisionNode, InputOutputNode, TextNode } from "@/components/student/FlowchartNodes";
import FlowchartSidebar from "@/components/student/FlowchartSidebar";

const nodeTypes = { 
  start: StartNode, 
  process: ProcessNode, 
  decision: DecisionNode, 
  input: InputOutputNode,
  text: TextNode 
};

export default function MateriPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materi, setMateri] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModules, setOpenModules] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [canGoNext, setCanGoNext] = useState(false);

  const [prevMateriId, setPrevMateriId] = useState(null);
  const [nextMateriId, setNextMateriId] = useState(null);
  const [posttestId, setPosttestId] = useState(null);
  const [isPosttestDone, setIsPosttestDone] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [userReflection, setUserReflection] = useState("");
  const [runCount, setRunCount] = useState(0);

  const toggleModule = (modId) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ✅ PERBAIKAN: Gunakan rute /api/student/...
        const accessRes = await api.get(`/api/student/course-access/${params.id}`);
        const accessStatus = accessRes.data;

        if (accessStatus.posttestId) setPosttestId(accessStatus.posttestId);
        setIsPosttestDone(accessStatus.posttestDone || false);

        if (accessStatus.hasPretest && !accessStatus.pretestDone) {
          alert("Silakan kerjakan Pre-test terlebih dahulu!");
          router.push(`/student/test/${params.id}/pretest/${accessStatus.pretestId}`);
          return;
        }

        // Ambil Data Kursus Lengkap
        const allDataRes = await getFullCourses();
        // Unwrapping data jika dibungkus { status, data }
        const allData = allDataRes.data || allDataRes; 
        const currentCourse = allData.find(c => Number(c.id) === Number(params.id));
        
        if (currentCourse) {
          setCourse(currentCourse);
          setModules(currentCourse.modules || []);
          const allMateri = currentCourse.modules.flatMap(m => m.materi || []);
          const currentIndex = allMateri.findIndex(m => Number(m.id) === Number(params.materiId));
          const currentMateri = allMateri[currentIndex];
          
          if (!currentMateri) throw new Error("Materi tidak ditemukan");

          setMateri(currentMateri);

          // Auto-open modul materi saat ini
          const currentMod = currentCourse.modules.find(mod => mod.materi?.some(mat => mat.id === currentMateri.id));
          if (currentMod) setOpenModules(prev => ({ ...prev, [currentMod.id]: true }));

          // Reset status workspace
          setIsSubmitted(false);
          setShowWorkspace(false);
          setCanGoNext(false);
          setTimeLeft(30);
          setUserReflection("");
          setRunCount(0);
          setUserCode(currentMateri.assignment?.starter_code || "// Tulis kodemu di sini...");
          setNodes([]);
          setEdges([]);

          // ✅ Restore Jawaban Jika Sudah Pernah Mengirim
          try {
            const subRes = await api.get(`/api/student/submission/${params.materiId}`);
            const subData = subRes.data;

            if (subData.exists) {
              const savedContent = typeof subData.data.content === 'string' 
                ? JSON.parse(subData.data.content) 
                : subData.data.content;

              setIsSubmitted(true);
              setCanGoNext(true);
              setUserReflection(savedContent.reflection || "");

              if (currentMateri.assignment?.type === 'code') {
                setUserCode(savedContent.task?.code || "");
                setTerminalOutput(savedContent.task?.output || "");
                setRunCount(savedContent.run_count || 0);
              } else if (currentMateri.assignment?.type === 'flowchart') {
                const restoredNodes = (savedContent.task?.nodes || []).map((node) => ({
                  ...node,
                  data: {
                    ...node.data,
                    onChange: (newLabel) => {
                      setNodes((nds) =>
                        nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n))
                      );
                    }
                  }
                }));
                setNodes(restoredNodes);
                setEdges(savedContent.task?.edges || []);
              }
            }
          } catch (err) {
            console.error("Gagal restore jawaban:", err);
          }

          // Atur Navigasi
          if (currentIndex > 0) setPrevMateriId(allMateri[currentIndex - 1].id);
          if (currentIndex < allMateri.length - 1) setNextMateriId(allMateri[currentIndex + 1].id);
        }
      } catch (err) { 
        console.error("Error Loading Data:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    
    if (params?.id && params?.materiId) fetchData();
  }, [params.id, params.materiId]);

  // Logika Timer & Button Next
  useEffect(() => {
    if (!materi) return;
    const hasTask = materi.assignment || materi.has_reflection;
    if (!hasTask) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setCanGoNext(true);
      }
    } else {
      setCanGoNext(isSubmitted);
    }
  }, [timeLeft, materi, isSubmitted]);

  // Flowchart Callbacks
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
  
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    const label = event.dataTransfer.getData('application/label');
    if (!type || !reactFlowInstance) return;
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    
    const newNodeId = `node_${Date.now()}`;
    const newNode = { 
      id: newNodeId, 
      type, 
      position, 
      data: { 
        label: label,
        onChange: (newLabel) => {
          setNodes((nds) =>
            nds.map((n) => (n.id === newNodeId ? { ...n, data: { ...n.data, label: newLabel } } : n))
          );
        }
      } 
    };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  const onNodesDelete = useCallback((deleted) => {
      setNodes((nds) => nds.filter((node) => !deleted.find((d) => d.id === node.id)));
    }, [setNodes]
  );
  
  const onEdgesDelete = useCallback((deleted) => {
      setEdges((eds) => eds.filter((edge) => !deleted.find((d) => d.id === edge.id)));
    }, [setEdges]
  );

  const handleRunCode = async () => {
    setIsCompiling(true);
    setRunCount(prev => prev + 1);
    setTerminalOutput("System: Compiling... ⏳");
    try {
      const res = await api.post("/api/student/run-code", { 
        materi_id: materi.id, 
        code: userCode 
      });
      const data = res.data;
      setTerminalOutput(data.stderr ? `❌ Error:\n${data.stderr}` : `✅ Output:\n${data.stdout}`);
    } catch (err) { 
      setTerminalOutput("❌ Connection Error"); 
    } finally { 
      setIsCompiling(false); 
    }
  };

  const handleSendAssignment = async () => {
    if (materi?.has_reflection && !userReflection.trim()) {
      return alert("Harap isi respon refleksi Anda!");
    }
    
    const taskContent = materi.assignment?.type === 'code' 
      ? { code: userCode, output: terminalOutput } 
      : { nodes, edges };
    
    try {
      const res = await api.post("/api/student/submit-assignment", { 
        materi_id: materi.id, 
        content: { 
          task: taskContent, 
          reflection: userReflection, 
          run_count: runCount 
        } 
      });
  
      if (res.status === 200 || res.status === 201) {
        setIsSubmitted(true);
        setCanGoNext(true);
        // Catat aktivitas belajar siswa setelah submit
        await api.post("/api/student/log-activity");
        alert("🎉 Berhasil! Jawaban dan output terminal telah terkirim.");
      }
    } catch (err) {
      alert("Gagal mengirim jawaban.");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="uppercase tracking-[0.3em] text-[10px] font-black italic opacity-50">Syncing Workspace...</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-slate-200 flex flex-col overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Header (UI Aman) */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center shrink-0 justify-between">
        <div className="flex items-center gap-4">
            <button onClick={() => router.push('/student/courses')} className="p-2 hover:bg-slate-800 rounded-xl transition-all group">
                <X size={20} className="group-hover:rotate-90 transition-transform"/>
            </button>
            <h2 className="text-2xl font-black tracking-tighter uppercase text-white italic">{course?.title}</h2>
        </div>
        {!canGoNext && !materi?.assignment && (
            <div className="flex items-center gap-3 bg-blue-600/10 px-6 py-2 rounded-full border border-blue-500/20">
                <Clock size={16} className="text-blue-500 animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Selesaikan materi dalam {timeLeft}s</span>
            </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigasi (UI Aman) */}
        <aside className="w-80 bg-slate-900/50 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto p-6 space-y-4">
          {modules.map((module, mIdx) => (
            <div key={module.id} className="space-y-2">
              <button onClick={() => toggleModule(module.id)} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800 transition-all border border-slate-700/50">
                <span className="text-sm font-black text-white uppercase tracking-tight text-left">{mIdx + 1}. {module.title}</span>
                {openModules[module.id] ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
              </button>
              {openModules[module.id] && (
                <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  {module.materi?.map((item) => (
                    <div 
                        key={item.id} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${item.id == params.materiId ? "bg-blue-600 text-white shadow-lg italic" : "text-slate-500 hover:bg-slate-800/50"}`} 
                        onClick={() => router.push(`/student/courses/${params.id}/materi/${item.id}`)}
                    >
                        <FileText size={14} />
                        <span className="truncate">{item.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Area Konten Utama (UI Aman) */}
        <main className="flex-1 overflow-y-auto bg-slate-950 flex flex-col relative custom-scrollbar">
          <div className="w-full px-12 py-12 flex-1 max-w-5xl mx-auto">
            <h1 className="text-5xl font-black text-white mb-10 tracking-tighter uppercase italic">{materi?.title}</h1>

            {materi?.video_url && (
              <div className="mb-16 aspect-video rounded-[48px] overflow-hidden border-[12px] border-slate-900 shadow-2xl bg-black group relative">
                <iframe width="100%" height="100%" src={materi.video_url.includes('watch?v=') ? materi.video_url.replace('watch?v=', 'embed/') : materi.video_url} title="Video" frameBorder="0" allowFullScreen />
              </div>
            )}

            <div className="text-slate-300 text-lg leading-relaxed mb-20 bg-slate-900/40 p-12 rounded-[56px] border border-slate-800 shadow-inner">
              <article className="prose prose-invert prose-blue max-w-none prose-p:leading-loose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{materi?.content}</ReactMarkdown>
              </article>
            </div>

            {/* Area Refleksi (UI Aman) */}
            {materi?.has_reflection && (
              <div className="mt-16 p-10 rounded-[48px] bg-purple-600/5 border border-purple-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><MessageSquareQuote size={120} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                    <MessageSquareQuote className="text-purple-400" size={28} />
                    <span className="text-xs font-black text-purple-400 uppercase tracking-widest italic">Reflective Session</span>
                    </div>
                    <h5 className="text-white font-black text-2xl mb-8 uppercase tracking-tight leading-snug">{materi.reflection_question}</h5>
                    <textarea className="w-full bg-slate-950/80 border border-slate-800 p-8 rounded-[32px] text-white text-lg h-48 outline-none focus:border-purple-500 transition-all shadow-inner" value={userReflection} onChange={(e) => setUserReflection(e.target.value)} placeholder="Tuangkan pemahamanmu di sini..." />
                    <div className="mt-8 flex justify-end">
                    <button onClick={handleSendAssignment} className={`${isSubmitted ? "bg-slate-800 text-slate-500" : "bg-purple-600 text-white"} px-12 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95`}>
                        <Save size={18} /> {isSubmitted ? "SUBMISSION UPDATED" : "SEND REFLECTION"}
                    </button>
                    </div>
                </div>
              </div>
            )}

            {/* Area Penugasan (UI Aman) */}
            {materi?.assignment && (
              <div className="mt-16 p-10 rounded-[48px] bg-blue-600/5 border border-blue-500/20 shadow-2xl flex flex-col md:flex-row items-center gap-12 group transition-all hover:border-blue-500/40">
                <div className={`p-10 rounded-[40px] transition-all duration-500 ${isSubmitted ? "bg-green-500/10 text-green-500 rotate-12" : "bg-blue-500/10 text-blue-400 animate-pulse"}`}>
                  {materi.assignment.type === 'code' ? <CodeIcon size={64}/> : <BrainCircuit size={64}/>}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-black text-4xl uppercase tracking-tighter mb-3 italic">Assignment: {materi.assignment.type}</h4>
                  <p className="text-slate-400 text-xl mb-10 italic leading-relaxed">"{materi.assignment.instruction}"</p>
                  <button onClick={() => setShowWorkspace(!showWorkspace)} className="px-12 py-5 bg-blue-600 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-900/40 transition-all hover:bg-blue-500 active:scale-95">
                    {showWorkspace ? "CLOSE WORKSPACE" : "OPEN WORKSPACE"}
                  </button>
                </div>
              </div>
            )}

            {/* Workspace Editor (UI Aman) */}
            {showWorkspace && materi?.assignment && (
              <div className="mt-12 bg-slate-900 border-4 border-slate-800 rounded-[56px] overflow-hidden flex flex-col h-[850px] shadow-2xl">
                <div className="h-20 bg-slate-800/50 border-b border-slate-700 px-12 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">{materi.assignment.type} Environment</span>
                  </div>
                  <div className="flex gap-4">
                    {materi.assignment.type === 'code' && !isSubmitted && (
                      <button onClick={handleRunCode} disabled={isCompiling} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:bg-blue-500">
                        {isCompiling ? <Loader2 className="animate-spin" size={16}/> : <Play size={16}/>} RUN CODE
                      </button>
                    )}
                    {!isSubmitted && (
                        <button onClick={handleSendAssignment} className="bg-green-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-500 transition-all">
                            SUBMIT TASK
                        </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                  {materi.assignment.type === 'flowchart' ? (
                    <ReactFlowProvider>
                      <div className="flex flex-1 overflow-hidden">
                        <FlowchartSidebar />
                        <div className="flex-1 relative bg-slate-950">
                          <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            nodeTypes={nodeTypes}
                            deleteKeyCode={["Backspace", "Delete"]}
                            onNodesDelete={onNodesDelete}
                            onEdgesDelete={onEdgesDelete}
                            fitView
                          >
                            <Background color="#1e293b" variant="dots" gap={20}/>
                            <Controls className="bg-slate-800 border-slate-700 fill-white"/>
                          </ReactFlow>
                        </div>
                      </div>
                    </ReactFlowProvider>
                  ) : (
                    <div className="flex-1 flex overflow-hidden font-mono">
                      <div className="flex-1 border-r border-slate-800">
                        <Editor height="100%" defaultLanguage="cpp" theme="vs-dark" value={userCode} onChange={(v) => setUserCode(v)} options={{ fontSize: 18, minimap: { enabled: false }, readOnly: isSubmitted, padding: { top: 40 } }} />
                      </div>
                      <div className="w-[400px] bg-black p-10 flex flex-col">
                        <div className="flex items-center gap-3 mb-6 text-green-500">
                            <Terminal size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Console Output</span>
                        </div>
                        <div className="flex-1 text-sm text-green-400/80 italic overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                          <div className="mb-4 text-blue-500/50 font-black uppercase text-[10px]">Execution Count: {runCount}</div>
                          {terminalOutput || "> System Ready. Waiting for execution..."}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigasi Materi (UI Aman) */}
            <div className="mt-32 mb-20 flex justify-between items-center border-t border-slate-900 pt-16">
              {prevMateriId ? (
                <Link href={`/student/courses/${params.id}/materi/${prevMateriId}`} className="text-slate-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all group">
                    <div className="p-3 bg-slate-900 rounded-full group-hover:bg-slate-800"><ArrowLeft size={18} /></div> PREVIOUS MODULE
                </Link>
              ) : <div/>}
              
              {nextMateriId ? (
                <button 
                    disabled={!canGoNext} 
                    onClick={() => router.push(`/student/courses/${params.id}/materi/${nextMateriId}`)} 
                    className={`font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 px-14 py-6 rounded-[32px] transition-all shadow-2xl ${!canGoNext ? "bg-slate-900 text-slate-700 opacity-50 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-500 hover:gap-6 active:scale-95"}`}
                >
                    NEXT MODULE <ArrowRight size={20} strokeWidth={3} />
                </button>
              ) : (
                <button 
                    onClick={() => isPosttestDone ? router.push('/student/courses') : router.push(`/student/test/${params.id}/posttest/${posttestId}`)} 
                    className={`px-14 py-6 rounded-[32px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 shadow-2xl transition-all active:scale-95 ${isPosttestDone ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-orange-600 text-white hover:bg-orange-500 animate-bounce"}`}
                >
                  {isPosttestDone ? "EXIT COURSE" : "FINAL POST-TEST"} <ArrowRight size={20} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}