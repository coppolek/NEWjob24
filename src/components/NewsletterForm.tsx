import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email,
        subscribedAt: serverTimestamp(),
      });
      setStatus('success');
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      setStatus('error');
    }
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex-1 max-w-lg text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-5 h-5 text-[#003399]" />
              Iscriviti alla Newsletter
            </h3>
            <p className="text-sm text-slate-600">
              Ricevi ogni settimana consigli di carriera, aggiornamenti sulle tendenze del mercato del lavoro e le migliori opportunità direttamente nella tua casella di posta.
            </p>
          </div>

          <div className="flex-1 w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Il tuo indirizzo email"
                  required
                  disabled={status === 'loading'}
                  className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 pr-32 text-slate-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] outline-none transition-all disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-1 top-1 bottom-1 bg-[#003399] hover:bg-blue-800 text-white font-medium px-4 rounded-lg transition-colors disabled:opacity-70 text-sm"
                >
                  {status === 'loading' ? 'Invio...' : 'Iscriviti'}
                </button>
              </div>
              
              {status === 'success' && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  Iscrizione completata con successo!
                </div>
              )}
              
              {status === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  Errore durante l'iscrizione. Riprova più tardi.
                </div>
              )}
            </form>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 text-center flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} CareerPortal. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Termini di Servizio</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
