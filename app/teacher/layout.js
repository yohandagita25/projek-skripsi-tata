"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/teacher/Navbar";
import Sidebar from "@/components/teacher/Sidebar";
import { API } from "@/lib/api";

export default function TeacherLayout({ children }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true); // ⬅️ penting

  // 🔒 CHECK AUTH (pakai cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/auth/me`, {
          credentials: "include", // ⬅️ ambil cookie
        });

        if (!res.ok) {
          router.replace("/login"); // ⛔ pakai replace
        } else {
          setLoading(false);
        }
      } catch (err) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  // 💾 Sidebar state (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    if (saved !== null) {
      setIsOpen(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar", JSON.stringify(isOpen));
  }, [isOpen]);

  // ⏳ Loading screen (biar tidak flicker)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        Loading...
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