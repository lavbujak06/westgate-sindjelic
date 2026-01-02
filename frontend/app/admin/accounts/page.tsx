'use client';

import React, { useEffect, useState, useMemo } from "react";
import styled from 'styled-components';

export default function AdminAccountsPage() {
  // Added <any[]> to satisfy TypeScript and prevent the 'never' error in VS Code
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
        fetch('http://localhost:5001/api/auth/admins', { credentials: 'include' }),
        fetch('http://localhost:5001/api/users', { credentials: 'include' })
      ]);
      
      const adminData = await adminRes.json();
      const userData = await userRes.json();
      
      // Added Array checks to prevent the ".filter is not a function" error
      setAdmins(Array.isArray(adminData) ? adminData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setAdmins([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredUsers = useMemo(() => {
    // Safety guard to ensure users is always an array
    const safeUsers = Array.isArray(users) ? users : [];
    return safeUsers.filter(user => 
      `${user?.name || ''} ${user?.surname || ''} ${user?.email || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUserDelete = async (id: string) => {
    if (!confirm('PERMANENT ACTION: This will delete the user and their login. Continue?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* --- ADMIN SECTION --- */}
        <section className="mb-12">
          <SectionTitle>System Administrators</SectionTitle>
          <AdminGrid>
            {admins.map((admin) => (
              <AdminCard key={admin.id}>
                <div className="dot" />
                <span>{admin.email}</span>
                <span className="role-tag">Full Access</span>
              </AdminCard>
            ))}
          </AdminGrid>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '3rem' }} />

        {/* --- USER SECTION --- */}
        <section>
          <HeaderControls>
            <div className="left">
              <SectionTitle>User Profiles</SectionTitle>
              <PageSelector>
                <label>Jump to:</label>
                <select 
                  value={currentPage} 
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  disabled={totalPages <= 1}
                >
                  {Array.from({ length: totalPages || 1 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                  ))}
                </select>
              </PageSelector>
            </div>
            
            <SearchInput 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </HeaderControls>

          <UserGrid>
            {loading ? (
              <p>Loading member data...</p>
            ) : currentData.length === 0 ? (
              <EmptyState>No members found.</EmptyState>
            ) : (
              currentData.map((user) => (
                <UserCard key={user.id}>
                  <div className="left">
                    <Avatar>{user.logo ? <img src={user.logo} alt="" /> : user.name?.[0]}</Avatar>
                    <div className="info">
                      <strong>{user.name} {user.surname}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <DeleteBtn onClick={() => handleUserDelete(user.id)}>
                    Delete User
                  </DeleteBtn>
                </UserCard>
              ))
            )}
          </UserGrid>
        </section>

        {/* --- INTEGRATED PAGINATION --- */}
        <StickyPagination>
          <div className="inner">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ← Previous
            </button>
            <span className="page-info">
              <b>Page {currentPage} of {totalPages || 1}</b>
              <small>{filteredUsers.length} total members</small>
            </span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        </StickyPagination>
      </div>
    </PageLayout>
  );
}

/* ---------------- STYLES (Unchanged) ---------------- */

const PageLayout = styled.div` padding: 2.5rem; background-color: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; `;
const SectionTitle = styled.h2` font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1.5rem; letter-spacing: -0.025em; `;
const AdminGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; `;
const AdminCard = styled.div` background: white; padding: 1rem 1.25rem; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #334155; .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; } .role-tag { margin-left: auto; font-size: 0.7rem; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: 600; } `;
const HeaderControls = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1.5rem; .left { display: flex; align-items: baseline; gap: 2rem; } `;
const PageSelector = styled.div` display: flex; align-items: center; gap: 0.5rem; label { font-size: 0.85rem; font-weight: 600; color: #64748b; } select { padding: 0.4rem 0.8rem; border-radius: 6px; border: 1px solid #cbd5e1; background: white; cursor: pointer; } `;
const SearchInput = styled.input` flex: 1; max-width: 400px; padding: 0.75rem 1.25rem; border-radius: 10px; border: 1px solid #cbd5e1; &:focus { outline: 2px solid #3b82f6; } `;
const UserGrid = styled.div` display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; `;
const UserCard = styled.div` background: white; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; .left { display: flex; align-items: center; gap: 1.25rem; } .info { display: flex; flex-direction: column; strong { color: #0f172a; } small { color: #64748b; } } `;
const Avatar = styled.div` width: 48px; height: 48px; border-radius: 50%; background: #facc15; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; } `;
const DeleteBtn = styled.button` background: #fff1f2; color: #e11d48; padding: 0.6rem 1.2rem; border-radius: 8px; border: 1px solid #ffe4e6; font-weight: 700; cursor: pointer; `;
const EmptyState = styled.div` text-align: center; padding: 4rem; color: #94a3b8; `;
const StickyPagination = styled.div` position: sticky; bottom: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 0.75rem 1.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); margin-top: 2rem; z-index: 10; .inner { display: flex; justify-content: space-between; align-items: center; } .page-info { display: flex; flex-direction: column; align-items: center; b { color: #0f172a; font-size: 0.9rem; } small { color: #64748b; font-size: 0.75rem; } } button { padding: 0.5rem 1.25rem; border-radius: 8px; background: #f1f5f9; color: #0f172a; border: 1px solid #e2e8f0; font-weight: 600; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } &:hover:not(:disabled) { background: #e2e8f0; } } `;