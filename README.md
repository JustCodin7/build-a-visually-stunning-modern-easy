# Eagle iPhone Store & Services

A fast, no-build static website. Open `index.html` locally or upload the full folder to Netlify, GitHub Pages, cPanel, or any static host.

## Easy client edits

All updateable business data lives in `site-data.js`:

- WhatsApp number and contact information
- iPhone stock, conditions, storage, prices, and images
- Repair services

Replace the images in `assets/` with client photography and update the matching `image`/`alt` values in `site-data.js`. The supplied images are visual placeholders.

## Quote flow

The form does not require a backend. It builds a pre-filled `wa.me` URL for `+27 68 183 6685`, shows a short confirmation, then opens WhatsApp in a new tab.
