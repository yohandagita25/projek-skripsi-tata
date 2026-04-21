import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const EditableLabel = ({ label, onChange, placeholder, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(label || "");

  useEffect(() => { setValue(label || ""); }, [label]);

  const handleBlur = () => {
    setIsEditing(false);
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  if (isEditing) {
    return (
      <textarea
        autoFocus
        className={`bg-transparent outline-none resize-none text-center w-full p-0 m-0 leading-tight ${className}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        rows={1}
        style={{ display: 'block', verticalAlign: 'middle' }}
      />
    );
  }

  return (
    <div 
      onDoubleClick={() => setIsEditing(true)} 
      // Tambahkan flex dan items-center justify-center di sini
      className={`cursor-text select-none min-w-[20px] min-h-[1em] flex items-center justify-center text-center w-full h-full leading-tight ${className}`}
    >
      {value || <span className="opacity-30">{placeholder}</span>}
    </div>
  );
};

// Start Node
export const StartNode = ({ data }) => (
  <div className="px-6 py-2 rounded-full border-2 border-green-500 bg-slate-900 text-white shadow-lg shadow-green-500/20 min-w-[120px]">
    <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-green-500" />
    <EditableLabel 
      label={data.label} 
      onChange={(val) => data?.onChange?.(val)} // Menggunakan optional chaining (?.)
      className="text-xs font-bold"
      placeholder="START"
    />
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-green-500" />
  </div>
);

// Process Node
export const ProcessNode = ({ data }) => (
  <div className="px-4 py-3 border-2 border-blue-500 bg-slate-900 text-white shadow-lg shadow-blue-500/20 min-w-[120px]">
    <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-500" />
    <EditableLabel 
      label={data.label} 
      onChange={(val) => data?.onChange?.(val)} 
      className="text-xs font-bold"
      placeholder="Proses"
    />
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-500" />
  </div>
);

// Decision Node
export const DecisionNode = ({ data }) => (
  <div className="relative w-28 h-28 flex items-center justify-center">
    <div className="absolute inset-0 border-2 border-yellow-500 bg-slate-900 rotate-45 shadow-lg shadow-yellow-500/20"></div>
    <Handle type="target" position={Position.Top} className="!top-0 w-2 h-2 !bg-yellow-500 z-10" />
    <div className="relative z-10 w-full px-4">
      <EditableLabel 
        label={data.label} 
        onChange={(val) => data?.onChange?.(val)} 
        className="text-[10px] font-bold leading-tight"
        placeholder="Kondisi?"
      />
    </div>
    <Handle type="source" position={Position.Bottom} id="yes" className="!bottom-0 w-2 h-2 !bg-green-500 z-10" />
    <Handle type="source" position={Position.Right} id="no" className="!right-0 w-2 h-2 !bg-red-500 z-10" />
  </div>
);

// Input Node
export const InputOutputNode = ({ data }) => (
  <div className="px-6 py-3 border-2 border-purple-500 bg-slate-900 text-white shadow-lg shadow-purple-500/20" 
       style={{ transform: 'skewX(-15deg)' }}>
    <div style={{ transform: 'skewX(15deg)' }}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-purple-500" />
      <EditableLabel 
        label={data.label} 
        onChange={(val) => data?.onChange?.(val)} 
        className="text-xs font-bold"
        placeholder="Input/Output"
      />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-purple-500" />
    </div>
  </div>
);

// Text Node
export const TextNode = ({ data }) => (
  <div className="p-2 bg-transparent text-slate-300 min-w-[50px]">
    <EditableLabel 
      label={data.label} 
      onChange={(val) => data?.onChange?.(val)} 
      className="text-sm font-medium"
      placeholder="Ketik teks..."
    />
  </div>
);