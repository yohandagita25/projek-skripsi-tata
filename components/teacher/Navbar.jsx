"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, User, Sparkles, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api"; // Import instance API Bapak

export default function TeacherNavbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ name: "Loading...", email: "" });
  const dropdownRef = useRef(null);
  const router = useRouter();

  // 1. Ambil Data Guru secara dinamis
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await api.get("/api/auth/me");
        if (res.status === 200) {
          setUser({
            name: res.data.name,
            email: res.data.email,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data guru:", error.message);
        setUser({ name: "Teacher", email: "teacher@system.com" });
      }
    };
    fetchTeacherData();
  }, []);

  // 2. Close dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Logout handler (Bersihkan Storage & Cookie)
  const handleLogout = async () => {
    try {
      localStorage.clear();
      // Hapus cookie token secara manual untuk keamanan ekstra
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      
      await api.post("/api/auth/logout").catch(() => {}); // Panggil logout backend jika ada
      window.location.href = "/";
    } catch (error) {
      window.location.href = "/";
    }
  };

  return (
    <nav className="sticky top-0 z-50 h-20 bg-slate-950/40 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-10">
      
      {/* Title / Brand Section */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-500">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">TEACHER PANEL</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Semantic Wave</p>
        </div>
      </div>

      {/* Right Section Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all border cursor-pointer
          ${open ? "bg-slate-900 border-slate-700 shadow-2xl scale-[1.02]" : "bg-transparent border-transparent hover:bg-slate-900/50"}`}
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <User size={20} strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 border-2 border-slate-950 rounded-full shadow-lg"></div>
          </div>

          <div className="hidden md:block text-left">
            <p className="text-sm font-bold uppercase text-white mb-0.5">{user.name}</p>
            <p className="text-[10px] uppercase tracking-widest font-black text-indigo-500 flex items-center gap-1">
              <Sparkles size={8} /> Educator
            </p>
          </div>
        </div>

        {/* 🔽 DROPDOWN MENU */}
        {open && (
          <div className="absolute right-0 top-full mt-4 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] z-[999] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            
            {/* Header Profile */}
            <div className="p-5 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Verified Educator</p>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <Mail size={14} /> {user.email}
              </p>
            </div>

            {/* Actions */}
            <div className="p-3">
              <button className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-2xl transition-all group">
                <User size={18} className="text-slate-500 group-hover:text-indigo-500" />
                Pengaturan Profil
              </button>
              
              <hr className="my-2 border-slate-800" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}