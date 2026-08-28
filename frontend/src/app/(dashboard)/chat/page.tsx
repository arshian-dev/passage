"use client";
import { useState, useEffect, useRef } from 'react';
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

export default function ChatIntake() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [caseState, setCaseState] = useState<CaseItem | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; text: string; isAttachment?: boolean }>>([
    { role: 'agent', text: "Hello! I am your AI immigration assistant. Which country are you looking to apply for a visa to?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all cases on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cases`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCases(data);
          setSelectedCaseId(data[0].case_id);
        } else {
          // If no cases exist yet, auto-create the first one
          handleNewCase();
        }
      })
      .catch(err => {
        console.error("Failed to load cases:", err);
        setSelectedCaseId("APP-8901");
      })
      .finally(() => setIsLoadingCases(false));
  }, []);

  // Fetch specific case details whenever selectedCaseId changes
  useEffect(() => {
    if (!selectedCaseId) return;
    fetch(`${API_BASE_URL}/api/cases/${selectedCaseId}`)
      .then(res => res.json())
      .then(data => {
        setCaseState(data);
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
      })
      .catch(err => console.error(err));
  }, [selectedCaseId]);

  const handleNewCase = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cases/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_country: "Unspecified", visa_type: "General" })
      });
      const newCase = await res.json();
      setCases(prev => [newCase, ...prev]);
      setSelectedCaseId(newCase.case_id);
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
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'agent', text: data.reply }]);
      
      // Refresh case state & cases list so country/sidebar updates live
      fetch(`${API_BASE_URL}/api/cases/${selectedCaseId}`)
        .then(r => r.json())
        .then(d => {
          setCaseState(d);
          setCases(prev => prev.map(c => c.case_id === selectedCaseId ? { ...c, ...d } : c));
        })
        .catch(console.error);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'agent', text: "Sorry, I encountered an error connecting to the server." }]);
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

      if (data.status === 'success' && data.extracted_data) {
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
      <header className="flex justify-between items-center w-full px-6 py-3.5 bg-surface border-b border-outline-variant shadow-sm z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-headline-sm font-bold" data-icon="forum">forum</span>
          <div className="flex flex-col">
            <h1 className="text-headline-sm font-bold text-on-surface">Intake Assistant</h1>
            <p className="text-label-md text-on-surface-variant">Multi-destination visa application chat with OCR ingestion</p>
          </div>
        </div>

        {/* Application Switcher & New Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
            <span className="text-label-md text-on-surface-variant font-medium">Active Application:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-transparent text-body-sm font-semibold text-primary outline-none cursor-pointer"
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
            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:bg-opacity-90 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Application
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto h-full flex flex-col lg:flex-row gap-6">
          {/* Left Panel: Chat Interface */}
          <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden border border-outline-variant min-h-[520px]">
            {/* Chat Sub-Header */}
            <div className="p-4 border-b border-outline-variant bg-surface flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" data-icon="robot_2">robot_2</span>
                <span className="font-semibold text-body-md text-on-surface">Passage AI Agent</span>
                <span className="px-2 py-0.5 bg-secondary-container text-secondary text-[10px] font-bold rounded">OCR Enabled</span>
              </div>
              <div className="flex items-center gap-2">
                {caseState?.target_country && caseState.target_country !== "Unspecified" ? (
                  <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container text-label-md font-bold rounded-full border border-secondary">
                    {caseState.target_country} {caseState.visa_type && caseState.visa_type !== "General" ? `• ${caseState.visa_type}` : ""}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-surface-variant text-on-surface-variant text-label-md rounded-full border border-outline-variant">
                    Destination: Pending
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-surface-container-low text-primary text-label-md font-bold rounded-full border border-outline-variant">
                  {selectedCaseId || "..."}
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-3 max-w-2xl ${msg.role === 'user' ? 'ml-auto justify-end' : ''}`}>
                  {msg.role === 'agent' && (
                    <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm" data-icon="robot_2">robot_2</span>
                    </div>
                  )}
                  <div className={msg.role === 'user' ? 
                    `bg-primary text-on-primary p-4 rounded-2xl rounded-tr-sm text-body-md shadow-sm whitespace-pre-wrap ${msg.isAttachment ? 'flex items-center gap-2 font-medium bg-primary-container' : ''}` : 
                    "bg-surface-container-low p-4 rounded-2xl rounded-tl-sm text-body-md text-on-surface border border-outline-variant shadow-sm whitespace-pre-wrap"
                  }>
                    {msg.isAttachment && (
                      <span className="material-symbols-outlined text-[20px]">description</span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {isUploading && (
                <div className="flex items-start gap-3 max-w-2xl">
                  <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-sm text-body-sm text-on-surface-variant border border-outline-variant flex items-center gap-2">
                    <span>Extracting text via Pytesseract OCR & matching fields...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar with Attachment & Multi-Line Shift+Enter Support */}
            <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
              <div className="relative flex items-end gap-2 bg-surface border border-outline-variant rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary shadow-sm transition-all">
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 flex-shrink-0 mb-0.5"
                  title="Upload passport, CV, screenshot, or PDF for OCR extraction"
                >
                  <span className="material-symbols-outlined text-[22px]">attach_file</span>
                </button>

                {/* Multi-line Auto-expanding Textarea */}
                <textarea 
                  rows={1}
                  className="flex-1 py-2.5 px-2 bg-transparent text-sm text-on-surface outline-none resize-none max-h-36 min-h-[38px] leading-relaxed" 
                  placeholder={caseState?.target_country && caseState.target_country !== "Unspecified" ? `Provide info or attach file for ${caseState.target_country} application...` : "Tell the agent your destination country or attach a document..."} 
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    // Auto-adjust textarea height
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
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
                  className="p-2.5 bg-primary text-on-primary hover:bg-opacity-90 rounded-xl transition-colors flex items-center justify-center disabled:opacity-40 flex-shrink-0 mb-0.5 shadow-sm"
                  title="Send (Enter)"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-on-surface-variant">
                <span><strong>Enter</strong> to send • <strong>Shift + Enter</strong> for new line</span>
                <span>Supported: PDF, PNG, JPG, WEBP, DOCX</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Checklist & Status */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-outline-variant">
              <h3 className="text-headline-sm font-semibold text-on-surface mb-4">Application Details</h3>
              
              {/* Country & Visa Card */}
              <div className="mb-4 p-3 bg-surface rounded-lg border border-outline-variant space-y-1">
                <div className="text-label-md text-on-surface-variant uppercase font-bold text-[10px]">Target Destination</div>
                <div className="text-body-md font-bold text-primary">
                  {caseState?.target_country && caseState.target_country !== "Unspecified" ? caseState.target_country : "Not specified yet"}
                </div>
                <div className="text-label-md text-on-surface-variant text-xs">
                  Pathway: {caseState?.visa_type || "General"}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 text-[11px]">Extracted Information</h4>
                  <ul className="space-y-2">
                    {caseState?.extracted_data && Object.keys(caseState.extracted_data).length > 0 ? (
                      Object.entries(caseState.extracted_data).map(([key, val]) => (
                        <li key={key} className="flex items-center justify-between text-body-sm text-on-surface">
                          <span className="flex items-center gap-1.5 capitalize text-on-surface-variant">
                            <span className="material-symbols-outlined text-secondary text-sm" data-icon="check_circle">check_circle</span>
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-semibold text-on-surface truncate max-w-[120px]">{String(val)}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-body-sm text-on-surface-variant italic">No information extracted yet</li>
                    )}
                  </ul>
                </div>

                <div className="border-t border-outline-variant pt-3"></div>

                <div>
                  <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 text-[11px]">Missing Required Fields</h4>
                  <ul className="space-y-2">
                    {caseState?.missing_fields && caseState.missing_fields.length > 0 ? (
                      caseState.missing_fields.map((field: string) => (
                        <li key={field} className="flex items-center gap-2 text-body-sm text-on-surface">
                          <div className="w-2 h-2 rounded-full bg-error flex-shrink-0"></div>
                          {field}
                        </li>
                      ))
                    ) : (
                      <li className="text-body-sm text-secondary font-medium flex items-center gap-1">
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
