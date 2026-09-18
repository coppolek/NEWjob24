import React, { useState } from 'react';
import { X, ExternalLink, MapPin, Briefcase, Calendar, DollarSign, Building2, Share2, Check, FileText } from 'lucide-react';
import { generatePuulpJobShareUrl } from '../lib/shareUrl';

interface JobModalProps {
  job: {
    title: string;
    company: string;
    locations?: string;
    salary?: string;
    date?: string;
    description?: string;
    site?: string;
    url: string;
  } | null;
  onClose: () => void;
  onRegister?: () => void;
}

export default function JobModal({ job, onClose, onRegister }: JobModalProps) {
  const [copied, setCopied] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  if (!job) return null;

  const handleBannerClick = () => {
    onClose();
    if (onRegister) {
      onRegister();
    }
  };

  const handleShare = () => {
    const puulpUrl = generatePuulpJobShareUrl(job);
    const shareText = `Offerta di lavoro per "${job.title}" presso ${job.company || 'azienda'} su Puulp`;

    if (navigator.share) {
      navigator.share({
        title: `${job.title} - Puulp`,
        text: shareText,
        url: puulpUrl,
      }).catch(() => {
        // Fallback su copia negli appunti se l'utente cancella la condivisione o da errore
        navigator.clipboard.writeText(puulpUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      navigator.clipboard.writeText(puulpUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Helper to remove any HTML tags or safely display text
  const cleanDescription = job.description 
    ? job.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : 'Nessuna descrizione dettagliata fornita.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between p-4 md:p-6 border-b border-slate-100 bg-white shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#003399] mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              Offerta di Lavoro
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-slate-600 font-medium text-sm md:text-base">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{job.company || 'Azienda riservata'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#003399] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apri originale</span>
            </a>
            <button 
              onClick={onClose}
              aria-label="Chiudi finestra"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Banner Promozionale Revisione CV */}
        <div 
          onClick={handleBannerClick}
          className="bg-gradient-to-r from-[#003399] to-blue-600 px-4 py-3 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner shrink-0 cursor-pointer hover:brightness-105 transition-all"
          title="Vai alla pagina di iscrizione per la revisione gratuita del CV"
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="bg-white/20 p-2 rounded-lg shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </span>
            <p className="text-sm font-medium text-left">
              <span className="font-bold text-blue-100">Potenzia il tuo CV!</span> Ottieni una revisione gratuita dai nostri esperti prima di candidarti.
            </p>
          </div>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleBannerClick();
            }}
            className="w-full sm:w-auto whitespace-nowrap text-xs md:text-sm bg-white text-[#003399] px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
          >
            Scopri come
          </button>
        </div>

        {/* Contenuto Principale Scheda Annuncio */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
          
          {/* Griglia Badge & Info rapide */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {job.locations && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#003399]" />
                  Località
                </span>
                <span className="text-sm font-semibold text-slate-800 truncate" title={job.locations}>
                  {job.locations}
                </span>
              </div>
            )}

            {job.salary ? (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Stipendio
                </span>
                <span className="text-sm font-semibold text-emerald-700 truncate" title={job.salary}>
                  {job.salary}
                </span>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  Stipendio
                </span>
                <span className="text-sm font-medium text-slate-500">
                  Non specificato
                </span>
              </div>
            )}

            {job.date && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Pubblicazione
                </span>
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {job.date}
                </span>
              </div>
            )}

            {job.site && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  Fonte
                </span>
                <span className="text-sm font-semibold text-slate-800 truncate" title={job.site}>
                  {job.site}
                </span>
              </div>
            )}
          </div>

          {/* Sezione Descrizione Annuncio */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#003399]" />
              Descrizione e Dettagli dell'annuncio
            </h3>

            <div className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
              {cleanDescription}
            </div>

            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-xs md:text-sm text-blue-900 flex items-start gap-2.5">
              <span className="bg-[#003399] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">i</span>
              <p>
                Questo annuncio è fornito tramite la rete di offerte di lavoro Careerjet. Cliccando su <strong>"Candidati o visualizza annuncio completo"</strong> verrai reindirizzato in sicurezza alla pagina ufficiale del datore di lavoro per inoltrare la tua candidatura.
              </p>
            </div>
          </div>

          {/* Toggle facoltativo per visualizzazione web incorporata */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setShowIframe(!showIframe)}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              {showIframe ? 'Nascondi anteprima browser integrata' : 'Problemi con i dettagli? Mostra anteprima browser integrata'}
            </button>
          </div>

          {showIframe && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-2 bg-slate-100 text-xs text-slate-600 border-b border-slate-200 flex justify-between items-center">
                <span>Anteprima browser (se appare un blocco verifica Cloudflare, usa il pulsante Candidati in basso):</span>
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-[#003399] font-medium flex items-center gap-1">
                  Apri link esterno <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-[400px] w-full bg-slate-100">
                <iframe 
                  src={job.url} 
                  className="w-full h-full border-0"
                  title="Dettagli Annuncio Esterno"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer con Pulsanti di Azione Principali */}
        <div className="p-4 md:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleShare}
              title="Condividi il link di Puulp a questo annuncio"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Link Puulp copiato!' : 'Condividi'}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
            >
              Chiudi
            </button>
          </div>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#003399] hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors text-sm md:text-base"
          >
            <span>Candidati o visualizza annuncio completo</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
