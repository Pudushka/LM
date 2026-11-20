# Lensho Capital — OZ 2.0 integration

A dedicated OZ 2.0 (opportunity zone) page for lensho.com, plus a homepage nav link and teaser band that lead to it. Everything follows the live site's design language: ink `#222828`, copper `#c9a07b`, Georgia, Barlow Condensed ExtraLight. The page is bilingual (EN / 中文).

## Files

| File | Purpose |
|---|---|
| `opportunity-zones.html` + `oz.css` + `oz.js` | Full OZ 2.0 page (intended route: `/opportunity-zones`) |
| `oz-teaser.html` + `oz-teaser.css` + `oz-teaser.js` | Homepage snippet: nav link + teaser section |
| `home-preview.html` | **Preview only**: a static copy of the live homepage with the teaser applied (uses `vendor/lensho-home.css`) |
| `images/`, `fonts/` | Copies of the existing lensho.com assets the page uses |

Local preview:

```bash
cd site && python3 -m http.server 8765
```

Then open `http://localhost:8765/opportunity-zones.html` and `http://localhost:8765/home-preview.html`.

## OZ page structure

1. **Hero**: the slogan "The gain has a clock. So does the map." over a huge gold "2.0" that fills in on load, with a live countdown to 1 January 2027.
2. **Key figures**: 180 days / 5 years / 10% / 0 tax, with count-up numbers.
3. **Scroll timeline**: a pinned section where the year steps 2027 → 2032 → 2037 as the curve draws (defer → step-up → exclude).
4. **Illustrative calculator**: sliders for gain, growth and holding period. Compares paying tax today with investing through a QOF.
5. **180-day window tool**: enter the date the gain was recognized and see days left, whether the window reaches into OZ 2.0, and a note for K-1 gains.
6. **Where Lensho fits**: the substantial-improvement test (double the building basis within 30 months), which matches Lensho's focus on renovation.
7. **A new map**: Hudson County priority markets on a schematic hex map. It is labelled as illustrative and is **not** a map of designated tracts.
8. **OZ 1.0 → 2.0 comparison**, **FAQ**, then a **CTA** (mailto: lenshocapitalllc@gmail.com) and the footer disclaimers.

## Porting into the vinext/Next app

- Turn `opportunity-zones.html` into `app/opportunity-zones/page.tsx`. The bilingual copy uses `.en` / `.zh` sibling spans, so map them onto the site's existing language toggle. `oz.js` stores the language choice in `localStorage['lensho-lang']`; change that key to whatever the homepage uses.
- Asset paths are relative (`images/…`, `fonts/…`). The same files already exist at `/images/…` and `/fonts/…` on lensho.com.
- Homepage: add `<a class="nav-oz" href="/opportunity-zones">OZ 2.0</a>` to the nav. Then insert the `oz-teaser.html` section directly after `<section class="cinematic">`.

### Homepage teaser — 中文 copy

| EN | 中文 |
|---|---|
| NEW · OPPORTUNITY ZONES · OZ 2.0 | 全新 · 机会区 · OZ 2.0 |
| The opportunity zone program, rewritten. *Substantial renovation at its core.* | 机会区计划，全面改写。*以大幅翻修为核心。* |
| From January 1, 2027, eligible capital gains invested in a qualified opportunity fund get rolling five-year deferral, a 10% step-up and tax-free appreciation after ten years. Rehabilitating existing buildings is central to how the program works — and to how we work. | 自 2027 年 1 月 1 日起，投入合格机会基金的资本利得可享五年滚动递延、10% 计税基础上调，以及持有十年后的增值免税。改造既有建筑是这一计划的核心，也正是我们的工作方式。 |
| Explore OZ 2.0 | 了解 OZ 2.0 |
| days until it takes effect | 天后正式生效 |
| Rolling deferral from the date you invest | 自投资日起滚动递延 |
| Step-up in basis on the deferred gain after five years | 持有满五年，递延利得计税基础上调 |
| Hold to exclude appreciation from federal capital gains tax | 持有满十年，增值部分免缴联邦资本利得税 |

## Content to confirm before launch

- **Lensho's role.** The copy says Lensho is "reviewing designated tracts" and invites investors to "register interest". It does not claim that a fund or offering exists. Update it once a QOF structure, terms and a minimum investment are set, and have counsel review all investor-facing language.
- **Tax summary.** The tax summary reflects the 2025 amendments to the federal program: a permanent program, new designations every 10 years from 1 Jan 2027, five-year rolling deferral, a 10% step-up (30% for rural funds), an exclusion after 10 years for appreciation through year 30, a stricter low-income test with no contiguous tracts, and expanded reporting. A tax advisor should verify it against final Treasury guidance.
- **New zone map.** Once the new Hudson County designations are final, replace the schematic hex map with real tract data.
- **Calculator assumptions.** The calculator uses a 23.8% federal rate, identical growth on both paths, and assumes the year-5 tax is paid from other funds. It ignores state tax and fees. A disclaimer is shown next to it.
