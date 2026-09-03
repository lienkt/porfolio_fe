# Personal Portfolio Website

A responsive personal portfolio built with plain HTML, CSS, and JavaScript. It presents a professional introduction, Generative AI and software engineering skills, work experience, featured projects, and contact information.

The project has no framework, build step, package manager, or external JavaScript dependency. You can run it locally and customize it with only a browser and a text editor.

## Live website

[https://lienkim.info/](https://lienkim.info/)

## Features

- Responsive layout for desktop, tablet, and mobile
- Editable content stored in one JavaScript file
- Skills grouped by Generative AI, Front-End, and Back-End
- Company and training history generated from data
- Horizontally scrollable project gallery
- Project cards with optional GitHub and live-demo links
- About and contact sections
- GitHub Pages and custom-domain friendly

## Technology

- HTML5
- CSS3
- Vanilla JavaScript

## Project structure

```text
.
├── index.html
├── CNAME
├── README.md
├── cv
│   ├── data.json
│   ├── template.html
│   ├── cv.css
│   ├── STYLE_PROMPT.md
│   ├── generate_cv.py
│   ├── index.html
│   └── lien-kim-cv.pdf
└── assets
    ├── css
    │   └── styles.css
    ├── img
    │   └── ...
    └── js
        ├── content.js
        └── script.js
```

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, navigation, gallery, and content placeholders |
| `assets/js/content.js` | Main text, skills, companies, projects, and links |
| `assets/js/script.js` | Renders dynamic content and handles gallery navigation |
| `assets/css/styles.css` | Layout, colors, responsive rules, and component styles |
| `assets/img/` | Avatars, company logos, and project images |
| `cv/data.json` | Single source of truth for CV content |
| `cv/generate_cv.py` | Validates CV data and generates HTML and PDF |
| `cv/template.html` | Semantic two-page HTML template |
| `cv/cv.css` | A4 screen and print styling |
| `cv/STYLE_PROMPT.md` | Design and editorial rules for future CV updates |
| `cv/index.html` | Generated browser preview; do not edit directly |
| `cv/lien-kim-cv.pdf` | Generated CV opened by the website's CV button |
| `CNAME` | Custom domain used by GitHub Pages |

## Run locally

Clone the repository:

```bash
git clone https://github.com/lienkt/porfolio_fe.git
cd porfolio_fe
```

Run a local web server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000). You can also open `index.html` directly or use an editor extension such as Live Server.

## Update and regenerate the CV

The CV uses a deterministic workflow: its content lives in JSON, its layout lives in an HTML template and CSS, and Python generates the final HTML/PDF files. No Python package installation is required.

### Requirements

- Python 3.9 or newer
- Google Chrome or Chromium

On macOS, the generator automatically checks the standard Google Chrome location. On Linux it checks common Chrome and Chromium commands. For a custom installation, set `CV_CHROME_BIN` to the full browser executable path:

```bash
CV_CHROME_BIN="/path/to/chrome" python3 cv/generate_cv.py
```

### Normal update workflow

1. Open `cv/data.json`.
2. Update the relevant section: `basics`, `summary`, `skills`, `languages`, `experience`, `education`, or `projects`.
3. Preserve reverse-chronological order in the `experience` array.
4. Validate the JSON and required fields:

```bash
python3 cv/generate_cv.py --check
```

5. Generate both `cv/index.html` and `cv/lien-kim-cv.pdf`:

```bash
python3 cv/generate_cv.py
```

6. Preview `cv/index.html` in a browser and open `cv/lien-kim-cv.pdf` to verify both pages before committing.

The generator fails when required data is missing, an experience has no bullet points, the page split is invalid, Chrome cannot create the PDF, or the generated PDF is not exactly two pages.

To generate only the browser preview without Chrome or PDF export, run:

```bash
python3 cv/generate_cv.py --html-only
```

### Content structure

Every experience follows this format:

```json
{
  "role": "Job title",
  "company": "Company name",
  "period": "Mon. YYYY – Mon. YYYY",
  "location": "City, Country",
  "bullets": [
    "Action-led achievement with context, technology, and outcome."
  ]
}
```

Every CV project contains `name`, one to three `bullets`, `technologies`, `github_url`, and `live_url`. Use an empty string when a GitHub or live link is unavailable, but keep at least one valid link per project. Add technology names to `technology_terms` when they should be automatically bolded inside summaries and bullets. Keep only the most relevant projects so the CV remains focused and fits two pages.

The `layout.experience_items_on_page_one` value controls where the experience list is split between pages. Change it only when balancing page content, then regenerate and inspect the PDF.

### CV writing and design rules

Read `cv/STYLE_PROMPT.md` before asking an AI assistant to revise the CV. It is the design and editorial contract for maintaining ATS compatibility, consistent dates, accurate facts, concise bullet points, and the two-page layout.

Important maintenance rules:

- Edit content in `cv/data.json`; do not edit the generated `cv/index.html`.
- Edit structure in `cv/template.html` and visual rules in `cv/cv.css`.
- Never invent metrics or achievements. Add measurable results only when they can be supported.
- Regenerate and review both files after every content, template, or style change.
- Keep the filename `lien-kim-cv.pdf` unless you also update the CV link in the website navigation.

## Customize the portfolio

### Update text and links

Most important content is stored in `assets/js/content.js` inside `PORTFOLIO_CONTENT`:

```js
const PORTFOLIO_CONTENT = {
  site: {},
  navigation: {},
  hero: {},
  experience: {},
  projects: [],
  about: {},
  footer: {},
};
```

Edit this file to change the name, introduction, skills, companies, project details, About text, and footer content. Some fields support HTML, including `<strong>`, `<br>`, lists, and spans.

Elements in `index.html` use a `data-content` path:

```html
<h2 data-content="experience.skillsTitle"></h2>
```

The JavaScript reads that path from `PORTFOLIO_CONTENT` and inserts the matching value.

### Replace images

Put new images in `assets/img/` and update their paths in `index.html` or `assets/js/content.js`.

- Use optimized PNG, JPEG, WebP, AVIF, or SVG files.
- Keep project screenshots at a consistent aspect ratio.
- Add meaningful `alt` text in `index.html`.
- Replace personal portraits and company logos before publishing a fork.

### Add a skill group

Add an object to `experience.skillGroups` in `assets/js/content.js`:

```js
{
  icon: "✦",
  title: "Generative AI",
  items: ["Python", "LLMs", "RAG", "AI Agents"],
}
```

### Add a company

Add an object to `experience.companies`:

```js
{
  name: "Company name",
  detail: "Role · Location",
  logo: "assets/img/company-logo.png",
  className: "company-name",
  link: "https://example.com/",
}
```

### Add a project

Add an object to the `projects` array in `assets/js/content.js`:

```js
{
  id: "project-0",
  note: "Note: Personal project",
  img: "assets/img/project-image.png",
  background_color: "green",
  github_link: "https://github.com/username/repository",
  live_link: "https://example.com/",
  title: "Project title",
  description: "A short explanation of the project.",
  tags: ["Python", "JavaScript"],
}
```

Use an empty string for a link that is not available. The interface automatically shows two buttons when both links are provided, one button when only one link is provided, and no buttons when both links are empty.

The image gallery is currently maintained in `index.html`. When adding or reordering projects:

1. Add or move the corresponding `.image-wrapper` in the gallery.
2. Keep gallery images in the same order as `PORTFOLIO_CONTENT.projects`.
3. Number project IDs sequentially: `project-0`, `project-1`, `project-2`, and so on.

This order allows a gallery image to scroll to its matching project card.

### Change colors and layout

Edit `assets/css/styles.css`. The main areas are grouped by comments such as Gallery, Skills and experience, Projects, About, and Footer. Responsive styles use media queries, so verify changes at both desktop and mobile widths.

## Deploy with GitHub Pages

1. Push the project to a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose the branch and root directory.
5. Save and wait for GitHub Pages to publish the site.

If you do not use a custom domain, remove or update `CNAME`. If you use one, replace its value with your own domain and configure the required DNS records.

## Before publishing your version

- Replace all personal text, email addresses, profile links, and CV links.
- Replace portraits, screenshots, and company logos that you do not own.
- Update the page title, metadata, footer copyright, and `CNAME`.
- Test every GitHub, live-demo, navigation, and contact link.
- Check the website on desktop and mobile.

## Reusing this project

You may use the code as a starting point for your own portfolio, but please replace the personal biography, photographs, project content, company logos, and contact information with your own material. Third-party names, logos, and screenshots remain the property of their respective owners.

## Contributing

Suggestions and improvements are welcome:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request with a clear description.

## Contact

For questions about the portfolio, open a GitHub issue or use the contact links on the live website.
