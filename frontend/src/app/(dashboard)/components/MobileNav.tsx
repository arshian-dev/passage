"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/applications', label: 'Apps', icon: 'folder_shared' },
    { href: '/chat', label: 'Chat', icon: 'forum' },
    { href: '/review', label: 'Review', icon: 'assignment_ind' },
    { href: '/admin', label: 'Cases', icon: 'admin_panel_settings' },
    { href: '/admin/knowledge-base', label: 'Forms', icon: 'dynamic_form' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant flex justify-around items-center px-1 py-1.5 z-50 shadow-lg pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 min-w-[54px] ${
              isActive
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary font-medium'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] transition-transform ${
                isActive ? 'scale-110' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
