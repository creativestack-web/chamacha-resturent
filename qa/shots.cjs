// Local QA helper: capture section screenshots for visual review.
// Usage: node qa/shots.cjs <width> <outPrefix> <selector1> [selector2 ...]
const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const [w, prefix, ...sels] = process.argv.slice(2);
(async () => {
  const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-gpu"], protocolTimeout: 180000 });
  const p = await b.newPage();
  await p.setViewport({ width: Number(w), height: 900 });
  await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await p.goto("http://localhost:3100", { waitUntil: "networkidle0" });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await new Promise((r) => setTimeout(r, 1200));
  const files = [];
  for (const [i, sel] of sels.entries()) {
    const el = await p.$(sel);
    if (!el) { console.log("MISSING", sel); continue; }
    const box = await el.boundingBox();
    const f = `/tmp/shots/${prefix}-${i}.png`;
    await p.screenshot({ path: f, clip: { x: 0, y: box.y, width: Number(w), height: Math.min(box.height, 4200) } });
    files.push(f);
    console.log("shot", sel, Math.round(box.height));
  }
  if (files.length > 1) {
    const metas = await Promise.all(files.map((f) => sharp(f).metadata()));
    const tw = Number(w) > 800 ? 1000 : 560;
    const scaled = await Promise.all(files.map((f, i) => sharp(f).resize({ width: tw }).toBuffer().then((buf) => ({ buf, h: Math.round((metas[i].height * tw) / metas[i].width) }))));
    await sharp({ create: { width: tw, height: scaled.reduce((a, s) => a + s.h, 0), channels: 3, background: "#000" } })
      .composite(scaled.reduce((acc, s, i) => { acc.out.push({ input: s.buf, top: acc.top, left: 0 }); acc.top += s.h; return acc; }, { out: [], top: 0 }).out)
      .jpeg({ quality: 62 })
      .toFile(`/tmp/shots/${prefix}-stack.jpg`);
    console.log("stacked ->", `/tmp/shots/${prefix}-stack.jpg`);
  }
  await b.close();
})();
