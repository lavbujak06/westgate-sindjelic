import Link from 'next/link';
import './admin.css'; 
import AdminGuard from '@/components/AdminGuard'; // Import the guard we created

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // 🔐 Wrap everything in the AdminGuard
    <AdminGuard>
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
            <Link href="/admin/dashboard" style={{ color: '#1e40af', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link href="/admin/news" style={{ color: '#1e40af', textDecoration: 'none' }}>
              News
            </Link>
            <Link href="/admin/accounts" style={{ color: '#1e40af', textDecoration: 'none' }}>
              Accounts
            </Link>
            <Link href="/admin/audit-logs" style={{ color: '#1e40af', textDecoration: 'none' }}>
              Audit Logs
            </Link>
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #cbd5e1' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#000', display: 'block', paddingTop: '0.5rem' }}>
              🔙 User Website
            </Link>
          </div>
        </aside>

        {/* Main content area */}
        <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
      </div>
    </AdminGuard>
  );
}