"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

// IMPORT UI ASLI BAPAK
import Navbar from "@/components/student/Navbar";
import Sidebar from "@/components/student/Sidebar";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // State untuk Sidebar Bapak

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ PERBAIKAN AXIOS: Pakai api.get (Axios otomatis kirim cookie)
        const res = await api.get("/auth/me");
        
        if (res.data.role === "student") {
          setAuthorized(true);
        } else {
          // Jika bukan student, tendang ke login
          window.location.replace("/login");
        }
      } catch (err) {
        console.error("Satpam Dashboard: Akses Ditolak", err);
        window.location.replace("/login");
      }
    };

    checkAuth();
  }, []);

  // ✅ LOADING STATE (Layar Hitam)
  if (!authorized) {
    return (
      <div className="h-screen bg-slate-950 text-white flex items-center justify-center font-black uppercase tracking-widest">
        MEMVERIFIKASI AKSES...
      </div>
    );
  }

  // ✅ KEMBALIKAN UI ASLI BAPAK (Sidebar & Navbar)
  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar Asli Bapak */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Navbar Asli Bapak */}
        <Navbar collapsed={collapsed} />
        
        <main className="mt-16 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}