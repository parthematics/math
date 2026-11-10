(function (root) {
  'use strict';

  const questions = [
    {
      id: 'clock', skill: 'Shape and motion',
      prompt: 'A point moves twice as fast around the same circle. Which quantity changes?',
      options: [
        { value: 'curvature', text: 'Curvature only' },
        { value: 'speed', text: 'Speed only' },
        { value: 'both', text: 'Both speed and curvature' },
        { value: 'neither', text: 'Neither speed nor curvature' },
      ],
      correct: 'speed',
      hints: ['Think about playing a video of a circular track at twice the playback speed.', 'Speed is distance per time. Curvature measures how much the tangent turns per distance along the track.'],
      retry: 'Not quite. Separate what describes the motion from what describes the circular track. Try again or ask for a hint.',
      explanation: 'Only speed changes. The circle has the same radius, so its curvature κ = 1/R is unchanged. Moving faster changes the time needed to travel along it.',
    },
    {
      id: 'calculation', skill: 'Using the definitions',
      prompt: 'A circle has radius 3 m. A point travels around it with angular speed 2 rad/s. What are its speed and the circle’s curvature?',
      options: [
        { value: 'a', text: 'Speed: 6 m/s. Curvature: 1/3 m⁻¹.' },
        { value: 'b', text: 'Speed: 2 m/s. Curvature: 1/3 m⁻¹.' },
        { value: 'c', text: 'Speed: 6 m/s. Curvature: 2/3 m⁻¹.' },
        { value: 'd', text: 'Speed: 3 m/s. Curvature: 1/6 m⁻¹.' },
      ],
      correct: 'a',
      hints: ['Angular speed counts radians per second. At a larger radius, each radian covers more distance.', 'Use speed = Rω and curvature = 1/R. Calculate the two quantities separately.'],
      retry: 'Check the two quantities separately. One depends on both radius and angular speed; the other depends on radius alone.',
      explanation: 'Speed is Rω = 3 × 2 = 6 m/s. Curvature is 1/R = 1/3 m⁻¹. The units differ because they measure different things.',
    },
    {
      id: 'radius', skill: 'Changing the shape',
      prompt: 'You double the radius of a circle while keeping the angular speed fixed. What happens?',
      options: [
        { value: 'a', text: 'Speed stays the same. Curvature is halved.' },
        { value: 'b', text: 'Speed and curvature both double.' },
        { value: 'c', text: 'Speed doubles. Curvature is halved.' },
        { value: 'd', text: 'Speed is halved. Curvature doubles.' },
      ],
      correct: 'c',
      hints: ['A complete turn takes the same time, but a larger circle has a longer circumference.', 'Compare Rω with (2R)ω, then compare 1/R with 1/(2R).'],
      retry: 'Keep angular speed fixed. Think about the distance covered in one complete turn, then about which circle bends more tightly.',
      explanation: 'Speed doubles because Rω becomes 2Rω. Curvature is halved because 1/R becomes 1/(2R). A wider circle bends less per unit distance.',
    },
    {
      id: 'information', skill: 'Reasoning from evidence',
      prompt: 'You know a particle is moving around a circle at 6 m/s. Is that enough information to determine the circle’s curvature?',
      options: [
        { value: 'a', text: 'Yes. The curvature must be 1/6 m⁻¹.' },
        { value: 'b', text: 'Yes. All circles have the same curvature.' },
        { value: 'c', text: 'No. A moving particle cannot have curvature.' },
        { value: 'd', text: 'No. Different circles can be traversed at the same speed.' },
      ],
      correct: 'd',
      hints: ['Could a car travel at the same speed on two circular tracks with different radii?', 'A radius of 1 m with angular speed 6 rad/s and a radius of 3 m with angular speed 2 rad/s both give speed 6 m/s. Compare their curvatures.'],
      retry: 'Ask whether the same speed can occur on circles with different radii. A counterexample can settle this.',
      explanation: 'Speed alone is not enough. A 1 m circle at 6 rad/s and a 3 m circle at 2 rad/s both give speed 6 m/s, but their curvatures are 1 m⁻¹ and 1/3 m⁻¹.',
    },
  ];

  function emptyRecord() {
    return { answer: null, attempts: 0, hints: 0, status: 'new' };
  }
  function complete(record) {
    return record.status === 'correct' || record.status === 'solution';
  }
  function check(question, record, answer) {
    if (!question.options.some(option => option.value === answer)) throw new RangeError('Select one of the available answers.');
    if (complete(record)) return record;
    return { ...record, answer, attempts: record.attempts + 1, status: answer === question.correct ? 'correct' : 'trying' };
  }
  function hint(question, record) {
    if (complete(record)) return record;
    return { ...record, hints: Math.min(record.hints + 1, question.hints.length) };
  }
  function solution(record) {
    return complete(record) ? record : { ...record, status: 'solution' };
  }
  function restore(raw) {
    const records = {};
    for (const question of questions) {
      const saved = raw && typeof raw === 'object' ? raw[question.id] : null;
      const record = emptyRecord();
      if (saved && typeof saved === 'object') {
        record.answer = question.options.some(option => option.value === saved.answer) ? saved.answer : null;
        record.attempts = Number.isInteger(saved.attempts) && saved.attempts >= 0 ? Math.min(saved.attempts, 1000000) : 0;
        record.hints = Number.isInteger(saved.hints) && saved.hints >= 0 ? Math.min(saved.hints, question.hints.length) : 0;
        if (saved.status === 'solution') record.status = 'solution';
        else if (saved.status === 'correct' && record.answer === question.correct && record.attempts > 0) record.status = 'correct';
        else if (record.attempts > 0) record.status = 'trying';
      }
      records[question.id] = record;
    }
    return records;
  }
  function summarize(records) {
    const result = { reviewed: 0, independent: 0, assisted: 0, solutions: 0, total: questions.length };
    for (const question of questions) {
      const record = records[question.id] || emptyRecord();
      if (record.status === 'correct') {
        result.reviewed += 1;
        if (record.attempts === 1 && record.hints === 0) result.independent += 1;
        else result.assisted += 1;
      } else if (record.status === 'solution') {
        result.reviewed += 1;
        result.solutions += 1;
      }
    }
    return result;
  }

  const api = Object.freeze({ questions, emptyRecord, complete, check, hint, solution, restore, summarize });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LessonPractice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
