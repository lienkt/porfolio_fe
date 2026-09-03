# CV style and content contract

Use this prompt whenever an AI assistant updates `cv/data.json`, `cv/template.html`, `cv/cv.css`, or `cv/generate_cv.py`.

> Maintain a professional, ATS-friendly, two-page A4 CV for Lien Kim. Treat `cv/data.json` as the only source of CV content. Never invent employers, dates, degrees, metrics, skills, or achievements. Ask for evidence before adding numerical impact. Keep reverse-chronological ordering. Use concise action-led bullets, consistent English, and consistent date formatting (`Mon. YYYY – Mon. YYYY` or `Mon. YYYY – Present`). Preserve accurate accents and place names.
>
> Keep the visual design restrained, modern, and highly readable: white background, dark charcoal body text, subtle navy section headings, and a professional system sans-serif stack led by Aptos/Segoe UI/Helvetica Neue. Use bold for roles, section titles, category labels, and technology names mentioned inside descriptive text. Use italics sparingly for dates, locations, and secondary context only. Never italicize long paragraphs or bullet points. Keep clear section headings with thin rules; do not use portraits, icons, rating bars, charts, columns, decorative graphics, or information embedded as images. Preserve selectable text and working contact/project links. Make the portfolio URL visibly prominent in the header, and label project links clearly as `GitHub ↗` and `Live demo ↗`. Use A4 dimensions and exactly two intentional `.page` elements. Page one contains the header, summary, skills, and newest experience. Page two contains remaining experience, education, and selected projects.
>
> Prioritize relevance in this order: Generative AI and Data, modern Front-End engineering, Back-End collaboration, testing, education, selected projects. Keep three to five bullets per major role where space permits. Manage every project description as one to three concise bullets in `projects[].bullets`, never as a free-form paragraph. Render the project's `Technologies:` line as the final bullet in the same list, not as a separate paragraph. Bullets should explain action, context, technology, and outcome without unsupported claims. Add both `github_url` and `live_url` when available; use an empty string only when a link genuinely does not exist. Avoid first-person pronouns, vague adjectives, keyword stuffing, duplicate claims, and confidential information.
>
> Before finishing, run `python3 cv/generate_cv.py --check`, generate HTML and PDF, confirm the PDF is two pages, inspect for overflow, and verify the website CV link still points to `cv/lien-kim-cv.pdf`.

## Non-negotiable rules

- Content changes belong in `data.json`, not generated `index.html`.
- Layout changes belong in `template.html` or `cv.css`.
- `index.html` and the PDF are generated artifacts; regenerate them after every data or layout change.
- Keep primary contact details on one readable line and Portfolio/GitHub on a prominent second line.
- Use standard section names: Summary, Skills, Experience, Education, Selected Projects.
- Keep technology names in `technology_terms` so the generator can bold them consistently in summaries and bullets.
- Store project descriptions only in `projects[].bullets`, with one to three action-led points.
- Render `Technologies:` as the final bullet point of every project.
- Include visible GitHub and live-demo links for each selected project whenever available.
- Italics are reserved for dates, locations, work mode, and brief secondary context.
- Do not use an AI-generated statement as a fact unless the user has reviewed and approved it.
- Do not include sensitive personal data such as a street address, birth date, marital status, or headshot.
- Prefer measurable outcomes, but never fabricate a number to make a bullet sound stronger.
