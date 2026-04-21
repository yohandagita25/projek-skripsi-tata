"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
  
    router.push("/");
  
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-slate-950 shadow-md flex items-center justify-between px-6 z-50">      
      <h1 className="text-xl font-bold text-blue-600">
        LMS Learning
      </h1>
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>        
        <button className="bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200">
          🔔
        </button>

        {/* Profile */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">Student</span>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-40 bg-white border rounded-lg shadow-md">

            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}