import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware per il parsing del JSON
  app.use(express.json());

  // API Route per effettuare query sicure all'API Careerjet (server-side)
  app.post('/api/careerjet/search', async (req, res) => {
    try {
      const { keywords, location, page, sort, contracttype, radius } = req.body;
      const CAREERJET_AFFID = "f1a193714fce5e0692127bbac3f283ad"; // Affiliate ID fornito

      const url = new URL('http://public.api.careerjet.net/search');
      
      // Parametri per l'API pubblica
      url.searchParams.append('affid', CAREERJET_AFFID);
      if (keywords) url.searchParams.append('keywords', keywords);
      if (location) url.searchParams.append('location', location);
      if (page) url.searchParams.append('page', page.toString());
      if (sort) url.searchParams.append('sort', sort);
      if (contracttype) url.searchParams.append('contracttype', contracttype);
      if (radius) url.searchParams.append('radius', radius.toString());
      
      url.searchParams.append('locale_code', 'it_IT'); // Di default italiano
      
      // I parametri obbligatori (user_ip, user_agent, url) per l'API
      const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      url.searchParams.append('user_ip', Array.isArray(userIp) ? userIp[0] : userIp);
      
      url.searchParams.append('user_agent', req.headers['user-agent'] || 'Mozilla/5.0');
      url.searchParams.append('url', req.headers.referer || 'http://localhost:3000');

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'Referer': req.headers.referer || 'http://localhost:3000'
        }
      });

      if (!response.ok) {
        throw new Error(`Careerjet API error: ${response.status}`);
      }

      const data = await response.json();
      
      // L'API potrebbe restituire un errore nel JSON
      if (data.type === 'ERROR') {
         throw new Error(data.error || 'Errore restituito dall\'API di Careerjet');
      }
      
      res.json(data);
    } catch (error: any) {
      console.error('API Error:', error.message);
      res.status(500).json({ error: 'Errore durante la ricerca. Riprova più tardi.' });
    }
  });

  // Integrazione di Vite per l'ambiente di sviluppo
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Gestione statica in produzione
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Express avviato su http://0.0.0.0:${PORT}`);
  });
}

startServer();
