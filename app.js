(function () {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const P = LessonPractice;
  const state = { radius: 2, clock: 1, angle: 35, playing: false };
  const controls = { radius: $('#radius'), clock: $('#clock'), angle: $('#angle') };
  // Keep the existing key so notes from the original lab survive the redesign.
  const storageKey = 'math-studio-lesson-1-v1';
  let savedData = {};
  let records = P.restore(null);
  let selectedAnswers = {};
  let questionIndex = 0;
  let storageAvailable = true;
  let animationId = null;
  let previousTime = null;

  function readSavedWork() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid saved work');
        savedData = parsed;
      }
      if (typeof savedData.notes === 'string') $('#notes').value = savedData.notes;
      records = P.restore(savedData.practice);
      if (Number.isInteger(savedData.practiceIndex)) questionIndex = Math.max(0, Math.min(savedData.practiceIndex, P.questions.length - 1));
      for (const question of P.questions) selectedAnswers[question.id] = records[question.id].answer;
      const probeKey = storageKey + '-probe';
      localStorage.setItem(probeKey, '1');
      localStorage.removeItem(probeKey);
    } catch {
      storageAvailable = false;
      $('#storage-status').textContent = 'Saved work could not be accessed. Copy your notes before leaving.';
    }
  }

  function save() {
    if (!storageAvailable) return;
    try {
      savedData = { ...savedData, schema: 2, notes: $('#notes').value, practice: records, practiceIndex: questionIndex };
      localStorage.setItem(storageKey, JSON.stringify(savedData));
      $('#storage-status').textContent = 'Saved in this browser · not synced';
    } catch {
      storageAvailable = false;
      $('#storage-status').textContent = 'Browser storage is unavailable. Copy your notes before leaving.';
    }
  }

  function svgContent(kind, model) {
    const center = 200;
    const positionScale = 52;
    const arrowScale = 25;
    const vector = kind === 'velocity' ? model.velocity : model.tangent;
    const color = kind === 'velocity' ? '#1865f2' : '#087f68';
    const x = center + model.position.x * positionScale;
    const y = center - model.position.y * positionScale;
    const endX = x + vector.x * arrowScale;
    const endY = y - vector.y * arrowScale;
    const grid = [];
    for (let i = -3; i <= 3; i += 1) {
      const point = center + i * positionScale;
      grid.push(`<line x1="${point}" y1="12" x2="${point}" y2="388"/><line x1="12" y1="${point}" x2="388" y2="${point}"/>`);
    }
    return `<title id="${kind}-title">${kind === 'velocity' ? 'Velocity' : 'Unit tangent'} on a circle</title>
      <desc id="${kind}-desc">Radius ${state.radius.toFixed(2)} metres, angle ${state.angle.toFixed(0)} degrees, angular speed ${state.clock.toFixed(2)} radians per second. Arrow magnitude ${Geometry.magnitude(vector).toFixed(2)}. Curvature ${model.curvature.toFixed(2)} per metre.</desc>
      <defs><marker id="arrow-${kind}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${color}"/></marker></defs>
      <g stroke="#edf0f4" stroke-width="1">${grid.join('')}</g>
      <g stroke="#d7dde5"><line x1="12" y1="200" x2="388" y2="200"/><line x1="200" y1="12" x2="200" y2="388"/></g>
      <g fill="#697386" font-family="system-ui, sans-serif" font-size="12"><text x="383" y="217">x</text><text x="210" y="20">y</text><text x="185" y="218">0</text></g>
      <circle class="curve-circle" cx="200" cy="200" r="${state.radius * positionScale}" fill="#f8fbff" stroke="#99adc8" stroke-width="2"/>
      <line x1="200" y1="200" x2="${x}" y2="${y}" stroke="#a0acbd" stroke-dasharray="4 5" stroke-width="1.5"/>
      <text x="${(200 + x) / 2 + 7}" y="${(200 + y) / 2 + 16}" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#5d6470">R</text>
      <line class="vector-arrow" x1="${x}" y1="${y}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="3.5" marker-end="url(#arrow-${kind})"/>
      <circle cx="${x}" cy="${y}" r="6" fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="200" cy="200" r="2.5" fill="#8090a6"/>`;
  }

  function renderLab() {
    const model = Geometry.circle({ radius: state.radius, angle: state.angle * Math.PI / 180, angularRate: state.clock });
    $('#velocity-plot').innerHTML = svgContent('velocity', model);
    $('#tangent-plot').innerHTML = svgContent('tangent', model);
    $('#radius-value').value = state.radius.toFixed(2) + ' m';
    $('#clock-value').value = state.clock.toFixed(2) + ' rad/s';
    $('#angle-value').value = state.angle.toFixed(0) + '°';
    $('#speed-value').textContent = model.speed.toFixed(2);
    $('#tangent-value').textContent = Geometry.magnitude(model.tangent).toFixed(2);
    $('#curvature-value').textContent = model.curvature.toFixed(2);
    for (const [key, input] of Object.entries(controls)) input.value = state[key];
  }

  function setPlaying(playing) {
    state.playing = playing;
    $('#play').textContent = playing ? 'Pause motion' : 'Play motion';
    $('#play').setAttribute('aria-pressed', String(playing));
    cancelAnimationFrame(animationId);
    previousTime = null;
    if (playing) animationId = requestAnimationFrame(animate);
  }

  function animate(time) {
    if (!state.playing) return;
    if (previousTime !== null) {
      const elapsed = Math.min((time - previousTime) / 1000, 0.1);
      state.angle = (state.angle + state.clock * elapsed * 180 / Math.PI) % 360;
      renderLab();
    }
    previousTime = time;
    animationId = requestAnimationFrame(animate);
  }

  function feedback(title, text, result) {
    const panel = $('#answer-feedback');
    panel.replaceChildren();
    const heading = document.createElement('strong');
    heading.textContent = title;
    const description = document.createElement('span');
    description.textContent = text;
    panel.append(heading, description);
    panel.dataset.result = result;
    panel.hidden = false;
  }

  function updateProgress() {
    const summary = P.summarize(records);
    $('#practice-count').textContent = summary.reviewed + ' of ' + summary.total + ' reviewed';
    $('#sidebar-progress').textContent = 'Practice · ' + summary.reviewed + ' of ' + summary.total + ' reviewed';
    $('#course-practice-progress').textContent = summary.reviewed + ' of ' + summary.total + ' practice questions reviewed';
    $('#question-progress').replaceChildren();
    P.questions.forEach((question, index) => {
      const record = records[question.id];
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(index + 1);
      button.dataset.result = record.status;
      const label = record.status === 'correct' ? 'answered correctly' : record.status === 'solution' ? 'solution reviewed' : 'not yet completed';
      button.setAttribute('aria-label', 'Question ' + (index + 1) + ': ' + label);
      if (index === questionIndex) button.setAttribute('aria-current', 'step');
      button.addEventListener('click', () => changeQuestion(index));
      $('#question-progress').append(button);
    });
    renderReview(summary);
  }

  function renderQuestion() {
    const question = P.questions[questionIndex];
    const record = records[question.id];
    const completed = P.complete(record);
    $('#question-number').textContent = 'Question ' + (questionIndex + 1) + ' of ' + P.questions.length;
    $('#question-skill').textContent = question.skill;
    $('#question-prompt').textContent = question.prompt;
    $('#answer-options').replaceChildren();
    for (const option of question.options) {
      const label = document.createElement('label');
      label.className = 'answer-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = option.value;
      input.checked = selectedAnswers[question.id] === option.value;
      input.disabled = completed;
      if (completed && option.value === question.correct) label.dataset.correct = 'true';
      const text = document.createElement('span');
      text.textContent = option.text;
      label.append(input, text);
      $('#answer-options').append(label);
    }
    $('#check-answer').hidden = completed;
    $('#check-answer').disabled = !selectedAnswers[question.id];
    $('#hint-button').hidden = completed;
    $('#hint-button').disabled = record.hints >= question.hints.length;
    $('#hint-button').textContent = record.hints ? 'Get another hint' : 'Get a hint';
    $('#solution-button').hidden = completed;
    $('#hint-panel').hidden = record.hints === 0;
    $('#hint-content').replaceChildren();
    for (const text of question.hints.slice(0, record.hints)) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      $('#hint-content').append(paragraph);
    }
    $('#answer-feedback').hidden = true;
    if (record.status === 'correct') feedback('Correct', question.explanation, 'correct');
    else if (record.status === 'solution') feedback('Solution reviewed', question.explanation, 'solution');
    else if (record.status === 'trying') feedback('Try again', question.retry, 'trying');
    $('#previous-question').disabled = questionIndex === 0;
    $('#next-question').hidden = !completed;
    $('#next-question').textContent = questionIndex === P.questions.length - 1 ? 'See lesson review →' : 'Next question →';
    updateProgress();
  }

  function renderReview(summary) {
    const allReviewed = summary.reviewed === summary.total;
    $('#review-message').textContent = summary.reviewed === 0
      ? 'Start the practice questions to check your understanding.'
      : allReviewed
        ? 'You have reviewed all four questions. Use the explanation below to check what you can recall without help.'
        : 'You have reviewed ' + summary.reviewed + ' of ' + summary.total + ' questions. You can return to practice at any time.';
    $('#review-results').hidden = summary.reviewed === 0;
    const list = document.createElement('ul');
    for (const [label, count] of [
      ['Correct on the first try, without hints', summary.independent],
      ['Correct after a hint or another attempt', summary.assisted],
      ['Reviewed by showing the solution', summary.solutions],
    ]) {
      const item = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = label;
      const value = document.createElement('strong');
      value.textContent = count;
      item.append(text, value);
      list.append(item);
    }
    $('#review-results').replaceChildren(list);
    $('#review-action').replaceChildren();
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'button ' + (allReviewed ? 'secondary' : 'primary');
    action.id = allReviewed ? 'retake-practice' : 'resume-practice';
    action.textContent = allReviewed ? 'Retake practice' : summary.reviewed ? 'Continue practice' : 'Start practice';
    action.addEventListener('click', () => {
      if (allReviewed) {
        records = P.restore(null);
        selectedAnswers = {};
        questionIndex = 0;
      } else {
        questionIndex = P.questions.findIndex(question => !P.complete(records[question.id]));
      }
      renderQuestion();
      save();
      location.hash = 'practice';
    });
    $('#review-action').append(action);
  }

  function changeQuestion(index) {
    questionIndex = index;
    renderQuestion();
    save();
    $('#question-prompt').focus({ preventScroll: true });
  }

  function route(initial = false) {
    const hash = location.hash.slice(1);
    if (hash === 'main') { $('#main').focus(); return; }
    const aliases = { experiment: 'learn', predictions: 'practice', 'learning-path': 'course', notebook: 'review', notes: 'review' };
    const isUnit = hash.startsWith('unit-') && document.getElementById(hash);
    const view = isUnit ? 'course' : aliases[hash] || (['course', 'learn', 'practice', 'review'].includes(hash) ? hash : 'learn');
    if (view !== 'learn') setPlaying(false);
    $('#lesson-shell').hidden = view === 'course';
    document.querySelectorAll('[data-view]').forEach(section => { section.hidden = section.dataset.view !== view; });
    document.querySelectorAll('[data-nav], [data-step]').forEach(link => {
      if ((link.dataset.nav || link.dataset.step) === view) link.setAttribute('aria-current', link.dataset.step ? 'step' : 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = view === 'course' ? 'Differential geometry · Math' : 'Speed and curvature · ' + view[0].toUpperCase() + view.slice(1);
    if (!initial) window.scrollTo(0, 0);
    if (isUnit) {
      isUnit.open = true;
      isUnit.querySelector('summary').focus({ preventScroll: true });
      isUnit.scrollIntoView({ block: 'start' });
    } else if (hash === 'notes' || hash === 'notebook') {
      $('#notes').focus();
    } else if (!initial && view === 'practice') {
      $('#question-prompt').focus({ preventScroll: true });
    } else if (!initial) {
      $('#main').focus({ preventScroll: true });
    }
  }

  for (const [key, input] of Object.entries(controls)) {
    input.addEventListener('input', () => {
      if (key === 'angle') setPlaying(false);
      state[key] = Number(input.value);
      renderLab();
    });
  }
  $('#play').addEventListener('click', () => setPlaying(!state.playing));
  $('#reset').addEventListener('click', () => {
    setPlaying(false);
    Object.assign(state, { radius: 2, clock: 1, angle: 35 });
    renderLab();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) setPlaying(false); });
  $('#answer-options').addEventListener('change', event => {
    if (!event.target.matches('input[name="answer"]')) return;
    const question = P.questions[questionIndex];
    selectedAnswers[question.id] = event.target.value;
    $('#check-answer').disabled = false;
    $('#answer-feedback').hidden = true;
  });
  $('#practice-form').addEventListener('submit', event => {
    event.preventDefault();
    const question = P.questions[questionIndex];
    const answer = selectedAnswers[question.id];
    if (!answer || P.complete(records[question.id])) return;
    records[question.id] = P.check(question, records[question.id], answer);
    renderQuestion();
    save();
    if (P.complete(records[question.id])) $('#next-question').focus({ preventScroll: true });
    else $('#check-answer').focus({ preventScroll: true });
  });
  $('#hint-button').addEventListener('click', () => {
    const question = P.questions[questionIndex];
    records[question.id] = P.hint(question, records[question.id]);
    renderQuestion();
    save();
    $('#hint-panel').focus({ preventScroll: false });
  });
  $('#solution-button').addEventListener('click', () => {
    const question = P.questions[questionIndex];
    records[question.id] = P.solution(records[question.id]);
    renderQuestion();
    save();
    $('#next-question').focus({ preventScroll: true });
  });
  $('#previous-question').addEventListener('click', () => changeQuestion(Math.max(0, questionIndex - 1)));
  $('#next-question').addEventListener('click', () => {
    if (questionIndex === P.questions.length - 1) location.hash = 'review';
    else changeQuestion(questionIndex + 1);
  });
  $('#notes').addEventListener('input', save);
  window.addEventListener('hashchange', () => route());

  readSavedWork();
  renderLab();
  renderQuestion();
  route(true);
})();
