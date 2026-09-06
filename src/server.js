/**
 * SAARTHI-SETU — DRE Server Entry Point
 */

import app from './app.js';
import config from './config/env.js';
import { listSchemes } from './engine/rule.engine.js';

const PORT = config.port;

app.listen(PORT, async () => {
  console.log('====================================================');
  console.log('       SAARTHI-SETU DETERMINISTIC RULE ENGINE       ');
  console.log('====================================================');
  console.log(`[Server] DRE Microservice listening on port ${PORT}`);
  console.log(`[Status] Environment: ${config.nodeEnv}`);
  console.log(`[API]    Health check: http://localhost:${PORT}/health`);
  console.log(`[API]    Match API:    http://localhost:${PORT}/api/v1/match`);
  console.log(`[API]    Schemes DB:   http://localhost:${PORT}/api/v1/schemes`);

  try {
    const schemes = await listSchemes();
    console.log(`[Database] Loaded ${schemes.length} authentic government schemes.`);
  } catch (err) {
    console.error('[Database Error] Failed to preload schemes:', err.message);
  }
  console.log('====================================================\n');
});
