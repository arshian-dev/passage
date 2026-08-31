import Link from 'next/link';
import { cookies } from 'next/headers';
import MobileNav from './components/MobileNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value;
  const isAdmin = role === 'admin';

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full min-h-screen bg-background relative">
      {/* Mobile Top Header (Visible only on mobile < md) */}
      <header className="md:hidden sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant px-4 py-2.5 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs">
            <span className="material-symbols-outlined text-lg font-bold">flight_takeoff</span>
          </div>
          <div>
            <span className="text-sm font-bold text-primary leading-none block">Passage</span>
            <span className="text-[9px] font-semibold text-secondary uppercase tracking-wider">AI Platform</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary-container rounded-full text-[10px] font-bold text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span>Live DB</span>
          </div>
          <Link
            href="/"
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
            title="Return to Home"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
          </Link>
        </div>
      </header>

      {/* Desktop SideNavBar (Hidden on Mobile) */}
      <nav className="hidden md:flex flex-col h-[100dvh] w-64 fixed left-0 top-0 z-40 p-5 bg-surface-container-lowest border-r border-outline-variant shadow-sm justify-between">
        {/* Top Header */}
        <div className="space-y-6">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl font-bold">flight_takeoff</span>
            </div>
            <div>
              <h1 className="text-headline-sm font-bold text-primary leading-tight">Passage</h1>
              <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">AI Immigration Platform</p>
            </div>
          </Link>

          {/* Navigation Section */}
          <div className="space-y-5">
            {/* Applicant Section */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest px-3 block mb-1">
                Applicant Portal
              </span>
              <Link 
                href="/applications" 
                className="flex items-center gap-3 px-3 py-2.5 text-body-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all rounded-xl group"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">folder_shared</span>
                <span>My Applications</span>
              </Link>
              <Link 
                href="/chat" 
                className="flex items-center gap-3 px-3 py-2.5 text-body-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all rounded-xl group"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">forum</span>
                <span>Intake Chat</span>
              </Link>
              <Link 
                href="/review" 
                className="flex items-center gap-3 px-3 py-2.5 text-body-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all rounded-xl group"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">assignment_ind</span>
                <span>Profile Review</span>
              </Link>
            </div>

            {/* Administration Section */}
            <div className="space-y-1 pt-2 border-t border-outline-variant/60">
              <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest px-3 block mb-1">
                Administration
              </span>
              <Link 
                href="/admin" 
                className="flex items-center gap-3 px-3 py-2.5 text-body-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all rounded-xl group"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">admin_panel_settings</span>
                <span>Case Management</span>
              </Link>
              <Link 
                href="/admin/knowledge-base" 
                className="flex items-center gap-3 px-3 py-2.5 text-body-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all rounded-xl group"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">dynamic_form</span>
                <span>Form Templates & KB</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Status Card */}
        <div className="pt-4 border-t border-outline-variant/60 space-y-3">
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[11px] font-bold text-on-surface">PostgreSQL Live</span>
            </div>
            <span className="text-[10px] font-semibold text-secondary px-1.5 py-0.5 bg-secondary-container rounded">Ready</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full md:pl-64 min-h-[calc(100vh-50px)] md:min-h-screen">
        {children}
      </div>

      {/* Dynamic Mobile BottomNav */}
      <MobileNav />
    </div>
  );
}
