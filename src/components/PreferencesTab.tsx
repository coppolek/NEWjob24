import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Bell, Search, MapPin, CheckCircle2 } from 'lucide-react';

export default function PreferencesTab() {
  const { user, signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    keyword: '',
    location: '',
    frequency: 'daily',
    emailAlerts: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPreferences() {
      if (!user) return;
      setIsLoading(true);
      try {
        const docRef = doc(db, 'filters', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            keyword: data.keyword || '',
            location: data.location || '',
            frequency: data.frequency || 'daily',
            emailAlerts: data.emailAlerts !== undefined ? data.emailAlerts : true
          });
        }
      } catch (err: any) {
        console.error("Error loading preferences:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPreferences();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);
    
    try {
      await setDoc(doc(db, 'filters', user.uid), {
        ...formData,
        userId: user.uid,
        updatedAt: new Date()
      }, { merge: true });
      setIsSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving preferences:", err);
      setError("Errore durante il salvataggio. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-blue-50 text-[#003399] rounded-full flex items-center justify-center mb-6">
          <Bell className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Avvisi di lavoro</h2>
        <p className="text-slate-600 mb-8">
          Accedi per impostare gli avvisi di lavoro e ricevere notifiche push per le posizioni che ti interessano.
        </p>
        <button 
          onClick={signIn}
          className="bg-[#003399] hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg w-full transition-colors"
        >
          Accedi o Registrati
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-100 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Avvisi di Lavoro</h2>
        <p className="text-slate-600 mt-2">
          Configura i tuoi avvisi per ricevere notifiche quando vengono pubblicate nuove posizioni in linea con le tue preferenze.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
          {error}
        </div>
      )}

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>Preferenze salvate con successo!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Cosa (Professione o parola chiave)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              name="keyword"
              value={formData.keyword}
              onChange={handleChange}
              placeholder="es. Sviluppatore React" 
              className="pl-10 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Dove (Città o Codice Postale)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="es. Milano, IT" 
              className="pl-10 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Frequenza avvisi</label>
          <select 
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
          >
            <option value="daily">Giornaliero (Consigliato)</option>
            <option value="weekly">Settimanale</option>
            <option value="instant">Istantaneo (Appena pubblicato)</option>
          </select>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <input 
            type="checkbox" 
            id="emailAlerts"
            name="emailAlerts"
            checked={formData.emailAlerts}
            onChange={handleChange}
            className="w-5 h-5 rounded border-slate-300 text-[#003399] focus:ring-[#003399]"
          />
          <label htmlFor="emailAlerts" className="text-sm text-slate-700 font-medium">
            Ricevi avvisi anche via email
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#003399] hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center"
          >
            {isSubmitting ? 'Salvataggio...' : 'Salva Preferenze'}
          </button>
        </div>
      </form>
    </div>
  );
}
