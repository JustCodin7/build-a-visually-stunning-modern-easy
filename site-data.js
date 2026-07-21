/*
  EAGLE STORE CONTENT HUB
  Update the contact details, stock, prices, and services here. The pages
  automatically pick up the changes—no need to edit each page.

  LIVE PRODUCT SHEET (optional)
  --------------------------------
  Paste a published Google Sheet CSV link into `productsSheetUrl` below and
  the site will load the iPhone stock from that sheet automatically on every
  page load — no code edits needed to add/remove/reprice a phone.

  Sheet column headers (first row), any order:
    model | condition | storage | price | image | alt

  - condition: New / Used / Refurbished / WiFi-only
  - price: numbers only, no "R" or commas (e.g. 8999)
  - image: paste the Cloudinary image URL here
  - alt: short text description of the photo (for accessibility)

  How to publish the sheet as CSV:
    1. Google Sheets → File → Share → Publish to web
    2. Under "Link", choose the product sheet/tab and select CSV as the format
    3. Click Publish, copy the generated link, paste it below as productsSheetUrl

  Leave productsSheetUrl as "" to keep using the `products` array below as
  the source of truth (also used automatically as a fallback if the sheet
  can't be reached).
*/
const EAGLE = {
  businessName: "Eagle iPhone Store & Services",
  phoneDisplay: "+27 68 183 6685",
  whatsappNumber: "27681836685",
  address: "Cape Town, Western Cape, South Africa",
  hours: ["Mon–Fri: 08:30–17:30", "Saturday: 09:00–14:00", "Sunday: By appointment"],
  productsSheetUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSs9sgDusqBL0fQjNHTg5KMmJHeGN_uPkx1dOvn0PczloPN5qlQg2KOhEdUsPwMhc2STM0zF2NfONR4/pub?output=csv",
  products: [],
  repairs: [
    { name: "Screen replacement", icon: "▣", description: "Crisp, responsive screen replacements for cracked or unresponsive displays." },
    { name: "Battery replacement", icon: "◒", description: "Restore all-day confidence with a fresh, high-quality battery." },
    { name: "Charging port repair", icon: "⌁", description: "Reliable charging again—whether the issue is lint, wear, or damage." },
    { name: "Water damage", icon: "◈", description: "Careful diagnostic assessment and treatment after liquid exposure." },
    { name: "Camera repair", icon: "◉", description: "Fix blurry, damaged, or non-working front and rear cameras." },
    { name: "Diagnostics & more", icon: "✦", description: "Speaker, microphone, button and software troubleshooting." }
  ]
};