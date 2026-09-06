/**
 * SAARTHI-SETU — Deterministic Rule Engine (DRE) SDK
 *
 * Programmatic SDK entry point for direct in-memory evaluation.
 * Zero-latency, 100% deterministic, no external dependencies required.
 */

// Core Rule Engine Orchestrator
export { matchSchemes, getSchemeById, listSchemes } from './engine/rule.engine.js';

// Eligibility Evaluator
export {
  evaluateScheme,
  evaluateAllSchemes,
  ELIGIBLE,
  NOT_ELIGIBLE,
  NEEDS_MORE_INFO
} from './engine/eligibility.engine.js';

// Scoring & Ranking
export {
  scoreScheme,
  rankScores,
  DEFAULT_WEIGHTS
} from './engine/scoring.engine.js';

// Financial Simulation & EMI Calculator
export {
  simulate,
  calculateEMI,
  DISCLAIMER
} from './engine/financial.simulator.js';

// 3-Tier Document Checklist Generator
export {
  generateChecklist
} from './engine/document.generator.js';

// NLP Extraction & Profile Builder
export {
  extractFromText,
  buildProfile
} from './services/profile.builder.js';

// Complete 80 Government Schemes Database
export { SCHEMES } from './engine/schemes.db.js';

export {
  validateScheme,
  ALL_CATEGORIES,
  ALL_GENDERS,
  ALL_STATES,
  ALL_ACTIVITIES
} from './engine/scheme.schema.js';
