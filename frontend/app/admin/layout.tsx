// /app/admin/layout.tsx
import Link from 'next/link';
import './admin.css'; // optional file for extra styling

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          backgroundColor: '#ffffff',
          borderRight: '3px solid #3b82f6',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
        }}
      >
        <h2 style={{ marginBottom: '2rem', color: '#1e40af' }}>Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/admin/dashboard" style={{ color: '#1e40af' }}>
            Dashboard
          </Link>
          <Link href="/admin/news" style={{ color: '#1e40af' }}>
            News
          </Link>
          <Link href="/admin/accounts" style={{ color: '#1e40af' }}>
            Admin Accounts
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
    </div>
  );
}
