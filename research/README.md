# Research-to-DRE workflow

`sources.yaml` is the allow-list of official research sources. Scraping creates immutable
page evidence; normalisation creates **candidates only**. Neither is used by the API.

```powershell
python research/scraper.py
python research/normalize.py
npm.cmd run build:schemes
npm.cmd test
```

After reviewing `data/candidate_schemes.yaml`, enter the verified record in
`data/approved_schemes.yaml`. Every record must have `review_status: approved`, at least
one evidence item, and an official source URL. The build step rejects anything else.

```yaml
version: "1.0"
schemes:
  - id: EXAMPLE_SCHEME
    name: Example reviewed scheme
    organization: Example Department
    review_status: approved
    source:
      url: https://example.gov.in/scheme
      organization: Example Department
      last_scraped: "2026-09-08T00:00:00+00:00"
    eligibility:
      age: { min: 18, max: 60 }
      income_annual: { max: 300000 }
    financing:
      max_amount: 500000
    evidence:
      - field: eligibility.income_annual.max
        value: 300000
        section_index: 12
        excerpt: "Annual family income must not exceed Rs. 3 lakh."
```

`npm run build:schemes` writes `src/engine/schemes.researched.js`. It is loaded alongside
the existing built-in schemes at runtime; do not edit the generated file by hand.
