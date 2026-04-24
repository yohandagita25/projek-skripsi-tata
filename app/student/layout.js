"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/student/Navbar";
import Sidebar from "@/components/student/Sidebar";
import { api } from "@/lib/api"; 

export default function StudentLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.role === "student") {
          setAuthorized(true);
        } else {
          // Jika role salah (misal teacher nyasar), tendang
          window.location.replace("/login");
        }
      } catch (err) {
        console.error("Gagal Validasi:", err);
        window.location.replace("/login");
      }
    };
    checkAuth();
  }, []);

  // Tampilan saat mengecek token
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white font-black uppercase tracking-[0.3em]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mr-4"></div>
        MEMVERIFIKASI AKSES...
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <Navbar collapsed={collapsed} />
        
        <main className="mt-16 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}