"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import MarkdownView from '@/app/components/MarkdownView';

interface CaseItem {
  case_id: string;
  target_country: string;
  visa_type: string;
  status: string;
  extracted_data?: Record<string, any>;
  missing_fields?: string[];
  completeness?: number;
}

export default function ChatIntake() {
  const searchParams = useSearchParams();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [caseState, setCaseState] = useState<CaseItem | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; text: string; isAttachment?: boolean }>>([
    { role: 'agent', text: "Hello! I am your AI immigration assistant. Which country are you looking to apply for a visa to?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'details'>('chat');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isUploading]);

  // Fetch all cases on mount
  useEffect(() => {
    const urlCaseId = searchParams.get('case_id');

    fetch(`${API_BASE_URL}/api/cases`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCases(data);
          const match = urlCaseId ? data.find((c: any) => c.case_id === urlCaseId) : null;
          setSelectedCaseId(match ? match.case_id : data[0].case_id);
        } else {
          // If no cases exist yet, auto-create the first one
          handleNewCase();
        }
      })
      .catch(err => {
        console.error("Failed to load cases:", err);
        setSelectedCaseId(urlCaseId || "APP-8901");
      })
      .finally(() => setIsLoadingCases(false));
  }, [searchParams]);

  // Fetch specific case details whenever selectedCaseId changes
  useEffect(() => {
    if (!selectedCaseId) return;
    fetch(`${API_BASE_URL}/api/cases/${selectedCaseId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCaseState(data);
        if (Array.isArray(data.chat_history) && data.chat_history.length > 0) {
          setMessages(data.chat_history);
        } else {
          const country = data.target_country && data.target_country !== "Unspecified" ? data.target_country : "";
          const visa = data.visa_type && data.visa_type !== "General" ? ` (${data.visa_type})` : "";
          
          if (country) {
            setMessages([
              { role: 'agent', text: `Hello! I see you are applying for ${country}${visa}. How can I assist you with your application details today? You can type your details or upload your passport, CV, or screenshot directly using the attachment button.` }
            ]);
          } else {
            setMessages([
              { role: 'agent', text: "Hello! I am your AI immigration assistant. Which country are you looking to apply for a visa to?" }
            ]);
          }
        }
      })
      .catch(err => console.error("Failed to load case details:", err));
  }, [selectedCaseId]);

  const handleNewCase = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cases/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_country: "Unspecified", visa_type: "General" })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const newCase = await res.json();
      setCases(prev => [newCase, ...prev]);
      setSelectedCaseId(newCase.case_id);
      setMessages([
        { role: 'agent', text: "Hello! I am your AI immigration assistant. Which country are you looking to apply for a visa to?" }
      ]);
    } catch (err) {
      console.error("Failed to create new case:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedCaseId) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/intake/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: selectedCaseId, message: userText })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data.chat_history) && data.chat_history.length > 0) {
        setMessages(data.chat_history);
      } else if (data.reply) {
        setMessages(prev => [...prev, { role: 'agent', text: data.reply }]);
      }
      
      // Refresh case state & cases list so country/sidebar updates live
      fetch(`${API_BASE_URL}/api/cases/${selectedCaseId}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d) {
            setCaseState(d);
            setCases(prev => prev.map(c => c.case_id === selectedCaseId ? { ...c, ...d } : c));
          }
        })
        .catch(console.error);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: 'agent', text: "Sorry, I encountered an error connecting to the server. Please verify your connection or try again." }]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedCaseId) return;
    const file = e.target.files[0];
    
    // Add user upload message
    setMessages(prev => [
      ...prev, 
      { role: 'user', text: `📎 Uploaded Document: ${file.name}`, isAttachment: true }
    ]);
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('case_id', selectedCaseId);

    try {
      const res = await fetch(`${API_BASE_URL}/api/intake/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.status === 'success' && data.chat_history && data.chat_history.length > 0) {
        setMessages(data.chat_history);
      } else if (data.status === 'success' && data.extracted_data) {
        const extractedEntries = Object.entries(data.extracted_data);
        let summaryText = `I have processed your document (${file.name}) using OCR. `;
        if (extractedEntries.length > 0) {
          const fieldsStr = extractedEntries.map(([k, v]) => `${k}: ${v}`).join(", ");
          summaryText += `I extracted: ${fieldsStr}. I've updated your application!`;
        } else {
          summaryText += `No matching form fields were detected, but the document has been attached to your case file.`;
        }
        setMessages(prev => [...prev, { role: 'agent', text: summaryText }]);
      } else {
        setMessages(prev => [...prev, { role: 'agent', text: `I received ${file.name} but could not extract structured text.` }]);
      }

      // Refresh case state
      const refreshed = await fetch(`${API_BASE_URL}/api/cases/${selectedCaseId}`).then(r => r.json());
      setCaseState(refreshed);
      setCases(prev => prev.map(c => c.case_id === selectedCaseId ? { ...c, ...refreshed } : c));
    } catch (err) {
      console.error("Upload error:", err);
      setMessages(prev => [...prev, { role: 'agent', text: `Error uploading and processing ${file.name}.` }]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const extractedCount = Object.keys(caseState?.extracted_data || {}).length;
  const missingCount = caseState?.missing_fields?.length || 0;

  return (
    <main className="flex-1 flex flex-col h-full relative w-full pb-16 md:pb-0">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.txt" 
        onChange={handleFileUpload} 
      />

      {/* Top Header / App Bar */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full px-4 sm:px-6 py-3 bg-surface border-b border-outline-variant shadow-sm z-30 sticky top-0 gap-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl font-bold" data-icon="forum">forum</span>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold text-on-surface leading-tight">Intake Assistant</h1>
            <p className="text-[11px] sm:text-xs text-on-surface-variant">Multi-destination visa application chat with OCR ingestion</p>
          </div>
        </div>

        {/* Application Switcher & New Button */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex-1 sm:flex-none flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant max-w-[240px] sm:max-w-none">
            <span className="text-[11px] text-on-surface-variant font-medium hidden sm:inline">Active Application:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-transparent text-xs font-bold text-primary outline-none cursor-pointer w-full truncate"
            >
              {cases.map((c) => (
                <option key={c.case_id} value={c.case_id}>
                  {c.case_id} — {c.target_country && c.target_country !== "Unspecified" ? c.target_country : "New Chat"} {c.visa_type && c.visa_type !== "General" ? `(${c.visa_type})` : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNewCase}
            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-opacity-90 flex items-center gap-1 shadow-sm transition-all flex-shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span className="hidden xs:inline">New App</span>
            <span className="xs:hidden">New</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Pill Switcher (Hidden on LG and above) */}
      <div className="lg:hidden px-4 pt-3 pb-1 flex gap-2 bg-background border-b border-outline-variant/60">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'chat'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface border border-outline-variant text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">chat</span>
          <span>Intake Chat</span>
        </button>
        <button
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'details'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface border border-outline-variant text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">checklist</span>
          <span>Details & Checklist</span>
          {missingCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              mobileTab === 'details' ? 'bg-primary-container text-on-primary-container' : 'bg-error text-on-error'
            }`}>
              {missingCount}
            </span>
          )}
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        <div className="max-w-6xl mx-auto h-full flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Panel: Chat Interface */}
          <div className={`flex-1 flex flex-col bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden border border-outline-variant min-h-[480px] sm:min-h-[520px] ${
            mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}>
            {/* Chat Sub-Header */}
            <div className="p-3 sm:p-4 border-b border-outline-variant bg-surface flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg" data-icon="robot_2">robot_2</span>
                <span className="font-semibold text-xs sm:text-sm text-on-surface">Passage AI Agent</span>
                <span className="px-2 py-0.5 bg-secondary-container text-secondary text-[10px] font-bold rounded">OCR Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                {caseState?.target_country && caseState.target_country !== "Unspecified" ? (
                  <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded-full border border-secondary/30">
                    {caseState.target_country} {caseState.visa_type && caseState.visa_type !== "General" ? `• ${caseState.visa_type}` : ""}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant text-[11px] rounded-full border border-outline-variant">
                    Pending
                  </span>
                )}
                <span className="px-2 py-0.5 bg-surface-container-low text-primary text-[11px] font-bold rounded-full border border-outline-variant">
                  {selectedCaseId || "..."}
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-background">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-2xl ${msg.role === 'user' ? 'ml-auto justify-end' : ''}`}>
                  {msg.role === 'agent' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs text-xs">
                      <span className="material-symbols-outlined text-sm" data-icon="robot_2">robot_2</span>
                    </div>
                  )}
                  <div className={msg.role === 'user' ? 
                    `bg-primary text-on-primary p-3 sm:p-4 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-xs leading-relaxed ${msg.isAttachment ? 'flex items-center gap-2 font-medium bg-primary-container' : ''}` : 
                    "bg-surface-container-low p-3 sm:p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm text-on-surface border border-outline-variant shadow-xs leading-relaxed"
                  }>
                    {msg.isAttachment ? (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">description</span>
                        <span className="font-semibold">{msg.text}</span>
                      </div>
                    ) : (
                      msg.role === 'agent' ? (
                        <MarkdownView content={msg.text} />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )
                    )}
                  </div>
                </div>
              ))}

              {isUploading && (
                <div className="flex items-start gap-2.5 max-w-[92%] sm:max-w-2xl">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <span className="material-symbols-outlined text-xs sm:text-sm animate-spin">sync</span>
                  </div>
                  <div className="bg-surface-container-low p-3 sm:p-4 rounded-2xl rounded-tl-sm text-xs text-on-surface-variant border border-outline-variant flex items-center gap-2">
                    <span>Extracting text via Pytesseract OCR & matching fields...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Attachment & Multi-Line Shift+Enter Support */}
            <div className="p-2.5 sm:p-4 border-t border-outline-variant bg-surface-container-lowest">
              <div className="relative flex items-end gap-1.5 sm:gap-2 bg-surface border border-outline-variant rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary shadow-xs transition-all">
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 flex-shrink-0 mb-0.5 cursor-pointer"
                  title="Upload passport, CV, screenshot, or PDF for OCR extraction"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]">attach_file</span>
                </button>

                {/* Multi-line Auto-expanding Textarea */}
                <textarea 
                  rows={1}
                  className="flex-1 py-2 px-1.5 sm:px-2 bg-transparent text-xs sm:text-sm text-on-surface outline-none resize-none max-h-32 min-h-[36px] leading-relaxed" 
                  placeholder={caseState?.target_country && caseState.target_country !== "Unspecified" ? `Provide info or attach file for ${caseState.target_country}...` : "Tell the agent your destination country or attach a document..."} 
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />

                <button 
                  onClick={handleSend} 
                  disabled={!input.trim()}
                  className="p-2 sm:p-2.5 bg-primary text-on-primary hover:bg-opacity-90 rounded-xl transition-colors flex items-center justify-center disabled:opacity-40 flex-shrink-0 mb-0.5 shadow-xs cursor-pointer"
                  title="Send (Enter)"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">send</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] sm:text-[11px] text-on-surface-variant">
                <span className="hidden sm:inline"><strong>Enter</strong> to send • <strong>Shift + Enter</strong> for new line</span>
                <span className="sm:hidden">Tap Send or press Enter</span>
                <span>PDF, PNG, JPG, WEBP, DOCX</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Checklist & Status */}
          <div className={`w-full lg:w-80 flex-col gap-4 sm:gap-6 ${
            mobileTab === 'details' ? 'flex' : 'hidden lg:flex'
          }`}>
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-5 sm:p-6 border border-outline-variant">
              <h3 className="text-base sm:text-lg font-bold text-on-surface mb-3 sm:mb-4">Application Details</h3>
              
              {/* Country & Visa Card */}
              <div className="mb-4 p-3 bg-surface rounded-xl border border-outline-variant space-y-1">
                <div className="text-[10px] text-on-surface-variant uppercase font-bold">Target Destination</div>
                <div className="text-sm sm:text-base font-bold text-primary">
                  {caseState?.target_country && caseState.target_country !== "Unspecified" ? caseState.target_country : "Not specified yet"}
                </div>
                <div className="text-xs text-on-surface-variant">
                  Pathway: {caseState?.visa_type || "General Intake"}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Extracted Information ({extractedCount})
                  </h4>
                  <ul className="space-y-2">
                    {caseState?.extracted_data && Object.keys(caseState.extracted_data).length > 0 ? (
                      Object.entries(caseState.extracted_data).map(([key, val]) => (
                        <li key={key} className="flex items-center justify-between text-xs sm:text-sm text-on-surface p-2 bg-surface rounded-lg border border-outline-variant/40">
                          <span className="flex items-center gap-1.5 capitalize text-on-surface-variant">
                            <span className="material-symbols-outlined text-secondary text-sm" data-icon="check_circle">check_circle</span>
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-semibold text-on-surface truncate max-w-[120px]">{String(val)}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-on-surface-variant italic p-2 bg-surface rounded-lg">No information extracted yet</li>
                    )}
                  </ul>
                </div>

                <div className="border-t border-outline-variant pt-3"></div>

                <div>
                  <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Missing Required Fields ({missingCount})
                  </h4>
                  <ul className="space-y-2">
                    {caseState?.missing_fields && caseState.missing_fields.length > 0 ? (
                      caseState.missing_fields.map((field: string) => (
                        <li key={field} className="flex items-center gap-2 text-xs sm:text-sm text-on-surface p-2 bg-surface rounded-lg border border-outline-variant/40">
                          <div className="w-2 h-2 rounded-full bg-error flex-shrink-0"></div>
                          <span>{field}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-secondary font-medium flex items-center gap-1 p-2 bg-secondary-container/30 rounded-lg">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        All required fields complete!
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
