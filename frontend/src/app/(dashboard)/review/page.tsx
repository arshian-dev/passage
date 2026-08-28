"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';

interface CaseItem {
  case_id: string;
  target_country: string;
  visa_type: string;
  status: string;
  extracted_data?: Record<string, any>;
  missing_fields?: string[];
  completeness?: number;
}

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [caseState, setCaseState] = useState<CaseItem | null>(null);
  const [unifiedProfile, setUnifiedProfile] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'case' | 'unified'>('case');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all cases on mount
  useEffect(() => {
    const urlCaseId = searchParams.get('case_id');
    
    Promise.all([
      fetch(`${API_BASE_URL}/api/cases`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/user/profile`).then(r => r.json()).catch(() => ({}))
    ])
      .then(([casesData, profileData]) => {
        if (Array.isArray(casesData) && casesData.length > 0) {
          setCases(casesData);
          const match = urlCaseId ? casesData.find(c => c.case_id === urlCaseId) : null;
          setSelectedCaseId(match ? match.case_id : casesData[0].case_id);
        }
        if (profileData && typeof profileData === 'object') {
          setUnifiedProfile(profileData);
        }
      })
      .catch(err => console.error("Error loading review data:", err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  // Fetch specific case details whenever selectedCaseId changes
  useEffect(() => {
    if (!selectedCaseId) return;
    fetch(`${API_BASE_URL}/api/cases/${selectedCaseId}`)
      .then(res => res.json())
      .then(data => {
        setCaseState(data);
        setDownloadUrl(null);
      })
      .catch(err => console.error("Error loading case:", err));
  }, [selectedCaseId]);

  const handleGenerate = async () => {
    if (!selectedCaseId) return;
    setIsGenerating(true);
    try {
      const form = new FormData();
      form.append('case_id', selectedCaseId);
      const res = await fetch(`${API_BASE_URL}/api/application/generate`, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (data.status === 'success') {
        const fullUrl = `${API_BASE_URL}${data.download_url}`;
        setDownloadUrl(fullUrl);
        // Automatically open/download the PDF
        window.open(fullUrl, '_blank');
      } else {
        alert("Failed to generate application PDF.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating application package.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getApplicantName = (extracted?: Record<string, any>) => {
    if (!extracted) return 'Applicant';
    const first = extracted['First Name'] || extracted['Given Name'] || extracted['applicant_given_name'] || '';
    const last = extracted['Last Name'] || extracted['Family Name'] || extracted['applicant_family_name'] || '';
    if (first || last) return `${first} ${last}`.trim();
    for (const [k, v] of Object.entries(extracted)) {
      if (k.toLowerCase().includes('name') && v) return String(v);
    }
    return 'Applicant';
  };

  const applicantName = getApplicantName(caseState?.extracted_data || unifiedProfile);
  const extractedEntries = Object.entries(caseState?.extracted_data || {});
  const unifiedEntries = Object.entries(unifiedProfile || {});
  const missingCount = caseState?.missing_fields?.length || 0;
  const isComplete = missingCount === 0 && extractedEntries.length > 0;
  const completeness = caseState?.completeness || (isComplete ? 100 : extractedEntries.length > 0 ? 50 : 0);

  return (
    <div className="flex-1 flex flex-col h-full relative w-full pb-36 sm:pb-32 md:pb-24 bg-background">
      {/* Top Header Bar */}
      <header className="bg-surface border-b border-outline-variant shadow-sm w-full z-30 flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3.5 gap-3 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-lg sm:text-xl">assignment_ind</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-on-surface">Application Profile Review</h1>
            <p className="text-[11px] sm:text-xs text-on-surface-variant">Review extracted records and generate verified government forms</p>
          </div>
        </div>

        {/* Application Selector */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex-1 sm:flex-none flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant max-w-[220px] sm:max-w-none">
            <span className="text-[11px] font-semibold text-on-surface-variant hidden sm:inline">Case:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-transparent text-xs font-bold text-primary outline-none cursor-pointer w-full truncate"
            >
              {cases.map((c) => (
                <option key={c.case_id} value={c.case_id}>
                  {c.case_id} — {c.target_country && c.target_country !== "Unspecified" ? c.target_country : "New Case"} ({c.visa_type || "General"})
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/chat?case_id=${selectedCaseId}`}
            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-opacity-90 flex items-center gap-1 shadow-sm transition-all flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">forum</span>
            <span className="hidden xs:inline">Intake Chat</span>
            <span className="xs:hidden">Chat</span>
          </Link>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Header Summary Banner */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-ambient border border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-on-surface flex items-center gap-1.5">
                  {applicantName}
                  {isComplete && <span className="material-symbols-outlined text-secondary text-xl sm:text-2xl" title="Verified Profile">verified</span>}
                </h2>
                <span className="px-2.5 py-0.5 bg-primary-fixed text-primary font-bold text-[11px] sm:text-xs rounded-full border border-primary/20">
                  #{caseState?.case_id || selectedCaseId}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                  isComplete ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {caseState?.status || 'In Progress'}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-medium text-on-surface-variant flex-wrap">
                <span className="flex items-center gap-1 font-bold text-primary">
                  <span className="material-symbols-outlined text-[15px] sm:text-[16px]">public</span>
                  {caseState?.target_country && caseState.target_country !== "Unspecified" ? caseState.target_country : "Destination Pending"}
                </span>
                <span>•</span>
                <span>Pathway: <strong className="text-on-surface">{caseState?.visa_type || "General Intake"}</strong></span>
                <span>•</span>
                <span>{extractedEntries.length} Recorded Entities</span>
              </div>
            </div>

            {/* Completeness Card */}
            <div className="flex items-center gap-3 sm:gap-4 bg-surface-container-low p-3 sm:p-4 rounded-xl border border-outline-variant/60 w-full md:w-auto justify-between md:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs border border-outline-variant">
                <span className="material-symbols-outlined text-xl sm:text-2xl font-bold text-primary">
                  {isComplete ? 'task_alt' : 'donut_large'}
                </span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Completeness</div>
                <div className="text-xl sm:text-2xl font-bold text-primary">{completeness}%</div>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex border-b border-outline-variant gap-3 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
            <button
              onClick={() => setActiveTab('case')}
              className={`pb-2.5 sm:pb-3 border-b-2 transition-colors flex items-center gap-1.5 sm:gap-2 flex-shrink-0 cursor-pointer ${
                activeTab === 'case' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">description</span>
              Application Fields ({extractedEntries.length})
            </button>
            <button
              onClick={() => setActiveTab('unified')}
              className={`pb-2.5 sm:pb-3 border-b-2 transition-colors flex items-center gap-1.5 sm:gap-2 flex-shrink-0 cursor-pointer ${
                activeTab === 'unified' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">hub</span>
              Unified Profile Records ({unifiedEntries.length})
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            
            {/* Left Col (8 Spans): Fields Data Table / Grid */}
            <div className="md:col-span-8 space-y-4 sm:space-y-6">
              <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-outline-variant bg-surface flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px]">
                      {activeTab === 'case' ? 'folder_open' : 'account_tree'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-on-surface">
                      {activeTab === 'case' 
                        ? `Application Data for ${caseState?.target_country || 'Target Country'}`
                        : "Unified Applicant Profile"}
                    </h3>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-on-surface-variant">
                    {activeTab === 'case' ? `${extractedEntries.length} items` : `${unifiedEntries.length} verified fields`}
                  </span>
                </div>

                <div className="p-4 sm:p-6">
                  {activeTab === 'case' ? (
                    extractedEntries.length === 0 ? (
                      <div className="py-8 sm:py-12 text-center space-y-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-container-low flex items-center justify-center mx-auto text-on-surface-variant">
                          <span className="material-symbols-outlined text-2xl sm:text-3xl">upload_file</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-on-surface">No Information Extracted Yet</h4>
                        <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                          Provide your details in the Intake Chat or upload your passport scan, CV, or screenshot to automatically populate this form.
                        </p>
                        <div className="pt-2 flex justify-center gap-3">
                          <Link
                            href={`/chat?case_id=${selectedCaseId}`}
                            className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-opacity-90 inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[16px]">forum</span>
                            Go to Intake Chat
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {extractedEntries.map(([key, val]) => (
                          <div 
                            key={key} 
                            className="p-3 sm:p-3.5 bg-surface rounded-xl border border-outline-variant flex flex-col justify-between space-y-1 hover:border-primary/50 transition-colors"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm font-bold text-on-surface break-words">
                                {String(val) || 'Pending'}
                              </span>
                              <span className="material-symbols-outlined text-secondary text-[16px] flex-shrink-0">
                                verified
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    unifiedEntries.length === 0 ? (
                      <div className="py-8 sm:py-12 text-center space-y-2">
                        <p className="text-xs sm:text-sm text-on-surface-variant">No cross-application profile data aggregated yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {unifiedEntries.map(([key, val]) => (
                          <div 
                            key={key} 
                            className="p-3 sm:p-3.5 bg-surface rounded-xl border border-outline-variant flex flex-col justify-between space-y-1"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm font-bold text-on-surface break-words">
                                {String(val)}
                              </span>
                              <span className="material-symbols-outlined text-secondary text-[16px] flex-shrink-0">
                                check_circle
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right Col (4 Spans): Requirements Checklist & AI Insights */}
            <div className="md:col-span-4 space-y-4 sm:space-y-6">
              {/* Requirements & Missing Fields Checklist */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-ambient border border-outline-variant space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">checklist</span>
                    Requirements Checklist
                  </h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    missingCount === 0 ? 'bg-secondary-container text-secondary' : 'bg-error-container text-error'
                  }`}>
                    {missingCount === 0 ? 'All Complete' : `${missingCount} Pending`}
                  </span>
                </div>

                {missingCount > 0 ? (
                  <div className="space-y-2.5 sm:space-y-3">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      The following required fields must be supplied before government form generation:
                    </p>
                    <ul className="space-y-2">
                      {caseState?.missing_fields?.map((field: string) => (
                        <li key={field} className="flex items-center justify-between p-2.5 bg-surface rounded-lg border border-outline-variant text-xs">
                          <span className="font-semibold text-on-surface flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-error flex-shrink-0"></span>
                            {field}
                          </span>
                          <Link 
                            href={`/chat?case_id=${selectedCaseId}`}
                            className="text-[11px] text-primary font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>Fill</span>
                            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 bg-secondary-container/40 rounded-xl border border-secondary/30 space-y-2 text-center">
                    <span className="material-symbols-outlined text-secondary text-2xl sm:text-3xl">verified</span>
                    <h4 className="text-xs sm:text-sm font-bold text-on-surface">100% Requirements Verified</h4>
                    <p className="text-xs text-on-surface-variant leading-normal">
                      All mandatory schema fields for {caseState?.target_country || 'this country'} are complete.
                    </p>
                  </div>
                )}
              </div>

              {/* PDF Package Preview Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-ambient border border-outline-variant space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-primary-container text-on-primary-container">
                    <span className="material-symbols-outlined text-lg sm:text-xl">picture_as_pdf</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-primary">AcroForm Generation</h3>
                    <p className="text-[10px] sm:text-[11px] text-on-surface-variant">Official PDF Form Petition</p>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Generates an official immigration petition package filled with verified data.
                </p>

                {downloadUrl && (
                  <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">download_done</span>
                      Ready
                    </span>
                    <a 
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-primary text-on-primary rounded text-[11px] font-bold hover:bg-opacity-90"
                    >
                      Download PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Docked Action Bar - Positioned above mobile navigation on mobile */}
      <div className="fixed bottom-[54px] md:bottom-0 right-0 left-0 md:left-64 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant shadow-2xl px-4 sm:px-6 py-2.5 sm:py-3.5 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-4">
          <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
            <input 
              type="checkbox" 
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer flex-shrink-0"
            />
            <span className="text-[11px] sm:text-xs font-semibold text-on-surface leading-tight">
              I confirm all application details are reviewed and accurate.
            </span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !isConfirmed}
              className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isGenerating ? 'sync' : 'document_scanner'}
              </span>
              <span>{isGenerating ? "Generating..." : "Generate Final Application"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
