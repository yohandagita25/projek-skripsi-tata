"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/student/Navbar";
import Sidebar from "@/components/student/Sidebar";
import { api } from "@/lib/api";

export default function StudentLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${api}/auth/me`, {
        credentials: "include"
      });
      console.log("Satpam Dashboard: Kunci Valid!", res.data);
      if (!res.ok) {
        router.push("/login");
        console.error("Satpam Dashboard: Kunci TIDAK VALID, tendang balik ke login!", err.response?.data);
      }
    };
    checkAuth();
  }, []);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex bg-slate-950 min-h-screen">
    {/* Sidebar tetap di sisi kiri */}
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

    {/* Kontainer Kanan */}
    <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
      <Navbar collapsed={collapsed} />
      
      {/* Main Content dengan padding top agar tidak tertutup Navbar */}
      <main className="mt-16 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
  );
}