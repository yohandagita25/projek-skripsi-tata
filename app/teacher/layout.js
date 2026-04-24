"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/teacher/Navbar";
import Sidebar from "@/components/teacher/Sidebar";
// ✅ PERBAIKAN: Import 'api' (huruf kecil) bukan cuma 'API'
import { api } from "@/lib/api"; 

export default function TeacherLayout({ children }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🔒 CHECK AUTH (pakai cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ Sekarang 'api' sudah dikenali karena sudah di-import di atas
        const res = await api.get("/auth/me");
  
        // Jika sukses, matikan loading
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        // Jika tidak ada session, lempar balik ke login
        router.replace("/login"); 
      }
    };
  
    checkAuth();
  }, [router]);

  // 💾 Sidebar state (localStorage) - Tetap Sama
  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    if (saved !== null) {
      setIsOpen(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar", JSON.stringify(isOpen));
  }, [isOpen]);

  // ⏳ Loading screen - Tetap Sama
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mr-3"></div>
        Checking Authorization...
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen
        ${isOpen ? "ml-64" : "ml-20"}`}
      >
        <Navbar />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}