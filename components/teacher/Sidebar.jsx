"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Menu,
  ChevronDown,
  GraduationCap,
  ShieldCheck
} from "lucide-react";

export default function TeacherSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  
  // State terpisah untuk setiap dropdown agar tidak bentrok
  const [openTest, setOpenTest] = useState(false);
  const [openGrades, setOpenGrades] = useState(false);

  // Otomatis buka dropdown berdasarkan pathname saat ini agar user tidak bingung
  useEffect(() => {
    if (pathname.startsWith("/teacher/test")) {
      setOpenTest(true);
    }
    if (pathname.startsWith("/teacher/results") || pathname.startsWith("/teacher/grading")) {
      setOpenGrades(true);
    }
  }, [pathname]);

  const menu = [
    { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "Courses", href: "/teacher/courses", icon: BookOpen },
    { 
      name: "Test Management", 
      href: "/teacher/test", 
      icon: FileText, 
      isDropdown: true,
      isOpenState: openTest,
      setOpenState: setOpenTest,
      subItems: [
        { name: "Pretest Soal", href: "/teacher/test/pretest" },
        { name: "Posttest Soal", href: "/teacher/test/posttest" },
      ]
    },
    { 
      name: "Student Grades", 
      href: "/teacher/results", 
      icon: GraduationCap, 
      isDropdown: true,
      isOpenState: openGrades,
      setOpenState: setOpenGrades,
      subItems: [
        { name: "Nilai Pretest", href: "/teacher/results/pretest" },
        { name: "Nilai Posttest", href: "/teacher/results/posttest" },
        { name: "Nilai Tugas", href: "/teacher/grading" },
      ]
    },
    { name: "Students List", href: "/teacher/students", icon: Users },
  ];

  return (
    <aside
      className={`h-screen bg-slate-950 text-white transition-all duration-500 z-50 border-r border-slate-900 flex flex-col fixed top-0 left-0
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Header: Logo / Branding */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-900/50">
        {isOpen && (
          <div className="flex items-center gap-3 animate-in fade-in duration-700">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-tight">
              ADMIN <span className="text-indigo-500">PANEL</span>
            </h1>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-slate-500 hover:text-white p-2.5 rounded-xl hover:bg-slate-900 transition-all ${!isOpen ? "mx-auto" : ""}`}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Menu List */}
      <nav className="flex-grow mt-8 px-3 overflow-y-auto no-scrollbar">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (item.isDropdown) {
              return (
                <li key={item.name} className="relative">
                  <button
                    onClick={() => {
                      if (!isOpen) setIsOpen(true);
                      item.setOpenState(!item.isOpenState);
                    }}
                    className={`group w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300
                    ${isActive && !item.isOpenState ? "bg-indigo-600/10 text-indigo-400" : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"}`}
                  >
                    <div className="min-w-[22px] flex justify-center group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>
                    {isOpen && (
                      <div className="flex items-center justify-between w-full animate-in slide-in-from-left-2 duration-300">
                        <span className="font-semibold tracking-wide">{item.name}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${item.isOpenState ? "rotate-180" : ""}`} />
                      </div>
                    )}
                  </button>

                  {/* Submenu Items */}
                  {item.isOpenState && isOpen && (
                    <ul className="mt-2 ml-10 space-y-1 border-l border-slate-800 animate-in slide-in-from-top-2 duration-300">
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className={`block py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                isSubActive ? "text-indigo-400 bg-indigo-400/5" : "text-slate-600 hover:text-slate-200"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  
                  {/* Tooltip saat Sidebar mengecil */}
                  {!isOpen && (
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-slate-700 whitespace-nowrap shadow-2xl">
                      {item.name}
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`group flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300
                  ${isActive ? "bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]" : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"}`}
                >
                  <div className="min-w-[22px] flex justify-center group-hover:scale-110 transition-transform">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  {isOpen && (
                    <span className="font-semibold tracking-wide animate-in slide-in-from-left-2 duration-300">
                      {item.name}
                    </span>
                  )}

                  {!isOpen && (
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap border border-slate-700 shadow-2xl">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Status */}
      {isOpen && (
        <div className="p-5 border-t border-slate-900/50">
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Teacher Mode</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-300 font-medium">Secured Connection</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}