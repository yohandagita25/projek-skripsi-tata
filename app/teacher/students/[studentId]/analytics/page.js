"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { 
  ArrowLeft, BarChart2, CheckCircle2, XCircle, 
  Target, Zap, BookOpen, Loader2, Calendar
} from "lucide-react";

export default function StudentAnalytics() {
  const { studentId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/api/teacher/analytics/${studentId}`);
        setData(res.data);
      } catch (err) {
        console.error("Error loading analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [studentId]);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="uppercase tracking-[0.3em] text-xs font-black italic text-white">Analyzing Student Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="p-4 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="text-right">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Learning Analytics</h1>
          <p className="text-blue-500 text-xs font-black uppercase tracking-[0.2em]">Competency Mapping System</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 font-black italic">
        <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[40px] relative overflow-hidden group">
          <Target className="absolute -right-4 -bottom-4 text-blue-500/10 group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] uppercase tracking-widest text-blue-500 mb-2">Overall Competency</p>
          <h2 className="text-5xl tracking-tighter text-white">{data?.summary?.overall_competency_percent}%</h2>
        </div>
        <div className="bg-purple-600/10 border border-purple-500/20 p-8 rounded-[40px] relative overflow-hidden group">
          <Zap className="absolute -right-4 -bottom-4 text-purple-500/10 group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] uppercase tracking-widest text-purple-500 mb-2">Materials Finished</p>
          <h2 className="text-5xl tracking-tighter text-white">{data?.summary?.materi_finished} <span className="text-xl text-slate-600">/ {data?.summary?.total_materi}</span></h2>
        </div>
        <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 rounded-[40px] relative overflow-hidden group">
          <Calendar className="absolute -right-4 -bottom-4 text-emerald-500/10 group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] uppercase tracking-widest text-emerald-500 mb-2">Active Engagement</p>
          <h2 className="text-5xl tracking-tighter text-white">High</h2>
        </div>
      </div>

      {/* ANALYTICS LIST PER MATERI */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
           <BarChart2 size={16} /> Detailed Competency Breakdown
        </h3>
        
        {data?.data.map((item) => (
          <div key={item.materi_id} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[48px] hover:border-blue-500/30 transition-all group shadow-xl">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
              <div className="flex-1">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic flex items-center gap-2 mb-2">
                  <BookOpen size={12} /> {item.module_title}
                </span>
                <h4 className="text-2xl font-black text-white uppercase tracking-tight italic">{item.materi_title}</h4>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white italic group-hover:text-blue-500 transition-colors">{item.progress.percent}%</div>
                <div className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Self-Assessment Score</div>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-3 bg-slate-950 rounded-full mb-8 p-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                style={{ width: `${item.progress.percent}%` }}
              ></div>
            </div>

            {/* INDICATORS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {item.details.all_indicators.map((ind, idx) => {
                const isAchieved = item.details.achieved_indicators.includes(ind);
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                      isAchieved ? "bg-blue-600/5 border-blue-500/20 text-white" : "bg-slate-950/50 border-slate-800 text-slate-600"
                    }`}
                  >
                    {isAchieved ? (
                      <CheckCircle2 size={20} className="text-blue-500 shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-slate-800 shrink-0" />
                    )}
                    <span className="text-xs font-bold italic tracking-tight">{ind}</span>
                  </div>
                );
              })}
              {item.details.all_indicators.length === 0 && (
                <div className="text-[10px] font-black uppercase text-slate-700 italic">No specific indicators for this unit</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}