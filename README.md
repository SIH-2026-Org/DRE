# SAARTHI-SETU — Deterministic Rule Engine (DRE) Module & Microservice

> **Smart India Hackathon 2026** | Problem Statement ID: **SIH26092**  
> **Theme**: Smart Automation | **Team**: Manifestation  
> **Tagline**: *One Call. Right Scheme. Right Door.*

The **Deterministic Rule Engine (DRE)** is a standalone, channel-agnostic, zero-hallucination decision engine designed to match underserved Indian entrepreneurs to eligible government financial schemes.

---

## 🌟 Key Features

1. **100% Deterministic & Auditable**:
   - Zero LLM involvement in eligibility determination.
   - Every qualification and rejection maps to verifiable statutory criteria.
2. **80 Verified Government Schemes**:
   - Central and State flagship programs covering MSME, Street Vendors, Agriculture, Animal Husbandry, Handlooms, Women Entrepreneurs, SC/ST/OBC/Minority/Divyangjan.
3. **Multi-Channel Architecture**:
   - Serves IVR (Voice), WhatsApp, Android Mobile App, SMS, and Web/CSC from a **single common engine**.
4. **Reducing-Balance Financial Simulator**:
   - Computes monthly EMI, upfront capital subsidy, interest subvention, and applicant margin money.
5. **3-Tier Smart Document Checklist**:
   - Splits documents into *Available*, *Need to Obtain* (with issuing authority, timeline, and difficulty), and *Collateral Waivers*.
6. **Dual Mode Execution**:
   - **REST Microservice**: Run standalone (`http://localhost:5000`) for network clients.
   - **In-Memory SDK**: Direct programmatic ES module import (`import { matchSchemes } from 'saarthi-setu-dre'`).

---

## 📂 Directory Structure

```
DRE/
├── package.json               # Standalone npm package
├── .env.example               # Environment template
├── .gitignore                 # Git ignore file
├── test_cli.js                # Interactive terminal tester
├── README.md                  # Comprehensive documentation
├── src/
│   ├── index.js               # Programmatic SDK export
│   ├── app.js                 # Express application
│   ├── server.js              # Microservice entry point (Port 5000)
│   ├── config/
│   │   └── env.js             # Environment configuration
│   ├── controllers/
│   │   └── dre.controller.js  # HTTP request handlers
│   ├── routes/
│   │   └── dre.routes.js      # REST API route declarations
│   ├── services/
│   │   └── profile.builder.js # NLP entity extraction (Hinglish/Hindi/English)
│   └── engine/
│       ├── rule.engine.js         # Unified orchestrator facade
│       ├── eligibility.engine.js  # Deterministic criteria evaluator
│       ├── scoring.engine.js      # 0-100 composite ranking algorithm
│       ├── financial.simulator.js # Reducing-balance EMI & subsidy calculator
│       ├── document.generator.js  # 3-tier document checklist generator
│       ├── scheme.schema.js       # Canonical scheme validator
│       └── schemes.db.js          # Authentic 80-scheme database
└── test/
    └── dre.test.js            # Automated unit test suite (node:test)
```

---

## 🚀 Quick Start

### 1. Installation
```bash
cd DRE
npm install
```

### 2. Run Automated Tests
```bash
npm test
```
*Executes all 7 core engine test suites with 100% pass rate.*

### 3. Run Interactive CLI Tester
```bash
npm run cli
# or: node test_cli.js
```
*Evaluates sample natural language inputs across all 80 schemes.*

### 4. Start Standalone Microservice
```bash
npm start
# or for live reload during development:
npm run dev
```
Server starts on `http://localhost:5000` (configurable via `PORT` environment variable).

---

## 📡 REST API Reference

### 1. Omnichannel Scheme Matching
* **Endpoint**: `POST /api/v1/match`
* **Description**: Matches beneficiary details against all 80 schemes, scores them, and generates EMI simulation & document checklists.
* **Headers**: `Content-Type: application/json`

#### Option A: Structured Profile Input
```json
{
  "profile": {
    "age": 29,
    "gender": "F",
    "social_category": "SC",
    "state": "Rajasthan",
    "activity": "dairy",
    "project_cost": 120000,
    "loan_required": 120000,
    "income_annual": 120000,
    "existing_documents": ["aadhaar", "photo"]
  },
  "options": {
    "topN": 3,
    "simulate": true,
    "documents": true
  }
}
```

#### Option B: Natural Language / Voice Transcript Input
```json
{
  "text": "Mujhe dairy business ke liye 1.2 lakh chahiye. Main Rajasthan mein rehta hoon. SC category.",
  "channel": "whatsapp",
  "language_code": "hi-IN"
}
```

#### Response:
```json
{
  "success": true,
  "status": "OK",
  "eligible_count": 8,
  "eligible_schemes": [
    {
      "scheme_id": "MAHILA_SAMRIDDHI_NBCFDC",
      "name": "Mahila Samriddhi Yojana for Backward Class Women",
      "short_name": "Mahila Samriddhi Yojana",
      "score": {
        "total_score": 100,
        "breakdown": {
          "eligibility_fit": 30,
          "financial_fit": 25,
          "activity_fit": 15,
          "social_priority": 15,
          "subsidy_attractiveness": 10,
          "channel_partner": 5
        }
      },
      "simulation": {
        "project_cost": 120000,
        "net_loan_amount": 114000,
        "emi_monthly": 2753,
        "interest_rate_effective": 4
      },
      "documents": {
        "available": ["Aadhaar Card"],
        "obtain": [
          {
            "name": "Caste Certificate",
            "issuing_authority": "Tehsildar / Revenue Department",
            "estimated_days": 15,
            "difficulty": "medium"
          }
        ]
      }
    }
  ]
}
```

---

### 2. Standalone Financial Simulator
* **Endpoint**: `POST /api/v1/simulate`
* **Body**:
```json
{
  "scheme_id": "PMMY_SHISHU",
  "profile": {
    "project_cost": 45000,
    "loan_required": 45000
  }
}
```

---

### 3. NLP Text Entity Parser
* **Endpoint**: `POST /api/v1/parse-profile`
* **Body**:
```json
{
  "text": "I need 50000 for my tea stall in Mumbai. Age 24 male OBC."
}
```

---

### 4. Scheme Catalog & Details
* **List all schemes**: `GET /api/v1/schemes` (Query params: `?category=Agriculture`, `?active=true`)
* **Single scheme detail**: `GET /api/v1/scheme/:id` (e.g. `/api/v1/scheme/PM_SVANIDHI`)
* **Engine health**: `GET /api/v1/health`

---

## 💻 Programmatic SDK Usage (In-Memory)

Any Node.js project can directly import the DRE without network overhead:

```javascript
import { matchSchemes, extractFromText, SCHEMES } from './DRE/src/index.js';

// 1. Extract profile from user voice transcript or text
const extracted = extractFromText("Main Bihar mein kirana store ke liye 80000 chahta hoon.");

// 2. Evaluate against all 80 schemes
const results = await matchSchemes({
  ...extracted,
  age: 26,
  gender: "M",
  social_category: "OBC"
}, { topN: 3 });

console.log(`Matched ${results.eligible_schemes.length} schemes!`);
```

---

## 🔗 Channel Integration Guides

### 1. IVR (Interactive Voice Response)
* User calls toll-free helpline $\rightarrow$ Audio transcribed via Speech-to-Text (e.g. Bhashini / Sarvam).
* Backend calls `POST http://localhost:5000/api/v1/match` with `{ text: transcript, channel: "ivr" }`.
* DRE returns top eligible scheme and indicative monthly EMI.
* Text-to-Speech reads the result in caller's local dialect.

### 2. Android Mobile App (Kotlin)
* Native Android app sends beneficiary profile to `POST http://10.0.2.2:5000/api/v1/match`.
* Renders scheme cards, EMI sliders, and document upload checklist.

### 3. WhatsApp Business Bot
* Chatbot receives message $\rightarrow$ Forwards user response to DRE API.
* Sends back interactive list messages and downloadable PDF checklists.

---

## ⚖️ Deterministic Evaluation Rules

| Rule | Parameter Evaluated | Failure Condition | Missing Info Handling |
| :--- | :--- | :--- | :--- |
| **Age** | `applicant.age` | `age < min || age > max` | Prompts clarification question |
| **Gender** | `applicant.gender` | Scheme restricted to `F` and user is `M` | Asks user gender |
| **Category** | `applicant.social_category` | Scheme is SC/ST only, user is GEN | Asks social category |
| **Location** | `applicant.state`, `area_type` | Scheme not operational in applicant state | Asks state / rural-urban |
| **Project Cost**| `applicant.project_cost` | Exceeds statutory scheme ceiling | Suggests higher-tier scheme |
| **Income** | `applicant.income_annual` | Exceeds family income ceiling | Asks annual family income |

---

## 📜 License
MIT © Team Manifestation — Smart India Hackathon 2026
