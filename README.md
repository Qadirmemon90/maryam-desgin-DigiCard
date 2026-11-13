# Maryam's Desgins — Executive Digital Visiting Card & Multi-Brand System

A luxury, modern minimalist digital business identity web application built with HTML5, CSS3, JavaScript (ES6+), Firebase Firestore, and Cloudinary CDN.

---

## Brand Aesthetic & Color Palette
Tailored directly to the official **Maryam's Desgins** emblem (`maryamsdesign.com`):
- **Cinnamon Bronze / Couture Caramel:** `#B6713F` (Primary Brand Accent)
- **Deep Espresso / Cocoa Noir:** `#2A201A` (Primary Typography & Executive Contrast)
- **Champagne Bronze / Foil Gold:** `#D49A6A` (Metallic Halo & Verified Seals)
- **Warm Linen / Pearl Ivory:** `#FAF7F2` (Ambient Canvas)
- **Pure White / Alabaster:** `#FFFFFF` (Card Faces & Elevated Surfaces)

---

## Key Features

### 1. Executive Admin Dashboard & Analytics
- **Live KPI Metrics Grid:**
  - **Total Visitors:** Real-time page view counts.
  - **Unique Clients:** Device and user-level distinct counts.
  - **QR Code Scans:** Camera detections and card flip counts.
  - **Direct Inquiries:** Tracked WhatsApp chats and direct phone calls.
  - **Contact Saves:** Downloaded `.vcf` address book cards.
- **Interactive 7-Day Activity Chart:**
  - Visual SVG timeline displaying daily views vs QR scans.
- **Inquiry Channels & Conversion Breakdown:**
  - Percentage distribution across WhatsApp, vCard, Call, and Share.
  - Device distribution (Mobile vs Desktop).
- **Real-Time Client Activity Stream:**
  - Live event stream showing viewer actions with timestamps and device types.
- **Instant Demo / Admin Bypass Access:**
  - 1-click access to the full admin dashboard from the login screen for testing and review.

### 2. Dynamic Style & Brand Sync from `maryamsdesign.com`
- **Dynamic Sync Engine:**
  - One-click sync button in Admin (`⚡ Sync from maryamsdesign.com`) that automatically extracts and applies the official luxury brand palette, verified identity, contact channels, and boutique typography.
  - Customizable source website URL input and sync scope (Full Style, Colors Only, Content Only).
- **Curated Luxury Presets:**
  - Cinnamon Bronze (Official `maryamsdesign.com`)
  - Espresso Noir (Executive Night)
  - Champagne Gold (Royal Festive)
  - Pure Ivory (Modern Minimalist)

### 3. QR Code Studio & Customizer
- **Payload Selection:**
  - Digital Visiting Card Web Link
  - Direct vCard (Instant Contact Save without opening a browser)
  - Instant WhatsApp Inquiry Link
  - Custom Destination URL
- **Full Visual Customization:**
  - Custom Foreground & Background color pickers with preset swatches.
  - High-res resolution slider (180px – 600px).
  - Margin / Quiet Zone controls.
  - Error correction levels (L, M, Q, H).
  - Maryam's Desgins center monogram logo overlay toggle.
- **Export & Production Tools:**
  - **Apply to Visiting Card Back:** Persists customized QR style to Firestore for all visitors.
  - **Download High-Res PNG:** Ready for graphic designers and printers.
  - **Print Visiting Card Sheet:** Instant printable layout sheet with 3.5" x 2" cutting guides.

### 4. Authentic Digital Visiting Card Experience (`index.html`)
- **Interactive 3D Flippable Card:**
  - **Front Face:** High-definition script logo emblem, verified badge, NFC smart card indicator, brand title, tagline, username badge, primary actions (*Save Contact* & *Share Card*), and quick-touch channels (*Call, WhatsApp, Email, Studio Directions*).
  - **Back Face:** Centered camera-scannable QR code with targeting corners, boutique studio address, operating hours, direct phone number, and digital security token.
  - **3D Parallax Tilt & Specular Sheen:** Dynamic responsive tilt tracking on desktop mouse movement and touch orientation with specular light reflection.
- **Section Tabs:**
  - **Collections:** Real-time stream of boutique collections, high-resolution thumbnails, promotional badges (*New Arrival, Festive Edit, Trending, Bespoke*), and direct WhatsApp order links.
  - **About:** Brand story, artisanal couture heritage, pure fabric certifications, and embroidery highlights.
  - **Services:** Custom Bridal & Formal consultations, Made-to-measure tailoring, and Worldwide Tracked Express Shipping.
  - **Inquiry:** Direct WhatsApp, email, and showroom location.
- **Automatic Event Tracking:**
  - Seamlessly records visits, clicks, and scans into Firestore and local analytics.

### 5. Multi-Brand & Multi-Profile Management
- **100% Backward Compatible:** Preserves all existing Firebase data in `settings/profile` and `links`.
- **Admin Multi-Brand Portal:**
  - Switch active brands in 1 click from the sidebar and topbar dropdown.
  - Create new brands with custom slugs (e.g. `bridal`, `couture`, `lawn`).
  - Configure unique profiles, logos, contact numbers, and collection links per brand.
  - **Shareable Brand URLs:** Each brand gets its own dedicated link:
    - Primary Brand: `index.html`
    - Brand 2: `index.html?brand=bridal`
    - Brand 3: `index.html?brand=couture`
  - **Set as Default Brand:** 1-click button in admin that makes any selected brand the primary default for root visitors (`index.html`).

### 6. Cloudinary CDN Media Hub
- Direct unsigned browser uploads for brand logos and collection cover photos.
- Upload preset: `ml_default`
- Cloud Name: `dis6nrztz`
- Configured in `js/cloudinary-config.js`.

---

## File Structure

```text
├── assets/
│   ├── maryam_logo_refinement.avif   # Official Maryam's Desgins script logo
│   ├── logo.avif                      # AVIF logo asset
│   ├── logo.png                       # Fallback PNG logo asset
│   └── 1.png ... 13.png               # High-res collection photography
├── css/
│   └── style.css                      # Complete custom design system with Dashboard & QR Studio
├── js/
│   ├── app.js                         # Public visiting card logic, dynamic QR & analytics tracker
│   ├── admin.js                       # Admin dashboard, visitor analytics, QR studio & sync controller
│   ├── firebase-config.js             # Firebase project credentials
│   └── cloudinary-config.js           # Cloudinary unsigned upload configuration
├── index.html                         # Public Digital Visiting Card page
├── admin.html                         # Executive Dashboard & Admin portal
└── README.md                          # Documentation
```
