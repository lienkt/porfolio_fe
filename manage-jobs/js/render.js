// All model and user text is escaped before insertion into HTML.
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = { must_have: 'Must Have', important: 'Important', nice_to_have: 'Nice to Have', strong: 'Strong', partial: 'Partial', gap: 'Gap', critical: 'Critical', manageable: 'Manageable', minor: 'Minor' };
const badge = value => `<span class="badge ${escape(value)}">${escape(labels[value] || value)}</span>`;
const list = values => `<ul>${values.map(v => `<li>${escape(v)}</li>`).join('')}</ul>`;
export const evidence = facts => facts.length ? facts.map(e => `<div class="evidence"><small>${escape(e.id)} · ${escape(e.kind)} · ${escape(e.source)}</small>${escape(e.text)}</div>`).join('') : '<span class="muted">No evidence found</span>';
const card = (title, body, extra = '') => `<section class="card ${extra}"><h2>${escape(title)}</h2>${body}</section>`;

export function renderAnalysis(a) {
  const role = a.roleSummary;
  const counts = ['strong', 'partial', 'gap'].map(type => `${badge(type)} ${a.evidenceMapping.filter(m => m.match === type).length}`);
  return card('Role Summary', `<div class="metadata">${escape(role.company || 'Company not specified')} · ${escape(role.seniority || 'Seniority not specified')}</div><h3 class="role-title">${escape(role.role)}</h3><p><strong>${escape(role.purpose)}</strong></p><p>${escape(role.summary)}</p><div class="counts">${counts.map(c => `<span>${c}</span>`).join('')}</div>`)
    + card('Hiring Priorities', `<div class="priority-grid">${['must_have','important','nice_to_have'].map(p => `<div>${badge(p)}${a.requirements.filter(r => r.priority === p).map(r => `<div class="priority-item"><strong>${escape(r.requirement)}</strong><div class="quote">“${escape(r.jdEvidence)}”</div></div>`).join('') || '<p class="muted">None identified</p>'}</div>`).join('')}</div>`)
    + card('Requirement → Evidence Mapping', `<div class="table-wrap"><table><thead><tr><th>Requirement</th><th>Priority</th><th>CV Evidence</th><th>Match</th></tr></thead><tbody>${a.evidenceMapping.map(m => `<tr><td>${escape(m.requirement)}</td><td>${badge(m.priority)}</td><td>${evidence(m.candidateEvidence)}</td><td>${badge(m.match)}</td></tr>`).join('')}</tbody></table></div>`)
    + card('Strongest Selling Points', a.sellingPoints.map((p,i) => `<article class="selling-point"><h3>${i+1}. ${escape(p.title)}</h3><p>${escape(p.employerValue)}</p>${evidence(p.evidence)}<div class="metadata">Relevant requirement: ${escape(p.relatedRequirement)}</div></article>`).join('') || '<p>No supported selling points found for this role.</p>')
    + card('Gaps / Risks', a.gaps.map(g => `<article class="gap-item">${badge(g.severity)} <strong>${escape(g.requirement)}</strong><p>${escape(g.explanation)}</p></article>`).join('') || '<p>No gaps identified in the extracted requirements.</p>')
    + card('Candidate Positioning', `<p><strong>${escape(a.positioning.statement)}</strong></p><p>${escape(a.positioning.rationale)}</p>`, 'positioning')
    + card('Career Story / Why This Role Makes Sense', `<p>${escape(a.careerStory)}</p>`)
    + card('Recommended Cover Letter Strategy', [
      ['Hook', escape(a.coverLetterStrategy.hook)], ['Match', list(a.coverLetterStrategy.matchPoints)],
      ['Proof', list(a.coverLetterStrategy.proofPoints)], ['Company motivation', escape(a.coverLetterStrategy.motivation)],
      ['Avoid overclaiming', list(a.coverLetterStrategy.avoidOverclaiming)]
    ].map(([title, body]) => `<div class="strategy-row"><strong>${title}</strong><div>${body}</div></div>`).join(''));
}
