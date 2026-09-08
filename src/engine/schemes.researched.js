/** Generated from research/data/approved_schemes.yaml. Do not edit. */
export const RESEARCHED_SCHEMES = [
  {
    "category": "SocialWelfare",
    "description": "NSFDC-sponsored, free NSQF-compliant skill-development training under PM-DAKSH for Scheduled Caste persons aged 18 to 45. The programme has no income criterion; trainees meeting the attendance condition receive a monthly DBT stipend of ₹1,500.",
    "tags": [
      "skill",
      "training",
      "entrepreneurship",
      "scheduled caste"
    ],
    "eligibility": {
      "age": {
        "min": 18,
        "max": 45
      },
      "income_annual": {
        "min": null,
        "max": null
      },
      "gender": null,
      "social_categories": [
        "SC"
      ],
      "activities": null,
      "activity_categories": null,
      "location": {
        "states": [
          "all"
        ],
        "urban_only": false,
        "rural_only": false
      },
      "occupation": null,
      "existing_business": null,
      "disability": null,
      "minority": null,
      "min_project_cost": null,
      "max_project_cost": null,
      "custom_rules": []
    },
    "financing": {
      "type": "training",
      "max_amount": null,
      "min_amount": null,
      "interest_rate": {
        "base": 0,
        "subsidy_rate": 0,
        "effective_rate": 0
      },
      "own_contribution_pct": 0,
      "tenure_months": {
        "min": 0,
        "max": 0
      },
      "moratorium_months": 0,
      "collateral_required": false,
      "subsidy_amount": null,
      "subsidy_pct": null,
      "subsidy_notes": null
    },
    "documents": [],
    "channel_partners": {
      "types": [],
      "pm_suraj_integrated": false
    },
    "name": "NSFDC PM-DAKSH Skill Development Training (SC)",
    "short_name": "NSFDC PM-DAKSH Training",
    "organization": "NSFDC",
    "scheme_id": "NSFDC_PM_DAKSH_SC_TRAINING",
    "ministry": "NSFDC",
    "metadata": {
      "active": true,
      "version": "2026-09-08",
      "official_url": "https://nsfdc.nic.in/faqs",
      "evidence": [
        {
          "field": "eligibility.age",
          "value": "18 to 45",
          "section_index": 111,
          "excerpt": "NSFDC sponsors free, NSQF-compliant Skill Development Training Programmes for persons belonging to Scheduled Castes (between the ages of 18 and 45) under the PM-DAKSH Yojana."
        },
        {
          "field": "eligibility.social_categories",
          "value": [
            "SC"
          ],
          "section_index": 111,
          "excerpt": "...for persons belonging to Scheduled Castes..."
        },
        {
          "field": "eligibility.income_annual",
          "value": null,
          "section_index": 111,
          "excerpt": "There is no income criterion for aspirants to enroll."
        },
        {
          "field": "benefits.monthly_stipend",
          "value": 1500,
          "section_index": 115,
          "excerpt": "Trainees receive a stipend of ₹1,500 per month via Direct Benefit Transfer (DBT), subject to maintaining an overall attendance of 80% or above throughout the training period."
        }
      ],
      "research_source": {
        "url": "https://nsfdc.nic.in/faqs",
        "organization": "NSFDC",
        "last_scraped": "2026-09-08T03:36:15.021533+00:00"
      }
    }
  }
];

export default RESEARCHED_SCHEMES;
