'use client';

export default function ConfirmModal({
  message,
  onCancel,
  onConfirm,
}: {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-red-950/30 text-red-500 rounded-full flex items-center justify-center border border-red-900/50">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <p className="text-slate-200 font-bold uppercase tracking-tight text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-slate-800 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-700 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">Confirm</button>
        </div>
      </div>
    </div>
  );
}