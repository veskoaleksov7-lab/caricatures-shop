const http = require('http');
const fs = require('fs');
const path = require('path');
const base = __dirname;
const mimeMap = { html: 'text/html', css: 'text/css', js: 'application/javascript', png: 'image/png', jpg: 'image/jpeg' };
http.createServer(function (req, res) {
    var urlPath = req.url === '/' ? 'index.html' : req.url.split('?')[0];
    var filePath = path.join(base, urlPath);
    var ext = path.extname(filePath).slice(1);
    var mime = mimeMap[ext] || 'text/plain';
    fs.readFile(filePath, function (err, data) {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    });
}).listen(8877, function () { console.log('Serving on http://localhost:8877'); });
