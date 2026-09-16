import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Briefcase, Building2, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';

export default function PostJobTab() {
  const { user, signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'jobs'), {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: ''
      });
    } catch (err: any) {
      console.error("Error creating job", err);
      setError("Errore durante la pubblicazione dell'annuncio. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-blue-50 text-[#003399] rounded-full flex items-center justify-center mb-6">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pubblica un annuncio</h2>
        <p className="text-slate-600 mb-8">
          Devi effettuare l'accesso o creare un account per poter pubblicare un'offerta di lavoro e trovare il candidato ideale.
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Annuncio pubblicato!</h2>
        <p className="text-slate-600 mb-8">
          Il tuo annuncio di lavoro è stato pubblicato con successo ed è ora visibile ai candidati.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Pubblica un altro annuncio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Pubblica un annuncio</h2>
        <p className="text-slate-600 mt-2">Compila i dettagli per trovare il candidato perfetto per la tua azienda.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Qualifica / Titolo dell'annuncio *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="es. Sviluppatore Frontend" 
                className="pl-10 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome dell'azienda *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="es. Acme Corp" 
                className="pl-10 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Luogo di lavoro *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="es. Milano, IT oppure Da remoto" 
                  className="pl-10 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Stipendio (opzionale)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="es. 30.000€ - 40.000€" 
                  className="pl-10 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo di contratto *</label>
            <select 
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="A contratto">A contratto</option>
              <option value="Tirocinio">Tirocinio</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descrizione dell'annuncio *</label>
            <textarea 
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Descrivi le responsabilità, i requisiti e i benefit..." 
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#003399] hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center"
          >
            {isSubmitting ? 'Pubblicazione in corso...' : 'Pubblica annuncio'}
          </button>
        </div>
      </form>
    </div>
  );
}
