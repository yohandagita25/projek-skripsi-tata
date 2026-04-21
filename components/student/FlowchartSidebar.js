"use client";

import React from 'react';
import { Type, Play, Square, Diamond, Peninsula, MousePointer2 } from 'lucide-react';

export default function FlowchartSidebar() {
  // Fungsi Drag & Drop
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const symbols = [
    { 
      type: 'start', 
      label: 'Mulai/Selesai', 
      color: 'border-green-500', 
      shape: 'w-12 h-7 rounded-full' 
    },
    { 
      type: 'process', 
      label: 'Proses/Aksi', 
      color: 'border-blue-500', 
      shape: 'w-12 h-7 rounded-none' 
    },
    { 
      type: 'decision', 
      label: 'Percabangan', 
      color: 'border-yellow-500', 
      // Diamond: W dan H harus sama agar simetris saat diputar
      shape: 'w-7 h-7 rotate-45 mb-1 mt-1' 
    },
    { 
      type: 'input', 
      label: 'Input/Output', 
      color: 'border-purple-500', 
      shape: 'w-12 h-7 -skew-x-12' 
    },
    { 
      type: 'text', 
      label: 'Teks Bebas', 
      color: 'border-slate-500', 
      shape: 'w-12 h-7 border-dashed border-2', 
      isText: true 
    },
  ];

  return (
    <aside className="w-48 bg-slate-900/80 border-r border-slate-800 p-6 flex flex-col gap-6 shrink-0 shadow-xl">
      <div className="flex flex-col gap-2 items-center mb-2">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">
          Simbol Flowchart
        </p>
        <div className="h-[1px] w-10 bg-slate-800"></div>
      </div>
      
      <div className="flex flex-col gap-9 items-center">
        {symbols.map((symbol) => (
          <div
            key={symbol.type}
            className="group flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing w-full"
            onDragStart={(event) => onDragStart(event, symbol.type, symbol.label)}
            draggable
          >
            {/* Container Miniatur Simbol */}
            <div className="h-10 flex items-center justify-center w-full relative">
              <div 
                className={`border-2 flex items-center justify-center ${symbol.color} bg-slate-800/50 
                ${symbol.shape} transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-700 
                shadow-lg group-hover:shadow-blue-500/10 group-active:scale-95`}
              >
                {symbol.isText && <Type size={14} className="text-slate-400 group-hover:text-white" />}
              </div>
            </div>
            
            {/* Label Simbol */}
            <span className="text-[9px] text-slate-500 font-black group-hover:text-blue-400 transition-colors text-center uppercase tracking-tighter">
              {symbol.label}
            </span>
          </div>
        ))}
      </div>

      {/* Instruksi Penggunaan */}
      <div className="mt-auto space-y-4">
        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-400">
            <MousePointer2 size={12} />
            <span className="text-[12px] font-black uppercase tracking-widest">Tips</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed italic font-medium">
            Tarik simbol ke canvas. <br />
            <span className="text-slate-400">Klik 2x</span> untuk edit teks. <br />
            <span className="text-slate-400">Del</span> untuk hapus.
          </p>
        </div>
      </div>
    </aside>
  );
}