'use client';
import React, { useEffect, useState, useMemo } from "react";

export default function AdminAccountsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminRes, userRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admins`, { credentials: 'include' }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { credentials: 'include' })
      ]);
      const adminData = await adminRes.json();
      const userData = await userRes.json();
      setAdmins(Array.isArray(adminData) ? adminData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setAdmins([]); setUsers([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredUsers = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : [];
    return safeUsers.filter(user => 
      `${user?.name || ''} ${user?.surname || ''} ${user?.email || ''}`
        .toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUserDelete = async (id: string) => {
    if (!confirm('PERMANENT ACTION: This will delete the user and their login. Continue?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) setUsers(users.filter((u) => u.id !== id));
    } catch (err) { alert('An error occurred'); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-red-600"></span> System Accounts
          </h1>
        </header>
        
        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-1">Administrators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {admins.map((admin) => (
              <div key={admin.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3 hover:border-red-900/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-300">{admin.email}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-white">Member Directory</h2>
            <div className="flex gap-3 w-full md:w-auto">
              <input 
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-red-600 outline-none w-full"
                placeholder="Search database..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/50">
            {loading ? (
              <p className="p-10 text-center text-slate-500 uppercase text-xs tracking-widest">Initialising Data...</p>
            ) : currentData.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-red-500 overflow-hidden">
                    {user.logo ? <img src={user.logo} alt="" className="w-full h-full object-cover" /> : user.name?.[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200">{user.name} {user.surname}</span>
                    <span className="text-xs text-slate-500 font-mono">{user.email}</span>
                  </div>
                </div>
                <button onClick={() => handleUserDelete(user.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-600 px-3 py-2 rounded-md transition-all border border-red-900/30">
                  Delete User
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-30">Prev</button>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Page {currentPage} of {totalPages || 1} — {filteredUsers.length} Records</span>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-30">Next</button>
          </div>
        </section>
      </div>
    </div>
  );
}