# ------------------------------------
# Stage 1: Build
# ------------------------------------
FROM node:20-alpine AS builder

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file delle dipendenze
COPY package.json package-lock.json* ./

# Installa tutte le dipendenze (incluse quelle di sviluppo necessarie per Vite e esbuild)
RUN npm install

# Copia tutto il resto del codice sorgente
COPY . .

# Compila l'app React (Vite) e il server Express (esbuild) nella cartella /dist
RUN npm run build

# ------------------------------------
# Stage 2: Production
# ------------------------------------
FROM node:20-alpine AS runner

# Imposta l'ambiente di produzione
ENV NODE_ENV=production

WORKDIR /app

# Copia i file delle dipendenze
COPY package.json package-lock.json* ./

# Installa SOLO le dipendenze di produzione (mantiene l'immagine leggera)
RUN npm install --omit=dev

# Copia la cartella buildata dal container precedente (builder)
COPY --from=builder /app/dist ./dist

# Esponi la porta 3000 (quella usata dal server.ts)
EXPOSE 3000

# Comando di avvio del server
CMD ["npm", "run", "start"]
