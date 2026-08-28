"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleAuth = (role: 'admin' | 'client', path: string) => {
    document.cookie = `role=${role}; path=/`;
    router.push(path);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* TopAppBar */}
      <header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-sm w-full top-0 z-50 sticky">
        <div className="flex justify-between items-center w-full px-6 sm:px-8 py-3.5 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <img alt="Passage Logo" className="h-10 md:h-12 w-auto rounded-md object-contain mix-blend-multiply" src="/assets/logo.png" />
          </div>
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#trust">Security</a>
          </nav>
          {/* CTAs */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="hidden md:block text-sm text-primary font-semibold hover:text-primary-container transition-colors cursor-pointer" onClick={() => handleAuth('admin', '/admin')}>
              Log In
            </button>
            <button onClick={() => handleAuth('client', '/chat')} className="bg-primary text-on-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover-lift shadow-ambient flex items-center gap-2 transition-all cursor-pointer">
              <span>Start Application</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-16 md:pt-24 pb-24 md:pb-32 overflow-hidden bg-surface-container-low min-h-[85vh] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img alt="Global Connectivity" className="w-full h-full object-cover opacity-50 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida/AEtjO1XGgpGwMIrYJQUduby-39twI04MDsQsb0l9TPYYzGpgDEckTIQKl83bqHU7zPkyKZ9wYWFOwyEww-P3lW7qGmyDXz9TXs8viuIma1JMFBhEi3g_j3O9vjxKSGCs0rVfCMbaY9oxPvWGLT6gIFxn2oWI5vKXCXKus1LjdVIu2xn93hcqif4VDJ7G0iXJcdGBTrMccPP4PBA9tRXagA_sUsVDhra3CJaD2DlDjtrypTW_DZv3NETTgwPy" />
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low/95 via-surface/85 to-surface-container/95"></div>
            <div className="absolute inset-0 bg-dots-pattern opacity-40 mix-blend-overlay"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 grid md:grid-cols-12 gap-12 items-center w-full">
            {/* Hero Content */}
            <div className="md:col-span-6 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass text-on-surface-variant text-xs font-semibold w-max shadow-sm border-white/60">
                <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
                <span className="tracking-wide">Enterprise Grade Compliance</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-on-surface">
                Navigate Global Immigration with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary block mt-1">AI Precision</span>
              </h1>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                Automate complex visa applications through conversational intake and intelligent document parsing. Turn months of bureaucratic delays into days of confident progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button onClick={() => handleAuth('client', '/chat')} className="bg-primary hover:bg-primary-container transition-colors text-on-primary px-8 py-3.5 rounded-xl text-sm font-bold hover-lift shadow-ambient-lg flex justify-center items-center gap-2 cursor-pointer">
                  Start Your Application
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                </button>
                <button onClick={() => handleAuth('admin', '/admin')} className="glass text-on-surface px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors flex justify-center items-center gap-2 shadow-sm border border-outline-variant/40 cursor-pointer">
                  Admin Console
                  <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                </button>
              </div>
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-outline-variant/30 max-w-max">
                <div className="flex -space-x-2.5">
                  <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center text-[10px] font-bold">AK</div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-fixed text-primary flex items-center justify-center text-[10px] font-bold">AM</div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface bg-secondary-fixed text-secondary flex items-center justify-center text-[10px] font-bold">JD</div>
                </div>
                <div className="text-xs text-on-surface-variant">
                  Trusted by <span className="font-bold text-primary">5,000+</span> applicants globally.
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="md:col-span-6 relative hidden md:block">
              {/* Main App Card */}
              <div className="glass bg-white/70 rounded-3xl shadow-ambient-lg p-7 relative z-10 hover-lift transform rotate-1 transition-transform duration-500 hover:rotate-0 border border-white">
                <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-xl">smart_toy</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">Passage Assistant</div>
                      <div className="text-xs text-secondary flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(19,105,106,0.6)]"></span> Online
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-surface-container/80 text-on-surface text-[10px] font-bold tracking-wider uppercase rounded-full shadow-sm">Secure Session</span>
                </div>
                {/* Chat Mockup */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                    <div className="bg-white text-on-surface p-3.5 rounded-2xl rounded-tl-sm text-xs shadow-sm border border-outline-variant/20 leading-relaxed">
                      Hello! I&apos;ve successfully parsed your passport and verified your details with OCR. We are ready to review your Express Entry application. Shall we proceed?
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-1">
                    <div className="bg-primary text-on-primary p-3.5 rounded-2xl rounded-tr-sm text-xs shadow-md leading-relaxed">
                      Yes, let&apos;s review the requirements.
                    </div>
                  </div>
                  {/* Processing State */}
                  <div className="flex items-center gap-2.5 mt-2 px-3.5 text-secondary text-xs font-semibold bg-secondary/10 py-2.5 rounded-xl border border-secondary/20">
                    <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                    <span>Reconciling profile with IRCC guidelines...</span>
                  </div>
                </div>
              </div>
              {/* Decorative Floating Card */}
              <div className="absolute -bottom-8 -left-8 glass bg-white/90 rounded-2xl shadow-ambient-lg p-4 flex items-center gap-4 z-20 hover-lift transform -rotate-3 transition-transform duration-500 hover:rotate-0 border border-white">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-secondary to-secondary-fixed text-white shadow-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Pytesseract OCR Engine</div>
                  <div className="text-[11px] text-secondary flex items-center gap-1.5 font-semibold mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    99.4% Accuracy Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intelligent Document Parsing Section */}
        <section className="py-20 md:py-28 bg-surface relative" id="features">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">Intelligent Document Parsing</h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">Extract precise data from complex documents and screenshots with 98%+ accuracy, eliminating manual data entry.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/40 shadow-ambient hover-lift flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">badge</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">Passport &amp; ID Verification</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">Instantly extract MRZ codes, biographical data, and validity dates with in-memory OCR understanding.</p>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between border border-outline-variant/30">
                  <span className="text-xs font-semibold text-on-surface-variant">Confidence Score</span>
                  <span className="text-xs font-bold text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">verified</span> 99.8%</span>
                </div>
              </div>
              {/* Feature Card 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/40 shadow-ambient hover-lift flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">description</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">CV &amp; Qualifications</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">Parse complex employment histories, academic credentials, and specialized skills into structured schemas.</p>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between border border-outline-variant/30">
                  <span className="text-xs font-semibold text-on-surface-variant">Confidence Score</span>
                  <span className="text-xs font-bold text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">verified</span> 97.5%</span>
                </div>
              </div>
              {/* Feature Card 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/40 shadow-ambient hover-lift flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">account_balance</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">Financial Statements</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">Analyze financial capacity, reconcile transactions, and verify account balances across multiple formats.</p>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between border border-outline-variant/30">
                  <span className="text-xs font-semibold text-on-surface-variant">Confidence Score</span>
                  <span className="text-xs font-bold text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">verified</span> 98.2%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conversational Intake Section */}
        <section className="py-20 md:py-28 bg-surface-container-low border-y border-outline-variant/30 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">Conversational Intake</h2>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  Replace rigid forms with an adaptive AI assistant that asks contextual questions, clarifies ambiguities, and gracefully resolves data conflicts across documents.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-xl mt-0.5">check_circle</span>
                    <span className="text-xs sm:text-sm text-on-surface font-medium leading-relaxed">Unified Applicant Profile sharing across multiple destination country applications.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-xl mt-0.5">check_circle</span>
                    <span className="text-xs sm:text-sm text-on-surface font-medium leading-relaxed">Zero-hallucination policy strictly adhering to verified records.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-xl mt-0.5">check_circle</span>
                    <span className="text-xs sm:text-sm text-on-surface font-medium leading-relaxed">Direct in-chat document &amp; screenshot OCR processing.</span>
                  </li>
                </ul>
              </div>
              <div className="glass bg-white/70 rounded-3xl p-6 sm:p-8 border border-white shadow-ambient-lg">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                    <div className="bg-surface-container-lowest text-on-surface p-4 rounded-2xl rounded-tl-sm text-xs shadow-sm border border-outline-variant/20 leading-relaxed">
                      I noticed you previously verified your Passport Number as A12345678. For your Germany Opportunity Card, I just need your German Language Level.
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-2">
                    <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-sm text-xs shadow-md leading-relaxed">
                      I have a B2 certificate from Goethe-Institut.
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center mt-1">
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                    <div className="bg-surface-container-lowest text-on-surface p-4 rounded-2xl rounded-tl-sm text-xs shadow-sm border border-outline-variant/20 leading-relaxed">
                      Perfect! I have recorded your German Language Level as &quot;B2&quot;. Your Opportunity Card profile is now 100% complete.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-28 bg-surface relative" id="how-it-works">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">How Passage Works</h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">A streamlined, secure workflow from initial document ingestion to finalized government forms.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center text-lg font-bold shadow-md mb-4">1</div>
                <h4 className="text-base font-bold text-on-surface mb-2">Ingest</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Securely upload unstructured documents, IDs, screenshots, or chat directly.</p>
              </div>
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-lg font-bold shadow-md mb-4">2</div>
                <h4 className="text-base font-bold text-on-surface mb-2">Parse &amp; OCR</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Tesseract-OCR and LLM models extract and classify entities with high precision.</p>
              </div>
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-surface-container-high text-primary flex items-center justify-center text-lg font-bold shadow-md mb-4">3</div>
                <h4 className="text-base font-bold text-on-surface mb-2">Reconcile</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Conversational agent verifies missing fields and shares unified profile data.</p>
              </div>
              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-lg font-bold shadow-md mb-4"><span className="material-symbols-outlined text-2xl">check</span></div>
                <h4 className="text-base font-bold text-on-surface mb-2">Generate</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Automatically populate verified government forms and review profiles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security / Compliance Section */}
        <section className="py-20 md:py-28 bg-primary text-on-primary relative overflow-hidden" id="trust">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Enterprise-Grade Compliance &amp; Security</h2>
              <p className="text-sm sm:text-base text-primary-fixed-dim leading-relaxed">Your applicants&apos; sensitive data is protected by industry-leading security protocols and compliance standards.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-primary-container/80 backdrop-blur-sm p-8 rounded-2xl border border-primary-fixed/20 text-center hover-lift shadow-xl">
                <div className="w-12 h-12 mx-auto bg-primary-fixed/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl text-secondary-fixed">shield_locked</span>
                </div>
                <h4 className="text-base font-bold mb-2 text-white">Zero Image Storage</h4>
                <p className="text-xs text-primary-fixed-dim leading-relaxed">All document uploads are processed in ephemeral RAM without saving photo files to disk.</p>
              </div>
              <div className="bg-primary-container/80 backdrop-blur-sm p-8 rounded-2xl border border-primary-fixed/20 text-center hover-lift shadow-xl">
                <div className="w-12 h-12 mx-auto bg-primary-fixed/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl text-secondary-fixed">policy</span>
                </div>
                <h4 className="text-base font-bold mb-2 text-white">GDPR &amp; PIPEDA Aligned</h4>
                <p className="text-xs text-primary-fixed-dim leading-relaxed">Strict adherence to global data privacy regulations and localized PostgreSQL storage.</p>
              </div>
              <div className="bg-primary-container/80 backdrop-blur-sm p-8 rounded-2xl border border-primary-fixed/20 text-center hover-lift shadow-xl">
                <div className="w-12 h-12 mx-auto bg-primary-fixed/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl text-secondary-fixed">lock</span>
                </div>
                <h4 className="text-base font-bold mb-2 text-white">AES-256 Encryption</h4>
                <p className="text-xs text-primary-fixed-dim leading-relaxed">All application state and entity extractions are encrypted at rest and in transit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-surface-container-low text-center relative">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">Ready to transform your immigration workflows?</h2>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">Join applicants and law firms using Passage to process immigration applications with AI speed and precision.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <button onClick={() => handleAuth('client', '/chat')} className="bg-primary hover:bg-primary-container transition-colors text-on-primary px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover-lift shadow-ambient-lg cursor-pointer">
                Start Free Application
              </button>
              <button onClick={() => handleAuth('admin', '/admin')} className="glass bg-white/60 text-on-surface px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-colors shadow-sm border border-outline-variant/40 cursor-pointer">
                Explore Admin Dashboard
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant/30 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img alt="Passage Logo" className="h-8 w-auto rounded object-contain mix-blend-multiply" src="/assets/logo.png" />
              <span className="text-sm font-bold text-primary">Passage AI</span>
            </div>
            <div className="text-xs text-on-surface-variant">
              © 2026 Passage Immigration AI Platform. All rights reserved.
            </div>
            <div className="flex gap-6 text-xs font-semibold text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
