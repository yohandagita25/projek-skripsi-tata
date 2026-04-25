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
// ✅ PERBAIKAN: Gunakan api (huruf kecil) dari lib
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
        // ✅ PERBAIKAN: Gunakan api.get (Otomatis bawa cookie & URL Railway)
        const res = await api.get("/teacher/dashboard-stats");
        const data = res.data; // Axios meletakkan hasil di .data

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
        // ✅ PERBAIKAN: Gunakan api.get
        const res = await api.get(`/teacher/course-progress/${selectedCourse}`);
        setChartData(res.data || []);
      } catch (err) {
        console.error("Gagal mengambil data grafik:", err);
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
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    );
  }

  const cards = [
    { title: "Total Courses", value: stats.courses, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Students", value: stats.students, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Total Modules", value: stats.modules, icon: Layout, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="p-2 space-y-8 bg-slate-950 min-h-screen text-slate-200">
      
      {/* HEADER */}
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
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{card.title}</h2>
                <p className={`text-4xl font-black ${card.color} tracking-tighter mt-2`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART SECTION DENGAN DROPDOWN */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-bold text-lg text-white">Progres Penyelesaian Modul</h2>
            <p className="text-slate-500 text-xs">Menampilkan jumlah siswa yang menyelesaikan setiap modul</p>
          </div>

          {/* DROPDOWN KURSUS */}
          <div className="relative">
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-white px-6 py-3 pr-12 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="h-[350px] w-full relative">
          {chartLoading && (
            <div className="absolute inset-0 bg-slate-900/50 z-10 flex items-center justify-center rounded-3xl backdrop-blur-sm">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          )}
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="module_name" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={10}
                fontFamily="inherit"
                fontWeight="bold"
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dx={-10}
                fontWeight="bold"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", fontSize: "12px" }}
                itemStyle={{ color: "#3b82f6", fontWeight: "bold" }}
                cursor={{ stroke: '#1e293b', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="completed_count"
                stroke="#3b82f6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorStudents)"
                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#0f172a" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}