"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';

interface ApplicationItem {
  case_id: string;
  target_country: string;
  visa_type: string;
  status: string;
  extracted_data?: Record<string, any>;
  missing_fields?: string[];
  completeness?: number;
}

export default function ApplicationsManagementPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  
  // Edit modal state
  const [editingApp, setEditingApp] = useState<ApplicationItem | null>(null);
  const [editCountry, setEditCountry] = useState('');
  const [editVisa, setEditVisa] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editFields, setEditFields] = useState<Array<{ key: string; value: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchApplications = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/cases`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApplications(data);
        }
      })
      .catch(err => console.error("Error loading applications:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    applications.forEach(a => {
      if (a.target_country && a.target_country !== "Unspecified") {
        set.add(a.target_country);
      }
    });
    return Array.from(set);
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const country = (app.target_country || '').toLowerCase();
      const visa = (app.visa_type || '').toLowerCase();
      const id = (app.case_id || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      // Look in extracted data for names
      const extractedStr = JSON.stringify(app.extracted_data || {}).toLowerCase();

      const matchesCountry = !selectedCountry || country === selectedCountry.toLowerCase();
      const matchesSearch = !q || id.includes(q) || country.includes(q) || visa.includes(q) || extractedStr.includes(q);

      return matchesCountry && matchesSearch;
    });
  }, [applications, searchQuery, selectedCountry]);

  const handleStartNew = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cases/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_country: "Unspecified", visa_type: "General" })
      });
      const newCase = await res.json();
      router.push(`/chat?case_id=${newCase.case_id}`);
    } catch (err) {
      console.error("Error creating application:", err);
      alert("Failed to create a new application.");
    }
  };

  const handleDelete = async (caseId: string) => {
    if (!confirm(`Are you sure you want to permanently delete application #${caseId}?`)) return;

    setIsDeleting(caseId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/cases/${caseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setApplications(prev => prev.filter(a => a.case_id !== caseId));
      } else {
        alert("Failed to delete application.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting application.");
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditModal = (app: ApplicationItem) => {
    setEditingApp(app);
    setEditCountry(app.target_country || '');
    setEditVisa(app.visa_type || '');
    setEditStatus(app.status || 'In Progress');

    const fieldsArr = Object.entries(app.extracted_data || {}).map(([key, value]) => ({
      key,
      value: String(value ?? '')
    }));
    setEditFields(fieldsArr);
  };

  const handleSaveEdit = async () => {
    if (!editingApp) return;
    setIsSaving(true);

    const updatedExtractedData: Record<string, any> = {};
    editFields.forEach(({ key, value }) => {
      if (key.trim()) {
        updatedExtractedData[key.trim()] = value;
      }
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/cases/${editingApp.case_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_country: editCountry,
          visa_type: editVisa,
          status: editStatus,
          extracted_data: updatedExtractedData
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a.case_id === editingApp.case_id ? { ...a, ...updated } : a));
        setEditingApp(null);
      } else {
        alert("Failed to update application.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the application.");
    } finally {
      setIsSaving(false);
    }
  };

  const addCustomField = () => {
    setEditFields(prev => [...prev, { key: 'New Field', value: '' }]);
  };

  const removeCustomField = (index: number) => {
    setEditFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateFieldKey = (index: number, key: string) => {
    setEditFields(prev => prev.map((f, i) => i === index ? { ...f, key } : f));
  };

  const updateFieldValue = (index: number, value: string) => {
    setEditFields(prev => prev.map((f, i) => i === index ? { ...f, value } : f));
  };

  const getApplicantName = (extracted?: Record<string, any>) => {
    if (!extracted) return 'New Applicant';
    const first = extracted['First Name'] || extracted['Given Name'] || extracted['applicant_given_name'] || '';
    const last = extracted['Last Name'] || extracted['Family Name'] || extracted['applicant_family_name'] || '';
    if (first || last) return `${first} ${last}`.trim();
    for (const [k, v] of Object.entries(extracted)) {
      if (k.toLowerCase().includes('name') && v) return String(v);
    }
    return 'New Applicant';
  };

  return (
    <div className="flex-1 flex flex-col h-full relative w-full pb-16 md:pb-0 bg-background">
      {/* Top Header Bar */}
      <header className="bg-surface border-b border-outline-variant shadow-sm w-full z-30 flex justify-between items-center px-6 py-4 flex-shrink-0 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-xl">folder_shared</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-on-surface leading-tight">My Applications</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">Manage, edit, and track all your visa submissions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleStartNew}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-opacity-90 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Start New Application
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Controls Bar: Search & Filter */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient border border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input 
                type="text"
                placeholder="Search by ID, country, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:border-primary outline-none cursor-pointer"
              >
                <option value="">All Countries ({applications.length})</option>
                {availableCountries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                onClick={fetchApplications}
                className="p-2 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
                title="Refresh applications"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Applications Grid */}
          {loading ? (
            <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
              <p className="text-sm font-semibold">Loading your applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant shadow-ambient space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
                <span className="material-symbols-outlined text-4xl">folder_off</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">No Applications Found</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                {searchQuery || selectedCountry 
                  ? "No applications matched your search criteria. Try clearing the filter."
                  : "You don't have any ongoing visa applications yet. Start one now to chat with our AI agent!"}
              </p>
              <button
                onClick={handleStartNew}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold inline-flex items-center gap-2 hover:bg-opacity-90 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Start First Application
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map(app => {
                const name = getApplicantName(app.extracted_data);
                const completeness = app.completeness ?? 0;
                const hasExtracted = Object.keys(app.extracted_data || {}).length > 0;
                const missingCount = app.missing_fields?.length ?? 0;
                const isComplete = missingCount === 0 && hasExtracted;
                const isUnspecified = !app.target_country || app.target_country === "Unspecified";

                return (
                  <div 
                    key={app.case_id}
                    className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden group shadow-ambient-hover"
                  >
                    {/* Card Header */}
                    <div className="p-5 border-b border-outline-variant/60 bg-surface/50 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-primary-fixed text-primary text-xs font-bold rounded-lg border border-primary/20">
                            #{app.case_id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isComplete 
                              ? 'bg-secondary-container text-on-secondary-container border border-secondary/40' 
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {app.status || 'In Progress'}
                          </span>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                            title="Edit Application Details"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(app.case_id)}
                            disabled={isDeleting === app.case_id}
                            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Application"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="text-base font-bold text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-secondary text-[18px]">public</span>
                          {!isUnspecified ? app.target_country : "Destination Pending"}
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                          Pathway: {app.visa_type || "General Intake"}
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      {/* Applicant & Details */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-on-surface-variant font-medium">Applicant:</span>
                          <span className="font-bold text-on-surface">{name}</span>
                        </div>

                        {hasExtracted && (
                          <div className="pt-2 border-t border-outline-variant/40 space-y-1.5">
                            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">Recorded Data</span>
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(app.extracted_data || {}).slice(0, 4).map(([k, v]) => (
                                <span key={k} className="px-2 py-0.5 bg-surface-container rounded text-[11px] text-on-surface flex items-center gap-1">
                                  <span className="text-on-surface-variant font-medium">{k}:</span>
                                  <span className="font-bold truncate max-w-[90px]">{String(v)}</span>
                                </span>
                              ))}
                              {Object.keys(app.extracted_data || {}).length > 4 && (
                                <span className="px-1.5 py-0.5 text-[10px] text-primary font-bold">
                                  +{Object.keys(app.extracted_data || {}).length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Completeness Bar */}
                      <div className="space-y-1.5 pt-3 border-t border-outline-variant/40">
                        <div className="flex justify-between text-xs">
                          <span className="text-on-surface-variant font-medium">Profile Completeness</span>
                          <span className="font-bold text-primary">{completeness}%</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${completeness}%` }}
                          ></div>
                        </div>
                        <div className="text-[11px]">
                          {isComplete ? (
                            <span className="text-secondary font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              Ready for review
                            </span>
                          ) : hasExtracted && missingCount > 0 ? (
                            <span className="text-error font-semibold">{missingCount} required fields pending</span>
                          ) : (
                            <span className="text-on-surface-variant italic">Intake pending • Start chat to begin</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer CTAs */}
                    <div className="p-4 bg-surface border-t border-outline-variant flex items-center gap-2">
                      <Link
                        href={`/chat?case_id=${app.case_id}`}
                        className="flex-1 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold text-center hover:bg-opacity-90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">forum</span>
                        Continue Chat
                      </Link>
                      <Link
                        href={`/review?case_id=${app.case_id}`}
                        className="p-2 bg-surface-container border border-outline-variant text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center"
                        title="Review Profile"
                      >
                        <span className="material-symbols-outlined text-[18px]">assignment_ind</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Edit Application Modal */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-2xl border border-outline-variant overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_document</span>
                <h3 className="text-base font-bold text-on-surface">Edit Application #{editingApp.case_id}</h3>
              </div>
              <button 
                onClick={() => setEditingApp(null)}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Target Country</label>
                  <input 
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    placeholder="e.g. Canada"
                    className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-medium focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Visa Pathway</label>
                  <input 
                    type="text"
                    value={editVisa}
                    onChange={(e) => setEditVisa(e.target.value)}
                    placeholder="e.g. Express Entry"
                    className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-medium focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Application Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-medium focus:border-primary outline-none cursor-pointer"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Ready for Submission">Ready for Submission</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Extracted Fields Editor */}
              <div className="pt-3 border-t border-outline-variant space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-on-surface uppercase">Application Data Fields</span>
                  <button
                    type="button"
                    onClick={addCustomField}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Add Field
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {editFields.length === 0 ? (
                    <p className="text-xs text-on-surface-variant italic">No data fields added yet.</p>
                  ) : (
                    editFields.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={field.key}
                          onChange={(e) => updateFieldKey(idx, e.target.value)}
                          placeholder="Field Name"
                          className="w-1/3 px-2.5 py-1.5 bg-surface border border-outline-variant rounded-lg text-xs font-medium focus:border-primary outline-none"
                        />
                        <input 
                          type="text"
                          value={field.value}
                          onChange={(e) => updateFieldValue(idx, e.target.value)}
                          placeholder="Value"
                          className="flex-1 px-2.5 py-1.5 bg-surface border border-outline-variant rounded-lg text-xs focus:border-primary outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomField(idx)}
                          className="p-1 text-on-surface-variant hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface border-t border-outline-variant flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingApp(null)}
                className="px-4 py-2 bg-surface border border-outline-variant text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-opacity-90 flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
