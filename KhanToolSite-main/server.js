// Servidor Express para servir arquivos estáticos do diretório atual
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

// Segurança básica
app.use(helmet({
  contentSecurityPolicy: false
}));

// Compressão gzip/brotli
app.use(compression());

// Diretório público (raiz do projeto)
const publicDir = __dirname;

// Servir assets estáticos de forma segura
app.use(express.static(publicDir, {
  extensions: ['html'],
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    // Tipos comuns
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Rota raiz: preferir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Rota de saúde
app.get('/health', (_req, res) => res.json({ ok: true }));

// Captura 404 para htmls amigáveis
app.use((req, res, next) => {
  if (req.accepts('html')) {
    return res.status(404).sendFile(path.join(publicDir, 'index.html'));
  }
  return next();
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


