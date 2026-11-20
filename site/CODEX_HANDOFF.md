# Deploy brief: Lensho Capital website (for Codex or any engineer)

> **中文摘要：** 本文件写给负责上线的工程师或 Codex。网站是纯静态文件，没有构建依赖，只需 Python 3。上线时必须保留现有的 `/platform`（合作平台登录）、`/calculators/refinance`（再融资计算器）和 `/api/*`，不能改动或覆盖。文末的验收清单逐项通过后才算完成。

## 1. What this is

A complete static rebuild of lensho.com, with six pages, bilingual EN/中文 content and no framework or runtime dependencies.

| Route | Source | Purpose |
|---|---|---|
| `/` | `src/index.html` | Homepage: cinematic hero, OZ 2.0 band, philosophy, focus, process, renovation experience, tools, partnerships, insights, contact form |
| `/opportunity-zones` | `src/opportunity-zones.html` | OZ 2.0 hub: countdown, scroll timeline, calculator, 180-day window, fit check, improvement planner, map, key dates, 1.0 vs 2.0, glossary, FAQ |
| `/oz-guide` | `src/oz-guide.html` | Long-form OZ 2.0 investor guide |
| `/how-we-work` | `src/how-we-work.html` | Partner roles and checklists, six stages, platform |
| `/disclosures` | `src/disclosures.html` | Disclosures, privacy and terms |
| 404 | `src/404.html` | Not-found page (root-relative links) |

**Out of scope, and must stay as they are:** `/platform` (sign-in partner platform), `/calculators/refinance` (server-calculated tool) and `/api/*`. The new pages link to them.

## 2. Build

```bash
cd site
python3 build.py --clean-urls
```

The output goes to `site/dist-lensho/` and `site/lensho-site.zip`. All internal links are extensionless (`/opportunity-zones`) and asset paths are root-relative (`/assets/...`). The build fails if any local link or image is missing.

`python3 build.py` without the flag writes the portable `site/dist/`, which uses relative `.html` links and is used for previews.

Edit sources only in `site/src/` (pages), `site/src/partials/` (shared head, header and footer), `site/assets/` and `site/public/`. Never edit `dist*/` by hand.

## 3. Deploy: choose the option that fits the current hosting

The live site is a vinext/Next-style app (assets under `/_next/`, images under `/images/`), served behind Cloudflare.

### Option A: inside the existing app (preferred if /platform and the refinance tool live in the same app)
1. Copy `dist-lensho/assets/` to the app's `public/assets/`. This adds new paths only and does not collide with `/_next` or `/images`.
2. Copy `opportunity-zones.html`, `oz-guide.html`, `how-we-work.html` and `disclosures.html` into `public/`, and add rewrites so the extensionless routes serve them. In a Next-style app:
   ```js
   // next.config.js (or the vinext equivalent)
   async rewrites() { return [
     { source: '/opportunity-zones', destination: '/opportunity-zones.html' },
     { source: '/oz-guide',          destination: '/oz-guide.html' },
     { source: '/how-we-work',       destination: '/how-we-work.html' },
     { source: '/disclosures',       destination: '/disclosures.html' },
   ]; }
   ```
3. Homepage: replace the current `/` page with `dist-lensho/index.html`, either served the same way through a rewrite of `/` → `/index.html`, or by porting the markup into the root page component. Keep the existing root layout only if it adds nothing visible. The new page brings its own header and footer.
4. Merge `public/robots.txt`, `public/sitemap.xml` and `public/site.webmanifest` with the app's existing files. The sitemap already lists `/platform` and `/calculators/refinance`. Apply the `_headers` rules if the host supports them (Cloudflare Pages and Netlify do).
5. Optionally port the pages to React components later. The markup is plain HTML; `assets/js/*.js` are framework-free IIFEs that can be loaded with `<Script strategy="afterInteractive">`.

### Option B: static host for the marketing pages, with the app keeping its routes
Deploy `dist-lensho/` to Cloudflare Pages (or any static host). Cloudflare Pages serves `/opportunity-zones` from `opportunity-zones.html` automatically. Then route `/platform*`, `/calculators/*` and `/api/*` to the existing app with a Worker or path-based routes. Do not switch DNS until the acceptance checks below pass on a preview URL.

## 4. Contact form

The form (`[data-contact-form]` in `index.html`) currently validates its fields, builds a bilingual summary and opens the visitor's email app addressed to lenshocapitalllc@gmail.com. A copy button covers visitors whose email app does not open. Nothing is stored.

To send submissions server-side instead, add `data-endpoint="/api/contact"` to the `<form>`. `site.js` will then POST JSON with the fields `name, email, role, topic, location, size, message, consent`, show a thank-you message when the response is 2xx, and fall back to email on any error. Implementing that endpoint (and its spam protection, for example Cloudflare Turnstile) is up to the app.

## 5. Acceptance checklist

- [ ] `python3 build.py --clean-urls` completes, with links checked.
- [ ] `/`, `/opportunity-zones`, `/oz-guide`, `/how-we-work` and `/disclosures` return 200 with no console errors and no failed requests.
- [ ] An unknown path returns the 404 page, styled.
- [ ] `/platform`, `/calculators/refinance` and `/api/*` behave exactly as before.
- [ ] The EN/中文 toggle works on every page and is remembered across pages (`localStorage['lensho-lang']`). `?lang=zh` forces Chinese.
- [ ] At a 390px width (iPhone): no horizontal scroll, the menu button opens and closes the drawer, and the floating calculator button does not cover the hero.
- [ ] OZ tools work: the 180-day window, fit check (four answers lead to a result), improvement planner (changing the budget flips it between "On track" and "Below the threshold"), calculator sliders and glossary filter.
- [ ] The contact form shows errors when fields are empty, and when completed it opens email and shows the summary.
- [ ] `https://lensho.com/sitemap.xml` lists the new routes, and canonical tags point to `https://lensho.com/...`.
- [ ] Lighthouse on mobile scores Accessibility ≥ 95 and SEO ≥ 95. Images are pre-sized WebP and the hero preloads.

## 6. Content the owner must confirm before go-live

These items are written plausibly but are business commitments or legal positions, so the owner should confirm each one:

1. **OZ fund status.** Pages say Lensho is "reviewing tracts" and invite "introductions" or "registered interest". They do not claim that a fund or offering exists. Update the wording when a QOF exists, and have securities counsel review any investor-facing page.
2. **Service promises** on `/how-we-work`: a first reply within two business days, one shared underwriting model per deal, regular progress updates, annual tax documents, and the stage timings (weeks 1–12, months 3–18).
3. **Tax summary** (OZ page, guide, glossary). It reflects the 2025 federal amendments: permanent program, ten-year designation rounds from 1 Jan 2027, five-year rolling deferral, 10% step-up (30% rural), exclusion for appreciation through year 30, 50% rural substantial-improvement threshold, 31-month working-capital safe harbor, and the July 2026 nomination round. A tax advisor should verify all of it.
4. **Map.** The Hudson County hex map is schematic and is labelled as such. Replace it with real designated tracts once the OZ 2.0 map is final.
5. **Disclosures and privacy** text should be reviewed by counsel.
6. **Images.** Architectural renders are labelled as concepts. The renovation photos are the principal's prior projects, as on the current site.
