import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { interpretWithGemini } from './server/geminiService.js'

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        const url = req.url.split('?')[0];

        if (url === '/api/status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0;
          return res.end(JSON.stringify({
            geminiAvailable: hasKey,
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            mode: hasKey ? 'gemini' : 'fallback'
          }));
        }

        if (url === '/api/interpret' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const result = await interpretWithGemini(data.conversation || [], data.currentRequirements);
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err?.message || 'Server interpretation error' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Load server-side env files (without exposing to client bundle)
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.GEMINI_MODEL && !process.env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  }

  return {
    plugins: [react(), apiServerPlugin()],
    server: {
      port: 5173
    }
  };
});
