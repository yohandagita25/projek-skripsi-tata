"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeacherNavbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // 🔒 Close dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Logout handler
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6">

      {/* Title */}
      <div className="flex items-center gap-6">
        
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>

        {/* Profile */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:bg-slate-800 px-2 py-1 rounded-lg cursor-pointer transition"
        >
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full border border-slate-700"
          />
          <div className="text-sm">
            <p className="font-medium">Teacher</p>
            <p className="text-gray-400 text-xs">Admin</p>
          </div>
        </div>

        {/* 🔽 DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-14 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-lg overflow-hidden animate-fadeIn">

            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-sm font-semibold">Teacher</p>
              <p className="text-xs text-gray-400">teacher@email.com</p>
            </div>

            <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-800 text-sm">
              <User size={16} /> Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-600 text-sm text-red-400 hover:text-white transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}

      </div>
    </nav>
  );
}