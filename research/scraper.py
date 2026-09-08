from __future__ import annotations

import json
import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
import yaml
from bs4 import BeautifulSoup


BASE_DIR = Path(__file__).resolve().parent
SOURCE_FILE = BASE_DIR / "sources.yaml"
OUTPUT_FILE = BASE_DIR / "data" / "raw_schemes.json"
HTML_DIR = BASE_DIR / "data" / "html"

HEADERS = {
    "User-Agent": (
        "Saarthi-Setu-SchemeResearch/1.0 "
        "(government-scheme prototype)"
    )
}

TIMEOUT = 30
DELAY_SECONDS = 2


def load_sources():
    with SOURCE_FILE.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}

    sources = [
        x for x in data.get("sources", [])
        if x.get("enabled", True)
    ]

    for source in sources:
        missing = [key for key in ("id", "name", "organization", "url") if not source.get(key)]
        if missing:
            raise ValueError(f"Source is missing required fields {missing}: {source}")

    return sources


def clean_text(text):
    return " ".join(text.split())


def scrape_page(source):
    url = source["url"]

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=TIMEOUT
    )

    response.raise_for_status()
    content = response.content
    content_hash = hashlib.sha256(content).hexdigest()
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    html_file = HTML_DIR / f"{source['id']}-{content_hash[:12]}.html"
    html_file.write_bytes(content)

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    # Remove unnecessary HTML
    for tag in soup(
        ["script", "style", "noscript", "svg", "nav", "footer"]
    ):
        tag.decompose()

    title = ""

    if soup.title:
        title = clean_text(
            soup.title.get_text(" ", strip=True)
        )

    sections = []

    current_heading = title
    for tag in soup.find_all(
        ["h1", "h2", "h3", "h4", "h5",
         "p", "li", "th", "td"]
    ):
        text = clean_text(
            tag.get_text(" ", strip=True)
        )

        if text:
            if tag.name in {"h1", "h2", "h3", "h4", "h5"}:
                current_heading = text
            sections.append({
                "index": len(sections),
                "tag": tag.name,
                "heading": current_heading,
                "text": text
            })

    return {
        "source_id": source["id"],
        "name": source["name"],
        "organization": source["organization"],
        "url": url,
        "final_url": response.url,
        "scraped_at": datetime.now(
            timezone.utc
        ).isoformat(),
        "http_status": response.status_code,
        "content_type": response.headers.get("Content-Type"),
        "content_sha256": content_hash,
        "html_snapshot": str(html_file.relative_to(BASE_DIR)),
        "title": title,
        "sections": sections
    }


def main():

    sources = load_sources()

    results = []

    for source in sources:

        print(
            f"[SCRAPE] "
            f"{source['name']} -> {source['url']}"
        )

        try:

            results.append(
                scrape_page(source)
            )

            print("[OK]")

        except requests.RequestException as exc:

            print(f"[ERROR] {exc}")

            results.append({
                "source_id": source["id"],
                "name": source["name"],
                "organization": source["organization"],
                "url": source["url"],
                "scraped_at": datetime.now(
                    timezone.utc
                ).isoformat(),
                "error": str(exc)
            })

        time.sleep(DELAY_SECONDS)

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with OUTPUT_FILE.open(
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            results,
            f,
            ensure_ascii=False,
            indent=2
        )

    print(
        f"\nSaved raw evidence to: "
        f"{OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()
