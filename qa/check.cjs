// Local QA helper (not part of the website). Usage: node qa/check.cjs [shots]
const puppeteer = require("puppeteer-core");
const shots = process.argv[2] === "shots";
(async () => {
  const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-gpu"], protocolTimeout: 180000 });
  for (const w of [320, 375, 390, 414, 768, 1024, 1440, 1920]) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w < 768 ? 820 : 900 });
    await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await p.goto("http://localhost:3100", { waitUntil: "networkidle0" });
    const r = await p.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const bad = [];
      document.querySelectorAll("header *, main *, footer *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > W + 1) {
          let a = el.parentElement, clip = false;
          while (a && a !== document.body) { if (getComputedStyle(a).overflowX !== "visible") { clip = true; break; } a = a.parentElement; }
          if (!clip) bad.push(el.tagName + " " + String(el.className).slice(0, 70) + " R" + Math.round(r.right));
        }
      });
      const small = [...document.querySelectorAll("main *")].filter((e) => e.childElementCount === 0 && e.textContent.trim() && !e.closest(".sr-only") && parseFloat(getComputedStyle(e).fontSize) < 10).map((e) => e.textContent.trim().slice(0, 20));
      return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 6), small: small.slice(0, 5) };
    });
    console.log(w, JSON.stringify(r));
    if (shots) {
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } window.scrollTo(0, 0); });
      await new Promise((r) => setTimeout(r, 1500));
      await p.screenshot({ path: `/tmp/shots/full-${w}.jpg`, fullPage: true, type: "jpeg", quality: 60 });
    }
    await p.close();
  }
  await b.close();
})();
