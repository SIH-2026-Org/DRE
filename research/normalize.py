import json
import re
from pathlib import Path

import yaml


BASE_DIR = Path(__file__).resolve().parent

RAW_FILE = BASE_DIR / "data" / "raw_schemes.json"
YAML_FILE = BASE_DIR / "data" / "candidate_schemes.yaml"


def get_all_text(raw_source):
    """
    Convert scraped sections into one searchable text string.
    """

    sections = raw_source.get("sections", [])

    return "\n".join(
        item.get("text", "")
        for item in sections
    )


def find_money(text, patterns):
    """
    Find a money amount from text.

    Supports:
        ₹1.25 lakh
        Rs. 1.25 lakh
        Rs 1,25,000
        1.25 crore
        500000
    """

    for pattern in patterns:

        matches = re.finditer(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        for match in matches:

            raw_number = match.group(1)

        
            raw_number = (
                raw_number
                .replace(",", "")
                .strip()
            )

    
            if not re.fullmatch(
                r"\d+(?:\.\d+)?",
                raw_number
            ):
                continue

            try:
                number = float(raw_number)
            except ValueError:
                continue

            unit = ""

            if len(match.groups()) >= 2:
                unit = (
                    match.group(2) or ""
                ).lower()

            if "lakh" in unit:
                number *= 100000

            elif "crore" in unit:
                number *= 10000000

            return int(number)

    return None


def find_income_limit(text):

    patterns = [
        r"income.*?(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|crore)?",
        r"(?:annual|family).*?income.*?(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|crore)?",
    ]

    return find_money(
        text,
        patterns
    )


def find_max_loan(text):

    patterns = [
        r"maximum loan.*?(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|crore)?",
        r"max(?:imum)?\.?\s*loan.*?(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|crore)?",
        r"loan.*?up to.*?(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|crore)?",
    ]

    return find_money(
        text,
        patterns
    )


def find_project_cost(text):

    patterns = [
        r"project cost.*?(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|crore)?",
        r"project.*?up to.*?(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|crore)?",
    ]

    return find_money(
        text,
        patterns
    )


def create_candidate(source):

    text = get_all_text(source)

    source_id = source["source_id"]

    name = source.get(
        "name",
        source_id
    )

    scheme = {
        "id": source_id.upper(),
        "name": name,

        "source": {
            "organization":
                source.get("organization"),

            "url":
                source.get("url"),

            "last_scraped":
                source.get("scraped_at")
        },

        "rules": [],

        "finance": {},

        "documents": [],

        "ranking": {
            "base_score": 50
        },
        # Candidate records are evidence leads only. The DRE never reads them.
        "review_status": "pending"
    }

    # ------------------------------------------------
    # Income
    # ------------------------------------------------

    income = find_income_limit(text)

    if income:

        scheme["rules"].append({
            "field":
                "annual_family_income",

            "operator":
                "lte",

            "value":
                income
        })


    # ------------------------------------------------
    # Maximum loan
    # ------------------------------------------------

    max_loan = find_max_loan(text)

    if max_loan:

        scheme["rules"].append({
            "field":
                "requested_loan",

            "operator":
                "lte",

            "value":
                max_loan
        })

        scheme["finance"]["max_loan"] = max_loan


    # ------------------------------------------------
    # Project cost
    # ------------------------------------------------

    project_cost = find_project_cost(text)

    if project_cost:

        scheme["rules"].append({
            "field":
                "project_cost",

            "operator":
                "lte",

            "value":
                project_cost
        })

        scheme["finance"][
            "max_project_cost"
        ] = project_cost


    return scheme


def main():

    if not RAW_FILE.exists():

        print(
            "raw_schemes.json not found."
        )

        print(
            "Run: python scraper.py"
        )

        return


    with RAW_FILE.open(
        "r",
        encoding="utf-8"
    ) as f:

        raw_data = json.load(f)


    schemes = []

    for source in raw_data:

        if "error" in source:

            print(
                f"Skipping {source['source_id']} "
                f"because scraping failed."
            )

            continue


        print(
            f"Normalizing: "
            f"{source['name']}"
        )

        scheme = create_candidate(
            source
        )

        schemes.append(scheme)


    output = {

        "version": "0.1",

        "generated_from":
            "data/raw_schemes.json",

        "warning":
            "Candidate rules extracted from scraped text. "
            "Review and verify against the official source "
            "before using for eligibility decisions.",

        "schemes":
            schemes
    }


    with YAML_FILE.open(
        "w",
        encoding="utf-8"
    ) as f:

        yaml.safe_dump(
            output,
            f,
            allow_unicode=True,
            sort_keys=False
        )


    print(
        f"\nCreated: {YAML_FILE}"
    )


if __name__ == "__main__":
    main()
