"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { BookOpen, Users, Layout, Loader2, ChevronDown, LayoutDashboard } from "lucide-react";
// ✅ SINKRONISASI: Menggunakan instance api (huruf kecil) agar token auth terbawa
import { api } from "@/lib/api";

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    modules: 0,
  });

  // State untuk Dropdown dan Data Grafik
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // ✅ PERBAIKAN: Menembak rute /api/teacher/dashboard-stats
        const res = await api.get("/api/teacher/dashboard-stats");
        
        // Sesuai teacherController: res.json({ status: "success", totalCourses, ... })
        const data = res.data; 

        setStats({
          courses: data.totalCourses || 0,
          students: data.totalStudents || 0,
          modules: data.totalModules || 0,
        });
        
        setCourses(data.courseList || []);
        
        if (data.courseList && data.courseList.length > 0) {
          setSelectedCourse(data.courseList[0].id);
        }
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        // ✅ PERBAIKAN: Menembak rute /api/teacher/course-progress/:id
        const res = await api.get(`/api/teacher/course-progress/${selectedCourse}`);
        
        // Unwrapping data dari { status: "success", data: [...] }
        const result = res.data?.data || res.data || [];
        setChartData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Gagal mengambil data grafik:", err);
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [selectedCourse]);

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500 gap-4">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em] italic opacity-50">Sinkronisasi Data...</p>
      </div>
    );
  }

  // ✅ PERBAIKAN ReferenceError: Menggunakan komponen Icon langsung tanpa typo variabel 'text'
  const cards = [
    { title: "Total Courses", value: stats.courses, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Students", value: stats.students, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Total Modules", value: stats.modules, icon: Layout, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="p-2 space-y-8 bg-slate-950 min-h-screen text-slate-200 selection:bg-blue-500/30">
      
      {/* HEADER - Sesuai gambar image_31e412.png */}
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
          <LayoutDashboard className="text-blue-500" size={40} />Teacher Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Pantau perkembangan kursus dan keaktifan siswa Anda di sini.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] hover:border-slate-700 transition-all group shadow-2xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</h2>
                <p className={`text-5xl font-black ${card.color} tracking-tighter mt-2`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform shadow-lg`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART SECTION - Sesuai gambar image_31e412.png */}
      <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[48px] shadow-sm backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="font-black text-xl text-white uppercase tracking-tight italic">Progres Penyelesaian Modul</h2>
            <p className="text-slate-500 text-xs mt-1">Menampilkan jumlah siswa yang menyelesaikan setiap modul</p>
          </div>

          {/* DROPDOWN KURSUS */}
          <div className="relative">
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-white px-8 py-4 pr-14 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all cursor-pointer shadow-xl"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
          </div>
        </div>

        <div className="h-[380px] w-full relative">
          {chartLoading && (
            <div className="absolute inset-0 bg-slate-900/50 z-10 flex items-center justify-center rounded-3xl backdrop-blur-sm">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          )}
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
              <XAxis 
                dataKey="module_name" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={15}
                fontFamily="inherit"
                fontWeight="900"
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dx={-10}
                fontWeight="900"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "20px", padding: "15px", fontSize: "12px", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                itemStyle={{ color: "#3b82f6", fontWeight: "900", textTransform: "uppercase" }}
                cursor={{ stroke: '#1e293b', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="completed_count"
                stroke="#3b82f6"
                strokeWidth={5}
                fillOpacity={1}
                fill="url(#colorStudents)"
                dot={{ r: 6, fill: "#3b82f6", strokeWidth: 3, stroke: "#0f172a" }}
                activeDot={{ r: 8, strokeWidth: 0, fill: "#fff" }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}