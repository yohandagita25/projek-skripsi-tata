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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Berikan jeda sangat singkat untuk memastikan browser sudah siap dengan cookienya
        const res = await api.get("/auth/me");
        
        console.log("Satpam: Verifikasi Berhasil!", res.data);
        
        if (res.data.role === "student") {
          setAuthorized(true);
        } else {
          console.error("Satpam: Role bukan student, tapi:", res.data.role);
          window.location.href = "/login";
        }
      } catch (err) {
        // Cek detail error di console
        console.error("Satpam: Akses Ditolak.", err.response?.data || err.message);
        
        // Jika tidak berwenang, tendang ke login
        // Kita gunakan window.location.href agar pembersihan state sempurna
        window.location.href = "/login";
      }
    };

    checkAuth();
  }, []);

  // ✅ LOADING STATE (Layar Hitam) - TETAP SAMA
  if (!authorized) {
    return (
      <div className="h-screen bg-slate-950 text-white flex items-center justify-center font-black uppercase tracking-widest">
        MEMVERIFIKASI AKSES...
      </div>
    );
  }

  // ✅ UI ASLI BAPAK (Sidebar & Navbar) - TETAP SAMA
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