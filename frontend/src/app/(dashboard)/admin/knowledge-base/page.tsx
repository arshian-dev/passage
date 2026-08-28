"use client";
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';

interface FormSchemaItem {
  country_code: string;
  visa_type: string;
  version: string;
  field_count: number;
  required_fields: Array<{
    id?: string;
    name: string;
    type: string;
    required: boolean;
  }>;
}

export default function KnowledgeBaseIngestion() {
  const [formFields, setFormFields] = useState<{id: string, name: string, type: string, required: boolean}[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [countryCode, setCountryCode] = useState("Canada");
  const [visaType, setVisaType] = useState("Express Entry");

  // Generated templates list state
  const [savedForms, setSavedForms] = useState<FormSchemaItem[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [inspectingForm, setInspectingForm] = useState<FormSchemaItem | null>(null);

  const fetchSavedForms = () => {
    setIsLoadingForms(true);
    fetch(`${API_BASE_URL}/api/admin/forms`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSavedForms(data);
        }
      })
      .catch(err => console.error("Failed to load saved form schemas:", err))
      .finally(() => setIsLoadingForms(false));
  };

  useEffect(() => {
    fetchSavedForms();
  }, []);

  const [ocrStatus, setOcrStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsParsing(true);
    setOcrStatus(`Running Tesseract OCR on "${file.name}"...`);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/parse-form`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        if (data.country_code) setCountryCode(data.country_code);
        if (data.visa_type) setVisaType(data.visa_type);
        if (data.fields && Array.isArray(data.fields)) {
          setFormFields(data.fields);
        }
        setOcrStatus(`✅ OCR extracted ${data.fields?.length || 0} fields from "${file.name}"${data.country_code ? ` (${data.country_code})` : ''}`);
      }
    } catch(err) {
      console.error(err);
      setOcrStatus(`❌ OCR parsing failed for "${file.name}".`);
    } finally {
      setIsParsing(false);
    }
  };

  const addField = () => {
    setFormFields([...formFields, { id: Math.random().toString(36).substring(7), name: 'New Field', type: 'text', required: false }]);
  };
  
  const updateField = (id: string, key: string, value: any) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };
  
  const removeField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const handleSaveForm = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/save-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          country_code: countryCode,
          visa_type: visaType,
          fields: formFields 
        })
      });
      const data = await res.json();
      alert(data.message);
      fetchSavedForms();
    } catch(err) {
      console.error(err);
      alert("Failed to save form configuration");
    }
  };

  const handleLoadIntoBuilder = (form: FormSchemaItem) => {
    setCountryCode(form.country_code);
    setVisaType(form.visa_type);
    const mapped = form.required_fields.map((f, i) => ({
      id: f.id || String(i),
      name: f.name,
      type: f.type || 'text',
      required: Boolean(f.required)
    }));
    setFormFields(mapped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteForm = async (cCode: string, vType: string) => {
    if (!confirm(`Are you sure you want to delete the form schema for ${cCode} (${vType})?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/forms/${encodeURIComponent(cCode)}/${encodeURIComponent(vType)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSavedForms(prev => prev.filter(f => !(f.country_code === cCode && f.visa_type === vType)));
      } else {
        alert("Failed to delete form template.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting form template.");
    }
  };

  const scrollToForms = () => {
    const el = document.getElementById('generated-forms-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col h-full relative w-full pb-16 md:pb-0">
      {/* Top Header Bar */}
      <header className="bg-surface border-b border-outline-variant shadow-sm w-full z-30 flex justify-between items-center px-6 py-4 flex-shrink-0 sticky top-0">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
          <span>Admin</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-primary">Knowledge Base & Form Templates</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={scrollToForms}
            className="px-3.5 py-1.5 bg-surface-container border border-outline-variant rounded-lg text-xs font-bold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
            Active Templates ({savedForms.length})
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Page Title & Intro */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Application Form Generator</h1>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              Upload official visa guidelines or configure custom fields directly to generate structured schema requirements for the AI intake agent.
            </p>
          </div>

          {/* Bento Grid: Upload & Builder */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Upload Portal (Col Span 4) */}
            <div className="md:col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-ambient border border-outline-variant flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
                    <span className="material-symbols-outlined">upload_file</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Source Document / Form</h3>
                    <p className="text-xs text-on-surface-variant">Extract fields via Pytesseract OCR</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-6 text-center bg-surface-container-low hover:bg-surface-variant transition-colors cursor-pointer group min-h-[170px] relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.txt" 
                    onChange={handleFileUpload} 
                    disabled={isParsing}
                  />
                  <div className="w-12 h-12 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform text-secondary">
                    <span className="material-symbols-outlined text-[26px]">{isParsing ? 'sync' : 'cloud_upload'}</span>
                  </div>
                  <p className="text-sm font-bold text-primary mb-0.5">{isParsing ? 'Running OCR on Document...' : 'Upload Form PDF or Screenshot'}</p>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-outline">Supported: PDF, PNG, JPG, WEBP, DOCX</span>
                </div>

                {ocrStatus && (
                  <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                    ocrStatus.startsWith('❌') 
                      ? 'bg-error-container text-error border-error/30' 
                      : ocrStatus.startsWith('✅') 
                        ? 'bg-secondary-container text-secondary border-secondary/30'
                        : 'bg-surface-container text-primary border-outline-variant animate-pulse'
                  }`}>
                    <span className="material-symbols-outlined text-[16px]">
                      {ocrStatus.startsWith('❌') ? 'error' : ocrStatus.startsWith('✅') ? 'check_circle' : 'document_scanner'}
                    </span>
                    <span className="flex-1">{ocrStatus}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-outline-variant/60 space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">How it works</p>
                <p className="text-xs text-on-surface-variant leading-normal">
                  Pytesseract OCR scans your PDF or form screenshot in memory, extracts all fields, and loads them directly into the builder for instant saving.
                </p>
              </div>
            </div>

            {/* Form Builder Tool (Col Span 8) */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-ambient border border-outline-variant flex flex-col min-h-[440px] space-y-5">
              {/* Builder Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
                    <span className="material-symbols-outlined">dynamic_form</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Requirement Fields Builder</h3>
                    <p className="text-xs text-on-surface-variant">Customize mandatory and optional visa fields.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                  <input
                    type="text"
                    placeholder="Country (e.g. Canada)"
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-xs w-32 outline-none focus:border-primary font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Visa (e.g. Express Entry)"
                    value={visaType}
                    onChange={e => setVisaType(e.target.value)}
                    className="px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-xs w-40 outline-none focus:border-primary font-semibold"
                  />
                  <button 
                    onClick={addField} 
                    className="px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-xs text-primary font-bold hover:bg-surface-container-low flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                    Add Field
                  </button>
                  <button 
                    onClick={handleSaveForm} 
                    disabled={formFields.length === 0} 
                    className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-opacity-90 flex items-center gap-1 shadow-sm disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[15px]">save</span>
                    Save Template
                  </button>
                </div>
              </div>

              {/* Builder Canvas */}
              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto bg-surface-container-low rounded-xl p-4 border border-outline-variant max-h-[340px]">
                {isParsing ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant min-h-[200px] space-y-2">
                    <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
                    <p className="text-sm font-semibold">Extracting schema requirements from document...</p>
                  </div>
                ) : formFields.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-outline min-h-[200px] space-y-2 text-center p-4">
                    <span className="material-symbols-outlined text-4xl">post_add</span>
                    <p className="text-sm font-medium text-on-surface-variant">Upload an official PDF on the left, click "Add Field" above, or select a saved template below to customize.</p>
                  </div>
                ) : (
                  formFields.map((field) => (
                    <div key={field.id} className="p-3 bg-surface rounded-lg border border-outline-variant flex items-center gap-3 group hover:border-primary transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-outline cursor-grab hover:text-primary transition-colors text-[20px]">drag_indicator</span>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <div className="flex flex-col">
                          <label className="text-[10px] text-on-surface-variant uppercase font-bold mb-0.5">Field Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-2.5 py-1 text-xs font-semibold focus:border-primary outline-none"
                            value={field.name}
                            onChange={(e) => updateField(field.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-on-surface-variant uppercase font-bold mb-0.5">Data Type</label>
                          <select 
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-2 py-1 text-xs font-medium focus:border-primary outline-none cursor-pointer"
                            value={field.type}
                            onChange={(e) => updateField(field.id, 'type', e.target.value)}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="email">Email</option>
                            <option value="file">File Upload</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 pt-3 sm:pt-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-0 cursor-pointer"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                            />
                            <span className="text-xs font-bold text-on-surface">Required</span>
                          </label>
                        </div>
                      </div>
                      <button onClick={() => removeField(field.id)} className="text-outline hover:text-error transition-colors p-1.5 rounded-full hover:bg-error-container">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Section: Generated Forms & Active Templates */}
          <div id="generated-forms-section" className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-ambient border border-outline-variant space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-secondary-container text-on-secondary-container">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-primary">Active Application Templates</h2>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    Saved form schemas currently powering destination-specific AI agent intake workflows.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-surface-container text-primary font-bold text-xs rounded-full border border-outline-variant">
                  {savedForms.length} Active Templates
                </span>
                <button 
                  onClick={fetchSavedForms}
                  className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                  title="Refresh form templates"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
              </div>
            </div>

            {/* Templates Grid */}
            {isLoadingForms ? (
              <div className="py-12 text-center text-on-surface-variant flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl animate-spin text-primary">sync</span>
                <p className="text-sm font-medium">Loading saved application schemas from database...</p>
              </div>
            ) : savedForms.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant space-y-4 bg-surface-container-low rounded-xl p-8 border border-dashed border-outline-variant">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto text-primary">
                  <span className="material-symbols-outlined text-3xl">dynamic_form</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-on-surface">No Form Templates Saved Yet</h4>
                  <p className="text-sm text-on-surface-variant max-w-[540px] mx-auto mt-2 leading-relaxed text-center">
                    Upload an official visa guideline PDF on the left or use the Requirement Fields Builder above to configure and save your first application schema.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCountryCode("Canada");
                    setVisaType("Express Entry");
                    setFormFields([
                      { id: "1", name: "First Name", type: "text", required: true },
                      { id: "2", name: "Last Name", type: "text", required: true },
                      { id: "3", name: "Date of Birth", type: "date", required: true },
                      { id: "4", name: "Passport Number", type: "text", required: true },
                      { id: "5", name: "Email", type: "email", required: true },
                      { id: "6", name: "Employment Status", type: "text", required: false }
                    ]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold inline-flex items-center gap-2 hover:bg-opacity-90 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                  Load Starter Template into Builder
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedForms.map((form) => {
                  const requiredCount = form.required_fields.filter(f => f.required).length;

                  return (
                    <div 
                      key={`${form.country_code}-${form.visa_type}`}
                      className="bg-surface rounded-xl border border-outline-variant p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:border-primary/50"
                    >
                      {/* Top Header */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="px-2.5 py-1 bg-primary-fixed text-primary font-bold text-xs rounded-lg uppercase tracking-wider">
                            {form.country_code}
                          </span>
                          <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                            v{form.version}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                            {form.visa_type}
                          </h3>
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                            {form.field_count} total fields ({requiredCount} mandatory)
                          </p>
                        </div>
                      </div>

                      {/* Fields Preview Chips */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">Defined Fields</span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {form.required_fields.map((f, i) => (
                            <span 
                              key={i}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${
                                f.required 
                                  ? 'bg-secondary-container text-on-secondary-container font-semibold' 
                                  : 'bg-surface-container-high text-on-surface-variant'
                              }`}
                            >
                              {f.name}
                              {f.required && <span className="text-error font-bold">*</span>}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleLoadIntoBuilder(form)}
                          className="flex-1 py-2 bg-surface-container-high text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit_note</span>
                          Edit in Builder
                        </button>
                        <button
                          onClick={() => setInspectingForm(form)}
                          className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                          title="Inspect full details"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => handleDeleteForm(form.country_code, form.visa_type)}
                          className="p-2 border border-outline-variant rounded-lg text-error hover:bg-error-container transition-colors"
                          title="Delete template"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Field Inspection Modal */}
      {inspectingForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-2xl border border-outline-variant overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schema</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface">
                    {inspectingForm.country_code} • {inspectingForm.visa_type}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{inspectingForm.field_count} Fields Configured</p>
                </div>
              </div>
              <button 
                onClick={() => setInspectingForm(null)}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-2.5 flex-1">
              {inspectingForm.required_fields.map((field, idx) => (
                <div key={idx} className="p-3 bg-surface rounded-lg border border-outline-variant flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      {field.name}
                      {field.required && (
                        <span className="px-1.5 py-0.2 bg-error-container text-error text-[10px] font-bold rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-on-surface-variant uppercase font-medium">Type: {field.type || 'text'}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    {field.type === 'date' ? 'calendar_month' : field.type === 'number' ? 'tag' : field.type === 'file' ? 'attach_file' : 'text_fields'}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-surface border-t border-outline-variant flex justify-end gap-3">
              <button
                onClick={() => {
                  handleLoadIntoBuilder(inspectingForm);
                  setInspectingForm(null);
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-opacity-90 flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                Load into Builder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
