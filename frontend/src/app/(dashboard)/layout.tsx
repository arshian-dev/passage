import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value;
  const isAdmin = role === 'admin';

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full relative min-h-screen bg-background">
      {/* Desktop SideNavBar */}
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

          <Link 
            href="/" 
            className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-col min-w-0 w-full md:pl-64 min-h-screen">
        {children}
      </div>

      {/* Mobile BottomNav (Hidden on MD) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant flex justify-around p-2 z-50 shadow-lg">
        <Link href="/applications" className="flex flex-col items-center p-1.5 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-xl">folder_shared</span>
          <span className="text-[10px] font-medium mt-0.5">Apps</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center p-1.5 text-primary font-bold">
          <span className="material-symbols-outlined text-xl">forum</span>
          <span className="text-[10px] mt-0.5">Chat</span>
        </Link>
        <Link href="/review" className="flex flex-col items-center p-1.5 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-xl">assignment_ind</span>
          <span className="text-[10px] font-medium mt-0.5">Review</span>
        </Link>
        <Link href="/admin" className="flex flex-col items-center p-1.5 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          <span className="text-[10px] font-medium mt-0.5">Admin</span>
        </Link>
        <Link href="/admin/knowledge-base" className="flex flex-col items-center p-1.5 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-xl">dynamic_form</span>
          <span className="text-[10px] font-medium mt-0.5">Forms</span>
        </Link>
      </nav>
    </div>
  );
}
