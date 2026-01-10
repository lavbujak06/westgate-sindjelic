'use client';
import React, { useEffect, useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchLogs = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => { setLogs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setLogs([]); setLoading(false); });
  };

  useEffect(() => { fetchLogs(); }, []);

  const clearLogs = async () => {
    if (!window.confirm("CRITICAL ACTION: Are you sure you want to delete all audit history?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs/clear`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) { fetchLogs(); alert("History cleared successfully."); }
    } catch (err) { alert("Error clearing logs."); }
  };

  const filteredLogs = useMemo(() => {
    const safeLogs = Array.isArray(logs) ? logs : [];
    return safeLogs.filter((log: any) =>
      log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.admin?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentData = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableRows = logs.map((log: any) => [new Date(log.created_at).toLocaleString(), log.admin, log.action, log.details]);
    autoTable(doc, {
      startY: 40,
      head: [['Timestamp', 'Admin Email', 'Action', 'Details']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] },
    });
    doc.save(`Security_Report_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Security Audit</h1>
            <p className="text-slate-500 text-sm font-mono mt-1">Status: <span className="text-green-500">Encrypted / Active</span></p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <input className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none" placeholder="Filter events..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            <button onClick={generatePDF} className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-all">Export PDF</button>
            <button onClick={clearLogs} className="bg-red-950/30 text-red-500 border border-red-900/50 px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-red-600 hover:text-white transition-all">Wipe Logs</button>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800/50">
              {currentData.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-4 font-bold text-slate-300 text-xs">{log.admin}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${log.action.includes('DELETE') ? 'bg-red-900/20 text-red-500 border border-red-900/30' : 'bg-blue-900/20 text-blue-400 border border-blue-900/30'}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 italic text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}