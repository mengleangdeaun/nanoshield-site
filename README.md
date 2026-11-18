# Nanoshield Cambodia website

Next.js 16 (App Router, Cache Components) marketing site for https://nanoshield-cambodia.com, in English (`/en`) and Khmer (`/km`). Every page is prerendered static HTML; `ensureStatic = "navigation"` in `app/[lang]/layout.tsx` fails the build if one stops being static.

## Where things live

| What | File |
| --- | --- |
| Business facts (phone, address, links, domain, routes) | `content/site.ts` |
| All page copy | `content/en.ts`, `content/km.ts` (typed: a missing Khmer key fails `tsc`) |
| Page sections (ported from the Claude Design export) | `components/sections.tsx` |
| Metadata, hreflang, JSON-LD | `lib/seo.ts` |
| Security headers (CSP, HSTS…) | `next.config.ts` |
| `/` → `/en` or `/km` by browser language | `proxy.ts` |
| AI/answer-engine summary | `public/llms.txt` |

## Colours and themes

Dark is the default for every visitor, even on light-mode devices; the header sun/moon button switches to light. The choice is saved in `localStorage`, and an inline script in `app/[lang]/layout.tsx` applies it before first paint. Use the role classes defined in `app/globals.css`; never raw hex:

| Class | Use |
| --- | --- |
| `bg-surface` / `bg-raised` / `bg-sunken` | page / alternate sections & cards / footer |
| `text-fg` / `text-muted` / `border-line` | body text / secondary text / dividers |
| `text-orange`, `border-orange`, `.btn` | brand orange `#ec5b25` in both themes, only on **large** text (≥24px, or bold ≥18.66px), buttons, borders and shapes |
| `text-accent` | **small** orange text (labels, links): brand orange in dark mode, near-black in light mode, where brand orange on white is too low-contrast |

## Commands

```bash
npm run dev         # local dev
npm run lint
npm run typecheck
npm run test:e2e    # build + Playwright: routes, SEO head, JSON-LD, axe a11y, headers, redirects, FAQ, mobile menu
npm run test:lh     # build + Lighthouse CI (mobile) on 5 pages, asserts 100 in all categories
```

## Before launch

- Replace placeholders: photos (`PHOTO ·` / `IMAGE ·` boxes), `[PRICE]`, `[HOURS]`, `[INTERVAL]`, `[X]`, `[GUARANTEE TERMS]`, `[WARRANTY TERMS]`. Then remove `.fixme` from the "no placeholder content left" test in `e2e/site.spec.ts`.
- Have a native speaker proofread `content/km.ts`.
- Once hours and coordinates are known, add `openingHours` and `geo` to `businessSchema` in `lib/seo.ts`.
- Deploy on Vercel with the root directory `sub-systems/nanoshield-site`. Then check PageSpeed Insights, the Rich Results Test and securityheaders.com, and submit `/sitemap.xml` in Search Console.
