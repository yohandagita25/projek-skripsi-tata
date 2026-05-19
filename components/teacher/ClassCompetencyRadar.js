"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell, CartesianGrid, ReferenceLine
} from 'recharts';
import { api } from "@/lib/api";
import { AlertCircle, CheckCircle2, TrendingUp, Loader2, BookOpen, ListChecks } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { materi_title, indicators } = payload[0].payload;
    
    return (
      <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl min-w-[300px] z-50">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
          <BookOpen size={18} className="text-blue-500" />
          <h4 className="text-sm font-black text-white uppercase tracking-tight">{materi_title || "Tanpa Judul"}</h4>
        </div>
        
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Rincian Indikator:</p>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {indicators && indicators.map((ind, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between items-start text-[11px] gap-4">
                <span className="text-slate-300 font-medium leading-tight flex-1">
                  {idx + 1}. {ind.name}
                </span>
                <span className={`font-black shrink-0 ${ind.val >= 70 ? 'text-blue-500' : 'text-rose-500'}`}>
                  {ind.val}%
                </span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${ind.val >= 70 ? 'bg-blue-500' : 'bg-rose-500'}`} 
                  style={{ width: `${ind.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center">
           <span className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">Rata-rata Modul</span>
           <span className="text-xl font-black text-white italic">{payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ClassCompetencyRadar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/teacher/class-competency");
        const rawData = res.data?.data || res.data || [];
        
        if (!Array.isArray(rawData)) {
            setData([]);
            return;
        }

        // --- LOGIKA GROUPING PER MODUL ---
        const grouped = rawData.reduce((acc, item) => {
          const key = item.materi_title || "Materi Umum";
          if (!acc[key]) {
            acc[key] = {
              materi_title: key,
              total_percentage: 0,
              count: 0,
              indicators: []
            };
          }
          const p = Math.round((parseInt(item.total_students_understood) / parseInt(item.total_students)) * 100) || 0;
          acc[key].total_percentage += p;
          acc[key].count += 1;
          acc[key].indicators.push({ name: item.indicator_name, val: p });
          return acc;
        }, {});

        const formattedData = Object.values(grouped).map((modul, index) => ({
          ...modul,
          display_label: `Modul ${index + 1}`,
          percentage: Math.round(modul.total_percentage / modul.count)
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Gagal memproses data modul:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="mt-10 h-64 flex flex-col items-center justify-center text-slate-500 bg-slate-900/20 rounded-[48px] border border-dashed border-slate-800">
      <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
      <p className="font-black uppercase text-[10px] tracking-widest text-white">Menyusun Analitik Modul...</p>
    </div>
  );

  if (error || data.length === 0) return (
    <div className="mt-10 p-12 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[48px]">
        <AlertCircle className="mx-auto text-slate-700 mb-4" size={48} />
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Belum Ada Data Kompetensi</p>
        <p className="text-slate-700 text-[10px] mt-2 italic">Pastikan indikator materi sudah dibuat dan siswa sudah mengisi refleksi.</p>
    </div>
  );

  return (
    <div className="mt-10 p-8 md:p-12 bg-slate-900/40 border border-slate-800 rounded-[56px] backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 blur-[120px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              Module Mastery Analysis
            </h3>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] ml-1">
            Analisis Rata-rata per Bab (ID-1 = Input Pertama)
          </p>
        </div>
        
        <div className="flex gap-3 text-white">
           <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
              <CheckCircle2 size={14} className="text-blue-500" /> Tuntas
           </div>
           <div className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
              <AlertCircle size={14} className="text-rose-500" /> Intervensi
           </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="display_label" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
            />
            <ReferenceLine y={70} stroke="#3b82f6" strokeDasharray="5 5" opacity={0.5} label={{ position: 'top', value: 'Goal 70%', fill: '#3b82f6', fontSize: 10, fontWeight: 'black' }} />
            
            <Bar dataKey="percentage" radius={[12, 12, 0, 0]} barSize={50}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.percentage >= 70 ? '#3b82f6' : '#f43f5e'}
                  className="hover:opacity-80 transition-all duration-300 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-12 p-8 bg-slate-950/40 border border-slate-800 rounded-[32px] flex items-center gap-6">
        <div className="flex-1 text-white">
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 italic">
                <ListChecks size={16} className="text-blue-500" /> Informasi Dashboard
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed italic">
                Grafik ini menampilkan tingkat penguasaan kelas berdasarkan <span className="text-white font-bold underline">Rata-rata Indikator</span> di setiap modul. Silakan arahkan kursor (hover) ke batang grafik untuk melihat rincian capaian setiap indikator pembelajaran.
            </p>
        </div>
      </div>
    </div>
  );
}