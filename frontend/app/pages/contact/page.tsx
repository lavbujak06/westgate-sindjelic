'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { MapPin, Phone, Clock, ArrowRight, Send, MessageSquare, Map as MapIcon, X } from 'lucide-react';

const categories = [
  "General Inquiry", "Senior Men's Football", "Senior Women's Football",
  "Junior Academy", "Sponsorship", "Trials & Recruitment", "Other"
];

export default function ContactPage() {

  // State Managment ///////////
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', category: 'General Inquiry',
    date: '', message: '', honeypot: ''
  });
  const [file, setFile] = useState<File[]>([]);
  
  const removeFile = (index: number) => {  // for removing attachments to the form
    setFile(prev => prev.filter((_, i) => i !== index));
  };


  
  useEffect(() => { // pre fill email if a user is logged in
    if (user?.email) setFormData(prev => ({ ...prev, email: user.email }));
  }, [user]);

  const handleInputChange = (field: string, value: string) => {   // clear errors when user starts typing
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => { // Handling submit, making sure the file limit is not over 24mb, and applying the schema validation errors as well as global errors
    e.preventDefault();
    setErrors({});

    if (formData.honeypot) return;
    const totalSize = file.reduce((acc, f) => acc + f.size, 0);
    const MAX_TOTAL_SIZE = 24 * 1024 * 1024; // 24MB

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error("Combined file size exceeds 24MB limit.");
      return; 
    }
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    file.forEach(( f ) => {
      data.append('attachments', f);
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();

      if (res.ok) {
        setSubmitted(true);
        toast.success("Message Dispatched!");
      } else {
        // Logic to determine which field the error belongs to
        const msg = result.error || result.message;
        
        if (msg.toLowerCase().includes("name")) setErrors({ name: msg });
        else if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
        else if (msg.toLowerCase().includes("message")) setErrors({ message: msg });
        else toast.error(msg);
        }
    } catch (err) {
      toast.error("Transmission Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = async () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: 'General Inquiry',
      date: '', 
      message: '', 
      honeypot: ''
    });
    setFile([]);
    setConfirmReset(false); 
    toast.success("Form Cleared");
  };

  if (submitted) return (   // Present the user a success message after sending an email
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 italic">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-center shadow-2xl">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Transmission <span className="text-red-600">Complete</span></h2>
        <div className="space-y-4">
            <button onClick={() => window.location.href = '/'} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]">Return to Home</button>
            <button onClick={() => setSubmitted(false)} className="w-full text-slate-500 py-2 font-black uppercase text-[9px] tracking-[0.2em]">Send another message</button>
        </div>
        </div>
    </div>
  );

  return (
    <main className="bg-[#020617] min-h-screen pb-20 italic">
      <Navbar />
      
      {/* HERO SECTION */}
      <div className="max-w-6xl mx-auto px-6 pt-32 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
          <div>
            <h1 className="text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
              Contact <span className="text-red-600">HQ</span>
            </h1>
            <p className="text-slate-500 font-mono text-xs uppercase mt-4 tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              Direct Line to Westgate Sindjelic
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.2em]">Melbourne, Australia</p>
            <p className="text-white font-black uppercase text-sm tracking-tighter mt-1">EST. 1985</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-32">
        
        {/* SECTION 1: LOCATION & ACCESS */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-red-600/10 p-2 rounded-lg">
              <MapIcon className="text-red-600" size={20} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Visit the Grounds</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-[3.5rem] shadow-2xl overflow-hidden">
            {/* MAP BLOCK */}
            <div className="lg:col-span-8 relative h-[550px] group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.9455!2d144.8033!3d-37.7845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad661686b651985%3A0x8988fff5eef6134f!2sArdeer%20Reserve!5e0!3m2!1sen!2sau!4v1705200000000!5m2!1sen!2sau" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Ardeer Reserve Map"
                className="brightness-90 contrast-125 group-hover:brightness-100 transition-all duration-500"
              />
              
              <div className="absolute bottom-8 right-8 z-10">
                  <button 
                      onClick={() => window.open('https://www.google.com/maps/place/Ardeer+Reserve/@-37.7784113,144.8034041,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad661686b651985:0x8988fff5eef6134f!8m2!3d-37.7784156!4d144.8059844!16s%2Fg%2F11h2nlv4wh?hl=en&entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D', '_blank')}
                      className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3 hover:bg-black hover:scale-105 transition-all duration-300"
                  >
                      Get Directions <ArrowRight size={18} strokeWidth={3} />
                  </button>
              </div>
            </div>

            {/* INFO BLOCK */}
            <div className="lg:col-span-4 bg-slate-50 p-12 flex flex-col justify-center border-l border-slate-100">
              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Location</h3>
                  <p className="text-slate-900 text-3xl font-black uppercase italic leading-tight tracking-tighter">
                    Ardeer Reserve, <br/> Ardeer VIC 3022
                  </p>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Training Times</h3>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-black uppercase text-lg italic">Tue & Thu</p>
                    <p className="text-red-600 font-black uppercase text-base italic leading-none">6:00 PM — 9:00 PM</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Call Westgate</h3>
                  <p className="text-slate-900 text-4xl font-black uppercase italic tracking-tighter">
                    0400 000 000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE ENQUIRY FORM */}
        <section className="pb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-red-600/10 p-2 rounded-lg">
              <MessageSquare className="text-red-600" size={20} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Email Inquiry</h2>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-[4rem] p-8 lg:p-16 shadow-3xl backdrop-blur-sm">
            {/* RESET BUTTON SECTION */}
            <div className="flex justify-end mb-8">
              {!confirmReset ? (
                <button 
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl hover:border-red-600 hover:bg-red-600/5 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                    Clear Form
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-2 animate-in zoom-in duration-200">
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-700 shadow-lg shadow-red-900/20"
                  >
                    Confirm Reset
                  </button>
                  <button 
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-4 py-2 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <input type="text" className="hidden" value={formData.honeypot} onChange={e => setFormData({...formData, honeypot: e.target.value})} />

              <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                      {errors.name && <span className="text-[9px] font-bold text-red-500 uppercase italic animate-pulse">{errors.name}</span>}
                  </div>
                  <input 
                      required 
                      className={`w-full bg-slate-950/50 border ${errors.name ? 'border-red-600' : 'border-slate-800'} rounded-2xl p-5 text-white text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all`} 
                      value={formData.name} 
                      onChange={e => handleInputChange('name', e.target.value)} 
                  />
              </div>

              <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                      {errors.email && <span className="text-[9px] font-bold text-red-500 uppercase italic animate-pulse">{errors.email}</span>}
                  </div>
                  <input 
                      required 
                      type="email" 
                      className={`w-full bg-slate-950/50 border ${errors.email ? 'border-red-600' : 'border-slate-800'} rounded-2xl p-5 text-white text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all`} 
                      value={formData.email} 
                      onChange={e => handleInputChange('email', e.target.value)} 
                  />
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                  <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-white text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                  <select className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-white text-sm focus:border-red-600 outline-none transition-all"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c} className="bg-slate-950">{c}</option>)}
                  </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Relevant Date (Optional)</label>
                  <input type="date" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-white text-sm focus:border-red-600 outline-none transition-all" 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message</label>
                      {errors.message && <span className="text-[9px] font-bold text-red-500 uppercase italic animate-pulse">{errors.message}</span>}
                  </div>
                  <textarea 
                      required 
                      rows={6} 
                      className={`w-full bg-slate-950/50 border ${errors.message ? 'border-red-600' : 'border-slate-800'} rounded-3xl p-6 text-white text-sm focus:border-red-600 outline-none resize-none transition-all`} 
                      value={formData.message} 
                      onChange={e => handleInputChange('message', e.target.value)} 
                  />
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-end mb-2 px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                    Attachments (Max 24MB total)
                  </label>
                  <span className={`text-[10px] font-bold uppercase italic ${
                    (file.reduce((acc: number, f: File) => acc + f.size, 0) / (24 * 1024 * 1024)) > 0.9 
                    ? 'text-red-600' : 'text-slate-400'
                  }`}>
                    {(file.reduce((acc: number, f: File) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} / 24 MB
                  </span>
                </div>

                {/* SIZE PROGRESS BAR */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${
                      (file.reduce((acc: number, f: File) => acc + f.size, 0) / (24 * 1024 * 1024)) > 0.9 
                      ? 'bg-red-600' : 'bg-white'
                    }`}
                    style={{ 
                      width: `${Math.min((file.reduce((acc: number, f: File) => acc + f.size, 0) / (24 * 1024 * 1024)) * 100, 100)}%` 
                    }}
                  />
                </div>
                
                {/* UPLOAD BOX */}
                <div className="group relative w-full h-32 bg-slate-950/30 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center hover:border-red-600 transition-all cursor-pointer mb-6">
                  <input 
                    type="file" 
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={e => {
                      const newFiles = Array.from(e.target.files || []);
                      setFile(prev => [...prev, ...newFiles]);
                    }} 
                  />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-red-600 transition-colors">
                      Click or Drag to Add Files
                    </p>
                  </div>
                </div>

                {/* FILE LIST & DELETE ON HOVER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {file.map((f, index) => (
                    <div 
                      key={`${f.name}-${index}`}
                      className="group relative bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between overflow-hidden"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black text-white uppercase italic truncate pr-8">
                          {f.name}
                        </span>
                        <span className="text-[8px] text-slate-500 uppercase">
                          {(f.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>

                      {/* DELETE BUTTON - VISIBLE ON HOVER */}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute right-3 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-black text-white p-2 rounded-xl transition-all duration-200 z-20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                disabled={loading} 
                className="md:col-span-2 group relative bg-red-600 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-white text-sm overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-red-600 transition-colors duration-300">
                  {loading ? <Loader /> : (
                    <>Transmit Data <Send size={16} /></>
                  )}
                </span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}