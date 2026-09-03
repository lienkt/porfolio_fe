#!/usr/bin/env python3
"""Validate CV data, render cv/index.html, and export cv/lien-kim-cv.pdf."""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any


CV_DIR = Path(__file__).resolve().parent
DATA_FILE = CV_DIR / "data.json"
TEMPLATE_FILE = CV_DIR / "template.html"
HTML_FILE = CV_DIR / "index.html"
STYLE_PROMPT_FILE = CV_DIR / "STYLE_PROMPT.md"


def text(value: Any) -> str:
    return html.escape(str(value), quote=True)


def load_data() -> dict[str, Any]:
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise ValueError(f"Missing content file: {DATA_FILE}") from error
    except json.JSONDecodeError as error:
        raise ValueError(
            f"Invalid JSON at line {error.lineno}, column {error.colno}: {error.msg}"
        ) from error


def require_string(container: dict[str, Any], key: str, path: str, errors: list[str]) -> None:
    value = container.get(key)
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{path}.{key} must be a non-empty string")


def validate(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if data.get("schema_version") != 1:
        errors.append("schema_version must be 1")

    basics = data.get("basics")
    if not isinstance(basics, dict):
        errors.append("basics must be an object")
    else:
        for key in (
            "name",
            "phone",
            "phone_href",
            "email",
            "linkedin",
            "linkedin_url",
            "github",
            "github_url",
            "website",
            "website_url",
        ):
            require_string(basics, key, "basics", errors)

    require_string(data, "summary", "root", errors)

    skills = data.get("skills")
    if not isinstance(skills, list) or not skills:
        errors.append("skills must be a non-empty array")
    else:
        for index, group in enumerate(skills):
            if not isinstance(group, dict):
                errors.append(f"skills[{index}] must be an object")
                continue
            require_string(group, "category", f"skills[{index}]", errors)
            if not isinstance(group.get("items"), list) or not group["items"]:
                errors.append(f"skills[{index}].items must be a non-empty array")

    languages = data.get("languages")
    if not isinstance(languages, list) or not languages:
        errors.append("languages must be a non-empty array")

    experiences = data.get("experience")
    if not isinstance(experiences, list) or not experiences:
        errors.append("experience must be a non-empty array in newest-to-oldest order")
    else:
        for index, item in enumerate(experiences):
            if not isinstance(item, dict):
                errors.append(f"experience[{index}] must be an object")
                continue
            for key in ("role", "company", "period", "location"):
                require_string(item, key, f"experience[{index}]", errors)
            bullets = item.get("bullets")
            if not isinstance(bullets, list) or not 1 <= len(bullets) <= 5:
                errors.append(f"experience[{index}].bullets must contain 1–5 items")
            elif any(not isinstance(bullet, str) or not bullet.strip() for bullet in bullets):
                errors.append(f"experience[{index}].bullets cannot contain empty items")

    for section_name, required_fields in (
        ("education", ("school", "location", "degree", "period")),
        ("projects", ("name",)),
    ):
        items = data.get(section_name)
        if not isinstance(items, list) or not items:
            errors.append(f"{section_name} must be a non-empty array")
            continue
        for index, item in enumerate(items):
            if not isinstance(item, dict):
                errors.append(f"{section_name}[{index}] must be an object")
                continue
            for key in required_fields:
                require_string(item, key, f"{section_name}[{index}]", errors)
            if section_name == "projects" and (
                not isinstance(item.get("technologies"), list) or not item["technologies"]
            ):
                errors.append(f"projects[{index}].technologies must be a non-empty array")
            if section_name == "projects":
                bullets = item.get("bullets")
                if not isinstance(bullets, list) or not 1 <= len(bullets) <= 3:
                    errors.append(f"projects[{index}].bullets must contain 1–3 items")
                for link_key in ("github_url", "live_url"):
                    if not isinstance(item.get(link_key), str):
                        errors.append(f"projects[{index}].{link_key} must be a string")
                if not item.get("github_url") and not item.get("live_url"):
                    errors.append(f"projects[{index}] needs at least one GitHub or live URL")

    layout = data.get("layout")
    if not isinstance(layout, dict):
        errors.append("layout must be an object")
    else:
        split = layout.get("experience_items_on_page_one")
        count = len(experiences) if isinstance(experiences, list) else 0
        if not isinstance(split, int) or not 1 <= split < count:
            errors.append("layout.experience_items_on_page_one must split the experience list")
        require_string(layout, "pdf_filename", "layout", errors)
        if isinstance(layout.get("pdf_filename"), str) and Path(layout["pdf_filename"]).name != layout["pdf_filename"]:
            errors.append("layout.pdf_filename must be a filename, not a path")

    if not TEMPLATE_FILE.is_file():
        errors.append(f"Missing template: {TEMPLATE_FILE.name}")
    if not (CV_DIR / "cv.css").is_file():
        errors.append("Missing stylesheet: cv.css")
    if not STYLE_PROMPT_FILE.is_file():
        errors.append("Missing design contract: STYLE_PROMPT.md")
    return errors


def render_header(basics: dict[str, str]) -> str:
    return f"""<header class="resume-header">
          <h1>{text(basics['name'])}</h1>
          <p>
            <a href="tel:{text(basics['phone_href'])}">{text(basics['phone'])}</a>
            <span>|</span>
            <a href="mailto:{text(basics['email'])}">{text(basics['email'])}</a>
            <span>|</span>
            <a href="{text(basics['linkedin_url'])}">{text(basics['linkedin'])}</a>
          </p>
          <p class="profile-links">
            <a class="website-link" href="{text(basics['website_url'])}">Portfolio: {text(basics['website'])}</a>
            <span>|</span>
            <a href="{text(basics['github_url'])}">GitHub: {text(basics['github'])}</a>
          </p>
        </header>"""


def emphasize_technologies(value: str, technology_terms: list[str]) -> str:
    escaped_value = text(value)
    escaped_terms = sorted((text(term) for term in technology_terms), key=len, reverse=True)
    if not escaped_terms:
        return escaped_value
    pattern = re.compile("|".join(re.escape(term) for term in escaped_terms), re.IGNORECASE)
    return pattern.sub(lambda match: f"<strong>{match.group(0)}</strong>", escaped_value)


def render_experience_item(item: dict[str, Any], technology_terms: list[str]) -> str:
    bullets = "\n".join(
        f"              <li>{emphasize_technologies(bullet, technology_terms)}</li>"
        for bullet in item["bullets"]
    )
    return f"""<article class="entry">
            <div class="entry-heading"><h3>{text(item['role'])}</h3><time>{text(item['period'])}</time></div>
            <div class="entry-subheading"><strong>{text(item['company'])}</strong><span>{text(item['location'])}</span></div>
            <ul>
{bullets}
            </ul>
          </article>"""


def render(data: dict[str, Any]) -> str:
    template = TEMPLATE_FILE.read_text(encoding="utf-8")
    split = data["layout"]["experience_items_on_page_one"]
    technology_terms = data.get("technology_terms", [])
    first_jobs = "\n\n          ".join(
        render_experience_item(item, technology_terms) for item in data["experience"][:split]
    )
    remaining_jobs = "\n\n          ".join(
        render_experience_item(item, technology_terms) for item in data["experience"][split:]
    )

    skill_lines = "\n".join(
        f"          <p><strong>{text(group['category'])}:</strong> {text(', '.join(group['items']))}.</p>"
        for group in data["skills"]
    )
    skill_lines += (
        f"\n          <p><strong>Languages:</strong> {text(', '.join(data['languages']))}.</p>"
    )

    education = "\n".join(
        f"""          <article class="entry compact">
            <div class="entry-heading"><h3>{text(item['school'])}</h3><span>{text(item['location'])}</span></div>
            <div class="entry-subheading"><span>{text(item['degree'])}</span><time>{text(item['period'])}</time></div>
          </article>"""
        for item in data["education"]
    )

    project_blocks = []
    for item in data["projects"]:
        bullet_html = "\n".join(
            f"              <li>{emphasize_technologies(bullet, technology_terms)}</li>"
            for bullet in item["bullets"]
        )
        links = []
        if item["github_url"]:
            github_url = text(item["github_url"])
            links.append(f'<a href="{github_url}">GitHub ↗</a>')
        if item["live_url"]:
            live_url = text(item["live_url"])
            links.append(f'<a class="live-link" href="{live_url}">Live demo ↗</a>')
        project_blocks.append(
            f"""          <article class="project">
            <div class="project-heading"><h3>{text(item['name'])}</h3><span class="project-links">{' · '.join(links)}</span></div>
            <ul>
{bullet_html}
              <li class="project-technologies"><strong>Technologies:</strong> {text(', '.join(item['technologies']))}</li>
            </ul>
          </article>"""
        )
    projects = "\n".join(project_blocks)

    replacements = {
        "{{DOCUMENT_TITLE}}": text(f"{data['basics']['name']} — CV"),
        "{{HEADER}}": render_header(data["basics"]),
        "{{SUMMARY}}": f"""<section>
          <h2>Summary</h2>
          <p>{emphasize_technologies(data['summary'], technology_terms)}</p>
        </section>""",
        "{{SKILLS}}": f"""<section>
          <h2>Skills</h2>
{skill_lines}
        </section>""",
        "{{EXPERIENCE_PAGE_ONE}}": f"""<section>
          <h2>Experience</h2>
          {first_jobs}
        </section>""",
        "{{EXPERIENCE_PAGE_TWO}}": f"""<section>
          <h2>Experience <small>(continued)</small></h2>
          {remaining_jobs}
        </section>""",
        "{{EDUCATION}}": f"""<section>
          <h2>Education</h2>
{education}
        </section>""",
        "{{PROJECTS}}": f"""<section>
          <h2>Selected Projects</h2>
{projects}
        </section>""",
    }
    for marker, value in replacements.items():
        template = template.replace(marker, value)
    unresolved = re.findall(r"{{[A-Z0-9_]+}}", template)
    if unresolved:
        raise ValueError(f"Unresolved template markers: {', '.join(unresolved)}")
    return template


def find_chrome() -> str | None:
    configured = os.environ.get("CV_CHROME_BIN")
    candidates = [
        configured,
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        shutil.which("google-chrome"),
        shutil.which("google-chrome-stable"),
        shutil.which("chromium"),
        shutil.which("chromium-browser"),
    ]
    return next((candidate for candidate in candidates if candidate and Path(candidate).exists()), None)


def export_pdf(html_file: Path, pdf_file: Path) -> None:
    chrome = find_chrome()
    if not chrome:
        raise RuntimeError(
            "Google Chrome/Chromium was not found. Install it or set CV_CHROME_BIN to its executable path."
        )
    with tempfile.TemporaryDirectory(prefix="cv-chrome-") as profile_dir:
        command = [
            chrome,
            "--headless",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--no-pdf-header-footer",
            f"--user-data-dir={profile_dir}",
            f"--print-to-pdf={pdf_file}",
            html_file.resolve().as_uri(),
        ]
        result = subprocess.run(command, capture_output=True, text=True, timeout=90, check=False)
    if result.returncode != 0 or not pdf_file.is_file() or pdf_file.stat().st_size == 0:
        details = (result.stderr or result.stdout).strip()
        raise RuntimeError(f"Chrome could not generate the PDF.\n{details}")


def pdf_page_count(pdf_file: Path) -> int:
    content = pdf_file.read_bytes()
    return len(re.findall(rb"/Type\s*/Page\b", content))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="validate data without generating files")
    parser.add_argument("--html-only", action="store_true", help="generate HTML without exporting PDF")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        data = load_data()
        errors = validate(data)
        if errors:
            print("CV data validation failed:", file=sys.stderr)
            for error in errors:
                print(f"  - {error}", file=sys.stderr)
            return 1
        print("CV data is valid.")
        if args.check:
            return 0

        HTML_FILE.write_text(render(data), encoding="utf-8")
        print(f"Generated {HTML_FILE.relative_to(CV_DIR.parent)}")
        if args.html_only:
            return 0

        pdf_file = CV_DIR / data["layout"]["pdf_filename"]
        export_pdf(HTML_FILE, pdf_file)
        pages = pdf_page_count(pdf_file)
        if pages != 2:
            raise RuntimeError(
                f"Expected a 2-page PDF but generated {pages} page(s). Adjust content or layout before publishing."
            )
        print(f"Generated {pdf_file.relative_to(CV_DIR.parent)} ({pages} pages)")
        return 0
    except (OSError, RuntimeError, ValueError, subprocess.TimeoutExpired) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
