"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell, CartesianGrid 
} from 'recharts';
import { api } from "@/lib/api";
import { AlertCircle, CheckCircle2, TrendingUp, Loader2 } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-2xl max-w-sm">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 italic">
          {payload[0].payload.materi_title}
        </p>
        <p className="text-sm font-bold text-white leading-relaxed mb-3">
          {payload[0].payload.indicator_name}
        </p>
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
           <span className="text-[10px] uppercase font-black text-slate-500">Mastery Level</span>
           <span className={`text-2xl font-black ${payload[0].value >= 70 ? 'text-blue-500' : 'text-rose-500'}`}>
             {payload[0].value}%
           </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ClassCompetencyRadar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/teacher/class-competency");
        const rawData = res.data?.data || [];
        
        // 1. Memetakan data asli
        const formattedData = rawData.map((item, index) => ({
          ...item,
          // Simpan nomor urut asli berdasarkan index database (dimulai dari 1)
          original_index: index + 1,
          percentage: Math.round((parseInt(item.total_students_understood) / parseInt(item.total_students)) * 100) || 0
        }));

        // 2. Balik urutan array agar data pertama (Indikator 1) berada di atas pada grafik horizontal
        // Karena Recharts merender data pertama dari bawah ke atas pada Layout Vertical.
        const reversedData = [...formattedData].reverse().map((item) => ({
          ...item,
          display_label: `Indikator ${item.original_index}`
        }));

        setData(reversedData);
      } catch (err) {
        console.error("Gagal mengambil statistik kelas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center text-slate-500 bg-slate-900/20 rounded-[48px] border border-dashed border-slate-800">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p className="font-black uppercase text-[10px] tracking-widest">Generating Competency Radar...</p>
    </div>
  );

  return (
    <div className="mt-10 p-8 md:p-12 bg-slate-900/40 border border-slate-800 rounded-[56px] backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[120px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              Class Competency Radar
            </h3>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] ml-1">
            Analisis Ketuntasan per Indikator (Indikator 1 = Urutan Pertama)
          </p>
        </div>
        
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-500 shadow-lg shadow-blue-500/5">
              <CheckCircle2 size={14} /> Tuntas
           </div>
           <div className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-rose-500 shadow-lg shadow-rose-500/5">
              <AlertCircle size={14} /> Remedial
           </div>
        </div>
      </div>

      <div className="h-[600px] w-full pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ left: 20, right: 60, top: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} opacity={0.2} />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              dataKey="display_label" 
              type="category" 
              width={120} 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(255,255,255,0.02)' }} 
            />
            <Bar 
              dataKey="percentage" 
              radius={[0, 20, 20, 0]} 
              barSize={24}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.percentage >= 70 ? '#3b82f6' : '#f43f5e'}
                  className="hover:fill-opacity-80 transition-all duration-300 cursor-help shadow-xl"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10 p-8 bg-slate-950/40 border border-slate-800 rounded-[32px] flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500">
           <AlertCircle size={24} />
        </div>
        <div className="flex-1 text-center md:text-left">
           <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] mb-2">Pedagogical Insight</h4>
           <p className="text-xs text-slate-400 leading-relaxed italic max-w-2xl">
             Arahkan kursor pada batang untuk melihat deskripsi capaian pembelajaran secara mendalam.
           </p>
        </div>
      </div>
    </div>
  );
}