"use client";
import { useState, useEffect, useMemo } from 'react';
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
    <div className="flex-1 flex flex-col h-full relative w-full pb-16 md:pb-0">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-outline-variant shadow-sm w-full z-30 flex justify-between items-center px-lg py-base flex-shrink-0 sticky top-0">
        <div className="flex items-center md:hidden">
          <span className="material-symbols-outlined text-primary text-headline-sm font-headline-sm font-bold mr-2" data-icon="gavel">gavel</span>
          <span className="text-headline-sm font-headline-sm font-bold text-primary">Passage Agent</span>
        </div>
        <div className="hidden md:block text-headline-sm font-headline-sm font-bold text-on-surface">Case Management Dashboard</div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline" data-icon="search">search</span>
            <input 
              className="pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary text-body-sm font-body-sm w-64 outline-none" 
              placeholder="Search cases, names, email..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={fetchDashboardData} className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors" title="Refresh data">
            <span className="material-symbols-outlined" data-icon="refresh">refresh</span>
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
        </div>
      </header>

      {/* Canvas */}
      <main className="flex-1 overflow-y-auto p-4 md:p-lg">
        <div className="max-w-max-width mx-auto space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient shadow-ambient-hover transition-transform duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Total Active Cases</p>
                  <h3 className="text-headline-lg font-headline-lg text-primary">{stats.active_cases.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-primary-fixed rounded-lg text-primary">
                  <span className="material-symbols-outlined" data-icon="folder_open">folder_open</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-body-sm font-body-sm text-secondary">
                <span className="material-symbols-outlined text-sm mr-1" data-icon="trending_up">trending_up</span>
                <span>Live connected to PostgreSQL</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient shadow-ambient-hover transition-transform duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Pending Audits</p>
                  <h3 className="text-headline-lg font-headline-lg text-tertiary-container">{stats.pending_audits.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-tertiary-fixed rounded-lg text-tertiary-container">
                  <span className="material-symbols-outlined" data-icon="fact_check">fact_check</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-body-sm font-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1" data-icon="schedule">schedule</span>
                <span>Ready for human review</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient shadow-ambient-hover transition-transform duration-200 border-l-4 border-secondary">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Documents Processed</p>
                  <h3 className="text-headline-lg font-headline-lg text-secondary">{stats.processed_today.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-secondary-fixed rounded-lg text-secondary">
                  <span className="material-symbols-outlined" data-icon="description">description</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-body-sm font-body-sm text-secondary">
                <span className="material-symbols-outlined text-sm mr-1" data-icon="auto_awesome">auto_awesome</span>
                <span>AI extraction active</span>
              </div>
            </div>
          </div>

          {/* Filters & Table Section */}
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center gap-3">
                <h2 className="text-headline-sm font-headline-sm text-on-surface">Applicant Cases</h2>
                <span className="px-2.5 py-0.5 bg-surface-container text-primary font-bold text-label-md rounded-full border border-outline-variant">
                  {filteredCases.length}
                </span>
              </div>
              
              {/* Dynamic Country and Visa Type Filters */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
                <select 
                  className="form-select rounded-lg border-outline-variant bg-surface text-body-sm font-body-sm focus:border-primary focus:ring-primary p-2 border outline-none cursor-pointer"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">All Countries</option>
                  {availableCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>

                <select 
                  className="form-select rounded-lg border-outline-variant bg-surface text-body-sm font-body-sm focus:border-primary focus:ring-primary p-2 border outline-none cursor-pointer"
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
                    className="bg-surface border border-outline-variant px-3 py-2 rounded-lg text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-1"
                    title="Clear filters"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-outline-variant">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-6 py-3 text-left text-label-md font-label-md text-on-surface-variant uppercase tracking-wider" scope="col">Applicant ID</th>
                    <th className="px-6 py-3 text-left text-label-md font-label-md text-on-surface-variant uppercase tracking-wider" scope="col">Name</th>
                    <th className="px-6 py-3 text-left text-label-md font-label-md text-on-surface-variant uppercase tracking-wider" scope="col">Country / Visa</th>
                    <th className="px-6 py-3 text-left text-label-md font-label-md text-on-surface-variant uppercase tracking-wider" scope="col">Status</th>
                    <th className="px-6 py-3 text-left text-label-md font-label-md text-on-surface-variant uppercase tracking-wider" scope="col">AI Confidence</th>
                    <th className="px-6 py-3 text-right text-label-md font-label-md text-on-surface-variant uppercase tracking-wider" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-surface-container-lowest divide-y divide-outline-variant">
                  {filteredCases.map((c, i) => (
                    <tr key={c.case_id || i} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-body-sm font-body-sm font-medium text-primary">#{c.case_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-body-sm font-body-sm font-semibold text-on-surface">{c.name || 'Unknown Applicant'}</div>
                        <div className="text-label-md font-label-md text-on-surface-variant">{c.email || 'Not provided'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-body-sm font-body-sm text-on-surface font-medium">{c.country || c.target_country || 'Unspecified'}</div>
                        <div className="text-label-md font-label-md text-on-surface-variant">{c.visa || c.visa_type || 'General Intake'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-md font-label-md bg-surface-variant text-on-surface-variant border border-outline-variant font-medium">
                          <span className="material-symbols-outlined text-xs mr-1 animate-pulse" data-icon="sync">sync</span>
                          {c.status || 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-surface-variant rounded-full h-2">
                            <div className="bg-primary-container h-2 rounded-full transition-all" style={{ width: `${c.confidence || 0}%` }}></div>
                          </div>
                          <span className="text-label-md text-on-surface-variant font-bold">{c.confidence || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-body-sm font-body-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <a 
                            className="px-3 py-1 bg-surface-container text-primary font-bold rounded hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant"
                            href={`/review?case_id=${c.case_id}`}
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleDeleteCase(c.case_id, c.name)}
                            disabled={isDeleting === c.case_id}
                            className="p-1.5 text-error hover:bg-error-container rounded transition-colors disabled:opacity-50"
                            title="Delete application"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCases.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-body-sm text-on-surface-variant">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-3xl text-outline">search_off</span>
                          <p>No applications match your selected filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface">
              <span className="text-body-sm font-body-sm text-on-surface-variant">
                Showing {filteredCases.length} of {cases.length} entries
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-outline-variant rounded-md text-body-sm font-body-sm text-on-surface-variant bg-primary-fixed text-on-primary-fixed font-medium">1</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
