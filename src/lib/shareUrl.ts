export interface SharedJob {
  title: string;
  company: string;
  locations?: string;
  salary?: string;
  date?: string;
  description?: string;
  site?: string;
  url: string;
}

/**
 * Genera un URL del portale Puulp che punta direttamente all'annuncio specificato.
 */
export function generatePuulpJobShareUrl(job: SharedJob): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  const payload = {
    t: job.title,
    c: job.company,
    l: job.locations || '',
    s: job.salary || '',
    d: job.date || '',
    desc: job.description || '',
    st: job.site || '',
    u: job.url
  };

  try {
    // Codifica Base64 sicura per caratteri UTF-8 (italiano, accenti, simboli valuta)
    const jsonStr = JSON.stringify(payload);
    const encoded = btoa(encodeURIComponent(jsonStr));
    return `${origin}${pathname}?job=${encodeURIComponent(encoded)}`;
  } catch (e) {
    console.warn('Fallback generating URL params:', e);
    const params = new URLSearchParams({
      jobTitle: job.title,
      company: job.company,
      jobUrl: job.url
    });
    if (job.locations) params.set('locations', job.locations);
    return `${origin}${pathname}?${params.toString()}`;
  }
}

/**
 * Legge i parametri dall'URL di Puulp per determinare se è stato aperto un link condiviso di un annuncio.
 */
export function parsePuulpJobFromUrl(): SharedJob | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const encodedJob = params.get('job');

    if (encodedJob) {
      const decoded = decodeURIComponent(atob(encodedJob));
      const parsed = JSON.parse(decoded);
      return {
        title: parsed.t || '',
        company: parsed.c || '',
        locations: parsed.l || undefined,
        salary: parsed.s || undefined,
        date: parsed.d || undefined,
        description: parsed.desc || undefined,
        site: parsed.st || undefined,
        url: parsed.u || ''
      };
    }

    // Fallback con parametri semplici
    const jobTitle = params.get('jobTitle');
    const jobUrl = params.get('jobUrl');
    if (jobTitle && jobUrl) {
      return {
        title: jobTitle,
        company: params.get('company') || '',
        locations: params.get('locations') || undefined,
        url: jobUrl
      };
    }
  } catch (e) {
    console.warn('Impossibile decodificare l\'annuncio dall\'URL condiviso:', e);
  }

  return null;
}
