# Application workspace — manual AI workflow

This page runs entirely in the browser with HTML, CSS and JavaScript. No AI API key,
Python backend, npm installation or build is needed. It also works on GitHub Pages.

## Run locally

From the project root:

```bash
python3 -m http.server 8001
```

Open http://localhost:8001/manage-jobs/. Keep the terminal running.

## Use

1. Enter a job description and optional title/company, then click **Analyze**.
2. In **Prompt**, copy or download the generated prompt. It includes your CV profile,
   evidence catalog, JD, application strategy instructions and the required JSON schema.
   Review this information before sharing it with your chosen AI chat.
3. Paste the prompt into ChatGPT or another AI chat and request `application-result.json`.
   If the chat cannot attach a file, copy its raw JSON response.
4. In **Import JSON**, upload the file or paste raw JSON, then click **Validate & show results**.
5. **Analysis** shows role summary, priorities, evidence mapping, selling points, gaps,
   positioning, career story and recommended cover letter strategy.
6. **Cover Letter** shows the editable draft, word count and paragraph evidence. Copy it
   after reviewing. To regenerate, ask your AI chat to revise and import the complete JSON again.

The import validates fields/types, unique requirement IDs, exact JD quotes, CV evidence,
requirement coverage, selling point references, letter citations, 300–400 words and empty
self-audit arrays. Project/training/skill evidence alone is downgraded from Strong to Partial.
It cannot verify whether the AI's interpretation or every claim is factually correct; review
both analysis and letter. The self-audit comes from the same external AI.

An existing result can be imported after a reload if its profile evidence matches the current
CV. Once a prompt or result is loaded, imports must match that job. Generate a new prompt to
switch jobs. Unsaved results are cleared on reload. Use Save job to keep them in this browser, or keep your downloaded JSON.
Maximum import size is 2 MB. Invalid imports leave the previous valid result intact.

## Files

- `../cv/data.json`: live candidate profile; changes are included after reloading.
- `contract.json`: output schema and instructions for extraction, matching, positioning,
  writing and self-audit.
- `js/workflow.js`: CV adapter, prompt generator, validation and evidence enrichment.
- `js/app.js`: tabs, clipboard, download, file import and editable letter.
- `js/render.js`: escaped rendering of structured analysis.

The workspace runs entirely in the browser; no backend or `.env` configuration is required.

## Check

```bash
node --test manage-jobs/test-workflow.mjs
```

## Saved jobs

Click **Save job** to keep the current JD, validated AI result and edited cover letter.
Each save also downloads a separate JSON file named with the company, title and stable job ID.
The file includes the JD, title, company, update time, original AI result (`resultJSON`) and
edited cover letter (`letter`). **Download JSON** exports any previously saved entry.
The **Download JSON** button beside **Save job** exports the current job with its latest
edits without saving it to browser storage. **Download all** in **Joblist** downloads
one JSON file containing all saved entries in a `jobs` array; save current edits first.
Your browser chooses the download location; the page cannot write directly into the repository.
These saved-job files are different from the AI response expected by **Import JSON**.
To import the original AI response, use the contents of the file's `resultJSON` field.
Use **Joblist** to open or delete an entry, or **Add job** to start another application.
Opening an entry and saving again updates that entry. Save after making changes.
Data stays in this browser on this site; it does not sync across devices and clearing browser data removes it.
Saved AI results are validated again against the current CV when opened.

## Edit, save and export a cover letter

In **Cover Letter**, edit the imported draft or write your own letter. Enter a JD of
at least 40 characters, then click **Save letter** to store it with the job without
leaving the editor. Reopen the job from **Joblist** to continue editing.

**Export PDF** opens an A4 preview using the CV's typography, navy headings and
contact header. It includes the current letter, job title and company, including
unsaved edits. Click **Save as PDF / Print**, choose **Save as PDF**, and disable
browser headers and footers. Long letters continue onto additional pages.
Exporting does not save the job; use **Save letter** to keep edits in the browser.
