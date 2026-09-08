/** Turns human-reviewed research records into a DRE module. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { validateScheme } from '../src/engine/scheme.schema.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INPUT = path.join(ROOT, 'research', 'data', 'approved_schemes.yaml');
const OUTPUT = path.join(ROOT, 'src', 'engine', 'schemes.researched.js');

const defaults = {
  category: 'Research', description: 'Human-reviewed scheme imported from official-source research.', tags: [],
  eligibility: {
    age: null, income_annual: { min: null, max: null }, gender: null, social_categories: null,
    activities: null, activity_categories: null, location: { states: ['all'], urban_only: false, rural_only: false },
    occupation: null, existing_business: null, disability: null, minority: null,
    min_project_cost: null, max_project_cost: null, custom_rules: [],
  },
  financing: {
    // Unknown finance must not be treated as a loan or produce an invented EMI.
    type: 'training', max_amount: null, min_amount: null,
    interest_rate: { base: 0, subsidy_rate: null, effective_rate: 0 }, own_contribution_pct: 0,
    tenure_months: { min: 0, max: 0 }, moratorium_months: 0, collateral_required: false,
    subsidy_amount: null, subsidy_pct: null, subsidy_notes: null,
  },
  documents: [], channel_partners: { types: [], pm_suraj_integrated: false },
};

function toDreScheme(record) {
  const id = record.id || record.scheme_id || '(missing id)';
  if (record.review_status !== 'approved') throw new Error(`Scheme ${id} is not approved.`);
  if (!record.evidence?.length) throw new Error(`Scheme ${id} must include at least one evidence record.`);
  if (!record.source?.url && !record.metadata?.official_url) throw new Error(`Scheme ${id} is missing an official source URL.`);
  if (!record.eligibility || !record.financing) {
    throw new Error(`Scheme ${id} must contain reviewer-configured eligibility and financing objects.`);
  }
  const placeholder = /\b(replace this|paste the|put_the_|smoke-test|example\.gov)\b/i;
  const valuesToReview = [record.name, record.description, record.source?.last_scraped,
    ...record.evidence.flatMap(item => [item.excerpt, item.value])];
  if (valuesToReview.some(value => typeof value === 'string' && placeholder.test(value))) {
    throw new Error(`Scheme ${id} still contains template text; replace it with verified source data first.`);
  }

  const eligibility = record.eligibility || {};
  const financing = record.financing || {};
  const scheme = {
    ...defaults, ...record,
    scheme_id: record.scheme_id || record.id,
    short_name: record.short_name || record.name,
    ministry: record.ministry || record.organization || record.source?.organization || 'Not specified',
    eligibility: {
      ...defaults.eligibility, ...eligibility,
      income_annual: { ...defaults.eligibility.income_annual, ...eligibility.income_annual },
      location: { ...defaults.eligibility.location, ...eligibility.location },
      custom_rules: eligibility.custom_rules || [],
    },
    financing: {
      ...defaults.financing, ...financing,
      interest_rate: { ...defaults.financing.interest_rate, ...financing.interest_rate },
      tenure_months: { ...defaults.financing.tenure_months, ...financing.tenure_months },
    },
    metadata: {
      active: record.metadata?.active ?? true,
      version: record.metadata?.version || new Date().toISOString().slice(0, 10),
      official_url: record.metadata?.official_url || record.source?.url,
      application_portal: record.metadata?.application_portal,
      nodal_agency: record.metadata?.nodal_agency,
      helpline: record.metadata?.helpline,
      evidence: record.evidence,
      research_source: record.source || null,
    },
  };
  for (const key of ['id', 'source', 'evidence', 'review_status']) delete scheme[key];
  if (!scheme.scheme_id || !scheme.name) throw new Error('Every approved scheme needs id/scheme_id and name.');
  validateScheme(scheme);
  return scheme;
}

const input = YAML.parse(fs.readFileSync(INPUT, 'utf8')) || {};
if (!Array.isArray(input.schemes)) throw new Error('approved_schemes.yaml must contain a schemes array.');
const schemes = input.schemes.map(toDreScheme);
const ids = new Set();
for (const scheme of schemes) {
  if (ids.has(scheme.scheme_id)) throw new Error(`Duplicate approved scheme ID: ${scheme.scheme_id}`);
  ids.add(scheme.scheme_id);
}
const output = `/** Generated from research/data/approved_schemes.yaml. Do not edit. */\nexport const RESEARCHED_SCHEMES = ${JSON.stringify(schemes, null, 2)};\n\nexport default RESEARCHED_SCHEMES;\n`;
fs.writeFileSync(OUTPUT, output, 'utf8');
console.log(`Built ${schemes.length} approved research scheme(s) into ${path.relative(ROOT, OUTPUT)}.`);
