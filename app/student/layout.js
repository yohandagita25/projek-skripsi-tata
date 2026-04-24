"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/student/Navbar";
import Sidebar from "@/components/student/Sidebar";
import { api } from "@/lib/api"; // ✅ Ini adalah instance axios

export default function StudentLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // ✅ Tambahkan loading state agar tidak kedip
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ PERBAIKAN: Gunakan api.get, bukan fetch manual
        const res = await api.get("/auth/me");
        
        console.log("Satpam Dashboard: Kunci Valid!", res.data);
        setLoading(false); // Matikan loading jika sukses
      } catch (err) {
        // ✅ Jika error (token habis/tidak ada), lempar balik ke login
        console.error("Satpam Dashboard: Kunci TIDAK VALID, tendang balik!");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // ⏳ Jika masih mengecek kunci, tampilkan loading dulu
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white font-bold uppercase tracking-widest">
        Verifying Session...
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar tetap di sisi kiri */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Kontainer Kanan */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <Navbar collapsed={collapsed} />
        
        {/* Main Content */}
        <main className="mt-16 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}