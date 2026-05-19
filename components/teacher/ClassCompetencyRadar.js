"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell, CartesianGrid, ReferenceLine
} from 'recharts';
import { api } from "@/lib/api";
import { AlertCircle, CheckCircle2, TrendingUp, Loader2, Lightbulb, Target } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-2xl max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <Target size={12} className="text-blue-500" />
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">
            {payload[0].payload.materi_title}
          </p>
        </div>
        <p className="text-sm font-bold text-white leading-relaxed mb-4">
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
        
        // Memastikan data diurutkan sesuai urutan masuk dari database, lalu diberi label 1 - selesai
        const formattedData = rawData.map((item, index) => ({
          ...item,
          id_sort: index, // Simpan urutan asli
          display_label: `ID-${index + 1}`,
          percentage: Math.round((parseInt(item.total_students_understood) / parseInt(item.total_students)) * 100) || 0
        }));

        // Pastikan urutan tetap dari Indikator 1 di paling kiri
        setData(formattedData);
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
      <p className="font-black uppercase text-[10px] tracking-widest text-white">Analyzing Data Sequence...</p>
    </div>
  );

  const remedialCount = data.filter(d => d.percentage < 70).length;

  return (
    <div className="mt-10 p-8 md:p-12 bg-slate-900/40 border border-slate-800 rounded-[56px] backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 blur-[120px] -z-10"></div>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              Competency Vertical Metric
            </h3>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] ml-1">
            Visualisasi Ketuntasan Belajar Klasikal (Urutan 1 ke-n)
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

      {/* CHART - Vertical Bar (Urutan dari Kiri ke Kanan) */}
      <div className="h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="display_label" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
              dy={10}
              interval={0} // Pastikan semua label ID muncul tidak tersembunyi
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
            <ReferenceLine y={70} stroke="#3b82f6" strokeDasharray="5 5" opacity={0.5} label={{ position: 'right', value: 'KKM 70', fill: '#3b82f6', fontSize: 10, fontWeight: 'black' }} />
            
            <Bar dataKey="percentage" radius={[12, 12, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.percentage >= 70 ? '#3b82f6' : '#f43f5e'}
                  className="hover:opacity-80 transition-all duration-300 cursor-help"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-slate-950/40 border border-slate-800 rounded-[32px] flex items-start gap-5">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 shrink-0">
                <Lightbulb size={24} />
            </div>
            <div>
                <h4 className="text-[11px] font-black uppercase text-white tracking-widest mb-2">Petunjuk Navigasi</h4>
                <ul className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
                    <li>• Urutan <span className="text-slate-300 font-bold italic">ID-1</span> dimulai dari indikator pertama yang Bapak input di database.</li>
                    <li>• Semakin ke kanan menunjukkan progres indikator materi selanjutnya.</li>
                    <li>• Arahkan kursor untuk membaca teks capaian pembelajaran secara lengkap.</li>
                </ul>
            </div>
        </div>

        <div className={`p-8 border rounded-[32px] flex items-start gap-5 transition-colors ${remedialCount > 0 ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
            <div className={`p-3 rounded-2xl shrink-0 ${remedialCount > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                <AlertCircle size={24} />
            </div>
            <div>
                <h4 className={`text-[11px] font-black uppercase tracking-widest mb-2 ${remedialCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    Analisis Strategis
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    {remedialCount > 0 
                      ? `Terdapat ${remedialCount} indikator yang belum tuntas secara klasikal. Prioritaskan pendalaman materi pada ID tersebut sebelum beralih ke modul berikutnya.`
                      : `Seluruh indikator telah mencapai batas KKM 70%. Target pembelajaran kelas telah terpenuhi dengan sangat baik.`
                    }
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}