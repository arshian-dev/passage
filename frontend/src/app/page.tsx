"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parallax scroll effect for hero
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  const handleAuth = (role: 'admin' | 'client', path: string) => {
    document.cookie = `role=${role}; path=/`;
    router.push(path);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fafcff] text-[#0f172a] overflow-x-hidden selection:bg-[#cce0ff] selection:text-[#002045]">
      
      {/* Subtle Global Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg border-b border-slate-200/70 shadow-xs w-full top-0 z-50 sticky"
      >
        <div className="flex justify-between items-center w-full px-4 sm:px-8 py-3.5 max-w-7xl mx-auto">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 6, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-10 h-10 rounded-xl bg-[#002045] flex items-center justify-center text-white shadow-sm"
            >
              <span className="material-symbols-outlined text-2xl font-bold">flight_takeoff</span>
            </motion.div>
            <div>
              <span className="text-lg font-bold text-[#002045] leading-tight block tracking-tight">Passage</span>
              <span className="text-[10px] font-semibold text-[#0d9488] uppercase tracking-wider block">AI Immigration</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold text-[#475569] hover:text-[#002045] transition-colors" href="#features">Features</a>
            <a className="text-sm font-semibold text-[#475569] hover:text-[#002045] transition-colors" href="#form-filling">Automated Filing</a>
            <a className="text-sm font-semibold text-[#475569] hover:text-[#002045] transition-colors" href="#intake">Conversational AI</a>
            <a className="text-sm font-semibold text-[#475569] hover:text-[#002045] transition-colors" href="#how-it-works">Workflow</a>
            <a className="text-sm font-semibold text-[#475569] hover:text-[#002045] transition-colors" href="#trust">Security</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              className="hidden sm:block text-xs sm:text-sm text-[#002045] font-semibold hover:text-[#061a33] transition-colors px-2 py-1.5 cursor-pointer" 
              onClick={() => handleAuth('admin', '/admin')}
            >
              Admin Login
            </button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAuth('client', '/chat')} 
              className="bg-[#002045] hover:bg-[#061a33] text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Start Free Intake</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </motion.button>
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#475569] hover:text-[#002045] hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 shadow-lg"
          >
            <nav className="flex flex-col space-y-3">
              <a onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#0f172a] hover:text-[#002045] py-1" href="#features">Features</a>
              <a onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#0f172a] hover:text-[#002045] py-1" href="#form-filling">Automated Filing</a>
              <a onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#0f172a] hover:text-[#002045] py-1" href="#intake">Conversational AI</a>
              <a onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#0f172a] hover:text-[#002045] py-1" href="#how-it-works">Workflow</a>
              <a onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#0f172a] hover:text-[#002045] py-1" href="#trust">Security</a>
            </nav>
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <button 
                onClick={() => { setMobileMenuOpen(false); handleAuth('admin', '/admin'); }}
                className="w-full py-2.5 text-center text-xs font-bold text-[#002045] bg-blue-50 rounded-xl"
              >
                Admin Login
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleAuth('client', '/chat'); }}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#002045] rounded-xl shadow-sm"
              >
                Start Free Intake
              </button>
            </div>
          </motion.div>
        )}
      </motion.header>

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section ref={heroRef} className="relative pt-12 sm:pt-20 md:pt-28 pb-16 sm:pb-24 md:pb-32 overflow-hidden min-h-[85vh] flex items-center">
          {/* Airplane Wing Photo Background with Organic Soft Edge Fade */}
          <motion.div 
            style={{ y: heroImageY, opacity: heroOpacity }}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          >
            <img 
              alt="Airplane Wing Cutting Clouds" 
              className="w-full h-full object-cover object-center md:object-right-top opacity-70 sm:opacity-75 select-none scale-105" 
              src="/assets/Airplane_wing_cutting_clouds_202608310540.jpeg" 
            />
            {/* Smooth luminous gradients creating comfortable whitespace for text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fafcff] via-[#fafcff]/90 to-[#fafcff]/20"></div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fafcff] to-transparent"></div>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid md:grid-cols-12 gap-10 md:gap-12 items-center w-full">
            {/* Left Hero Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="md:col-span-6 flex flex-col gap-6"
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 shadow-2xs border border-slate-200/80 text-[#002045] text-xs font-semibold w-max"
              >
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-pulse"></span>
                <span>AI-Powered Immigration Intake &amp; Form Automation</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-3.5xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] text-[#002045] tracking-tight"
              >
                Immigration paperwork, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002045] via-[#003870] to-[#0d9488]">
                  streamlined by AI.
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed"
              >
                Converse with an intelligent assistant, upload raw passport scans and CVs, and auto-populate official government petition forms with zero manual errors.
              </motion.p>

              {/* CTAs */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3.5 pt-1"
              >
                <motion.button 
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAuth('client', '/chat')} 
                  className="w-full sm:w-auto bg-[#002045] hover:bg-[#061a33] transition-all text-white px-7 py-3.5 rounded-xl text-sm font-bold shadow-md flex justify-center items-center gap-2 cursor-pointer"
                >
                  <span>Start Your Application</span>
                  <span className="material-symbols-outlined text-base">rocket_launch</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAuth('admin', '/admin')} 
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#002045] px-7 py-3.5 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-2xs border border-slate-200 cursor-pointer"
                >
                  <span>Admin Console</span>
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                </motion.button>
              </motion.div>

              {/* Trust Badge */}
              <motion.div 
                variants={fadeInUp}
                className="flex items-center gap-4 pt-4 border-t border-slate-200/60 max-w-max"
              >
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold shadow-2xs">CA</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 text-[#002045] flex items-center justify-center text-[10px] font-bold shadow-2xs">DE</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-100 text-[#0d9488] flex items-center justify-center text-[10px] font-bold shadow-2xs">US</div>
                </div>
                <div className="text-xs text-[#475569] font-medium">
                  Trusted across <span className="font-bold text-[#002045]">Express Entry, Chancenkarte, &amp; Global Visas</span>.
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Visual Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-6 relative hidden md:block"
            >
              {/* Main Frosted Glass Card */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,32,69,0.08)] p-7 relative z-10 border border-slate-200/80"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#002045] text-white rounded-xl flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-xl">smart_toy</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#002045]">Passage Assistant</div>
                      <div className="text-xs text-[#0d9488] flex items-center gap-1.5 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#0d9488] shadow-[0_0_6px_rgba(13,148,136,0.6)]"></span> Online • OCR Active
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-[#002045] text-[11px] font-bold rounded-full">Secure Session</span>
                </div>

                {/* Simulated Chat */}
                <div className="space-y-3.5">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#002045]/10 text-[#002045] flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                    <div className="bg-slate-50 text-[#0f172a] p-3.5 rounded-2xl rounded-tl-xs text-xs border border-slate-200/70 leading-relaxed shadow-2xs">
                      Hello! I&apos;ve parsed your passport and verified your details via in-memory OCR. Ready to review your Canada Express Entry package?
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-[#002045] text-white p-3.5 rounded-2xl rounded-tr-xs text-xs shadow-xs leading-relaxed max-w-[85%]">
                      Yes, let&apos;s review and auto-fill the forms.
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 text-[#0d9488] text-xs font-semibold bg-[#ccfbf1]/50 py-2.5 rounded-xl border border-[#0d9488]/20">
                    <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                    <span>Reconciling profile with IRCC guidelines...</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Accuracy Badge */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3.5 z-20 border border-slate-200"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#002045]">Tesseract OCR Engine</div>
                  <div className="text-[11px] text-[#0d9488] font-semibold">99.4% Extraction Precision</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. INTELLIGENT DOCUMENT PARSING SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white border-y border-slate-200/60 relative" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto space-y-3"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#002045] text-xs font-bold uppercase tracking-wider">
                Capabilities
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002045] tracking-tight">
                Intelligent Document Parsing
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Extract precise data from complex documents, passports, CVs, and screenshots with zero manual data entry.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            >
              {/* Feature 1 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-[#fafcff] p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002045] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">badge</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#002045]">Passport &amp; ID Verification</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Instantly extract MRZ codes, biographical records, and expiration dates with in-memory OCR parsing.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-200/60">
                  <span className="text-xs font-semibold text-[#475569]">Confidence Rate</span>
                  <span className="text-xs font-bold text-[#0d9488] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span> 99.8%
                  </span>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-[#fafcff] p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">description</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#002045]">CV &amp; Credentials Parsing</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Automatically convert employment histories, university degrees, and language test scores into structured schemas.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-200/60">
                  <span className="text-xs font-semibold text-[#475569]">Confidence Rate</span>
                  <span className="text-xs font-bold text-[#0d9488] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span> 98.5%
                  </span>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-[#fafcff] p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">account_balance</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#002045]">Financial Proof Reconciliation</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Verify account statements, salary slips, and minimum settlement fund thresholds across multiple currencies.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-200/60">
                  <span className="text-xs font-semibold text-[#475569]">Confidence Rate</span>
                  <span className="text-xs font-bold text-[#0d9488] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span> 99.1%
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. AUTOMATED FORM FILLING SHOWCASE */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#fafcff] relative overflow-hidden" id="form-filling">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="grid md:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Image in a Clean Floating Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="md:col-span-6 relative order-2 md:order-1"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 group bg-white p-2.5">
                  <img 
                    src="/assets/formfilling.jpeg" 
                    alt="AI Automated Immigration Form Filling" 
                    className="w-full h-[320px] sm:h-[400px] object-cover rounded-2xl group-hover:scale-102 transition-transform duration-500 select-none"
                  />
                  
                  {/* Floating Overlay Badge */}
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                    className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-md border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#002045] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">draw</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#002045]">Direct AcroForm Population</div>
                        <div className="text-[11px] text-[#0d9488] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]"></span> Ready for Government Filing
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-50 text-[#0d9488] text-[10px] font-bold rounded-lg uppercase">
                      Auto-Mapped
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column: Content */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="md:col-span-6 space-y-6 order-1 md:order-2"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#002045] text-xs font-bold w-max">
                  <span className="material-symbols-outlined text-[15px]">assignment_turned_in</span>
                  <span>Zero Manual Form Filling</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002045] leading-tight tracking-tight">
                  Turn Complex Questionnaires into <br className="hidden sm:inline"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002045] via-[#003870] to-[#0d9488]">
                    Flawless PDF Petitions
                  </span>
                </h2>
                <p className="text-base text-[#475569] leading-relaxed">
                  No more copying and pasting dates, passport numbers, and employment records across repetitive PDFs. Passage automatically binds verified intake entities straight into official government AcroForm templates.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="text-2xl font-bold text-[#002045] mb-1">80%</div>
                    <div className="text-xs font-medium text-[#475569]">Reduction in drafting time</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="text-2xl font-bold text-[#0d9488] mb-1">100%</div>
                    <div className="text-xs font-medium text-[#475569]">AcroForm schema alignment</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CONVERSATIONAL INTAKE & GLOBAL MOBILITY (Featuring BoardingPlane.jpeg) */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white border-y border-slate-200/60 relative overflow-hidden" id="intake">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="grid md:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Copy */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="md:col-span-6 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 text-[#0d9488] text-xs font-bold w-max">
                  <span className="material-symbols-outlined text-[15px]">flight</span>
                  <span>Cross-Application Unified Profile</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002045] leading-tight tracking-tight">
                  Conversational Intake that <br className="hidden sm:inline" />
                  Remembers Your Details
                </h2>
                <p className="text-base text-[#475569] leading-relaxed">
                  Replace static forms with an adaptive AI assistant. Verified details (passport numbers, degrees, language levels) automatically persist across multiple destination country applications.
                </p>
                <ul className="space-y-3 pt-1">
                  {[
                    "Unified Applicant Profile sharing across Canada, Germany, UK, & USA petitions.",
                    "Strict zero-hallucination policy adhering strictly to verified records.",
                    "Instant in-chat document & screenshot OCR extraction."
                  ].map((text, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                      className="flex items-start gap-3 p-3 bg-[#fafcff] rounded-xl border border-slate-200/70"
                    >
                      <span className="material-symbols-outlined text-[#0d9488] text-lg mt-0.5 flex-shrink-0">check_circle</span>
                      <span className="text-xs sm:text-sm text-[#0f172a] font-medium leading-relaxed">{text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Right Visual Card with BoardingPlane.jpeg in a Refined Editorial Frame */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="md:col-span-6 relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white p-2.5">
                  <img 
                    src="/assets/BoardingPlane.jpeg" 
                    alt="Passenger Boarding Aircraft" 
                    className="w-full h-[340px] sm:h-[400px] object-cover rounded-2xl opacity-85 select-none"
                  />
                  
                  {/* Floating Live Dialogue Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-md border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#002045] text-white flex items-center justify-center text-[10px]">
                        <span className="material-symbols-outlined text-xs">smart_toy</span>
                      </div>
                      <span className="text-xs font-bold text-[#002045]">Cross-Country Pre-Fill</span>
                    </div>
                    <p className="text-xs text-[#475569] leading-snug">
                      &quot;I found your verified Passport Number from your Express Entry profile. Reusing it for your Germany Opportunity Card.&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. HOW IT WORKS (WORKFLOW) */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#fafcff] relative" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14 max-w-2xl mx-auto space-y-3"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#002045] text-xs font-bold uppercase tracking-wider">
                Workflow
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002045] tracking-tight">
                How Passage Works
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                A secure, 4-step pipeline from raw document uploads to finalized petition packets.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { step: "01", title: "Ingest", desc: "Upload PDFs, scans, CVs, or chat naturally with the assistant.", icon: "cloud_upload" },
                { step: "02", title: "Parse & OCR", desc: "Tesseract OCR & LLM extract verified fields strictly in RAM.", icon: "document_scanner" },
                { step: "03", title: "Reconcile", desc: "Intake assistant prompts only for verified missing schema items.", icon: "rule" },
                { step: "04", title: "Generate", desc: "Download compliant, submission-ready AcroForm petition PDFs.", icon: "check_circle" }
              ].map((item) => (
                <motion.div 
                  key={item.step}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0d9488] bg-teal-50 px-2.5 py-1 rounded-lg">STEP {item.step}</span>
                    <span className="material-symbols-outlined text-xl text-[#002045]">{item.icon}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#002045]">{item.title}</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SECURITY & COMPLIANCE */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white border-y border-slate-200/60 relative" id="trust">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 max-w-2xl mx-auto space-y-3"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0d9488] text-xs font-bold uppercase tracking-wider">
                Security First
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002045] tracking-tight">
                Enterprise Compliance &amp; Zero-Retention
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Your applicants&apos; sensitive data is protected by industry-leading security and privacy protocols.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { icon: "shield_locked", title: "Zero Image Storage", desc: "All documents are parsed strictly in ephemeral RAM byte streams without writing photos to disk." },
                { icon: "policy", title: "GDPR & PIPEDA Aligned", desc: "Strict adherence to international data sovereignty regulations and localized database storage." },
                { icon: "lock", title: "AES-256 Encryption", desc: "All verified entity records and application state are encrypted at rest and in transit." }
              ].map((item) => (
                <motion.div 
                  key={item.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="bg-[#fafcff] p-7 rounded-2xl border border-slate-200/80 text-center shadow-2xs space-y-3"
                >
                  <div className="w-12 h-12 mx-auto bg-blue-50 text-[#002045] rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#002045]">{item.title}</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CINEMATIC CTA HERO BANNER (Airport Terminal Background) */}
        {/* ========================================================================= */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-8 overflow-hidden bg-[#fafcff]">
          <div className="max-w-6xl mx-auto relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl min-h-[420px] flex items-center justify-center p-8 sm:p-14 text-center">
            {/* Airport Terminal Background with Soft Ambient Tint */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img 
                src="/assets/Airport_terminal_at_dusk_202608310540.jpeg" 
                alt="International Airport Terminal at Dusk" 
                className="w-full h-full object-cover object-center opacity-78 select-none scale-102"
              />
              {/* Soft luminous white scrim for high contrast and pleasant readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/70 to-white/85"></div>
            </div>

            {/* Inner Content Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10 max-w-2xl mx-auto space-y-6"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#002045] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002045] leading-tight tracking-tight">
                Ready to simplify your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002045] via-[#003870] to-[#0d9488]">
                  immigration process?
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Join applicants and legal teams processing immigration petitions with AI precision and automated form completion.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-2">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAuth('client', '/chat')} 
                  className="bg-[#002045] hover:bg-[#061a33] text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Start Free Application</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAuth('admin', '/admin')} 
                  className="bg-white hover:bg-slate-50 text-[#002045] text-xs sm:text-sm font-bold px-7 py-3.5 rounded-xl shadow-xs border border-slate-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore Admin Dashboard</span>
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#002045] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-lg font-bold">flight_takeoff</span>
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-[#002045] block leading-tight">Passage</span>
                <span className="text-[9px] font-semibold text-[#0d9488] uppercase tracking-wider block">AI Immigration</span>
              </div>
            </Link>
            <div className="text-xs text-[#64748b]">
              © 2026 Passage Immigration AI. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-[#64748b]">
              <a className="hover:text-[#002045] transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-[#002045] transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-[#002045] transition-colors" href="#">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
