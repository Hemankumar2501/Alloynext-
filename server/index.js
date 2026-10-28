require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AlloyNext Node.js API',
    database: 'SQLite (better-sqlite3) connected',
    gemini_ai: process.env.GEMINI_API_KEY ? 'active' : 'fallback-mode'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AlloyNext Node.js API',
    database: 'SQLite (better-sqlite3) connected'
  });
});

// Mount Routes under /api AND /api/v1 for seamless cross-compatibility
app.use('/api', routes);
app.use('/api/v1', routes);

// Serve static frontend root index.html if accessed directly
app.use(express.static(path.join(__dirname, '..')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[AlloyNext Server Error]:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AlloyNext Server] Production API running on http://127.0.0.1:${PORT}`);
  console.log(`[AlloyNext Server] Database: ${path.join(__dirname, '..', 'alloynext.db')}`);
});
