# Portfolio — Lien Kim

Website: [lienkim.com](https://lienkim.com/). Built with HTML, CSS, and JavaScript. No `npm install` or build step required.

## Edit the portfolio

| What to update                                | File                    |
| --------------------------------------------- | ----------------------- |
| Text, skills, experience, projects, and links | `assets/js/content.js`  |
| Page structure                                | `index.html`            |
| Colors, spacing, and responsive styles        | `assets/css/styles.css` |
| Images                                        | `assets/img/`           |

## Run locally

From the project root (`porfolio_fe`), run:

```bash
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000/). Refresh the browser after making changes. Press `Ctrl+C` in the terminal to stop the server.

## Application workspace

The separate `/manage-jobs/` page creates a prompt from a JD and your CV. Copy it
into your preferred AI chat, then import its JSON to view the analysis and editable cover letter.
No API key or AI backend is needed. Run `python3 -m http.server 8001` if port 8000 is busy,
then open http://localhost:8001/manage-jobs/.
See [workflow instructions](manage-jobs/README.md).

## CV documentation

See [cv/README.md](cv/README.md) for editing, generating, previewing, and publishing the CV.

## Publish the portfolio

Commit your changed files and push to the branch used by GitHub Pages. Once deployment finishes, check the [live website](https://lienkim.com/).
