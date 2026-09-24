const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8989;
const PUBLIC_DIR = __dirname;

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/favicon.ico')) {
    fs.readFile(path.join(PUBLIC_DIR, 'favicon.ico'), (err, data) => {
      if (err) {
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end(data);
      }
    });
    return;
  }

  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  let extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.mp4':
      contentType = 'video/mp4';
      break;
    case '.mp3':
      contentType = 'audio/mpeg';
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err, content) => {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      const isText = contentType.startsWith('text/') || contentType === 'application/json';
      res.writeHead(200, { 'Content-Type': isText ? `${contentType}; charset=utf-8` : contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
