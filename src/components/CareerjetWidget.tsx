import { useState, useEffect, type FormEvent } from 'react';
import { Search, MapPin, Briefcase, Filter, ChevronDown } from 'lucide-react';
import JobModal from './JobModal';

interface CareerjetWidgetProps {
  onNavigateToRegister?: () => void;
}

export default function CareerjetWidget({ onNavigateToRegister }: CareerjetWidgetProps = {}) {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  
  // Filters state
  const [sort, setSort] = useState('relevance');
  const [contracttype, setContracttype] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!keywords && !location) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch('/api/careerjet/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keywords, location, sort, contracttype })
      });

      if (!response.ok) {
        throw new Error('Errore nella comunicazione con il server');
      }

      const data = await response.json();
      setResults(data.jobs || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Si è verificato un errore durante la ricerca.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white shadow-xl shadow-slate-200/50 rounded-2xl p-4 md:p-6 mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Professione, parole chiave o azienda" 
              className="pl-11 w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 focus:border-[#003399] focus:bg-white focus:ring-1 focus:ring-[#003399] outline-none transition-all"
            />
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Città, provincia o CAP" 
              className="pl-11 w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 focus:border-[#003399] focus:bg-white focus:ring-1 focus:ring-[#003399] outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="h-14 bg-[#003399] hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold px-8 rounded-xl transition-colors md:w-auto w-full flex-shrink-0 flex items-center justify-center"
          >
            {isLoading ? 'Ricerca...' : 'Cerca Lavoro'}
          </button>
        </div>

        {/* Pulsante per mostrare/nascondere i filtri */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#003399] transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtri avanzati
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Area Filtri Avanzati */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            
            {/* Filtro Ordina per (Data, Stipendio, Rilevanza) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ordina per</label>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
              >
                <option value="relevance">Rilevanza</option>
                <option value="date">Data di pubblicazione</option>
                <option value="salary">Stipendio</option>
              </select>
            </div>

            {/* Filtro Tipologia di contratto */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipologia Contratto</label>
              <select 
                value={contracttype} 
                onChange={(e) => setContracttype(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
              >
                <option value="">Qualsiasi tipo</option>
                <option value="p">Tempo Indeterminato (Permanent)</option>
                <option value="c">Contratto / Tempo Determinato</option>
                <option value="t">Temporaneo (Temporary)</option>
                <option value="i">Stage / Tirocinio</option>
                <option value="v">Volontariato</option>
              </select>
            </div>

          </div>
        )}
      </form>

      {/* Risultati */}
      {hasSearched && (
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-slate-50 rounded-2xl h-32 border border-slate-100"></div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center">
              {error}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Nessun annuncio trovato</h3>
              <p className="text-slate-500 mt-1">Prova a cambiare i criteri di ricerca</p>
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Risultati della ricerca</h3>
              {results.map((job, idx) => (
                <a 
                  key={idx} 
                  href={job.url} 
                  onClick={(e) => { e.preventDefault(); setSelectedJob(job); }}
                  className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#003399]/30 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[#003399] group-hover:underline mb-1">{job.title}</h4>
                      <p className="text-slate-800 font-medium mb-3">{job.company}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                          <MapPin className="w-4 h-4" />
                          {job.locations}
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded font-medium">
                            {job.salary}
                          </div>
                        )}
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <Briefcase className="w-4 h-4" />
                          {job.site}
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-sm line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job Details Modal */}
      <JobModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
        onRegister={onNavigateToRegister}
      />
    </div>
  );
}
