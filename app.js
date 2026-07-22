/* Shared layout, catalogue rendering, mobile nav, and no-backend WhatsApp quoting. */
const money = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });
const page = document.body.dataset.page || "";

/* Minimal CSV parser — handles quoted fields and commas inside quotes,
   which Google Sheets uses whenever a cell (e.g. an alt description)
   contains a comma. */
function parseCSV(text) {
  const rows = []; let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ""));
}

function csvToProducts(text) {
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = (r[i] || "").trim());
    if (!obj.model) return null;
    return {
      id: (obj.model || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      model: obj.model,
      condition: obj.condition || "Used",
      storage: obj.storage || "",
      price: Number(String(obj.price).replace(/[^0-9.]/g, "")) || 0,
      image: obj.image || "",
      alt: obj.alt || obj.model
    };
  }).filter(Boolean);
}

/* Loads products from the published Google Sheet if one is configured.
   Falls back silently to the static EAGLE.products array on any error,
   so a bad link or an offline sheet never breaks the site. */
async function loadProducts() {
  if (!EAGLE.productsSheetUrl) return;
  try {
    const sep = EAGLE.productsSheetUrl.includes("?") ? "&" : "?";
    const res = await fetch(`${EAGLE.productsSheetUrl}${sep}cachebust=${Date.now()}`);
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const products = csvToProducts(await res.text());
    if (products.length) EAGLE.products = products;
  } catch (err) {
    console.warn("Could not load live product sheet, using fallback data.", err);
  }
}

function header() {
  const links = [["index.html", "Home", "home"], ["shop.html", "Shop", "shop"], ["repairs.html", "Repairs", "repairs"], ["about.html", "About", "about"], ["contact.html", "Contact", "contact"]];
  return `<header class="site-header"><a class="brand" href="index.html" aria-label="Eagle iPhone Store home"><span class="brand-mark">E</span><span>EAGLE <b>iPHONE</b></span></a><button class="nav-toggle" aria-label="Open navigation" aria-expanded="false">☰</button><nav class="site-nav">${links.map(([url,label,id]) => `<a class="${page === id ? "active" : ""}" href="${url}">${label}</a>`).join("")}<a class="nav-quote" href="${page === "shop" ? "#quote" : "quote.html"}">Get a quote <span>↗</span></a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div><a class="brand brand-footer" href="index.html"><span class="brand-mark">E</span><span>EAGLE <b>iPHONE</b></span></a><p>Premium iPhones. Proper care. Personal service.</p></div><div><p class="footer-label">NEED HELP?</p><a href="https://wa.me/${EAGLE.whatsappNumber}" target="_blank" rel="noopener">WhatsApp ${EAGLE.phoneDisplay}</a><a href="contact.html">Visit & contact us</a></div><div><p class="footer-label">EXPLORE</p><a href="shop.html">Shop iPhones</a><a href="repairs.html">iPhone repairs</a></div><small>© ${new Date().getFullYear()} Eagle iPhone Store & Services. All rights reserved.</small></footer>`;
}

function renderProducts(target, products = EAGLE.products) {
  if (!target) return;
  target.innerHTML = products.map(p => `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.alt}" loading="lazy" decoding="async"><span class="condition ${p.condition.toLowerCase().replace(/[^a-z]/g, "")}">${p.condition}</span></div><div class="product-info"><p class="eyebrow">${p.storage} · Ready to go</p><h3>${p.model}</h3><div class="product-bottom"><strong>${money.format(p.price)}</strong><a href="quote.html?type=buying&item=${encodeURIComponent(p.model + " — " + p.condition + " — " + p.storage)}" aria-label="Request quote for ${p.model}">Get quote <span>↗</span></a></div></div></article>`).join("");
}

function quoteOptions(type) {
  const items = type === "buying" ? EAGLE.products.map(p => `${p.model} — ${p.condition} — ${p.storage}`) : EAGLE.repairs.map(r => r.name);
  return `<option value="" selected disabled>Select ${type === "buying" ? "an iPhone" : "a repair service"}</option>${items.map(i => `<option>${i}</option>`).join("")}`;
}

function setupQuoteForm(form) {
  if (!form) return;
  const type = form.querySelector("[name=quoteType]"), item = form.querySelector("[name=item]"), notice = form.querySelector(".form-notice");
  const grid = form.querySelector(".form-grid");
  const notesField = form.querySelector("[name=notes]").closest(".field");
  notesField.insertAdjacentHTML("beforebegin", `<div class="field" data-device-field><label for="quote-device">Your iPhone model</label><input id="quote-device" name="deviceModel" placeholder="e.g. iPhone 13 Pro" required></div><div class="field"><label for="quote-contact">Best way to reply</label><select id="quote-contact" name="contactMethod"><option>WhatsApp</option><option>Phone call</option><option>Either is fine</option></select></div><div class="field full"><label for="quote-email">Email address <span>(optional)</span></label><input id="quote-email" name="email" type="email" placeholder="you@example.com"></div>`);
  notesField.insertAdjacentHTML("afterend", `<p class="form-helper field full">We use these details only to prepare your WhatsApp enquiry—nothing is stored on this website.</p>`);
  const params = new URLSearchParams(location.search);
  if (params.get("type")) type.value = params.get("type");
  const fillOptions = () => { item.innerHTML = quoteOptions(type.value); const requested = params.get("item"); if (requested) item.value = requested; const deviceField = form.querySelector("[data-device-field]"); const deviceInput = form.querySelector("[name=deviceModel]"); const itemLabel = item.closest(".field").querySelector("label"); const notesLabel = form.querySelector("[name=notes]").closest(".field").querySelector("label"); if (type.value === "buying") { itemLabel.textContent = "Choose an iPhone"; notesLabel.innerHTML = "Anything else? <span>(optional)</span>"; deviceField.querySelector("label").textContent = "Current phone (if trading in)"; deviceInput.placeholder = "Optional — e.g. iPhone 11"; deviceInput.required = false; } else { itemLabel.textContent = "Choose repair type"; notesLabel.innerHTML = "Tell us what happened <span>(optional)</span>"; deviceField.querySelector("label").textContent = "Your iPhone model"; deviceInput.placeholder = "e.g. iPhone 13 Pro"; deviceInput.required = true; } };
  fillOptions(); type.addEventListener("change", fillOptions);
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = encodeURIComponent(`Hello Eagle iPhone Store!\n\nI'd like a quote.\n*Quote for:* ${data.get("quoteType") === "buying" ? "Buying an iPhone" : "iPhone repair"}\n*Selection:* ${data.get("item")}\n*My iPhone:* ${data.get("deviceModel") || "Not applicable"}\n*Name:* ${data.get("name")}\n*Phone:* ${data.get("phone")}\n*Email:* ${data.get("email") || "Not provided"}\n*Preferred reply:* ${data.get("contactMethod")}\n*Notes:* ${data.get("notes") || "None"}`);
    notice.hidden = false; notice.textContent = "Redirecting to WhatsApp…";
    setTimeout(() => window.open(`https://wa.me/${EAGLE.whatsappNumber}?text=${message}`, "_blank", "noopener"), 650);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const refresh = document.createElement("link"); refresh.rel = "stylesheet"; refresh.href = "refresh.css"; document.head.append(refresh);
  const formStyles = document.createElement("link"); formStyles.rel = "stylesheet"; formStyles.href = "form-enhancements.css"; document.head.append(formStyles);
  const performanceStyles = document.createElement("link"); performanceStyles.rel = "stylesheet"; performanceStyles.href = "performance-boost.css"; document.head.append(performanceStyles);
  // Ensure a favicon is present for all pages (falls back to the SVG in assets/)
  if (!document.querySelector('link[rel="icon"]')) {
    const fav = document.createElement('link');
    fav.rel = 'icon';
    fav.href = 'assets/favicon.svg';
    fav.type = 'image/svg+xml';
    document.head.append(fav);
  }
  document.querySelector("#header").innerHTML = header(); document.querySelector("#footer").innerHTML = footer();
  const navButton = document.querySelector(".nav-toggle"), nav = document.querySelector(".site-nav");
  navButton?.addEventListener("click", () => { const open = nav.classList.toggle("open"); navButton.setAttribute("aria-expanded", open); });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    if (window.innerWidth <= 840) {
      nav.classList.remove("open");
      navButton?.setAttribute("aria-expanded", "false");
    }
  }));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) {
      nav?.classList.remove("open");
      navButton?.setAttribute("aria-expanded", "false");
    }
  });
  await loadProducts();
  renderProducts(document.querySelector("[data-products]"), page === "home" ? EAGLE.products.slice(0, 3) : EAGLE.products);
  setupQuoteForm(document.querySelector("[data-quote-form]"));
  if (page === "shop") setupShop();
  if (page === "repairs") renderRepairs();
  document.querySelectorAll("[data-phone]").forEach(el => el.textContent = EAGLE.phoneDisplay);
  document.querySelectorAll(".brand").forEach(brand => brand.innerHTML = `<span class="brand-mark" aria-hidden="true"><i></i><i></i></span><span class="brand-name">Eagle <b>iPhone</b><small>STORE & SERVICES</small></span>`);
  if (page === "home") document.querySelector(".hero .kicker").textContent = "Cape Town's iPhone specialists";
  if (page === "contact") { const details = document.querySelectorAll(".contact-card dd"); if (details[1]) details[1].textContent = EAGLE.address; const map = document.querySelector(".map-placeholder p"); if (map) map.innerHTML = `Cape Town, Western Cape<br><strong>Map location placeholder</strong>`; }
});

function setupShop() {
  const filter = document.querySelector("#condition-filter"), sort = document.querySelector("#sort-products"), grid = document.querySelector("[data-products]");
  function update() { let list = EAGLE.products.filter(p => filter.value === "all" || p.condition === filter.value); if (sort.value === "low") list.sort((a,b)=>a.price-b.price); if (sort.value === "high") list.sort((a,b)=>b.price-a.price); renderProducts(grid, list); }
  filter.addEventListener("change", update); sort.addEventListener("change", update);
}
function renderRepairs() { const grid = document.querySelector("[data-repairs]"); if (grid) grid.innerHTML = EAGLE.repairs.map(r => `<article class="repair-card"><span class="repair-icon">${r.icon}</span><h3>${r.name}</h3><p>${r.description}</p><a href="quote.html?type=repair&item=${encodeURIComponent(r.name)}">Get a quote <span>↗</span></a></article>`).join(""); }