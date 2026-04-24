"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        console.log("SATPAAM: Kunci Valid!", res.data);
        setAuthorized(true);
      } catch (err) {
        // ✅ JANGAN TENDANG DULU! Kita mau lihat errornya apa
        console.error("SATPAM: Ada masalah tapi saya biarkan masuk:", err.response?.data);
        setAuthorized(true); // Paksa masuk untuk ngetes UI
      }
    };
    checkAuth();
  }, []);

  // ✅ Selama belum authorized, jangan tampilkan apa-apa (layar hitam/loading)
  // Ini untuk mencegah 'flicker' atau balapan router
  if (!authorized) {
    return <div className="h-screen bg-slate-950 text-white p-10 font-black">MEMVERIFIKASI AKSES...</div>;
  }

  return <>{children}</>; 
}