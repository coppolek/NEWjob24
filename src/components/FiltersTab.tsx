import { useState, useEffect } from 'react';
import { Save, SlidersHorizontal, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function FiltersTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [keywords, setKeywords] = useState('');
  const [includeSynonyms, setIncludeSynonyms] = useState(true);
  const [exactTitles, setExactTitles] = useState(false);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('Entro 30 km');
  const [remote, setRemote] = useState(true);
  const [frequency, setFrequency] = useState('instant');

  useEffect(() => {
    async function loadPreferences() {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'filters', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setKeywords(data.keywords || '');
          setIncludeSynonyms(data.includeSynonyms ?? true);
          setExactTitles(data.exactTitles ?? false);
          setLocation(data.location || '');
          setRadius(data.radius || 'Entro 30 km');
          setRemote(data.remote ?? true);
          setFrequency(data.frequency || 'instant');
        }
      } catch (e) {
        console.error("Error loading filters", e);
      }
      setLoading(false);
    }
    loadPreferences();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'filters', user.uid), {
        userId: user.uid,
        keywords,
        includeSynonyms,
        exactTitles,
        location,
        radius,
        remote,
        frequency,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error("Error saving filters", e);
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <SlidersHorizontal className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">Accedi per salvare i filtri</h3>
        <p className="text-slate-500 mt-2">Devi effettuare l'accesso per poter configurare e ricevere gli alert di ricerca.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 h-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900">Filtri e Alert Avanzati</h2>
        <p className="text-sm text-slate-500 mt-1">Imposta le tue preferenze per ricevere le notifiche sulle opportunità migliori.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Keywords & Role */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              Ruolo Desiderato
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Qualifica o Parole Chiave</label>
                <input 
                  type="text" 
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-900"
                  placeholder="Es. Sviluppatore React, Project Manager..."
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors flex-1">
                  <input type="checkbox" checked={includeSynonyms} onChange={e => setIncludeSynonyms(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Includi Sinonimi</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors flex-1">
                  <input type="checkbox" checked={exactTitles} onChange={e => setExactTitles(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Solo titoli esatti</span>
                </label>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Location & Remote */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              Luogo e Modalità
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Città o Regione</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-900"
                  placeholder="Es. Milano, Lombardia..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Raggio di Ricerca</label>
                <select value={radius} onChange={e => setRadius(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-900 bg-white">
                  <option>Solo questa città</option>
                  <option>Entro 15 km</option>
                  <option>Entro 30 km</option>
                  <option>Entro 50 km</option>
                  <option>Tutta la regione</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={remote} onChange={e => setRemote(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                <span className="text-sm font-medium text-slate-700">Includi posizioni 100% Remote (Lavoro da casa)</span>
              </label>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Notifications config */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              Frequenza Notifiche
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${frequency === 'instant' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${frequency === 'instant' ? 'text-blue-900' : 'text-slate-700'}`}>Istantanea</span>
                  <input type="radio" name="freq" checked={frequency === 'instant'} onChange={() => setFrequency('instant')} className="text-blue-600 focus:ring-blue-600" />
                </div>
                <span className={`text-xs ${frequency === 'instant' ? 'text-blue-700' : 'text-slate-500'}`}>Appena un annuncio viene pubblicato</span>
              </label>
              <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${frequency === 'daily' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${frequency === 'daily' ? 'text-blue-900' : 'text-slate-700'}`}>Giornaliera</span>
                  <input type="radio" name="freq" checked={frequency === 'daily'} onChange={() => setFrequency('daily')} className="text-blue-600 focus:ring-blue-600" />
                </div>
                <span className={`text-xs ${frequency === 'daily' ? 'text-blue-700' : 'text-slate-500'}`}>Un riepilogo ogni mattina alle 08:00</span>
              </label>
              <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${frequency === 'weekly' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${frequency === 'weekly' ? 'text-blue-900' : 'text-slate-700'}`}>Settimanale</span>
                  <input type="radio" name="freq" checked={frequency === 'weekly'} onChange={() => setFrequency('weekly')} className="text-blue-600 focus:ring-blue-600" />
                </div>
                <span className={`text-xs ${frequency === 'weekly' ? 'text-blue-700' : 'text-slate-500'}`}>Un report completo il Lunedì</span>
              </label>
            </div>
          </section>

        </div>
        
        <div className="px-6 py-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-600/20" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvataggio...' : 'Salva Preferenze'}
          </button>
        </div>
      </div>
    </div>
  );
}
