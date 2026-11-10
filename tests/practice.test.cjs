'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../practice.js');
const q = P.questions[0];

test('a wrong answer cannot complete practice and a retry is not first-try success', () => {
  const records = P.restore(null);
  records[q.id] = P.check(q, records[q.id], 'both');
  assert.equal(P.complete(records[q.id]), false);
  assert.equal(P.summarize(records).reviewed, 0);
  records[q.id] = P.check(q, records[q.id], q.correct);
  assert.deepEqual(P.summarize(records), { reviewed: 1, independent: 0, assisted: 1, solutions: 0, total: 4 });
});

test('requested hints are recorded and cannot count as independent first-try success', () => {
  const records = P.restore(null);
  records[q.id] = P.hint(q, records[q.id]);
  records[q.id] = P.check(q, records[q.id], q.correct);
  assert.equal(P.summarize(records).independent, 0);
  assert.equal(P.summarize(records).assisted, 1);
  assert.equal(records[q.id].attempts, 1);
});

test('revealing a solution counts as review rather than a correct answer', () => {
  const records = P.restore(null);
  records[q.id] = P.solution(records[q.id]);
  assert.deepEqual(P.summarize(records), { reviewed: 1, independent: 0, assisted: 0, solutions: 1, total: 4 });
  assert.equal(records[q.id].answer, null);
  assert.equal(records[q.id].attempts, 0);
  assert.equal(P.check(q, records[q.id], q.correct), records[q.id]);
});

test('restoring saved practice validates status, choices, attempts, and hint bounds', () => {
  const records = P.restore({
    clock: { status: 'correct', answer: 'both', attempts: 0, hints: 999 },
    calculation: { status: 'correct', answer: 'a', attempts: 1, hints: 0 },
    radius: { status: 'solution', answer: '<script>', attempts: -3, hints: -1 },
    information: 'broken data',
  });
  assert.equal(records.clock.status, 'new');
  assert.equal(records.clock.hints, 2);
  assert.equal(records.radius.answer, null);
  assert.equal(records.radius.attempts, 0);
  assert.deepEqual(P.summarize(records), { reviewed: 2, independent: 1, assisted: 0, solutions: 1, total: 4 });
});

test('completed results stay stable on revisit and checking rejects missing choices', () => {
  const correct = P.check(q, P.emptyRecord(), q.correct);
  assert.equal(P.hint(q, correct), correct);
  assert.equal(P.solution(correct), correct);
  assert.equal(P.check(q, correct, 'both'), correct);
  assert.throws(() => P.check(q, P.emptyRecord(), null), RangeError);
  assert.deepEqual(P.restore({ clock: correct }).clock, correct);
});
