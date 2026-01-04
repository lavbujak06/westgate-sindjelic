import React from 'react';

interface StatBoxProps {
  label: string;
  value: string | number | undefined;
  color: string;
}

export default function StatBox({ label, value, color }: StatBoxProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-black/5 border-b-4 border-gray-100 flex flex-col items-center justify-center min-w-[160px] animate-in fade-in zoom-in duration-500">
      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{label}</span>
      <span className={`text-4xl font-black italic ${color}`}>{value ?? '-'}</span>
    </div>
  );
}