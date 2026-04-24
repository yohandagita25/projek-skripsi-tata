"use client";
import { api } from "@/lib/api"; // Memanggil konfigurasi API yang sudah online
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // ✅ Mencegah refresh halaman otomatis oleh form
    
    try {
      const res = await api.post("/auth/login", { email, password });
      
      // Simpan role ke localStorage sebagai cadangan jika cookie bermasalah
      localStorage.setItem("userRole", res.data.role);
  
      // Ganti bagian if success di handleLogin Bapak
    if (res.data.role === "student") {
      console.log("Mencoba tembus ke dashboard...");
      // Gunakan timestamp (?t=...) agar browser menganggap ini link baru & tidak pakai cache
      window.location.replace(`/student/dashboard?t=${Date.now()}`);
    }
    } catch (err) {
      console.error("Login Gagal:", err.response?.data);
      alert("Gagal: " + (err.response?.data?.error || "Cek Koneksi"));
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* Animated Background - Tetap Sama */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse bottom-10 right-10"></div>
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse top-1/2 left-1/2"></div>
      </div>

      {/* NAVBAR - Tetap Sama */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-10 py-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
        <Link href="/">
          <h1 className="text-xl font-bold text-blue-400 cursor-pointer">
            Semantic Wave
          </h1>
        </Link>
      </nav>
      
      {/* LOGIN CARD - Tetap Sama */}
      <div className="flex items-center justify-center px-6 py-20">
        <div className="bg-slate-900/80 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-800">
          <h2 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-slate-400 text-center mb-8">
            Login to continue your learning journey
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-6 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold transition">
              Login
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Don't have an account? Register{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}