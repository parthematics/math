# Publishing the learning studio

The learner has requested **GitHub Pages with automatic updates**, as a standing preference. Publish tested site and curriculum updates without asking for the same permission again. Do not claim a deployment succeeded without observing the deployment and checking the live site.

## Build

From the repository root, with Node.js 24 or newer:

```sh
npm ci --ignore-scripts --cache /tmp/math-studio-npm-cache
npm test
```

The test command builds `dist/`. Its `index.html` includes the lab's CSS and JavaScript in one file, so HTML previews do not need to locate companion script and stylesheet files. Open that generated file for a portable lab. Separate pages render the curriculum, first lesson, and placement mathematics using local KaTeX fonts.

`dist/` is generated and ignored by Git. The deployment uploads only `dist/`; personal profile/progress files, browser notes, tests, and repository metadata are excluded. Notes remain in the learner's browser and do not sync between devices.

## One-time GitHub setup

In `parthematics/math`, open **Settings → Pages → Build and deployment**, then choose **GitHub Actions** as the source. Then open **Actions → Publish math studio → Run workflow**, using branch `main` (or rerun a failed deployment). This can also be configured through GitHub's Pages API when repository administration and API network access are available.

The expected default address is `https://parthematics.github.io/math/`. This is an expected address, not proof of a deployment. A repository custom domain or existing Pages configuration may change the final URL; prefer the URL returned by the actual deployment.

## Each update

1. Implement the requested learning/site changes.
2. Run `npm test`. For interaction changes, check the generated site in a browser, including a phone-sized viewport.
3. Commit and push the tested change to `main`. Preserve existing work and never force-push to publish.
4. The **Publish math studio** GitHub Actions workflow builds, tests, and deploys on every push to `main`. It can also be run manually.
5. Observe the workflow result and make a functional request to the live site. Report a failed or unverified deployment accurately.

Use existing GitHub authentication. A successful Git push does not establish API or Pages administration access. If API calls fail at the proxy CONNECT step, resolve network access before asking for credentials. This cloud environment needs `api.github.com` to configure/observe Pages and `parthematics.github.io` to validate the default live URL. These domain additions were saved to the environment draft; draft saving does not apply network changes.

## Local validation

For source development, the original `index.html`, `styles.css`, `geometry.js`, `practice.js`, and `app.js` still work together. For deployed behavior, serve `dist/` with a local static server and check its rendered reading pages as well as the experiment. A local test server is temporary and is not a published website.

The prepared cloud machine also supports `python3 tests/browser_smoke.py`, which checks a project subdirectory, phone layouts, equations, controls, saved notes, denied storage, and an HTML-only preview. It starts and shuts down its own temporary server.

## Deployment access

Pages has been enabled. [Workflow run 42919117144](https://github.com/parthematics/math/actions/runs/42919117144) successfully built and deployed to `https://parthematics.github.io/math/`. The cloud machine's direct API and Pages requests were blocked by its proxy, so deployment status was observed through GitHub's public workflow page. For each new update, verify the matching commit's workflow and make a functional live request when network access permits. Never treat an earlier successful run as evidence for a later change.
