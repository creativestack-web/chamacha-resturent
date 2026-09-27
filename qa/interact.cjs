// Functional + layout QA (no vision required). Usage: node qa/interact.cjs
const puppeteer = require("puppeteer-core");
const results = [];
const ok = (name, pass, extra = "") => { results.push(`${pass ? "PASS" : "FAIL"} — ${name}${extra ? " :: " + extra : ""}`); };

(async () => {
  const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-gpu"], protocolTimeout: 300000 });
  const p = await b.newPage();
  const errors = [];
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
  p.on("pageerror", (e) => errors.push("pageerror: " + String(e).slice(0, 160)));
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await p.goto("http://localhost:3100", { waitUntil: "networkidle0" });

  // 1. Images
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await new Promise((r) => setTimeout(r, 1500));
  const imgs = await p.evaluate(() => {
    const all = [...document.querySelectorAll("img")];
    return { total: all.length, broken: all.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src) };
  });
  ok("all images load", imgs.broken.length === 0, `${imgs.total} images, broken: ${imgs.broken.join(", ")}`);

  // 2. Text overflow inside containers
  const over = await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll("main p, main h1, main h2, main h3, main li, main dd, footer p, footer li").forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && getComputedStyle(el).overflowX === "visible") bad.push(el.tagName + ":" + el.textContent.trim().slice(0, 40));
    });
    return bad.slice(0, 6);
  });
  ok("no clipped text nodes", over.length === 0, over.join(" | "));

  // 3. Nav anchors exist
  const anchors = await p.evaluate(() => ["top", "menu", "about", "specialties", "deals", "gallery", "reviews", "locations", "contact"].filter((id) => !document.getElementById(id)));
  ok("all nav sections exist", anchors.length === 0, "missing: " + anchors.join(","));

  // 4. Header compacts on scroll
  const h0 = await p.evaluate(() => document.querySelector("header > div").getBoundingClientRect().height);
  await p.evaluate(() => window.scrollTo(0, 400));
  await new Promise((r) => setTimeout(r, 700));
  const h1 = await p.evaluate(() => document.querySelector("header > div").getBoundingClientRect().height);
  ok("header compacts on scroll", h1 < h0, `${h0} -> ${h1}`);

  // 5. Sticky mobile order bar (show threshold = 60% of viewport height)
  await p.evaluate(() => window.scrollTo(0, window.innerHeight * 0.9));
  await new Promise((r) => setTimeout(r, 700));
  const bar = await p.evaluate(() => {
    const fixed = [...document.querySelectorAll("div")].find((d) => getComputedStyle(d).position === "fixed" && d.className.includes("bottom-0"));
    return fixed ? getComputedStyle(fixed).transform + " | " + (fixed.textContent.includes("Order Now") ? "has CTA" : "no CTA") : "missing";
  });
  ok("sticky mobile bar visible after scroll", bar.includes("matrix(1, 0, 0, 1, 0, 0)") || bar.includes("none"), bar);

  // 6. Add to cart -> toast + badge
  await p.evaluate(() => document.getElementById("specialties").scrollIntoView());
  await new Promise((r) => setTimeout(r, 400));
  const addBtn = await p.$('#specialties button[aria-label^="Add to Order"]');
  await addBtn.click();
  await new Promise((r) => setTimeout(r, 900));
  const afterAdd = await p.evaluate(() => ({
    toast: document.body.innerText.includes("added"),
    badge: document.querySelector('button[aria-label^="Open your order"]')?.textContent.trim(),
    stored: !!localStorage.getItem("chamcha.cart.v1"),
  }));
  ok("add to cart shows toast + badge + persists", afterAdd.toast && afterAdd.badge === "1" && afterAdd.stored, JSON.stringify(afterAdd));

  // 7. Cart drawer: totals + pickup switch
  await p.click('button[aria-label^="Open your order"]');
  await new Promise((r) => setTimeout(r, 700));
  await p.evaluate(() => document.querySelector('aside[role="dialog"] button[aria-label="Increase quantity"]').click());
  await new Promise((r) => setTimeout(r, 300));
  const subtotal = await p.evaluate(() => {
    const t = document.querySelector('aside[role="dialog"]').innerText;
    const n = (label) => Number((t.match(new RegExp(label + "[^\\d]{0,12}Rs\\.\\s*([\\d,]+)")) || [])[1]?.replace(/,/g, "") || 0);
    return { sub: n("Subtotal"), fee: n("Delivery fee"), total: n("Total") };
  });
  ok("cart totals add up (delivery)", subtotal.sub + subtotal.fee === subtotal.total && subtotal.sub > 0, JSON.stringify(subtotal));

  await p.evaluate(() => [...document.querySelectorAll('aside[role="dialog"] [role="radio"]')].find((b) => b.textContent.includes("Pickup")).click());
  await new Promise((r) => setTimeout(r, 300));
  const pickup = await p.evaluate(() => {
    const t = document.querySelector('aside[role="dialog"]').innerText;
    const n = (label) => Number((t.match(new RegExp(label + "[^\\d]{0,12}Rs\\.\\s*([\\d,]+)")) || [])[1]?.replace(/,/g, "") || 0);
    return { sub: n("Subtotal"), total: n("Total"), label: /Pickup/.test(t) };
  });
  ok("pickup removes delivery fee", pickup.sub === pickup.total && pickup.label, JSON.stringify(pickup));
  await p.evaluate(() => [...document.querySelectorAll('aside[role="dialog"] [role="radio"]')].find((b) => b.textContent.includes("Delivery")).click());
  await new Promise((r) => setTimeout(r, 200));

  // 8. Checkout validation then WhatsApp handoff
  await p.evaluate(() => [...document.querySelectorAll('aside[role="dialog"] button')].find((b) => b.textContent.includes("Proceed to Checkout")).click());
  await new Promise((r) => setTimeout(r, 400));
  const formShown = await p.evaluate(() => !!document.querySelector("#checkout-form"));
  await p.evaluate(() => document.querySelector('button[form="checkout-form"]').click());
  await new Promise((r) => setTimeout(r, 500));
  const blocked = await p.evaluate(() => ({ stillForm: !!document.querySelector("#checkout-form"), invalid: document.querySelectorAll("#checkout-form :invalid").length }));
  ok("checkout form appears and blocks empty submit", formShown && blocked.stillForm && blocked.invalid > 0, JSON.stringify(blocked));

  await p.type("#co-name", "Test Guest");
  await p.type("#co-phone", "03001234567");
  await p.select("#co-area", "0");
  await p.type("#co-address", "12 Test Street, Test Area");
  await p.evaluate(() => { window.__open = null; window.open = (u) => { window.__open = u; return null; }; });
  await p.evaluate(() => document.querySelector('button[form="checkout-form"]').click());
  await new Promise((r) => setTimeout(r, 1400));
  const done = await p.evaluate(() => document.querySelector('aside[role="dialog"]').innerText.replace(/\n+/g, " | ").slice(0, 240));
  const popupUrl = await p.evaluate(() => window.__open || "(no window.open call)");
  ok("order hands off to WhatsApp (never fake-confirmed)", /wa\.me\/923000000000|api\.whatsapp\.com\/send\/\?phone=923000000000/.test(String(popupUrl)) && /WhatsApp/i.test(done), `popup has phone=${/923000000000/.test(String(popupUrl))}, text=${/text=/.test(String(popupUrl))}`);
  await p.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 500));

  // 9. Menu search + category filter
  await p.evaluate(() => document.getElementById("menu").scrollIntoView());
  await p.type("#menu-search", "karahi");
  await new Promise((r) => setTimeout(r, 700));
  const search = await p.evaluate(() => {
    const panel = document.getElementById("menu-results");
    return { count: panel.querySelectorAll("article").length, has: panel.innerText.toLowerCase().includes("karahi") };
  });
  ok("menu search filters dishes", search.count > 0 && search.has, JSON.stringify(search));
  await p.evaluate(() => { const i = document.querySelector("#menu-search"); i.value = ""; i.dispatchEvent(new Event("input", { bubbles: true })); });
  await new Promise((r) => setTimeout(r, 400));
  await p.evaluate(() => [...document.querySelectorAll('[role="tab"]')].find((t) => t.textContent.includes("Desserts")).click());
  await new Promise((r) => setTimeout(r, 700));
  const desserts = await p.evaluate(() => document.getElementById("menu-results").innerText.toLowerCase());
  ok("category filter works", desserts.includes("kheer") && desserts.includes("gulab"), "");

  // 10. Gallery lightbox
  await p.evaluate(() => document.getElementById("gallery").scrollIntoView());
  await new Promise((r) => setTimeout(r, 500));
  await p.evaluate(() => document.querySelector('#gallery button[aria-label^="View larger"]').click());
  await new Promise((r) => setTimeout(r, 700));
  const lb = await p.evaluate(() => !!document.querySelector('div[role="dialog"]') && document.body.style.overflow === "hidden");
  await p.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 600));
  const lbClosed = await p.evaluate(() => document.body.style.overflow !== "hidden");
  ok("gallery lightbox opens and closes", lb && lbClosed, "");

  // 11. Reservation flow
  await p.evaluate(() => document.getElementById("reservations").scrollIntoView());
  await p.type("#rs-name", "Test Guest");
  await p.type("#rs-phone", "03001234567");
  await p.evaluate(() => { const i = document.querySelector("#rs-date"); i.value = new Date(Date.now() + 864e5).toISOString().slice(0, 10); });
  await p.select("#rs-time", "8:00 PM");
  await p.evaluate(() => document.querySelector('#reservations button[type="submit"]').click());
  await new Promise((r) => setTimeout(r, 1400));
  const resv = await p.evaluate(() => document.getElementById("reservations").innerText.replace(/\n+/g, " | "));
  ok("reservation shows honest confirmation state", /ready|received/i.test(resv) && /confirm/i.test(resv), resv.slice(-260).slice(0, 110));

  // 12. Contact form
  await p.evaluate(() => document.getElementById("contact").scrollIntoView());
  await p.type("#ct-name", "Test Guest");
  await p.type("#ct-email", "test@example.com");
  await p.type("#ct-message", "Hello, testing the enquiry form.");
  await p.evaluate(() => document.querySelector('#contact button[type="submit"]').click());
  await new Promise((r) => setTimeout(r, 1400));
  const contact = await p.evaluate(() => document.getElementById("contact").innerText.replace(/\n+/g, " | "));
  ok("contact form confirms handoff", /Message received|message is ready/i.test(contact), contact.slice(-200));

  // 13. Mobile menu
  await p.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  await p.click('button[aria-label="Open menu"]');
  await new Promise((r) => setTimeout(r, 700));
  const menu = await p.evaluate(() => {
    const d = document.getElementById("mobile-nav");
    return { links: d.querySelectorAll("a").length, open: getComputedStyle(d).transform.includes("matrix(1, 0, 0, 1, 0, 0)"), locked: document.body.style.overflow === "hidden" };
  });
  await p.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 600));
  const menuClosed = await p.evaluate(() => getComputedStyle(document.getElementById("mobile-nav")).transform !== "matrix(1, 0, 0, 1, 0, 0)");
  ok("mobile menu opens, locks scroll, Escape closes", menu.links >= 11 && menu.open && menu.locked && menuClosed, JSON.stringify(menu));

  // 14. Contact links well-formed
  const links = await p.evaluate(() => ({
    wa: [...document.querySelectorAll('a[href^="https://wa.me/"]')].length,
    tel: [...document.querySelectorAll('a[href^="tel:"]')].length,
  }));
  ok("WhatsApp + phone links present", links.wa >= 5 && links.tel >= 3, JSON.stringify(links));

  ok("no console/page errors", errors.length === 0, errors.slice(0, 3).join(" | "));

  console.log(results.join("\n"));
  const fails = results.filter((r) => r.startsWith("FAIL")).length;
  console.log(`\n${results.length - fails}/${results.length} checks passed`);
  await b.close();
})().catch((e) => {
  console.log(results.join("\n"));
  console.log("\nSCRIPT ERROR: " + String(e).slice(0, 220));
  process.exit(1);
});
