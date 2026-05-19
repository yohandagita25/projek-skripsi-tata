"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell, CartesianGrid 
} from 'recharts';
import { api } from "@/lib/api";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default function ClassCompetencyRadar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/teacher/class-competency");
        // Kita olah data agar Recharts bisa membaca persentase
        const formattedData = res.data.data.map(item => ({
          ...item,
          percentage: Math.round((item.total_students_understood / item.total_students) * 100)
        }));
        setData(formattedData);
      } catch (err) {
        console.error("Gagal mengambil statistik kelas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-40 flex items-center justify-center text-slate-500 animate-pulse font-black uppercase text-[10px] tracking-widest">Loading Analytics...</div>;

  return (
    <div className="mt-10 p-10 bg-slate-900/40 border border-slate-800 rounded-[48px] backdrop-blur-md shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
            <TrendingUp className="text-blue-500" size={28} /> Class Competency Radar
          </h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Analisis Ketuntasan Indikator Pembelajaran Seluruh Siswa
          </p>
        </div>
        
        {/* Legend Ringkas */}
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-blue-500">
              <CheckCircle2 size={12} /> Tuntas (&gt;70%)
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-rose-500">
              <AlertCircle size={12} /> Perlu Penguatan
           </div>
        </div>
      </div>

      {/* GRAFIK UTAMA */}
      <div className="h-[450px] w-full pr-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ left: 20, right: 40, top: 0, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              dataKey="indicator_name" 
              type="category" 
              width={180} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-2xl">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-1">{payload[0].payload.materi_title}</p>
                      <p className="text-xs font-bold text-white mb-2">{payload[0].payload.indicator_name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-white">{payload[0].value}%</span>
                        <span className="text-[9px] text-slate-500 uppercase font-black">Siswa Paham</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="percentage" radius={[0, 12, 12, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.percentage >= 70 ? '#3b82f6' : '#f43f5e'} 
                  className="transition-all duration-500"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHT BOX UNTUK SKRIPSI */}
      <div className="mt-10 p-6 bg-slate-950/50 border border-slate-800 rounded-[32px] flex items-start gap-4">
        <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-500">
           <AlertCircle size={20} />
        </div>
        <div>
           <h4 className="text-[10px] font-black uppercase text-white tracking-widest mb-1">Automated Insight</h4>
           <p className="text-xs text-slate-500 leading-relaxed italic">
             Sistem mendeteksi {data.filter(d => d.percentage < 70).length} indikator di bawah target ketuntasan (70%). 
             Data ini dapat Bapak gunakan sebagai dasar melakukan tindakan perbaikan (Remedial Teaching) pada pertemuan berikutnya.
           </p>
        </div>
      </div>
    </div>
  );
}