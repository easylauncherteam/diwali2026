#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const PORT = 3030;

// Create uploads directory if not exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Generate short ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Enable CORS
function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
    setCORS(res);
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // POST /save - Save wish data
    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const id = generateId();
                const filePath = path.join(UPLOAD_DIR, `${id}.json`);
                
                fs.writeFileSync(filePath, JSON.stringify({
                    name: data.name,
                    image: data.image,
                    timestamp: Date.now()
                }));
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id, success: true }));
                console.log('✅ Saved wish:', id);
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
                console.error('❌ Error:', e.message);
            }
        });
    }
    
    // GET /load/:id - Load wish data
    else if (req.method === 'GET' && req.url.startsWith('/load/')) {
        const id = req.url.split('/')[2];
        const filePath = path.join(UPLOAD_DIR, `${id}.json`);
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
            console.log('✅ Loaded wish:', id);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
            console.log('❌ Wish not found:', id);
        }
    }
    
    // GET /cleanup - Delete old wishes (older than 7 days)
    else if (req.method === 'GET' && req.url === '/cleanup') {
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        let deleted = 0;
        
        fs.readdirSync(UPLOAD_DIR).forEach(file => {
            const filePath = path.join(UPLOAD_DIR, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (now - data.timestamp > maxAge) {
                fs.unlinkSync(filePath);
                deleted++;
            }
        });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ deleted }));
        console.log('🧹 Cleaned up', deleted, 'old wishes');
    }
    
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log('🪔 Diwali API Server running on port', PORT);
    console.log('📁 Upload directory:', UPLOAD_DIR);
});
