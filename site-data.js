/*
  EAGLE STORE CONTENT HUB
  Update the contact details, stock, prices, and services here. The pages
  automatically pick up the changes—no need to edit each page.
*/
const EAGLE = {
  businessName: "Eagle iPhone Store & Services",
  phoneDisplay: "+27 68 183 6685",
  whatsappNumber: "27681836685",
  address: "Cape Town, Western Cape, South Africa",
  hours: ["Mon–Fri: 08:30–17:30", "Saturday: 09:00–14:00", "Sunday: By appointment"],
  products: [
    { id: "iphone-15", model: "iPhone 15", condition: "New", storage: "128GB", price: 15499, image: "assets/iphone-15-green.png", alt: "Green iPhone 15 front and back" },
    { id: "iphone-14", model: "iPhone 14", condition: "Refurbished", storage: "128GB", price: 10999, image: "assets/iphone-11-black.png", alt: "Black iPhone product placeholder" },
    { id: "iphone-13", model: "iPhone 13", condition: "Used", storage: "128GB", price: 8999, image: "assets/iphone-12-mini.png", alt: "Dark iPhone product placeholder" },
    { id: "iphone-12", model: "iPhone 12", condition: "WiFi-only", storage: "64GB", price: 5499, image: "assets/iphone-12-mini.png", alt: "Dark iPhone product placeholder" },
    { id: "iphone-11", model: "iPhone 11", condition: "Used", storage: "64GB", price: 5999, image: "assets/iphone-11-black.png", alt: "Black iPhone front and back" },
    { id: "iphone-xr", model: "iPhone XR", condition: "WiFi-only", storage: "64GB", price: 3499, image: "assets/iphone-11-black.png", alt: "Black iPhone product placeholder" }
  ],
  repairs: [
    { name: "Screen replacement", icon: "▣", description: "Crisp, responsive screen replacements for cracked or unresponsive displays." },
    { name: "Battery replacement", icon: "◒", description: "Restore all-day confidence with a fresh, high-quality battery." },
    { name: "Charging port repair", icon: "⌁", description: "Reliable charging again—whether the issue is lint, wear, or damage." },
    { name: "Water damage", icon: "◈", description: "Careful diagnostic assessment and treatment after liquid exposure." },
    { name: "Camera repair", icon: "◉", description: "Fix blurry, damaged, or non-working front and rear cameras." },
    { name: "Diagnostics & more", icon: "✦", description: "Speaker, microphone, button and software troubleshooting." }
  ]
};
