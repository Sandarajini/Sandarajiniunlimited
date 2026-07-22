# Sandarajini Unlimited Website

A modern, mobile‑responsive static website for the transport business **Sandarajini Unlimited**. It showcases the fleet (2 buses, 1 van), provides a booking inquiry form, live status badges, and an admin dashboard (Google Auth placeholder, GPS map placeholder).

## Folder Structure
```
/sandarajiniunlimited/
│   index.html            # Public homepage
│   admin.html            # Manager dashboard (protected)
│   README.md             # Project documentation (this file)
│
└───assets/
    │   style.css         # Global stylesheet
    │   main.js           # Core UI interactions
    │   gallery.js        # Vehicle gallery, tabs, lightbox
    │   auth.js           # Google Auth placeholder logic
    │   images/           # Place image assets here (bus1, bus2, van)
    │       bus1-1.jpg
    │       bus1-2.jpg
    │       bus2-1.jpg
    │       van-1.jpg
    │       ...
```

## Development Setup
1. **Prerequisites** – any modern web browser. No build step required; open `index.html` directly or serve with a static server (e.g., `npx serve`).
2. **Edit assets** – replace placeholder images in `assets/images/` with real photos of your vehicles.
3. **Google Auth** – replace the stub in `auth.js` with your own Google Sign‑In client ID per the Google Identity Services docs.
4. **Map Integration** – add your Google Maps or Leaflet API key inside `admin.html` where the `#map` div is located.

## Deployment
- Host the folder on any static‑site provider (GitHub Pages, Netlify, Vercel, etc.).
- Ensure the `assets/` folder is uploaded alongside the HTML files.

Enjoy the clean, premium look!
