"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({ active_cases: 0, pending_audits: 0, processed_today: 0 });
  const [cases, setCases] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisa, setSelectedVisa] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchDashboardData = () => {
    fetch(`${API_BASE_URL}/api/admin/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
      
    fetch(`${API_BASE_URL}/api/admin/cases`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCases(data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute unique country & visa options dynamically from the actual data
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    cases.forEach(c => {
      const country = c.country || c.target_country;
      if (country && country !== "Unspecified" && country !== "GENERIC") {
        set.add(country);
      }
    });
    return Array.from(set);
  }, [cases]);

  const availableVisas = useMemo(() => {
    const set = new Set<string>();
    cases.forEach(c => {
      const visa = c.visa || c.visa_type;
      if (visa && visa !== "General" && visa !== "GENERIC") {
        set.add(visa);
      }
    });
    return Array.from(set);
  }, [cases]);

  // Filtered cases list
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const country = (c.country || c.target_country || '').toLowerCase();
      const visa = (c.visa || c.visa_type || '').toLowerCase();
      const name = (c.name || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const caseId = (c.case_id || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesCountry = !selectedCountry || country === selectedCountry.toLowerCase();
      const matchesVisa = !selectedVisa || visa === selectedVisa.toLowerCase();
      const matchesSearch = !q || 
        caseId.includes(q) || 
        name.includes(q) || 
        email.includes(q) || 
        country.includes(q) || 
        visa.includes(q);

      return matchesCountry && matchesVisa && matchesSearch;
    });
  }, [cases, searchQuery, selectedCountry, selectedVisa]);

  const handleDeleteCase = async (caseId: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete application #${caseId} (${name || 'Applicant'})?`)) {
      return;
    }

    setIsDeleting(caseId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/cases/${caseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCases(prev => prev.filter(c => c.case_id !== caseId));
        setStats((prev: any) => ({
          ...prev,
          active_cases: Math.max(0, prev.active_cases - 1)
        }));
      } else {
        alert("Failed to delete application from database.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while attempting to delete the application.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative w-full pb-16 md:pb-0 bg-background">
      {/* Top Header Bar */}
      <header className="bg-surface border-b border-outline-variant shadow-sm w-full z-30 flex justify-between items-center px-6 py-4 flex-shrink-0 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface leading-tight">Case Management Dashboard</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">Audit applicant intake states and track real-time verification progress</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary text-xs outline-none" 
              placeholder="Search cases, names, email..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchDashboardData} 
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors border border-outline-variant" 
            title="Refresh data"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient border border-outline-variant flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Active Cases</p>
                  <h3 className="text-3xl font-bold text-primary">{stats.active_cases.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-primary-fixed rounded-xl text-primary">
                  <span className="material-symbols-outlined text-2xl">folder_open</span>
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-secondary gap-1.5 pt-2 border-t border-outline-variant/40">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>Live connected to PostgreSQL</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient border border-outline-variant flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pending Audits</p>
                  <h3 className="text-3xl font-bold text-on-surface">{stats.pending_audits.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-tertiary-fixed rounded-xl text-tertiary-container">
                  <span className="material-symbols-outlined text-2xl">fact_check</span>
                </div>
              </div>
              <div className="flex items-center text-xs font-medium text-on-surface-variant gap-1.5 pt-2 border-t border-outline-variant/40">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>Ready for human review</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient border border-outline-variant flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Documents Processed</p>
                  <h3 className="text-3xl font-bold text-secondary">{stats.processed_today.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-secondary-fixed rounded-xl text-secondary">
                  <span className="material-symbols-outlined text-2xl">description</span>
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-secondary gap-1.5 pt-2 border-t border-outline-variant/40">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>OCR & AI extraction active</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant overflow-hidden flex flex-col">
            {/* Card Header & Filters */}
            <div className="p-5 border-b border-outline-variant bg-surface flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-on-surface">Applicant Cases</h2>
                <span className="px-2.5 py-0.5 bg-surface-container text-primary font-bold text-xs rounded-full border border-outline-variant">
                  {filteredCases.length} Total
                </span>
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-auto">
                <select 
                  className="rounded-xl border border-outline-variant bg-surface text-xs font-semibold focus:border-primary p-2 outline-none cursor-pointer"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">All Countries</option>
                  {availableCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>

                <select 
                  className="rounded-xl border border-outline-variant bg-surface text-xs font-semibold focus:border-primary p-2 outline-none cursor-pointer"
                  value={selectedVisa}
                  onChange={(e) => setSelectedVisa(e.target.value)}
                >
                  <option value="">All Visa Types</option>
                  {availableVisas.map(visa => (
                    <option key={visa} value={visa}>{visa}</option>
                  ))}
                </select>

                {(selectedCountry || selectedVisa || searchQuery) && (
                  <button 
                    onClick={() => { setSelectedCountry(''); setSelectedVisa(''); setSearchQuery(''); }}
                    className="bg-surface border border-outline-variant px-3 py-2 rounded-xl text-xs text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1 font-semibold"
                    title="Clear filters"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-outline-variant">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-wider" scope="col">Applicant ID</th>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-wider" scope="col">Name & Contact</th>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-wider" scope="col">Country / Visa</th>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-wider" scope="col">Status</th>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-wider" scope="col">AI Completeness</th>
                    <th className="px-5 py-3.5 text-right text-[10px] font-bold text-on-surface-variant uppercase tracking-wider" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/60">
                  {filteredCases.map((c, i) => (
                    <tr key={c.case_id || i} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-xs font-bold text-primary">#{c.case_id}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-on-surface">{c.name || 'Unknown Applicant'}</div>
                        <div className="text-[11px] text-on-surface-variant">{c.email || 'Not provided'}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-on-surface">{c.country || c.target_country || 'Unspecified'}</div>
                        <div className="text-[11px] text-on-surface-variant">{c.visa || c.visa_type || 'General Intake'}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface border border-outline-variant uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>
                          {c.status || 'In Progress'}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${c.confidence || 0}%` }}></div>
                          </div>
                          <span className="text-xs text-primary font-bold">{c.confidence || 0}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            className="px-3 py-1.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-opacity-90 transition-all text-xs inline-flex items-center gap-1 shadow-sm"
                            href={`/review?case_id=${c.case_id}`}
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteCase(c.case_id, c.name)}
                            disabled={isDeleting === c.case_id}
                            className="p-1.5 text-error hover:bg-error-container rounded-lg transition-colors disabled:opacity-50"
                            title="Delete application"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCases.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-xs text-on-surface-variant">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-3xl text-outline">search_off</span>
                          <p className="font-semibold text-sm text-on-surface">No applications match your selected filters.</p>
                          <p className="text-xs text-on-surface-variant">Try resetting search terms or filter criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Summary Footer */}
            <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface">
              <span className="text-xs font-medium text-on-surface-variant">
                Showing {filteredCases.length} of {cases.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-on-primary">1</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
