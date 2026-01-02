'use client';

import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AuditLogsPage() {
  // Added <any[]> to fix the VS Code "never[]" error
  const [logs, setLogs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchLogs = () => {
    setLoading(true);
    fetch('http://localhost:5001/api/audit-logs', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        // Safe check: if data isn't an array, use empty array
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLogs([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const clearLogs = async () => {
    if (!window.confirm("CRITICAL ACTION: Are you sure you want to delete all audit history?")) return;
    try {
      const res = await fetch('http://localhost:5001/api/audit-logs/clear', { 
        method: 'DELETE',
        credentials: 'include' 
      });
      if (res.ok) {
        fetchLogs(); 
        alert("History cleared successfully.");
      }
    } catch (err) {
      alert("Error clearing logs.");
    }
  };

  const filteredLogs = useMemo(() => {
    // Ensure logs is an array before filtering
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
    const dateStr = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text('Sindjelic Club - Security Audit Report', 14, 22);
    
    const tableRows = logs.map((log: any) => [
      new Date(log.created_at).toLocaleString(),
      log.admin,
      log.action,
      log.details
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Timestamp', 'Admin Email', 'Action', 'Details']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8 },
    });

    doc.save(`Security_Report_${dateStr.replace(/\//g, '-')}.pdf`);
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <HeaderSection>
          <div>
            <Title>Security Audit Logs</Title>
            <Subtitle>Monitor administrative actions and system security events.</Subtitle>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <SearchInput 
              placeholder="Search logs..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
            <DownloadButton onClick={generatePDF}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/></svg>
              Download Report
            </DownloadButton>
            <ClearButton onClick={clearLogs}>Clear History</ClearButton>
            <StatusBadge><span className="dot" /> Active</StatusBadge>
          </div>
        </HeaderSection>

        <TableWrapper>
          <LogTable>
            <thead>
              <tr>
                <th>Event Timestamp</th>
                <th>Administrator</th>
                <th>Action Type</th>
                <th>Event Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>Fetching security logs...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>No security events recorded.</td></tr>
              ) : (
                currentData.map((log: any) => (
                  <tr key={log.id}>
                    <td className="timestamp">
                      {new Date(log.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="admin-email" title={log.admin}>
                      {log.admin} 
                    </td>
                    <td style={{ width: '1%' }}> 
                      <Badge type={log.action}>{log.action.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="details">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </LogTable>
        </TableWrapper>

        <StickyPagination>
          <div className="inner">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Previous</button>
            <div className="page-info">
              <b>Page {currentPage} of {totalPages || 1}</b>
              <small>{filteredLogs.length} Total Events</small>
            </div>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
          </div>
        </StickyPagination>
      </div>
    </PageContainer>
  );
}

const PageContainer = styled.div` padding: 2.5rem; background-color: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; `;
const HeaderSection = styled.div` display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; `;
const Title = styled.h1` font-size: 1.875rem; font-weight: 800; color: #0f172a; margin: 0; `;
const Subtitle = styled.p` color: #64748b; margin-top: 0.5rem; `;
const SearchInput = styled.input` padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0; width: 240px; `;
const DownloadButton = styled.button` display: flex; align-items: center; gap: 0.5rem; background: #0f172a; color: white; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; `;
const ClearButton = styled.button` background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; &:hover { background: #ffe4e6; } `;
const StatusBadge = styled.div` display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 600; color: #059669; background: #ecfdf5; padding: 0.5rem 0.75rem; border-radius: 9999px; border: 1px solid #d1fae5; .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; } `;
const TableWrapper = styled.div` background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; `;
const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  table-layout: auto; /* Allows columns to adjust based on content */

  th { 
    background: #f1f5f9; 
    padding: 1rem 1.25rem; 
    text-align: left; 
    font-weight: 700; 
    color: #475569; 
    text-transform: uppercase; 
    font-size: 0.75rem;
    white-space: nowrap;
  }

  td { 
    padding: 1rem 1.25rem; 
    color: #1e293b; 
    border-bottom: 1px solid #f1f5f9; 
    vertical-align: middle;
  }

  .admin-email { 
    font-weight: 600; 
    color: #475569; 
    font-size: 0.85rem; 
    max-width: 200px; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; 
  }

  .timestamp { 
    font-family: 'JetBrains Mono', monospace; 
    color: #64748b; 
    font-size: 0.8rem; 
    white-space: nowrap; 
    width: 180px; /* Fixed width for consistency */
  }

  .details { 
    color: #334155; 
    font-weight: 500;
    min-width: 250px; /* Ensures details have the most room */
    line-height: 1.4;
  }
`;
const Badge = styled.span<{ type: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap; /* ⚡️ CRITICAL: Prevents "ADMIN LOGIN" from breaking into two lines */
  letter-spacing: 0.02em;
  
  background: ${props => {
    const t = props.type.toUpperCase();
    if (t.includes('DELETE') || t.includes('CLEAR')) return '#fef2f2';
    if (t.includes('LOGIN')) return '#f0fdf4';
    return '#eff6ff';
  }};
  
  color: ${props => {
    const t = props.type.toUpperCase();
    if (t.includes('DELETE') || t.includes('CLEAR')) return '#dc2626';
    if (t.includes('LOGIN')) return '#16a34a';
    return '#2563eb';
  }};

  border: 1px solid ${props => {
    const t = props.type.toUpperCase();
    if (t.includes('DELETE') || t.includes('CLEAR')) return '#fecdd3';
    if (t.includes('LOGIN')) return '#dcfce7';
    return '#dbeafe';
  }};
`;
const StickyPagination = styled.div`
  position: sticky; bottom: 2rem; background: white; border: 1px solid #e2e8f0; border-radius: 50px; padding: 0.6rem 1.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); margin-top: 2rem; z-index: 20;
  .inner { display: flex; justify-content: space-between; align-items: center; }
  .page-info { text-align: center; b { display: block; font-size: 0.85rem; } small { font-size: 0.7rem; color: #64748b; } }
  button { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.5rem 1.2rem; border-radius: 20px; font-weight: 700; cursor: pointer; &:disabled { opacity: 0.4; } }
`;