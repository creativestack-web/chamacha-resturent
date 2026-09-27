// Accessibility + contrast audit. Usage: node qa/a11y.cjs
const puppeteer = require("puppeteer-core");
(async () => {
  const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-gpu"], protocolTimeout: 240000 });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await p.goto("http://localhost:3100", { waitUntil: "networkidle0" });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });

  const r = await p.evaluate(() => {
    const lum = (hex) => {
      const c = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const rgbToHex = (rgb) => "#" + rgb.match(/\d+/g).slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
    // flatten半透明 text colour over the opaque background stack
    const flatten = (el) => {
      let node = el, bg = "rgba(0, 0, 0, 0)";
      while (node && node !== document.documentElement) {
        const c = getComputedStyle(node).backgroundColor;
        if (c && c !== "rgba(0, 0, 0, 0)" && !c.includes("0)")) { bg = c; break; }
        node = node.parentElement;
      }
      if (bg === "rgba(0, 0, 0, 0)") bg = "rgb(13, 11, 10)";
      const fg = getComputedStyle(el).color;
      const alpha = Number((fg.match(/[\d.]+/g) || [])[3] ?? 1);
      const [f, g] = [fg.match(/\d+/g).slice(0, 3).map(Number), bg.match(/\d+/g).slice(0, 3).map(Number)];
      const mixed = f.map((v, i) => Math.round(v * alpha + g[i] * (1 - alpha)));
      return [rgbToHex(`rgb(${mixed.join(",")})`), rgbToHex(bg)];
    };
    const textEls = [...document.querySelectorAll("main p, main a, main h1, main h2, main h3, main li, main dd, main dt, main span, footer p, footer a, footer li")].filter((e) => {
      if (!e.textContent.trim() || e.closest(".sr-only") || e.closest('[aria-hidden="true"]')) return false;
      const s = getComputedStyle(e);
      const hasOwnText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      return hasOwnText && s.display !== "none" && e.getBoundingClientRect().width > 0;
    });
    const low = [];
    textEls.forEach((e) => {
      const [fg, bg] = flatten(e);
      const size = parseFloat(getComputedStyle(e).fontSize);
      const bold = Number(getComputedStyle(e).fontWeight) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const c = contrast(fg, bg);
      const min = large ? 3 : 4.5;
      if (c < min) low.push({ t: e.textContent.trim().slice(0, 32), fg, bg, c: Math.round(c * 100) / 100, size, min });
    });
    return {
      headingOutline: [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => h.tagName).join("").slice(0, 80),
      h1Count: document.querySelectorAll("h1").length,
      imgsNoAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
      inputsNoLabel: [...document.querySelectorAll("input,select,textarea")].filter((i) => !i.getAttribute("aria-label") && !i.getAttribute("aria-labelledby") && !(i.id && document.querySelector(`label[for="${i.id}"]`)) && !i.closest("label")).length,
      buttonsNoName: [...document.querySelectorAll("button,a")].filter((e) => !e.textContent.trim() && !e.getAttribute("aria-label")).length,
      landmarks: ["header", "nav", "main", "footer"].filter((t) => !document.querySelector(t)),
      lowContrast: low.slice(0, 10),
      lowContrastCount: low.length,
      textSamples: textEls.length,
      reducedMotionRule: [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((rr) => rr.conditionText?.includes("prefers-reduced-motion")); } catch { return false; } }),
    };
  });

  // keyboard: first Tab should reach the skip link
  await p.keyboard.press("Tab");
  const firstFocus = await p.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 30));
  const focusRing = await p.evaluate(() => {
    const s = getComputedStyle(document.activeElement);
    return { outline: s.outlineStyle + " " + s.outlineWidth, color: s.outlineColor };
  });

  console.log(JSON.stringify({ ...r, firstFocus, focusRing }, null, 1));
  await b.close();
})();
