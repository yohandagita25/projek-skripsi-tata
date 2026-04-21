"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/app/services/courseService";
import { API } from "@/lib/api";

// IMPORT LIBRARY & CSS CUSTOM
import Calendar from "react-calendar";
import "./CalendarCustom.css"; 

import { 
  BookOpen, CheckCircle2, TrendingUp, Clock, 
  ArrowUpRight, Calendar as CalendarIcon, Award, Timer
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ enrolled: 0, completed: 18, percentage: 72 });
  const [userName, setUserName] = useState("");
  const [activeDays, setActiveDays] = useState([]);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(0); 
  const [streak, setStreak] = useState(0); // <-- STATE BARU UNTUK STREAK
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const courses = await getCourses();
        setStats(prev => ({ ...prev, enrolled: Array.isArray(courses) ? courses.length : 0 }));

        const userRes = await fetch(`${API}/auth/me`, { credentials: "include" });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserName(userData.name);
        }

        const activityRes = await fetch(`${API}/student/activity-calendar`, { credentials: "include" });
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActiveDays(activityData);
        }

        const durationRes = await fetch(`${API}/student/study-duration`, { credentials: "include" });
        if (durationRes.ok) {
          const durationData = await durationRes.json();
          setTotalStudyMinutes(durationData.totalMinutes || 0);
        }

        // --- FETCH DATA STREAK BARU ---
        const streakRes = await fetch(`${API}/student/learning-streak`, { credentials: "include" });
        if (streakRes.ok) {
          const streakData = await streakRes.json();
          setStreak(streakData.currentStreak || 0);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getTileClass = ({ date, view }) => {
    if (view === "month") {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      if (activeDays.includes(dateString)) {
        return "active-day-highlight";
      }
    }
    return null;
  };

  const cards = [
    { title: "Kursus Diikuti", value: stats.enrolled, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", unit: "Course" },
    { title: "Materi Selesai", value: stats.completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", unit: "Lesson" },
    { title: "Rata-Rata Progres", value: stats.percentage, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10", unit: "%" },
  ];

  const formatStudyTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return (
        <>
          {hours} <span className="text-lg text-blue-500 uppercase mx-1 italic tracking-wide">Jam</span> 
          {minutes} <span className="text-lg text-blue-500 uppercase ml-1 italic tracking-wide">Menit</span>
        </>
      );
    }
    return (
      <>
        {minutes} <span className="text-lg text-blue-500 uppercase ml-2 italic tracking-wide">Menit</span>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="p-2 space-y-8">
        
        {/* HEADER SECTION */}
        <div className="mt-3 mb-12">
          <h1 className="text-l font-black text-slate-600 uppercase tracking-tighter mb-2 leading-none select-none">Student Dashboard</h1>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Welcome, {userName}</h2>
          <div className="w-24 h-2 bg-blue-600 mt-6 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.4)]"></div>
        </div>

        {/* --- STREAK SECTION BARU --- */}
        <div className="mb-12 group relative overflow-hidden rounded-[48px] border border-orange-500/20 bg-orange-500/5 p-8 shadow-2xl transition-all hover:border-orange-500/40">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-[32px] bg-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-transform duration-500 group-hover:scale-110">
              <span className="text-4xl">🔥</span>
            </div>
            <div className="text-center md:text-left">
              <h4 className="mb-1 text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Learning Streak</h4>
              <div className="flex items-baseline justify-center md:justify-start gap-3">
                <span className="text-5xl font-black tracking-tighter text-white">
                  {loading ? "..." : streak}
                </span>
                <span className="text-xl font-black uppercase italic tracking-widest text-orange-200/40">Hari Berturut-turut</span>
              </div>
              <p className="mt-1 text-[10px] font-medium text-slate-500 italic uppercase tracking-wider">
                {streak > 0 ? "Hebat! Pertahankan momentum belajarmu hari ini." : "Mulai belajar hari ini untuk menyalakan apimu!"}
              </p>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-orange-600/5 blur-[80px]"></div>
        </div>

        {/* TOP SECTION: STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-800/60 p-10 rounded-[48px] relative overflow-hidden group hover:border-slate-600 transition-all duration-500"
            >
              <p className="text-slate-500 text-xl font-black uppercase tracking-normal mb-6 block select-none">
                {card.title}
              </p>

              <div className="flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-baseline gap-8">
                  <h3 className="text-3xl font-black text-white tracking-tighter leading-none">
                    {loading ? "..." : card.value}
                  </h3>
                  <span className="text-lg font-bold text-slate-600 uppercase tracking-normal">
                    {card.unit}
                  </span>
                </div>

                <div className={`p-4 rounded-3xl ${card.bg} ${card.color} shadow-xl group-hover:rotate-12 transition-transform duration-500 shrink-0`}>
                  <card.icon size={32} />
                </div>
              </div>
              <div className={`absolute -right-8 -bottom-8 w-40 h-40 blur-[80px] opacity-20 rounded-full ${card.bg}`}></div>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION: ACTIVITY & CALENDAR */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 items-stretch">
          <div className="xl:col-span-3 bg-slate-900/40 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Learning Activity</h3>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-1">Absensi & Keaktifan</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-2xl text-slate-400">
                <CalendarIcon size={24} />
              </div>
            </div>
            
            <div className="flex justify-center bg-slate-950/30 p-6 rounded-[32px] border border-slate-800/50">
              <Calendar 
                tileClassName={getTileClass}
                locale="id-ID"
                prev2Label={null}
                next2Label={null}
              />
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800/60 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Total Waktu Belajar</span>
                <span className="text-3xl font-black text-white tracking-tighter leading-none">
                  {loading ? "..." : formatStudyTime(totalStudyMinutes)}
                </span>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 flex flex-col gap-8">
            <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[48px] p-10 relative overflow-hidden shadow-2xl group flex flex-col justify-center">
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                    <Clock className="text-white" size={32} />
                 </div>
                 <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter leading-tight">Lanjutkan Perjalananmu</h3>
                 <p className="text-blue-100 text-lg mb-10 opacity-80 leading-relaxed font-medium italic text-xs">
                   Waktu belajar Anda akan terakumulasi secara otomatis dan diperbarui pada login berikutnya.
                 </p>
                 <button className="bg-white text-blue-700 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-4 transition-all hover:gap-6 shadow-xl active:scale-95 w-fit">
                   Mulai Belajar <ArrowUpRight size={20} strokeWidth={3} />
                 </button>
               </div>
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}