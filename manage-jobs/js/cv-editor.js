import { escape } from './render.js';
const label = key => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const templates = {
  skills: {category: '', items: ['']},
  experience: {role: '', company: '', period: '', location: '', bullets: ['']},
  education: {school: '', location: '', degree: '', period: ''},
  projects: {name: '', period: '', bullets: [''], technologies: [''], github_url: '', live_url: ''}
};
export const cloneCV = cv => structuredClone(cv);
export function validCV(cv, base) {
  if (!cv || typeof cv !== 'object' || Array.isArray(cv)) return false;
  return Object.entries(base).every(([key, value]) => {
    const candidate = cv[key];
    if (Array.isArray(value)) return Array.isArray(candidate) && candidate.every(item =>
      typeof value[0] === 'string' ? typeof item === 'string' : validCV(item, value[0]));
    if (value && typeof value === 'object') return validCV(candidate, value);
    return typeof candidate === typeof value && (typeof candidate !== 'number' || Number.isFinite(candidate));
  });
}
export function createCVEditor(container, onChange) {
  let draft;
  const expanded = new Map();
  const resolve = path => path ? path.split('.').reduce((value, key) => value[key], draft) : draft;
  function fields(value, path = '') {
    return Object.entries(value).filter(([key]) => !['schema_version', 'last_updated'].includes(key)).map(([key, item]) => {
      const name = path ? `${path}.${key}` : key;
      const group = content => path
        ? `<fieldset class="cv-group"><legend>${escape(label(key))}</legend>${content}</fieldset>`
        : `<details class="cv-group cv-section" data-cv-section="${escape(key)}" ${expanded.get(key) ?? ['skills', 'summary'].includes(key) ? 'open' : ''}><summary>${escape(label(key))}</summary><div class="cv-section-content">${content}</div></details>`;
      if ((/^skills\.\d+$/.test(path) && key === 'items') || (/^projects\.\d+$/.test(path) && key === 'technologies')) {
        const title = key === 'technologies' ? 'Technologies' : 'Skills';
        return `<label class="cv-field">${title}<textarea data-cv-field="${escape(name)}" data-cv-list="true" rows="3" placeholder="React, TypeScript, Python">${escape(item.join(', '))}</textarea><span class="cv-field-hint">Separate ${title.toLowerCase()} with commas or new lines.</span></label>`;
      }
      if (Array.isArray(item)) {
        return group(`${item.map((entry, index) => `<div class="cv-item"><div class="cv-item-heading"><strong>${escape(label(key))} ${index + 1}</strong><div class="actions"><button type="button" class="secondary" data-move="${name}" data-index="${index}" data-step="-1" ${index === 0 ? 'disabled' : ''} aria-label="Move ${escape(label(key))} ${index + 1} up">↑</button><button type="button" class="secondary" data-move="${name}" data-index="${index}" data-step="1" ${index === item.length - 1 ? 'disabled' : ''} aria-label="Move ${escape(label(key))} ${index + 1} down">↓</button><button type="button" class="secondary cv-remove" data-remove="${name}" data-index="${index}">${name === 'skills' ? 'Remove group' : 'Remove'}</button></div></div>${typeof entry === 'object' ? fields(entry, `${name}.${index}`) : field(`${name}.${index}`, `${label(key)} ${index + 1}`, entry)}</div>`).join('')}<button type="button" class="secondary" data-add="${name}">+ Add ${name === 'skills' ? 'skill group' : escape(label(key))}</button>`);
      }
      if (item && typeof item === 'object') return group(fields(item, name));
      return path ? field(name, label(key), item) : group(field(name, label(key), item));
    }).join('');
  }
  function field(path, title, value) {
    const multiline = /summary|bullets/.test(path);
    const attrs = `data-cv-field="${escape(path)}"`;
    return `<label class="cv-field">${escape(title)}${multiline ? `<textarea ${attrs} rows="3">${escape(value)}</textarea>` : `<input ${attrs} type="${typeof value === 'number' ? 'number' : 'text'}" ${typeof value === 'number' ? 'min="0" step="1"' : ''} value="${escape(value)}">`}</label>`;
  }
  const render = () => {
    for (const section of container.querySelectorAll?.('[data-cv-section]') || []) {
      expanded.set(section.dataset.cvSection, section.open);
    }
    container.innerHTML = fields(draft);
  };
  container.addEventListener('input', event => {
    const path = event.target.dataset.cvField;
    if (!path) return;
    const keys = path.split('.'), key = keys.pop();
    const parent = resolve(keys.join('.'));
    parent[key] = event.target.dataset.cvList ? event.target.value.split(/[,\n]+/).map(item => item.trim()).filter(Boolean) : event.target.type === 'number' ? Math.max(0, Math.floor(Number(event.target.value) || 0)) : event.target.value;
    onChange();
  });
  container.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const path = button.dataset.add || button.dataset.remove || button.dataset.move;
    if (!path) return;
    const array = resolve(path), index = Number(button.dataset.index);
    if (button.dataset.add) array.push(templates[path] ? cloneCV(templates[path]) : '');
    else if (button.dataset.remove) array.splice(index, 1);
    else { const next = index + Number(button.dataset.step); [array[index], array[next]] = [array[next], array[index]]; }
    render(); onChange();
  });
  return {set(cv) { draft = cloneCV(cv); expanded.clear(); container.innerHTML = ''; render(); }, get() { return cloneCV(draft); }};
}
const safeURL = value => /^https?:\/\//i.test(value || '') ? escape(value) : '#';
export function renderCV(cv, template, stylesheet, title) {
  const b = cv.basics;
  const terms = [...new Set(cv.technology_terms.filter(Boolean))].sort((a, b) => b.length - a.length);
  const pattern = terms.length ? new RegExp(terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi') : null;
  const emphasize = value => {
    if (!pattern) return escape(value);
    let last = 0, html = '';
    for (const match of value.matchAll(pattern)) { html += escape(value.slice(last, match.index)) + `<strong>${escape(match[0])}</strong>`; last = match.index + match[0].length; }
    return html + escape(value.slice(last));
  };
  const bullets = items => `<ul>${items.filter(Boolean).map(item => `<li>${emphasize(item)}</li>`).join('')}</ul>`;
  const section = (name, content) => content ? `<section><h2>${name}</h2>${content}</section>` : '';
  const experience = items => items.map(item => `<article class="entry"><div class="entry-heading"><h3>${escape(item.role)}</h3><time>${escape(item.period)}</time></div><div class="entry-subheading"><strong>${escape(item.company)}</strong><span>${escape(item.location)}</span></div>${bullets(item.bullets)}</article>`).join('');
  const split = Math.min(cv.experience.length, Math.max(0, cv.layout.experience_items_on_page_one));
  const link = (url, text, cls = '') => `<a target="_blank" rel="noopener noreferrer" class="${cls}" href="${safeURL(url)}">${escape(text)}</a>`;
  const replacements = {
    DOCUMENT_TITLE: escape(title),
    HEADER: `<header class="resume-header"><h1>${escape(b.name)}</h1><p><a href="tel:${escape(b.phone_href)}">${escape(b.phone)}</a><span>|</span><a href="mailto:${escape(b.email)}">${escape(b.email)}</a><span>|</span>${link(b.linkedin_url, b.linkedin)}</p><p class="profile-links">${link(b.website_url, `Portfolio: ${b.website}`, 'website-link')}<span>|</span>${link(b.github_url, `GitHub: ${b.github}`)}</p><p class="availability">${escape(b.availability)}</p></header>`,
    SUMMARY: section('Summary', cv.summary ? `<p>${emphasize(cv.summary)}</p>` : ''),
    SKILLS: section('Skills', cv.skills.map(group => `<p><strong>${escape(group.category)}:</strong> ${escape(group.items.filter(Boolean).join(', '))}.</p>`).join('') + (cv.languages.length ? `<p><strong>Languages:</strong> ${escape(cv.languages.filter(Boolean).join(', '))}.</p>` : '')),
    PROJECTS: section('Selected Projects', cv.projects.map(item => `<article class="project"><div class="project-heading"><h3>${escape(item.name)}</h3><time>${escape(item.period)}</time></div><p class="project-links">${[item.github_url ? link(item.github_url, 'GitHub ↗') : '', item.live_url ? link(item.live_url, 'Live demo ↗', 'live-link') : ''].filter(Boolean).join(' · ')}</p><ul>${item.bullets.filter(Boolean).map(text => `<li>${emphasize(text)}</li>`).join('')}${item.technologies.length ? `<li class="project-technologies"><strong>Technologies:</strong> ${escape(item.technologies.filter(Boolean).join(', '))}</li>` : ''}</ul></article>`).join('')),
    EXPERIENCE_PAGE_ONE: section('Experience', experience(cv.experience.slice(0, split))),
    EXPERIENCE_PAGE_TWO: section(`Experience${split ? ' <small>(continued)</small>' : ''}`, experience(cv.experience.slice(split))),
    EDUCATION: section('Education', cv.education.map(item => `<article class="entry compact"><div class="entry-heading"><h3>${escape(item.school)}</h3><span>${escape(item.location)}</span></div><div class="entry-subheading"><span>${escape(item.degree)}</span><time>${escape(item.period)}</time></div></article>`).join(''))
  };
  return template.replace(/{{([A-Z_]+)}}/g, (_, key) => replacements[key] || '').replace('href="cv.css"', `href="${escape(stylesheet)}"`).replace('</head>', '<style>.print-toolbar{padding:16px;text-align:center;background:#fff}.print-toolbar button{padding:10px;margin-left:12px;cursor:pointer}@media print{.print-toolbar{display:none}}</style></head>').replace('<body>', '<body><nav class="print-toolbar">Choose Save as PDF; disable browser headers and footers. Review pagination after edits.<button type="button" id="print-cv">Save as PDF / Print</button></nav>');
}
