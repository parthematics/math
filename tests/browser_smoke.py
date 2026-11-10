"""Check the built course, teaching flow, persistence, and phone layouts.

Uses the Playwright and Chromium already provided by the cloud environment.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
import json
import math
import shutil

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
KEY = "math-studio-lesson-1-v1"


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


with TemporaryDirectory(prefix="math-course-browser-") as temporary:
    Path(temporary, "math").symlink_to(ROOT / "dist", target_is_directory=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=temporary))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        with sync_playwright() as p:
            options = {"headless": True, "args": ["--no-sandbox"]}
            executable = shutil.which("chromium") or shutil.which("chromium-browser")
            if executable:
                options["executable_path"] = executable
            browser = p.chromium.launch(**options)
            base = f"http://127.0.0.1:{server.server_port}/math/"
            context = browser.new_context(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
            legacy = json.dumps({"notes": "My earlier circle notes.", "answers": {"clock": "speed"}})
            context.add_init_script(f"if (!localStorage.getItem({json.dumps(KEY)})) localStorage.setItem({json.dumps(KEY)}, {json.dumps(legacy)});")
            page = context.new_page()
            errors, requests, bad_responses = [], [], []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("request", lambda request: requests.append(request.url))
            page.on("response", lambda response: bad_responses.append(response.url) if response.status >= 400 else None)
            page.goto(base)
            expect(page.locator('[data-view="learn"]')).to_be_visible()
            expect(page.locator("#speed-value")).to_have_text("2.00")
            expect(page.locator("#curvature-value")).to_have_text("0.50")
            expect(page.locator("#notes")).to_have_value("My earlier circle notes.")
            assert page.locator(".lab").evaluate("(el) => getComputedStyle(el).borderRadius") == "6px"
            expect(page.locator("#play")).to_have_attribute("aria-pressed", "false")
            page.screenshot(path="/tmp/math-redesign-learn.png", full_page=True)

            def slider(name, value):
                page.locator("#" + name).evaluate(
                    "(el, value) => {el.value=value; el.dispatchEvent(new Event('input', {bubbles:true}));}", str(value)
                )

            def vector_length(selector):
                return page.locator(selector).evaluate(
                    "(el) => Math.hypot(el.getAttribute('x2')-el.getAttribute('x1'), el.getAttribute('y2')-el.getAttribute('y1'))"
                )

            original = vector_length("#velocity-plot .vector-arrow")
            tangent = vector_length("#tangent-plot .vector-arrow")
            slider("clock", 2)
            expect(page.locator("#speed-value")).to_have_text("4.00")
            expect(page.locator("#curvature-value")).to_have_text("0.50")
            assert math.isclose(vector_length("#velocity-plot .vector-arrow"), 2 * original)
            assert math.isclose(vector_length("#tangent-plot .vector-arrow"), tangent)
            slider("radius", 1)
            expect(page.locator("#curvature-value")).to_have_text("1.00")
            page.locator("#radius").focus()
            page.keyboard.press("ArrowRight")
            expect(page.locator("#radius")).to_have_value("1.25")
            slider("angle", 0)
            page.locator("#play").click()
            page.wait_for_function("Number(document.querySelector('#angle').value) > 3")
            page.locator('.lesson-steps a[href="#practice"]').click()
            expect(page.locator("#play")).to_have_attribute("aria-pressed", "false")
            expect(page.locator('[data-view="learn"]')).to_be_hidden()
            expect(page.locator('[data-step="practice"]')).to_have_attribute("aria-current", "step")
            expect(page.locator("#check-answer")).to_be_disabled()
            page.screenshot(path="/tmp/math-redesign-practice.png", full_page=True)

            # A wrong answer permits a retry without revealing the full solution.
            page.locator('input[value="curvature"]').check()
            page.locator("#check-answer").click()
            expect(page.locator("#answer-feedback")).to_contain_text("Try again")
            expect(page.locator("#answer-feedback")).not_to_contain_text("Only speed changes")
            expect(page.locator("#practice-count")).to_have_text("0 of 4 reviewed")
            expect(page.locator("#next-question")).to_be_hidden()
            page.locator("#hint-button").click()
            expect(page.locator("#hint-content")).to_contain_text("video")
            page.locator('input[value="speed"]').check()
            page.locator("#check-answer").click()
            expect(page.locator("#answer-feedback")).to_contain_text("Correct")
            expect(page.locator("#practice-count")).to_have_text("1 of 4 reviewed")
            page.locator("#next-question").click()

            # First-try answers and shown solutions have different outcomes.
            expect(page.locator("#question-number")).to_have_text("Question 2 of 4")
            page.locator('input[value="a"]').check()
            page.locator("#check-answer").click()
            page.locator("#next-question").click()
            page.locator("#solution-button").click()
            expect(page.locator("#answer-feedback")).to_contain_text("Solution reviewed")
            expect(page.locator("#practice-count")).to_have_text("3 of 4 reviewed")
            page.locator("#next-question").click()
            page.locator('input[value="d"]').check()
            page.locator("#check-answer").click()
            page.locator("#question-progress button").first.click()
            expect(page.locator('input[value="speed"]')).to_be_disabled()
            expect(page.locator("#practice-count")).to_have_text("4 of 4 reviewed")
            page.locator('[data-step="review"]').click()
            expect(page.locator("#review-results li").nth(0).locator("strong")).to_have_text("2")
            expect(page.locator("#review-results li").nth(1).locator("strong")).to_have_text("1")
            expect(page.locator("#review-results li").nth(2).locator("strong")).to_have_text("1")
            expect(page.locator("#notes")).to_have_value("My earlier circle notes.")
            page.locator("#notes").fill("Curvature measures turning per distance, so it does not depend on the clock.")
            page.reload()
            expect(page.locator('[data-view="review"]')).to_be_visible()
            expect(page.locator("#notes")).to_have_value("Curvature measures turning per distance, so it does not depend on the clock.")
            expect(page.locator("#review-results li").nth(0).locator("strong")).to_have_text("2")
            assert page.evaluate(f"JSON.parse(localStorage.getItem({json.dumps(KEY)})).answers.clock") == "speed"
            page.evaluate("window.scrollTo(0,0)")
            page.screenshot(path="/tmp/math-redesign-review.png", full_page=True)

            for width in (390, 320):
                page.set_viewport_size({"width": width, "height": 844})
                for route in ("learn", "practice", "review", "course", "unit-proofs", "unit-intrinsic", "unit-forms", "unit-stokes", "unit-riemannian", "unit-curvature", "unit-global"):
                    page.goto(base + "#" + route)
                    page.wait_for_function("document.documentElement.scrollWidth <= innerWidth")
                    if route.startswith("unit-"):
                        assert page.locator("#" + route).evaluate("(el) => el.open")
                for filename in ("lesson-1.html", "curriculum.html", "placement.html", "curves-and-surfaces.html", "manifold-preview.html"):
                    page.goto(base + filename)
                    expect(page.locator(".reader h1")).to_be_visible()
                    assert page.locator(".katex").count() > 0
                    page.evaluate("document.fonts.ready")
                    page.wait_for_function("document.documentElement.scrollWidth <= innerWidth")
                page.goto(base + "#learn")
                page.locator("#reset").click()
                if width == 390:
                    page.evaluate("window.scrollTo(0,0)")
                    page.screenshot(path="/tmp/math-redesign-mobile.png", full_page=True)

            # Retaking resets the practice set, never the learner's notes.
            page.goto(base + "#review")
            page.locator("#retake-practice").click()
            expect(page.locator("#practice-count")).to_have_text("0 of 4 reviewed")
            expect(page.locator("#check-answer")).to_be_disabled()
            page.locator('.site-header a[href="#notes"]').click()
            expect(page.locator("#notes")).to_have_value("Curvature measures turning per distance, so it does not depend on the clock.")
            page.locator("#notes").fill("A note is not mastery evidence.")
            expect(page.locator("#review-results")).to_be_hidden()

            # Storage denial and malformed earlier records do not break the lesson.
            for seed in ("blocked", "corrupt"):
                extra = browser.new_context()
                if seed == "blocked":
                    extra.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}})")
                else:
                    extra.add_init_script(f"localStorage.setItem({json.dumps(KEY)}, '{{broken-json');")
                fallback = extra.new_page()
                fallback.on("pageerror", lambda error: errors.append(str(error)))
                fallback.goto(base + "#practice")
                expect(fallback.locator("#storage-status")).to_contain_text("could not be accessed")
                fallback.locator("#solution-button").click()
                expect(fallback.locator("#practice-count")).to_have_text("1 of 4 reviewed")
                fallback.goto(base + "#notes")
                fallback.locator("#notes").fill("Still editable.")
                if seed == "corrupt":
                    assert fallback.evaluate(f"localStorage.getItem({json.dumps(KEY)})") == "{broken-json"

            # A preview with no access to sibling assets still renders and works.
            isolated = context.new_page()
            isolated.on("pageerror", lambda error: errors.append(str(error)))
            isolated.route("**/*", lambda route: route.continue_() if route.request.url == base else route.abort())
            isolated.goto(base)
            expect(isolated.locator("#speed-value")).to_have_text("2.00")
            isolated.locator("#clock").evaluate("(el) => {el.value=2; el.dispatchEvent(new Event('input', {bubbles:true}));}")
            expect(isolated.locator("#speed-value")).to_have_text("4.00")
            assert isolated.locator(".lab").evaluate("(el) => getComputedStyle(el).borderRadius") == "6px"
            assert all(request.startswith(base) for request in requests), requests
            assert not bad_responses, bad_responses
            assert not errors, errors
            browser.close()
            print("PASS: lesson navigation; diagrams; motion and keyboard; retry/hint/solution practice; honest review counts; old-note migration; reload and retake; 320/390px layouts; local math fonts; storage fallback; standalone preview.")
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
