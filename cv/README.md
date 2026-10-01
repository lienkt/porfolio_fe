# CV — Update and Generate

[Back to the portfolio README](../README.md)

Run all commands below from the project root (`porfolio_fe`), not from the `cv` folder.

## 1. Edit content

| What to update                                          | File               |
| ------------------------------------------------------- | ------------------ |
| CV summary, skills, experience, education, and projects | `cv/data.json`     |
| CV layout                                               | `cv/template.html` |
| CV fonts, spacing, and colors                           | `cv/cv.css`        |

**Do not edit `cv/index.html` directly.** It is generated from the data and template. CV and portfolio content are managed separately; updating the CV does not update portfolio content automatically.

## 2. Regenerate the CV

Requires **Python 3.9+** and **Google Chrome** (or Chromium). No additional Python packages are needed.

From the project root (`porfolio_fe`), run after each CV change:

```bash
python3 cv/generate_cv.py
```

This validates the data and regenerates both files:

- `cv/index.html`: the CV webpage.
- `cv/lien-kim-cv.pdf`: the PDF opened by the portfolio's CV button.

Review the PDF before publishing. It must contain exactly **2 pages**. If the generator reports a different page count, shorten the content or adjust the layout, then run it again.

Optional commands:

```bash
# Validate data without generating files
python3 cv/generate_cv.py --check

# Generate HTML only; Chrome is not required
python3 cv/generate_cv.py --html-only
```

If Chrome cannot be found, specify its executable path:

```bash
CV_CHROME_BIN="/path/to/chrome" python3 cv/generate_cv.py
```

## 3. Preview locally

From the project root, run:

```bash
python3 -m http.server 8000
```

- CV webpage: [localhost:8000/cv/](http://localhost:8000/cv/)
- CV PDF: [localhost:8000/cv/lien-kim-cv.pdf](http://localhost:8000/cv/lien-kim-cv.pdf)

Refresh the browser after regenerating the CV. Press `Ctrl+C` in the terminal to stop the server.

## 4. Publish updates

After reviewing the CV, commit and push to the branch used by GitHub Pages:

```bash
git add cv/
git commit -m "Update CV"
git push
```

Wait for GitHub Pages to finish deploying, then check the [website](https://lienkim.com/) and its CV button.

**Update workflow:** edit `cv/data.json` → run `python3 cv/generate_cv.py` → review HTML/PDF → commit and push.
