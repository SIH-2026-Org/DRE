/**
 * SAARTHI-SETU — DRE REST Routes
 *
 * Exposes all Deterministic Rule Engine capabilities over HTTP.
 */

import { Router } from 'express';
import {
  handleMatch,
  handleListSchemes,
  handleGetScheme,
  handleSimulate,
  handleParseProfile,
  handleEngineHealth,
} from '../controllers/dre.controller.js';

const router = Router();

// Core matching endpoint (all channels: IVR, WhatsApp, Android app, Web, SMS)
router.post('/match', handleMatch);

// Scheme browsing & inspection
router.get('/schemes', handleListSchemes);
router.get('/scheme/:id', handleGetScheme);

// Financial calculator & document simulator
router.post('/simulate', handleSimulate);

// Free text & voice transcript entity parser
router.post('/parse-profile', handleParseProfile);

// Engine health check
router.get('/health', handleEngineHealth);

export default router;
