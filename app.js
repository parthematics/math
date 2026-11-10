(function () {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const state = { radius: 2, clock: 1, angle: 35, playing: false };
  const controls = { radius: $('#radius'), clock: $('#clock'), angle: $('#angle') };
  const storageKey = 'math-studio-lesson-1-v1';
  const answers = {};
  const questions = {
    clock: { correct: 'speed', options: ['both', 'speed', 'curvature'], explanation: 'Speed = Rω, so doubling ω doubles speed. Curvature = 1/R: the same circle bends just as much per unit distance. The clock cancels.' },
    radius: { correct: 'inverse', options: ['both', 'same', 'inverse'], explanation: 'A larger circle covers more distance per turn: speed = Rω doubles. Its tangent turns more gently per unit distance: curvature = 1/R halves.' },
  };
  let animationId = null;
  let previousTime = null;
  let storageAvailable = true;

  function svgContent(kind, model) {
    const origin = { x: 256, y: 200 };
    const scale = 32;
    const vector = kind === 'velocity' ? model.velocity : model.tangent;
    const color = kind === 'velocity' ? '#315743' : '#b85f36';
    const x = origin.x + model.position.x * scale;
    const y = origin.y - model.position.y * scale;
    const endX = x + vector.x * scale;
    const endY = y - vector.y * scale;
    const grid = [];
    for (let i = -6; i <= 6; i += 1) {
      grid.push(`<line x1="${origin.x + i * scale}" y1="16" x2="${origin.x + i * scale}" y2="384"/><line x1="40" y1="${origin.y + i * scale}" x2="472" y2="${origin.y + i * scale}"/>`);
    }
    return `<title id="${kind}-title">${kind === 'velocity' ? 'Velocity' : 'Unit tangent'} on a circle</title>
      <desc id="${kind}-desc">Radius ${state.radius.toFixed(2)}, point angle ${state.angle.toFixed(0)} degrees, clock rate ${state.clock.toFixed(2)}. The ${kind === 'velocity' ? 'velocity' : 'unit tangent'} arrow has length ${Geometry.magnitude(vector).toFixed(2)}. Curvature ${model.curvature.toFixed(2)}.</desc>
      <defs><marker id="arrow-${kind}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${color}"/></marker></defs>
      <g stroke="#e8ebe2" stroke-width="1">${grid.join('')}</g>
      <g stroke="#d3dacb" stroke-width="1"><line x1="40" y1="200" x2="472" y2="200"/><line x1="256" y1="16" x2="256" y2="384"/></g>
      <g fill="#65735f" font-family="Georgia, serif" font-size="14"><text x="475" y="205">x</text><text x="264" y="22">y</text><text x="241" y="219">0</text></g>
      <circle class="curve-circle" cx="256" cy="200" r="${state.radius * scale}" fill="#ebf0e5" fill-opacity=".35" stroke="#91a483" stroke-width="2"/>
      <line x1="256" y1="200" x2="${x}" y2="${y}" stroke="#acb6a1" stroke-dasharray="4 5" stroke-width="1.5"/>
      <text x="${(256 + x) / 2 + 8}" y="${(200 + y) / 2 + 15}" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#65735f">R</text>
      <line class="vector-arrow" x1="${x}" y1="${y}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="3.5" marker-end="url(#arrow-${kind})"/>
      <circle cx="${x}" cy="${y}" r="6" fill="${color}" stroke="#fffefa" stroke-width="2"/>
      <circle cx="256" cy="200" r="2.5" fill="#91a483"/>`;
  }

  function render() {
    const model = Geometry.circle({ radius: state.radius, angle: state.angle * Math.PI / 180, angularRate: state.clock });
    $('#velocity-plot').innerHTML = svgContent('velocity', model);
    $('#tangent-plot').innerHTML = svgContent('tangent', model);
    $('#radius-value').value = state.radius.toFixed(2);
    $('#clock-value').value = state.clock.toFixed(2);
    $('#angle-value').value = `${state.angle.toFixed(0)}°`;
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
      render();
    }
    previousTime = time;
    animationId = requestAnimationFrame(animate);
  }

  for (const [key, input] of Object.entries(controls)) {
    input.addEventListener('input', () => {
      if (key === 'angle') setPlaying(false);
      state[key] = Number(input.value);
      render();
    });
  }
  $('#play').addEventListener('click', () => setPlaying(!state.playing));
  $('#reset').addEventListener('click', () => {
    setPlaying(false);
    Object.assign(state, { radius: 2, clock: 1, angle: 35 });
    render();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setPlaying(false);
  });

  function showAnswer(question, answer) {
    const config = questions[question];
    const card = document.querySelector(`[data-question="${question}"]`);
    const correct = answer === config.correct;
    for (const button of card.querySelectorAll('[data-answer]')) {
      const selected = button.dataset.answer === answer;
      button.setAttribute('aria-pressed', String(selected));
      button.dataset.result = selected ? (correct ? 'correct' : 'incorrect') : '';
    }
    const feedback = card.querySelector('.feedback');
    feedback.hidden = false;
    feedback.textContent = `${correct ? 'Yes. ' : 'Try the sliders, then reconsider. '}${config.explanation}`;
    $('#attempt-status').textContent = `${Object.keys(answers).length} / 2 predictions explored`;
  }

  function save() {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ notes: $('#notes').value, answers }));
      $('#storage-status').textContent = 'Saved in this browser · not synced';
    } catch {
      storageAvailable = false;
      $('#storage-status').textContent = 'Browser storage is unavailable. Copy your notes before leaving.';
    }
  }

  document.querySelectorAll('[data-question]').forEach((card) => {
    card.querySelectorAll('[data-answer]').forEach((button) => {
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        const question = card.dataset.question;
        answers[question] = button.dataset.answer;
        showAnswer(question, button.dataset.answer);
        save();
      });
    });
  });
  $('#notes').addEventListener('input', save);

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      if (typeof saved.notes === 'string') $('#notes').value = saved.notes;
      for (const question of Object.keys(questions)) {
        const answer = saved.answers && saved.answers[question];
        if (questions[question].options.includes(answer)) answers[question] = answer;
      }
      for (const [question, answer] of Object.entries(answers)) showAnswer(question, answer);
    }
    // A read can succeed even when writes are blocked; test without overwriting saved work.
    const probeKey = `${storageKey}-probe`;
    localStorage.setItem(probeKey, '1');
    localStorage.removeItem(probeKey);
  } catch {
    storageAvailable = false;
    $('#storage-status').textContent = 'Browser storage is unavailable. Copy your notes before leaving.';
  }

  render();
})();
