'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/services', label: 'Services' },
  { href: '/bookings', label: 'Bookings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <Link className="admin-brand-link" href="/">
          Lux<span>Stay</span>
        </Link>
        <span className="admin-brand-tag">Admin</span>
      </div>

      <nav className="admin-sidebar-nav">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              className={active ? 'admin-sidebar-link admin-sidebar-link-active' : 'admin-sidebar-link'}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <a href="http://localhost:3000" target="_blank" rel="noreferrer">
          Back to Site
        </a>
      </div>
    </aside>
  );
}