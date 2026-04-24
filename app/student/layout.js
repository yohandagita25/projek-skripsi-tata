"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // KITA MATIKAN DULU CEK AUTHNYA UNTUK TES
    console.log("SATPAM DIMATIKAN SEMENTARA - HARUSNYA DASHBOARD MUNCUL");
    setAuthorized(true); 
  }, []);

  // ✅ Selama belum authorized, jangan tampilkan apa-apa (layar hitam/loading)
  // Ini untuk mencegah 'flicker' atau balapan router
  if (!authorized) {
    return <div className="h-screen bg-slate-950 text-white p-10 font-black">MEMVERIFIKASI AKSES...</div>;
  }

  return <>{children}</>; 
}