# Alpha Pump Technologies

Static marketing website for **Alpha Pump Technologies** — manufacturer of pumps and motors under the **FINE ALPHA** brand in Coimbatore, India.

## Tech stack

- HTML pages (no framework)
- [Tailwind CSS](https://tailwindcss.com/) — source in `src/input.css`, compiled to `css/styles.css`
- Vanilla JavaScript — shared layout (`js/site.js`), product mind maps (`js/product-mindmap.js`)
- [Sharp](https://sharp.pixelplumbing.com/) — WebP conversion and favicon generation

## Getting started

```bash
npm install
npm run build:css
```

Open `index.html` in a browser, or serve the project root with any static file server:

```bash
npx serve .
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build:css` | Compile and minify Tailwind CSS |
| `npm run watch:css` | Watch `src/input.css` and rebuild CSS on change |
| `npm run generate:favicon` | Generate favicon assets from `assets/favicon.jpg` |
| `npm run landing:webp` | Convert PNG/JPEG images under `assets/` to WebP |
| `npm run build:assets` | Run favicon generation and WebP conversion |

### Favicon

Source image: `assets/favicon.jpg`

Outputs at project root: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-*.png`, `site.webmanifest`

### Images

The site serves **WebP** assets. After adding or replacing source images (PNG/JPEG) in `assets/`, run:

```bash
npm run landing:webp
```

To convert a specific file or folder:

```bash
npm run landing:webp -- assets/landingpage
npm run landing:webp -- assets/jetpumps/pro-1.png
```

## Project structure

```
├── index.html              # Home
├── about-us.html
├── contact-us.html
├── products.html
├── jet-pumps.html
├── monoblock-pump.html
├── submersible-pump.html
├── self-priming-pumps.html
├── assets/                 # Images (WebP) and favicon source
├── css/styles.css          # Compiled CSS (do not edit directly)
├── src/input.css           # Tailwind source
├── js/
│   ├── site.js             # Header, footer, nav, scroll reveal
│   └── product-mindmap.js  # Product detail mind map UI
├── scripts/
│   ├── generate-favicon.mjs
│   └── convert-landing-images.mjs
├── site.config.json        # Site URL and SEO defaults
├── robots.txt
├── sitemap.xml
└── .nojekyll               # GitHub Pages — skip Jekyll processing
```

## SEO and site config

Canonical URLs, Open Graph tags, and `sitemap.xml` use the origin in `site.config.json`. Update `siteOrigin` if the live domain changes, then align meta tags and `sitemap.xml` accordingly.

## Deployment

This is a static site. Deploy the project root (HTML, `css/`, `js/`, `assets/`, favicon files, `robots.txt`, `sitemap.xml`) to any static host (GitHub Pages, Netlify, etc.).

Before deploying:

1. `npm run build:css`
2. `npm run build:assets` (if images or favicon changed)

## License

Private — © Alpha Pump Technologies.
