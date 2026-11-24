// Servidor HTTP

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Prevención path traversal
  const safePath = path.normalize(path.join(ROOT_DIR, pathname));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Prohibido: Acceso fuera del directorio raíz');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback a index.html
      const altIndex = path.join(safePath, 'index.html');
      if (fs.existsSync(altIndex)) {
        serveFile(altIndex, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html lang="es">
          <head><meta charset="utf-8"><title>404 - No Encontrado</title></head>
          <body style="font-family:sans-serif;background:#0f172a;color:#f8fafc;padding:40px;text-align:center;">
            <h1 style="color:#ef4444;">404 - Archivo no encontrado</h1>
            <p>La ruta solicitada <code>${pathname}</code> no existe en el proyecto.</p>
            <p><a href="/" style="color:#38bdf8;">Volver al Inicio</a></p>
          </body>
          </html>
        `);
      }
      return;
    }

    serveFile(safePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Error interno del servidor');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.length
    });
    res.end(data);
  });
}

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.warn(`[AVISO] El puerto ${PORT} está ocupado. Intentando en ${PORT + 1}...`);
    server.listen(PORT + 1, '0.0.0.0');
  } else {
    console.error('[ERROR] Error en el servidor:', e);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const addr = server.address();
  console.log('========================================================');
  console.log('  🚀 Servidor Web Local UNETI - FUNDATUR Activo');
  console.log('========================================================');
  console.log(`  🌐 Localhost:   http://localhost:${addr.port}/`);
  console.log(`  🔗 IPv4 Direct: http://127.0.0.1:${addr.port}/`);
  console.log('  📁 Directorio: ', ROOT_DIR);
  console.log('  ⚡ MIME Types correctos garantizados (.js, .css, .html)');
  console.log('========================================================');
});
