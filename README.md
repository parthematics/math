# Differential geometry

A personal, interactive route into pure mathematics and differential geometry.

Built for a learner with competition mathematics and an electrical engineering degree, at **about four hours per week**. Prior calculus and linear algebra are useful starting points; proof fluency and recall will be checked rather than assumed.

## Start learning

1. Open **[the course](https://parthematics.github.io/math/)**. Follow **Learn → Practice → Review**. For a portable HTML lesson, build the site and open `dist/index.html`; it includes its scripts and styles in one file. The source [index.html](index.html) needs its companion CSS and JavaScript files in the same folder.
2. Read **[Lesson 1: Same circle, different clock](lessons/01-same-circle-different-clock.md)**. Make the predictions before opening the explanations.
3. In a chat with this repository, say: **“Teach me Lesson 1. Ask one question at a time.”** The tutor should wait for your reasoning and adapt the lesson to it.

The [curriculum](CURRICULUM.md) gives the complete learning route. Only the first interactive lab is implemented; later units are plans for tutor-led lessons, not a finished course library.

## The learning rhythm

Each week: two 60-minute lessons, one 90-minute problem/experiment session, and a 30-minute recall session. The 24-week schedule is an estimate, not a deadline. Use the [placement questions](lessons/00-placement.md) to choose where to spend time. Get a taste of geometry before working through prerequisites.

Lessons follow **predict → experiment → explain → prove → transfer**. The goal is to connect a picture to a precise statement and then explain why the statement is true.

- [Learning profile](LEARNING_PROFILE.md): known background and preferences; open questions are marked.
- [Progress](PROGRESS.md): demonstrated understanding and the next learning step. Nothing has been assessed yet.
- [Tutor instructions](AGENTS.md): how to teach from this repository.

## Development

The lab uses plain HTML, CSS, JavaScript, and SVG, with no external requests or runtime dependencies. Practice includes four questions, staged hints, retry feedback, and optional worked solutions. First-try answers, answers after help, and viewed solutions are recorded separately; none automatically establish mastery. Existing notes from the original lab are preserved. Notes and practice are saved in browser local storage when available. They do not sync between browsers or update the repository's progress log.

For local development, optionally run `python3 -m http.server 8000 --bind 127.0.0.1` from this directory. Stop it with Ctrl+C. No running service is required to open the lab as a file.

Build and check the published site with Node.js 24 or newer:

```sh
npm ci --ignore-scripts --cache /tmp/math-studio-npm-cache
npm test
```

The build uses pinned development dependencies to render the written lessons and their equations. The generated website needs no account, backend, analytics, CDN, or running application server. The GitHub Actions workflow republishes it on pushes to `main`; see [publishing](PUBLISHING.md) for the initial Pages setting and verification steps.
