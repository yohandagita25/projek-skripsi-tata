"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import Navbar from "@/components/student/Navbar";
import Sidebar from "@/components/student/Sidebar";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Berikan waktu napas 500ms agar browser selesai menulis cookie ke memori
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const res = await api.get("/auth/me");
        
        if (res.data.role === "student") {
          setAuthorized(true);
        } else {
          // Jika role salah, tendang
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Satpam: Akses Ditolak.", err.response?.data || err.message);
        
        // Hapus token yang mungkin sudah expired/invalid
        localStorage.removeItem("token"); 
        localStorage.removeItem("userRole");
        
        window.location.href = "/login";
      }
    };

    checkAuth();
  }, []);

  if (!authorized) {
    return (
      <div className="h-screen bg-slate-950 text-white flex items-center justify-center font-black uppercase tracking-widest">
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