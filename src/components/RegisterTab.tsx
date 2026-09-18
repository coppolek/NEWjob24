import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FileText, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Send, UserCheck, Star } from 'lucide-react';

interface RegisterTabProps {
  onNavigateToSearch?: () => void;
}

export default function RegisterTab({ onNavigateToSearch }: RegisterTabProps) {
  const { user, signIn } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    targetRole: '',
    experienceLevel: 'Mid (2-5 anni)',
    notes: '',
    wantCvReview: true,
    wantNewsletter: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Salva la richiesta di revisione CV su Firestore
      await addDoc(collection(db, 'cv_requests'), {
        fullName: formData.fullName,
        email: formData.email,
        targetRole: formData.targetRole,
        experienceLevel: formData.experienceLevel,
        notes: formData.notes,
        wantCvReview: formData.wantCvReview,
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      // 2. Se ha selezionato la newsletter, iscrivilo anche a newsletter_subscribers
      if (formData.wantNewsletter) {
        await addDoc(collection(db, 'newsletter_subscribers'), {
          email: formData.email,
          fullName: formData.fullName,
          source: 'register_cv_banner',
          subscribedAt: serverTimestamp()
        });
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error submitting registration:', err);
      setError('Si è verificato un errore durante la registrazione. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Intestazione Pagina */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#003399] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Iscrizione & Potenziamento Carriera
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Iscriviti a CareerPortal
        </h2>
        <p className="text-slate-600 mt-3 text-base sm:text-lg max-w-xl mx-auto">
          Crea il tuo profilo gratuito, richiedi la <strong>revisione gratuita del tuo CV</strong> con i nostri specialisti HR e ricevi le migliori opportunità su misura.
        </p>
      </div>

      {/* Box 1: Iscrizione Rapida con Account Google */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 p-6 rounded-2xl border border-blue-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-[#003399]" />
            <h3 className="font-bold text-slate-900 text-lg">
              {user ? 'Sei già autenticato' : 'Accesso Rapido con Account Google'}
            </h3>
          </div>
          <p className="text-sm text-slate-600">
            {user 
              ? `Accesso effettuato come ${user.displayName || user.email}. Il tuo profilo è già attivo per salvare ricerche e preferenze.` 
              : 'Iscriviti in un clic con il tuo account Google per sincronizzare le tue preferenze e candidature su qualsiasi dispositivo.'}
          </p>
        </div>

        {!user ? (
          <button
            onClick={signIn}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3 rounded-xl border border-slate-200 shadow-xs transition-colors shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Iscriviti con Google</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-2 rounded-xl shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profilo Connesso
          </span>
        )}
      </div>

      {/* Box 2: Modulo Revisione Gratuita del CV & Iscrizione Completa */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-[#003399]/10 rounded-xl text-[#003399] shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Richiedi la Revisione Gratuita del tuo CV
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              I nostri esperti verificheranno il formato, le parole chiave e la leggibilità del tuo curriculum per massimizzare le tue possibilità di colloquio.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="p-8 text-center bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-emerald-950">
              Iscrizione & Richiesta Ricevute!
            </h4>
            <p className="text-emerald-800 text-sm max-w-md mx-auto leading-relaxed">
              Grazie per esserti iscritto. Il nostro team di esperti revisionerà le informazioni fornite e ti ricontatterà all'indirizzo <strong>{formData.email}</strong> con suggerimenti e feedback personalizzati entro 24-48 ore lavorative.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToSearch}
                className="bg-[#003399] hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Torna a Cerca Lavoro
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nome e Cognome
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Mario Rossi"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Indirizzo Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="mario.rossi@email.it"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Ruolo o Settore desiderato
                </label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="es. Sviluppatore Web, Impiegato, Tecnico"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Livello di Esperienza
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all text-sm"
                >
                  <option value="Junior (0-2 anni)">Junior (0-2 anni o primo impiego)</option>
                  <option value="Mid (2-5 anni)">Mid (2-5 anni)</option>
                  <option value="Senior (5+ anni)">Senior (Oltre 5 anni)</option>
                  <option value="Manager / Direttivo">Manager / Direttivo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Link al tuo profilo LinkedIn o note sul tuo CV
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Incolla il link al tuo profilo LinkedIn, oppure descrivi brevemente le tue principali competenze o eventuali dubbi sul tuo CV..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all text-sm resize-none"
              />
            </div>

            {/* Checkbox opzioni */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wantCvReview}
                  onChange={(e) => setFormData({ ...formData, wantCvReview: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-[#003399] focus:ring-[#003399]"
                />
                <span className="text-xs sm:text-sm text-slate-700 font-medium">
                  <strong>Richiedi la revisione gratuita del CV</strong>: un nostro recruiter analizzerà la leggibilità per i sistemi ATS e ti invierà feedback personalizzato.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wantNewsletter}
                  onChange={(e) => setFormData({ ...formData, wantNewsletter: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-[#003399] focus:ring-[#003399]"
                />
                <span className="text-xs sm:text-sm text-slate-600">
                  Iscrivimi anche alla newsletter settimanale con consigli di carriera e offerte in evidenza.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#003399] hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Invio in corso...</span>
                ) : (
                  <>
                    <span>Iscriviti e Richiedi Revisione Gratuita</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>

      {/* Vantaggi Iscrizione */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-center">
          <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">100% Gratuito</h4>
          <p className="text-xs text-slate-500 mt-1">Nessun costo nascosto per i candidati.</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-center">
          <Sparkles className="w-5 h-5 text-blue-600 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">Feedback Esperto</h4>
          <p className="text-xs text-slate-500 mt-1">Consigli pratici da recruiter qualificati.</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-center">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">Dati Protetti</h4>
          <p className="text-xs text-slate-500 mt-1">Rispettiamo la tua privacy al 100%.</p>
        </div>
      </div>

    </div>
  );
}
