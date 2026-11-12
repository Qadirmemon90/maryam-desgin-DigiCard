# Boutique Maryam Profile Card - V4.1 Cloudinary Linked

## Cloudinary preset linked
Your screenshot shows upload preset:

```js
uploadPreset: "ml_default"
```

I have already added this in:

```text
js/cloudinary-config.js
```

## You still need Cloud Name
Cloudinary upload URL requires Cloud Name:

```js
window.cloudinaryConfig = {
  cloudName: "PASTE_YOUR_CLOUD_NAME_HERE",
  uploadPreset: "ml_default",
  folder: "boutique-maryam"
};
```

Cloud Name is not visible in your screenshot. You can find it in Cloudinary Dashboard top/left account area.

## Do NOT use API Secret in frontend
The API Secret from your screenshot must not be added to website code.
Only these are needed for unsigned browser upload:

- Cloud Name
- Unsigned Upload Preset

## Domain upload allow
Unsigned upload preset normally works from any domain:
- localhost
- Firebase Hosting
- Netlify
- Vercel
- cPanel
- Shopify page

For safety in Cloudinary preset settings:
- Signing Mode: Unsigned
- Allowed formats: jpg,png,jpeg,webp
- Folder: boutique-maryam
- Max file size limit recommended

## Social Media Icons Added

Public profile mein exact matching SVG style icons added:
- Facebook
- Instagram
- WhatsApp
- TikTok
- Pinterest
- Website

Admin profile settings se in sab ke URLs update ho sakte hain.

## Features
- Cloudinary upload for profile logo
- Cloudinary upload for collection images
- Add collection card
- Edit collection card
- Delete collection card
- Duplicate collection card
- Live/Hidden status
- Featured option

## Firebase Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /links/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Run
```bash
python -m http.server 5500
```

Open:
```text
http://localhost:5500/admin.html
```
# maryam-desgin-DigiCard
