import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Users, UserSquare2, Newspaper } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/firs', label: 'FIR Lifecycle', icon: FileText },
  { path: '/cases', label: 'Case Tracking', icon: Briefcase },
  { path: '/criminals', label: 'Criminal Database', icon: UserSquare2 },
  { path: '/officers', label: 'Officer Directory', icon: Users },
  { path: '/news', label: 'News Moderation', icon: Newspaper },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-glass)' }}>
          <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>CDMS Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Kerala Police RTI</p>
        </div>
        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  textDecoration: 'none',
                  border: isActive ? '1px solid var(--accent-secondary)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? '600' : '400',
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'none'
                }}
              >
                <Icon size={20} color={isActive ? 'var(--accent-secondary)' : 'currentColor'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem' }}>Admin User</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </header>
        <div className="animate-fade-in" style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
