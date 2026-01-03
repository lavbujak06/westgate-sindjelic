'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

const categories = [
  "General Inquiry", "Senior Men's Football", "Senior Women's Football",
  "Junior Academy", "Sponsorship", "Trials & Recruitment", "Other"
];

export default function ContactPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', category: 'General Inquiry',
    date: '', message: '', honeypot: ''
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.email) setFormData(prev => ({ ...prev, email: user.email }));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (file) data.append('attachment', file);

    try {
      const res = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        body: data, // Note: No headers needed for FormData
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Message Dispatched!");
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Transmission Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>

        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
            Transmission <span className="text-red-600">Complete</span>
        </h2>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-10 uppercase tracking-wide font-medium">
            Your inquiry has been encrypted and dispatched to the Technical Department. <br/> 
            <span className="text-slate-600 text-[10px] font-mono">Reference: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </p>

        <div className="space-y-4">
            <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-200 transition-all shadow-lg"
            >
            Return to Home
            </button>
            
            <button 
            onClick={() => setSubmitted(false)}
            className="w-full text-slate-500 py-2 font-black uppercase text-[9px] tracking-[0.2em] hover:text-white transition-colors"
            >
            Send another message
            </button>
        </div>
        </div>
    </div>
    );

  return (
    <main className="bg-[#020617] min-h-screen pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Contact <span className="text-red-600">HQ</span></h1>
          <p className="text-slate-500 font-mono text-xs uppercase mt-2 tracking-[0.2em]">Direct Line to Westgate Sindjelic</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800">
          
          {/* Honeypot - Hidden from humans */}
          <input type="text" className="hidden" value={formData.honeypot} onChange={e => setFormData({...formData, honeypot: e.target.value})} />

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Full Name</label>
            <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-red-600 outline-none" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Email Address</label>
            <input required type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-red-600 outline-none" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Phone Number (optional)</label>
            <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-red-600 outline-none" 
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Category</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-red-600 outline-none"
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
             <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Date (Optional - e.g. Trial or Incident date)</label>
             <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-red-600 outline-none" 
               value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Message</label>
            <textarea required rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-red-600 outline-none resize-none" 
              value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Attachments (Birth Cert/Logo/Photo)</label>
            <input type="file" className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-red-600 file:text-white file:font-black" 
              onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>

          <button disabled={loading} className="md:col-span-2 bg-red-600 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-white hover:bg-red-700 transition-all disabled:opacity-50">
            {loading ? <Loader /> : 'Transmit Message'}
          </button>
        </form>
      </div>
    </main>
  );
}