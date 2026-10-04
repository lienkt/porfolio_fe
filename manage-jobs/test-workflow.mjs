import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {profileFromCV, createPrompt, importResult} from './js/workflow.js';
import {renderAnalysis} from './js/render.js';
const profile = profileFromCV(JSON.parse(readFileSync(new URL('../cv/data.json', import.meta.url))));
const contract = JSON.parse(readFileSync(new URL('./contract.json', import.meta.url)));
const job = {jd: 'We require software engineering experience and teamwork for this position.', title: 'Engineer', company: 'Example'};
const professional = profile.evidence.find(e => e.kind === 'professional').id;
function fixture() {
  return {version: '1', job, profileEvidence: profile.evidence,
    analysis: {roleSummary: {role: '<script>bad</script>', company: null, seniority: null, purpose: 'Build software', summary: 'Engineering role'},
      requirements: [{id: 'r1', requirement: 'Software engineering', priority: 'must_have', jdEvidence: 'software engineering experience'}],
      evidenceMapping: [{requirementId: 'r1', evidenceIds: [professional], match: 'strong'}],
      sellingPoints: [{title: 'Engineering', employerValue: 'Build software', requirementId: 'r1', evidenceIds: [professional]}],
      positioning: {statement: 'Engineer', rationale: 'Professional experience'}, careerStory: 'Career story',
      coverLetterStrategy: {hook: 'Hook', matchPoints: ['Match'], proofPoints: ['Proof'], motivation: 'Motivation', avoidOverclaiming: []}},
    letter: {paragraphs: Array.from({length: 5}, () => ({text: Array(60).fill('word').join(' '), evidenceIds: [professional]}))},
    audit: {unsupportedClaims: [], missingCitations: [], unsupportedCompanyClaims: []}};
}
const parse = (value, current = job) => importResult(JSON.stringify(value), profile, contract, current);
test('prompt includes current CV, original JD and complete output contract', () => {
  const prompt = createPrompt(job, profile, contract);
  assert.ok(prompt.includes(job.jd)); assert.ok(prompt.includes(profile.name));
  assert.ok(prompt.includes('application-result.json')); assert.ok(prompt.includes('profileEvidence'));
});
test('valid result enriches analysis and letter; rendering escapes AI content', () => {
  const result = parse(fixture());
  assert.equal(result.letter.wordCount, 300);
  assert.deepEqual(result.analysis.sellingPoints[0].evidence, [profile.evidence.find(e => e.id === professional)]);
  assert.ok(!renderAnalysis(result.analysis).includes('<script>'));
  assert.ok(renderAnalysis(result.analysis).includes('&lt;script&gt;'));
  assert.equal(parse(fixture(), null).job.jd, job.jd);
});
test('rejects broken JSON, missing fields and oversize input', () => {
  assert.throws(() => importResult('```json {} ```', profile, contract), /Invalid JSON/);
  const value = fixture(); delete value.letter; assert.throws(() => parse(value), /fields/);
  assert.throws(() => importResult(' '.repeat(2000001), profile, contract), /too large/);
});
test('rejects mismatched JD/profile, fabricated quote and evidence IDs', () => {
  for (const mutate of [
    x => x.job = {...job, company: 'Different'},
    x => x.profileEvidence = [],
    x => x.analysis.requirements[0].jdEvidence = 'fabricated quote',
    x => x.analysis.evidenceMapping[0].evidenceIds = ['unknown'],
    x => x.analysis.sellingPoints[0].evidenceIds = ['unknown'],
    x => x.letter.paragraphs[0].evidenceIds = ['unknown'],
    x => x.analysis.evidenceMapping.push(x.analysis.evidenceMapping[0]),
    x => x.analysis.requirements.push(x.analysis.requirements[0]),
    x => x.analysis.evidenceMapping[0].match = 'gap',
    x => x.audit.unsupportedClaims = ['Unsupported claim'],
    x => x.letter.paragraphs[0].text = 'too short'
  ]) {
    const value = fixture(); mutate(value); assert.throws(() => parse(value));
  }
});
test('skill-only strong match is downgraded and shown as gap/risk', () => {
  const value = fixture(), skill = profile.evidence.find(e => e.kind === 'skill').id;
  value.analysis.evidenceMapping[0].evidenceIds = [skill];
  value.analysis.sellingPoints[0].evidenceIds = [skill];
  value.letter.paragraphs.forEach(p => p.evidenceIds = [skill]);
  const result = parse(value);
  assert.equal(result.analysis.evidenceMapping[0].match, 'partial');
  assert.equal(result.analysis.gaps[0].severity, 'manageable');
});
test('citation errors identify location and distinguish unknown, duplicate and unmatched IDs', () => {
  const unknown = fixture(); unknown.letter.paragraphs[0].evidenceIds = ['fake'];
  assert.throws(() => parse(unknown), /letter\.paragraphs\[0\]: IDs not found in the CV: fake/);
  const duplicate = fixture(); duplicate.analysis.evidenceMapping[0].evidenceIds = [professional, professional];
  assert.throws(() => parse(duplicate), /evidenceMapping \(r1\): duplicate evidence IDs/);
  const unmatched = fixture();
  const skill = profile.evidence.find(e => e.kind === 'skill').id;
  unmatched.analysis.sellingPoints[0].evidenceIds = [skill];
  assert.throws(() => parse(unmatched), /sellingPoints \(Engineering\).*exist in the CV but are not matched here/);
});
