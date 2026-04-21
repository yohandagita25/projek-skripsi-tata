"use client";

import dynamic from "next/dynamic";
// HAPUS SEMUA IMPORT CSS DARI @UIW DISINI

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-900/50 animate-pulse rounded-[32px] border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Initializing Editor...</div>
  }
);

export default function MarkdownEditor({ value, onChange }) {
  return (
    <div data-color-mode="dark" className="w-full">
      {/* Kita panggil CSS secara manual lewat link tag agar Next.js tidak Error Build */}
      <link rel="stylesheet" href="https://unpkg.com/@uiw/react-md-editor@4.1.0/dist/mdeditor.css" />
      <link rel="stylesheet" href="https://unpkg.com/@uiw/react-markdown-preview@5.2.0/dist/markdown.css" />
      
      <MDEditor
        value={value}
        onChange={onChange}
        height={400}
        preview="live"
        className="rounded-[32px] overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl"
      />
    </div>
  );
}