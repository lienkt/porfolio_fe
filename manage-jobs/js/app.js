import { renderAnalysis, evidence, escape } from './render.js';
import { profileFromCV, createPrompt, importResult } from './workflow.js';
const $ = id => document.getElementById(id);
const tabs = [...document.querySelectorAll('[role="tab"]')];
let savedJobId = null, resultJSON = null;
let profile, contract, currentJob = null, loaded = false, fileRevision = 0;
function setView(view) {
  const jobsVisible = view === 'jobs';
  document.body.dataset.view = jobsVisible ? 'jobs' : 'detail';
  for (const [id, visible] of [['workspace', !jobsVisible], ['panel-jobs', jobsVisible]]) {
    const element = $(id);
    element.hidden = !visible;
    // Enforce visibility even when a cached stylesheet overrides the hidden attribute.
    if (visible) element.style.removeProperty('display');
    else element.style.setProperty('display', 'none', 'important');
  }
  $('show-jobs').setAttribute('aria-expanded', String(jobsVisible));
  $('show-detail').setAttribute('aria-pressed', String(!jobsVisible));
}
function showJobs() {
  setView('jobs');
  renderJobs(); $('panel-jobs').focus();
}
function showWorkspace() {
  setView('detail');
}
$('show-jobs').addEventListener('click', showJobs);
$('show-detail').addEventListener('click', showWorkspace);
$('back-workspace').addEventListener('click', () => { showWorkspace(); $('show-detail').focus(); });
showWorkspace();
function selectTab(tab) {
  showWorkspace();
  for (const button of tabs) {
    const active = button === tab;
    button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
    $(button.getAttribute('aria-controls')).hidden = !active;
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
  });
});
function message(id, text, error = false) { $(id).textContent = text; $(id).classList.toggle('error', error); }
function wordCount() { $('word-count').textContent = `${$('letter').value.trim().split(/\s+/).filter(Boolean).length * Boolean($('letter').value.trim())} words · target 300–400`; }
function clearResults() {
  resultJSON = null;
  $('panel-analysis').textContent = 'Import an AI result to see the analysis.';
  $('letter').value = ''; $('letter').disabled = true; $('copy').disabled = true;
  $('letter-evidence').hidden = true; $('letter-sources').textContent = ''; wordCount();
  message('letter-status', 'Import an AI result first.');
}
$('analyze').disabled = true;
$('jd').addEventListener('input', () => { $('char-count').textContent = `${$('jd').value.length.toLocaleString()} / 30,000`; });
$('jd-form').addEventListener('submit', event => {
  event.preventDefault(); if (!loaded) return;
  const jd = $('jd').value.trim();
  if (jd.length < 40) return message('status', 'Paste a JD with at least 40 characters.', true);
  currentJob = {jd, title: $('title').value.trim(), company: $('company').value.trim()};
  $('prompt').value = createPrompt(currentJob, profile, contract);
  $('copy-prompt').disabled = false; $('download-prompt').disabled = false;
  fileRevision++; $('json-input').value = ''; $('json-file').value = ''; clearResults();
  message('import-status', ''); message('prompt-status', 'Copy this prompt to your AI chat and request the JSON file.');
  message('status', 'Prompt ready. No AI API request was sent.'); selectTab($('tab-prompt'));
});
async function copyText(id, status) {
  try { await navigator.clipboard.writeText($(id).value); message(status, 'Copied to clipboard.'); }
  catch { $(id).focus(); $(id).select(); message(status, 'Press Ctrl+C or Cmd+C to copy the selected text.'); }
}
$('copy-prompt').addEventListener('click', () => copyText('prompt', 'prompt-status'));
$('download-prompt').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([$('prompt').value], {type: 'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'application-prompt.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('json-file').addEventListener('change', async () => {
  const revision = ++fileRevision, file = $('json-file').files[0];
  if (!file) return;
  if (file.size > 2000000) return message('import-status', 'File is too large (maximum 2 MB).', true);
  try {
    const text = await file.text();
    if (revision !== fileRevision) return;
    $('json-input').value = text; message('import-status', 'File loaded. Click Validate & show results.');
  } catch { message('import-status', 'Could not read this file. Paste the JSON instead.', true); }
});
$('json-input').addEventListener('input', () => { fileRevision++; });
$('import-json').addEventListener('click', () => {
  if (!loaded) return;
  try {
    const result = importResult($('json-input').value, profile, contract, currentJob);
    resultJSON = $('json-input').value;
    $('panel-analysis').innerHTML = renderAnalysis(result.analysis);
    $('letter').value = result.letter.text; $('letter').disabled = false; $('copy').disabled = false; wordCount();
    const catalog = new Map(profile.evidence.map(e => [e.id, e]));
    $('letter-sources').innerHTML = result.letter.paragraphs.map((p, i) => `<h3>Paragraph ${i + 1}</h3>${evidence(p.evidenceIds.map(id => catalog.get(id)))}`).join('');
    $('letter-evidence').hidden = false;
    if (!currentJob) {
      $('jd').value = result.job.jd; $('title').value = result.job.title; $('company').value = result.job.company;
      $('jd').dispatchEvent(new Event('input')); currentJob = result.job;
      $('prompt').value = createPrompt(currentJob, profile, contract);
      $('copy-prompt').disabled = false; $('download-prompt').disabled = false;
    }
    message('import-status', 'JSON validated. Analysis and cover letter are ready.');
    message('status', 'Imported result ready. Review Analysis and Cover Letter.');
    message('letter-status', 'Imported draft. Check claims and wording before sending; the AI self-audit is not independent verification.');
    selectTab($('tab-analysis'));
  } catch (error) { message('import-status', error.message, true); }
});
$('letter').addEventListener('input', () => {
  wordCount(); $('copy').disabled = !$('letter').value.trim(); $('letter-evidence').hidden = true;
  message('letter-status', 'Edited draft. Evidence references apply to the original imported version.');
});
$('copy').addEventListener('click', () => copyText('letter', 'letter-status'));
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Cannot load ${path} (HTTP ${response.status}).`);
  return response.json();
}
Promise.all([loadJSON('../cv/data.json'), loadJSON('contract.json')]).then(([cv, rules]) => {
  profile = profileFromCV(cv); contract = rules; loaded = true;
  $('profile-status').textContent = `${profile.name} · CV loaded · No API key`;
  $('analyze').disabled = false; $('import-json').disabled = false;
}).catch(error => {
  $('profile-status').textContent = 'Profile could not load';
  message('status', `${error.message} Run python3 -m http.server 8001 and open http://localhost:8001/manage-jobs/.`, true);
});

const storageKey = 'application-workspace.saved-jobs.v1';
let savedJobs = [], jobsPage = 1;
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (!Array.isArray(stored) || stored.some(job => !job || typeof job.id !== 'string' || typeof job.jd !== 'string' || typeof job.title !== 'string' || typeof job.company !== 'string' || typeof job.updatedAt !== 'string' || typeof job.letter !== 'string' || (job.resultJSON !== null && typeof job.resultJSON !== 'string'))) throw new Error();
  savedJobs = stored;
} catch { message('jobs-status', 'Saved jobs could not be read. Saving is disabled to protect existing data.', true); }
let storageReadable = !$('jobs-status').textContent;
function downloadJSON(data, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function downloadJob(job) {
  const name = [job.company, job.title].filter(Boolean).join('-') || 'job';
  const slug = name.normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 100) || 'job';
  downloadJSON({version: 1, ...job}, `${slug}-${job.id}.json`);
}
function renderJobs() {
  $('download-all').disabled = !savedJobs.length;
  $('saved-count').textContent = `(${savedJobs.length})`;
  $('total-jobs').textContent = savedJobs.length;
  $('total-analyzed').textContent = savedJobs.filter(job => Boolean(job.resultJSON)).length;
  $('total-applied').textContent = savedJobs.filter(job => job.applied === true).length;
  $('total-rejected').textContent = savedJobs.filter(job => job.rejected === true).length;
  const query = $('jobs-search').value.trim().toLocaleLowerCase();
  const filtered = savedJobs.filter(job => {
    if (!`${job.title} ${job.company}`.toLocaleLowerCase().includes(query)) return false;
    return ['analyzed', 'applied', 'rejected'].every(key => {
      const filter = $(`filter-${key}`).value;
      const value = key === 'analyzed' ? Boolean(job.resultJSON) : job[key] === true;
      return !filter || value === (filter === 'yes');
    });
  });
  const size = Number($('jobs-page-size').value), pages = Math.max(1, Math.ceil(filtered.length / size));
  jobsPage = Math.min(jobsPage, pages);
  const start = (jobsPage - 1) * size;
  const rows = filtered.slice(start, start + size).map(job => {
    const id = escape(job.id), title = escape(job.title || 'Untitled job');
    return `<tr><td><strong>${title}</strong></td><td>${escape(job.company || 'Company not specified')}</td><td><span class="badge ${job.resultJSON ? 'strong' : ''}">${job.resultJSON ? 'Yes' : 'No'}</span></td>${['applied', 'rejected'].map(key => `<td><input type="checkbox" data-job-status="${key}" data-job-id="${id}" aria-label="${key === 'applied' ? 'Applied' : 'Rejected'}: ${title}" ${job[key] === true ? 'checked' : ''}></td>`).join('')}<td>${escape(new Date(job.updatedAt).toLocaleString())}</td><td><div class="actions"><button class="secondary" data-open-job="${id}">Open</button><button class="secondary" data-download-job="${id}">Download JSON</button><button class="secondary" data-delete-job="${id}">Delete</button></div></td></tr>`;
  }).join('');
  $('saved-jobs').innerHTML = `<table class="jobs-table"><caption class="sr-only">Saved jobs and application progress</caption><thead><tr><th scope="col">Job title</th><th scope="col">Company</th><th scope="col">Analyzed</th><th scope="col">Applied</th><th scope="col">Rejected</th><th scope="col">Updated</th><th scope="col">Actions</th></tr></thead><tbody>${rows || `<tr><td colspan="7" class="jobs-empty">${savedJobs.length ? 'No jobs match these filters.' : 'No saved jobs yet. Click Add job to add your first opportunity.'}</td></tr>`}</tbody></table>`;
  $('jobs-summary').textContent = filtered.length ? `${start + 1}–${Math.min(start + size, filtered.length)} of ${filtered.length} jobs (${savedJobs.length} saved)` : `0 jobs (${savedJobs.length} saved)`;
  $('jobs-page').textContent = `Page ${jobsPage} of ${pages}`;
  $('jobs-prev').disabled = jobsPage <= 1; $('jobs-next').disabled = jobsPage >= pages;
}
for (const id of ['jobs-search', 'filter-analyzed', 'filter-applied', 'filter-rejected', 'jobs-page-size']) {
  $(id).addEventListener(id === 'jobs-search' ? 'input' : 'change', () => { jobsPage = 1; renderJobs(); });
}
$('clear-filters').addEventListener('click', () => {
  for (const id of ['jobs-search', 'filter-analyzed', 'filter-applied', 'filter-rejected']) $(id).value = '';
  jobsPage = 1; renderJobs();
});
$('jobs-prev').addEventListener('click', () => { jobsPage--; renderJobs(); });
$('jobs-next').addEventListener('click', () => { jobsPage++; renderJobs(); });
$('saved-jobs').addEventListener('change', event => {
  const input = event.target.closest('[data-job-status]');
  if (!input || !['applied', 'rejected'].includes(input.dataset.jobStatus)) return;
  const next = savedJobs.map(job => job.id === input.dataset.jobId ? {...job, [input.dataset.jobStatus]: input.checked, updatedAt: new Date().toISOString()} : job);
  if (persistJobs(next)) message('jobs-status', 'Application status updated.');
  else renderJobs();
});
function persistJobs(next) {
  if (!storageReadable) { message('jobs-status', 'Storage could not be read. Saving is disabled to protect existing data.', true); showJobs(); return false; }
  try { localStorage.setItem(storageKey, JSON.stringify(next)); savedJobs = next; renderJobs(); return true; }
  catch { message('jobs-status', 'Could not save changes. Browser storage may be full or unavailable.', true); showJobs(); return false; }
}
function currentJobEntry() {
  const jd = $('jd').value.trim();
  if (jd.length < 40) { message('status', 'Paste a JD with at least 40 characters before saving or downloading.', true); return null; }
  const job = { jd, title: $('title').value.trim(), company: $('company').value.trim() };
  const matches = currentJob && job.jd === currentJob.jd && job.title === currentJob.title && job.company === currentJob.company;
  const id = savedJobId || crypto.randomUUID();
  const existing = savedJobs.find(item => item.id === id);
  return { ...existing, ...job, id, applied: existing?.applied === true, rejected: existing?.rejected === true, updatedAt: new Date().toISOString(), resultJSON: matches ? resultJSON : null, letter: matches && resultJSON ? $('letter').value : '' };
}
$('download-job').addEventListener('click', () => {
  const entry = currentJobEntry();
  if (!entry) return;
  downloadJob(entry);
  message('status', 'Current job JSON download started, including your latest edits.');
});
$('download-all').addEventListener('click', () => {
  if (!savedJobs.length) return;
  downloadJSON({version: 1, exportedAt: new Date().toISOString(), jobs: savedJobs}, `saved-jobs-${new Date().toISOString().slice(0, 10)}.json`);
  message('jobs-status', `JSON download started with ${savedJobs.length} saved jobs. Save current edits first to include them in future exports.`);
});
$('save-job').addEventListener('click', () => {
  const entry = currentJobEntry();
  if (!entry) return;
  const id = entry.id;
  if (!persistJobs([entry, ...savedJobs.filter(item => item.id !== id)])) return;
  savedJobId = id;
  downloadJob(entry);
  message('status', 'Job saved in this browser. JSON download started.'); message('jobs-status', 'Job saved. JSON includes the JD, AI result and edited cover letter.'); showJobs();
});
function resetWorkspace() {
  fileRevision++; currentJob = null; savedJobId = null;
  $('jd-form').reset(); $('jd').dispatchEvent(new Event('input'));
  $('prompt').value = ''; $('copy-prompt').disabled = true; $('download-prompt').disabled = true;
  $('json-input').value = ''; $('json-file').value = ''; clearResults();
  message('status', ''); message('prompt-status', ''); message('import-status', '');
}
$('new-job').addEventListener('click', () => { resetWorkspace(); selectTab($('tab-prompt')); $('title').focus(); });
$('saved-jobs').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const id = button.dataset.openJob || button.dataset.deleteJob || button.dataset.downloadJob;
  const job = savedJobs.find(item => item.id === id);
  if (!job) return;
  if (button.dataset.downloadJob) { downloadJob(job); message('jobs-status', 'Job JSON download started.'); return; }
  if (button.dataset.deleteJob) {
    if (persistJobs(savedJobs.filter(item => item.id !== id))) {
      if (savedJobId === id) savedJobId = null;
      message('jobs-status', 'Job deleted.');
    }
    return;
  }
  if (!loaded) return message('jobs-status', 'Wait for the CV profile to load before opening a job.', true);
  resetWorkspace(); savedJobId = id;
  $('jd').value = job.jd; $('title').value = job.title; $('company').value = job.company;
  $('jd').dispatchEvent(new Event('input'));
  currentJob = { jd: job.jd, title: job.title, company: job.company };
  $('prompt').value = createPrompt(currentJob, profile, contract);
  $('copy-prompt').disabled = false; $('download-prompt').disabled = false;
  selectTab($('tab-prompt'));
  if (job.resultJSON) {
    $('json-input').value = job.resultJSON; $('import-json').click();
    if (resultJSON) { $('letter').value = job.letter; $('letter').dispatchEvent(new Event('input')); }
  }
  message('status', 'Saved job opened. Click Save job to keep further changes.');
});
renderJobs();
