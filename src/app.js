/**
 * SAARTHI-SETU — DRE Express Application
 */

import express from 'express';
import cors from 'cors';
import dreRoutes from './routes/dre.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root health & metadata
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'saarthi-setu-dre',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount DRE API under /api/v1
app.use('/api/v1', dreRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.originalUrl} not found.`,
    available_endpoints: [
      'POST /api/v1/match',
      'GET /api/v1/schemes',
      'GET /api/v1/scheme/:id',
      'POST /api/v1/simulate',
      'POST /api/v1/parse-profile',
      'GET /api/v1/health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[DRE Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

export default app;
