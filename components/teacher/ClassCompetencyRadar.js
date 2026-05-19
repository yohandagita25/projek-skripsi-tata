"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { api } from "@/lib/api";
import { AlertCircle, CheckCircle2, TrendingUp, Loader2 } from "lucide-center"; // Sesuaikan jika lucide-react

export default function ClassCompetencyRadar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // 1. Ambil data dari API
        const res = await api.get("/api/teacher/class-competency");
        
        // 2. Logging untuk Debugging (Bisa Bapak cek di F12 Console)
        console.log("Raw API Response:", res.data);

        // 3. Ambil array data (Handle format {status: 'success', data: []})
        const rawData = res.data?.data || res.data || [];

        if (Array.isArray(rawData)) {
          const formattedData = rawData.map(item => {
            // ✅ PERBAIKAN KRITIS: Paksa ke Integer agar tidak NaN saat pembagian
            const understood = parseInt(item.total_students_understood) || 0;
            const total = parseInt(item.total_students) || 0;
            
            return {
              ...item,
              percentage: total > 0 ? Math.round((understood / total) * 100) : 0
            };
          });
          
          setData(formattedData);
        }
      } catch (err) {
        console.error("Gagal mengambil statistik kelas:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="mt-10 h-64 flex flex-col items-center justify-center bg-slate-900/20 border border-slate-800 rounded-[48px] border-dashed">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Syncing Class Analytics...</p>
      </div>
    );
  }

  // Jika setelah loading selesai data tetap kosong
  if (data.length === 0) {
    return (
      <div className="mt-10 p-20 text-center bg-slate-900/20 border border-slate-800 border-dashed rounded-[48px]">
        <AlertCircle className="mx-auto text-slate-700 mb-4" size={48} />
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">No Competency Data Detected</p>
        <p className="text-slate-700 text-[10px] mt-2 italic">Pastikan siswa sudah mengisi checklist capaian pembelajaran.</p>
      </div>
    );
  }

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
        
        {/* Legend */}
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
      <div className="h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ left: 40, right: 60, top: 0, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              dataKey="indicator_name" 
              type="category" 
              width={180} 
              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-2xl">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-1 italic">{payload[0].payload.materi_title}</p>
                      <p className="text-xs font-bold text-white mb-2">{payload[0].payload.indicator_name}</p>
                      <div className="flex items-center gap-2 border-t border-slate-800 pt-2 mt-2">
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
                  className="transition-all duration-700"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* - AUTOMATED INSIGHT - */}
      <div className="mt-10 p-6 bg-slate-950/50 border border-slate-800 rounded-[32px] flex items-start gap-4">
        <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-500">
           <AlertCircle size={20} />
        </div>
        <div>
           <h4 className="text-[10px] font-black uppercase text-white tracking-widest mb-1">Automated Insight</h4>
           <p className="text-xs text-slate-500 leading-relaxed italic">
             Ditemukan {data.filter(d => d.percentage < 70).length} indikator yang belum mencapai target ketuntasan kelas. Disarankan untuk memberikan penguatan pada materi terkait.
           </p>
        </div>
      </div>
    </div>
  );
}