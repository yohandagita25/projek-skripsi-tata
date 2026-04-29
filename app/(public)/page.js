"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pt-5">
        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
          <Link href="/">
            <h1 className="text-xl font-bold text-blue-400 cursor-pointer">
              Semantic Wave
            </h1>
          </Link>
        <div className="flex gap-6 items-center">
          <a href="#courses" className="hover:text-blue-400">Courses</a>
          <Link href="/login">
            <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-32 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Learn Programming <br />
          <span className="text-blue-400">Through Structured Learning</span>
        </h1>
        <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto">
          Platform pembelajaran pemrograman untuk siswa SMK.
          Pelajari bahasa C melalui modul interaktif, quiz,
          dan coding challenge yang dirancang untuk meningkatkan
          kemampuan Logical Thinking.
        </p>
        <div className="mt-8 flex justify-center gap-4">

          <Link href="/register">
            <button className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700">
              Start Learning
            </button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-slate-900">
        <div className="grid md:grid-cols-4 text-center gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="text-3xl font-bold text-blue-400">20+</h3>
            <p className="text-slate-400">Learning Modules</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-400">50+</h3>
            <p className="text-slate-400">Coding Challenges</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-400">500+</h3>
            <p className="text-slate-400">Students</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-400">100%</h3>
            <p className="text-slate-400">Practice Based</p>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section id="courses" className="py-24 px-10 bg-slate-950">
        <h2 className="text-3xl font-bold text-center mb-16">
          Featured Courses
        </h2>        
        {/* PERUBAHAN: Menggunakan flex dan justify-center */}
        <Link href="/login">
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl mx-auto">          
          <div className="bg-slate-900 p-6 rounded-xl hover:scale-105 transition hover:border border-blue-500 w-full max-w-[350px]">
            <h3 className="text-xl font-bold mt-4">
              Percabangan
            </h3>
            <p className="text-slate-400 mt-2">
              Pelajari sintaks bahasa C untuk logika percabangan.
            </p>
            <button className="mt-4 text-blue-400 font-semibold">
              View Module →
            </button>
          </div>
        </div>
        </Link>
      </section>

      {/* LEARNING EXPERIENCE */}
      <section id="features" className="py-24 px-10 bg-slate-900">
        <h2 className="text-3xl font-bold text-center mb-16">
          Learning Experience
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition">
            <h3 className="text-lg font-semibold mb-3">
              Interactive Modules
            </h3>
            <p className="text-slate-400">
              Metode belajar yang menyenangkan serta interaktif.
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition">
            <h3 className="text-lg font-semibold mb-3">
              Built-in Code Editor
            </h3>
            <p className="text-slate-400">
              Latihan coding langsung di LMS tanpa install software.
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition">
            <h3 className="text-lg font-semibold mb-3">
              Quiz Evaluation
            </h3>
            <p className="text-slate-400">
              Uji pemahaman melalui pre-test, post-test, dan quiz.
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition">
            <h3 className="text-lg font-semibold mb-3">
              Progress Tracking
            </h3>
            <p className="text-slate-400">
              Pantau perkembangan belajar siswa secara realtime.
            </p>
          </div>
        </div>
      </section>

      {/* LEARNING PATH */}
      <section className="py-24 px-10 bg-slate-950">
        <h2 className="text-3xl font-bold text-center mb-16">
          Structured Learning Path
        </h2>
        <div className="grid md:grid-cols-5 gap-10 text-center max-w-5xl mx-auto">
          <div>
            <div className="text-blue-400 text-4xl font-bold mb-4">1</div>
            <p>Register Account</p>
          </div>
          <div>
            <div className="text-blue-400 text-4xl font-bold mb-4">2</div>
            <p>Choose Course</p>
          </div>
          <div>
            <div className="text-blue-400 text-4xl font-bold mb-4">3</div>
            <p>Learning</p>
          </div>
          <div>
            <div className="text-blue-400 text-4xl font-bold mb-4">4</div>
            <p>Practice Coding</p>
          </div>
          <div>
            <div className="text-blue-400 text-4xl font-bold mb-4">5</div>
            <p>Complete Challenge</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h2 className="text-3xl font-bold mb-6">
          Start Your Programming Journey
        </h2>
        <Link href="/register">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
            Create Account
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 border-t border-slate-800 text-slate-400">
        © 2026 Semantic Wave — Yohanda Gita Pratiwi
      </footer>
    </div>
  );
}