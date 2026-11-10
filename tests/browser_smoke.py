"""Exercise the deployed layout using Playwright and a temporary local server.

Requires the Python playwright package and either system Chromium or Playwright's
Chromium installation. The cloud development environment already provides them.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
import math
import shutil

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


with TemporaryDirectory(prefix="math-studio-browser-") as temporary:
    # A project subdirectory catches links that accidentally assume domain root.
    Path(temporary, "math").symlink_to(ROOT / "dist", target_is_directory=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=temporary))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        with sync_playwright() as p:
            executable = shutil.which("chromium") or shutil.which("chromium-browser")
            options = {"headless": True, "args": ["--no-sandbox"]}
            if executable:
                options["executable_path"] = executable
            browser = p.chromium.launch(**options)
            base = f"http://127.0.0.1:{server.server_port}/math/"
            context = browser.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
            page = context.new_page()
            errors, requests, bad_responses = [], [], []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("request", lambda request: requests.append(request.url))
            page.on("response", lambda response: bad_responses.append(response.url) if response.status >= 400 else None)
            page.goto(base)
            expect(page.locator("#speed-value")).to_have_text("2.00")
            expect(page.locator("#curvature-value")).to_have_text("0.50")
            assert page.locator(".lab").evaluate("(el) => getComputedStyle(el).borderRadius") == "12px"

            def slider(name, value):
                page.locator("#" + name).evaluate(
                    "(el, value) => {el.value=value; el.dispatchEvent(new Event('input', {bubbles:true}));}",
                    str(value),
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
            page.locator("#play").click()
            paused = page.locator("#angle").input_value()
            page.evaluate("() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
            assert page.locator("#angle").input_value() == paused
            page.locator("#reset").click()
            expect(page.locator("#speed-value")).to_have_text("2.00")
            page.locator('[data-question="clock"] [data-answer="both"]').click()
            expect(page.locator('[data-question="clock"] .feedback')).to_contain_text("Try the sliders")
            page.locator('[data-question="clock"] [data-answer="speed"]').click()
            page.locator('[data-question="radius"] [data-answer="inverse"]').click()
            expect(page.locator("#attempt-status")).to_have_text("2 / 2 predictions explored")
            page.locator("#notes").fill("Turning per distance, independent of the clock.")
            page.reload()
            expect(page.locator("#notes")).to_have_value("Turning per distance, independent of the clock.")
            expect(page.locator("#attempt-status")).to_have_text("2 / 2 predictions explored")

            for width in (390, 320):
                page.set_viewport_size({"width": width, "height": 844})
                page.wait_for_function("document.documentElement.scrollWidth <= innerWidth")
                slider("clock", 1.5)
                expect(page.locator("#speed-value")).to_have_text("3.00")
                page.locator("#reset").click()
                for filename in ("lesson-1.html", "curriculum.html", "placement.html"):
                    page.goto(base + filename)
                    expect(page.locator(".reader h1")).to_be_visible()
                    assert page.locator(".katex").count() > 0
                    page.evaluate("document.fonts.ready")
                    page.wait_for_function("document.documentElement.scrollWidth <= innerWidth")
                    if filename == "lesson-1.html":
                        page.locator("summary").first.click()
                        assert page.locator("details").first.evaluate("(el) => el.open")
                page.goto(base)

            blocked_context = browser.new_context()
            blocked_context.add_init_script(
                "Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}})"
            )
            blocked = blocked_context.new_page()
            blocked.on("pageerror", lambda error: errors.append(str(error)))
            blocked.goto(base)
            expect(blocked.locator("#storage-status")).to_contain_text("unavailable")
            blocked.locator("#notes").fill("Still editable.")
            blocked.locator('[data-question="clock"] [data-answer="speed"]').click()
            expect(blocked.locator("#attempt-status")).to_have_text("1 / 2 predictions explored")

            # Reproduce an HTML-only preview: deny every sibling asset. The lab
            # should still have its styles and working controls.
            isolated = context.new_page()
            isolated.on("pageerror", lambda error: errors.append(str(error)))
            isolated.route("**/*", lambda route: route.continue_() if route.request.url == base else route.abort())
            isolated.goto(base)
            expect(isolated.locator("#speed-value")).to_have_text("2.00")
            isolated.locator("#clock").evaluate(
                "(el) => {el.value=2; el.dispatchEvent(new Event('input', {bubbles:true}));}"
            )
            expect(isolated.locator("#speed-value")).to_have_text("4.00")
            assert isolated.locator(".lab").evaluate("(el) => getComputedStyle(el).borderRadius") == "12px"
            assert all(request.startswith(base) for request in requests), requests
            assert not bad_responses, bad_responses
            assert not errors, errors
            browser.close()
            print("PASS: built site at /math/, sliders and arrows, motion, keyboard, predictions, saved notes, 320/390px layouts, rendered lessons and local fonts, denied storage, and HTML-only preview.")
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
