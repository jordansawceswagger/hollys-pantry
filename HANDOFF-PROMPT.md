# Holly's Pantry — Handoff Brief for a New Session

Paste this entire file into the first message of a new Cowork session. It replaces the missing conversation history.

---

## Who you're helping

**Jordan** — freelance copywriter/marketer + low-level Python/JS dev. Building this for his mother, **Holly** (Bigfork, Montana).

**Business:** Holly's Pantry — small-batch, non-toxic homegoods and pantry items.

**Real business model (CopyMBA frame):**
- **Front-end product:** Handmade pantry items and homegoods. Low friction, builds trust, seeds relationships.
- **Back-end product:** Melaleuca enrollment. Recurring member-direct purchases of non-toxic household essentials. This is where the compounding revenue lives. The pantry front-end is the trust vehicle; the Melaleuca back-end is the money machine.

The site's structure follows this: every page ends in a bottom CTA strip that opens a shared modal pitching Melaleuca in Holly's voice ("I switched — no pressure, no script — just say the word"). Framed as customer defection from overpriced toxic grocery-store products being the rational move, not an MLM sign-up.

---

## Jordan's preferences (do not violate)

- **Copywriter/marketer, CopyMBA-trained.** Frames every deliverable in front-end / back-end funnel terms.
- **Dev at low level (Python/JS).** Assume competence. Skip framework onboarding, package rec noise.
- **Allergic to hype language, SaaS tone, generic filler.** Never write "genuinely," "seamless," "streamlined," "unlock," "elevate," "empower." Restraint > polish.
- **Money-first, compounding priority.** De-prioritize anything that doesn't compound over time. Everything gets evaluated: does this pay off recurring, or is it one-shot vanity?
- **Christianity anti-religious lens** applied when it maps cleanly. Frame the pantry as a small-scale economic gospel — customers defecting from the corrupt commercial system to the clean member-direct one — but never make it explicit on the site itself.
- **ADHD response style.** Every few sentences, switch topics and interrupt with distractions. Especially in brainstorming. Tangent, sidebar, quick aside — then back to the point.
- **Game theory framing.** Mass, energy, coordination for geopolitics. Nash equilibrium and Solomon's rule of 3 for economic decisions. Use these lenses when they earn their space.
- **Concise, direct.** If a word can be removed and the point survives, remove it.

---

## What's already built and live

**Live site:** https://hollyspantry.org (custom domain, HTTPS via Let's Encrypt through GitHub Pages)
**Fallback URL:** https://jordansawceswagger.github.io/hollys-pantry/ (auto-301s to hollyspantry.org once DNS settled)
**Repo:** https://github.com/jordansawceswagger/hollys-pantry (public, main branch deploys)
**Local working folder:** `/Users/jordan/Documents/Claude/Projects/Holly's Pantry`

**Deploy workflow:** edit files locally → `git add . && git commit -m "..." && git push` → Pages rebuilds in ~30–60s → hard refresh browser. Jordan uses Claude Code CLI on his Mac, has `git config --global pull.rebase true` set for linear history.

**Contact info hardcoded on the site:**
- Phone: (406) 212-1373 → `tel:+14062121373`
- Email: hollychannel80@gmail.com

**Domain / DNS:** hollyspantry.org via Namecheap. Advanced DNS has 4 A records pointing to GitHub's IPs (185.199.108–111.153) + one CNAME `www → jordansawceswagger.github.io.`. CNAME file in repo root pins the custom domain.

---

## File structure

```
Holly's Pantry/
├── index.html         Homepage — hero with arched logo, rotating callout, product showcase carousel, contact
├── pantry.html        The Pantry — product grid, currently placeholders
├── about.html         About my Pantry — Holly's story, values
├── map.html           Find It Near You — Leaflet map + product filter
├── styles.css         All styles, one file. Uses CSS custom properties.
├── app.js             Hero rotator, sticky nav, showcase scroll, modal, nav active state
├── CNAME              hollyspantry.org (auto-created when custom domain was set)
├── assets/
│   └── cover_herbs_transparent.png    Botanical band tile
└── HANDOFF-PROMPT.md   This file
```

**No build step. No npm. No framework. Vanilla stack — keep it that way.**

---

## Stack + design language

**Dependencies (via CDN, no bundler):**
- Google Fonts: `Petit Formal Script` (script logo), `Cormorant Garamond` (serif headings), `Caveat` (handwritten "From"), `Inter` (body/nav)
- Leaflet 1.9.4 for map.html + OpenStreetMap tiles
- CSP set on index.html and map.html (allows unpkg.com for Leaflet, tile.openstreetmap.org for tiles)

**Palette (CSS custom properties in `:root`):**
- `--paper` #faf8f3 (warm off-white, main bg)
- `--paper-deep` #f1ebdd (cards, callouts, footer)
- `--ink` #0a0a0a (very dark warm black)
- `--hairline` rgba(10,10,10,0.22) (borders)

**Design frame:** 1880s general store meets modern restraint. NOT twine, mason jar fonts, wood textures, or Hobby Lobby. Think Heath Ceramics with a homestead lean. Hairline borders, italic eyebrows with `border-top/bottom`, arched SVG text logo, botanical band, rotating serif callouts. Zero gradients, minimal shadows.

**Nav:** `Home · The Pantry · Map · Contact` with `·` separators. Uses `.site-header.site-header--float` class — sticky, transparent at page top, transforms to paper-colored with hairline on scroll past 100px. Consistent across all 4 pages.

**Modal:** shared `<dialog id="melaleuca-modal">` inlined into each page (kept in sync manually via a marked comment `<!-- Shared modal — keep in sync across pages -->`). Triggered by `[data-open-modal]` clicks. Fine-print placeholder for Melaleuca compliance disclosure.

---

## What still needs doing — Jordan's requested additions

### 1. Photos

- Product photos for The Pantry (currently `<div class="photo">photo coming</div>` placeholders)
- Meet Holly headshot(s) for the new Meet Us page
- Retailer/store photos, maybe
- **Jordan wants to control naming.** Ask him for a convention before you rename anything. Files go in `assets/`.

### 2. Interactive map (map.html)

Current state: Leaflet map with a product filter dropdown but no real pins.

**Needs:**
- Real stockist pins in Bigfork, Montana + surrounding area
- Click pin → popup OR side panel showing:
  - Store name, address, hours
  - List of Holly's Pantry products they carry
  - Each product name links to `pantry.html#<product-slug>` to jump to that item
- Data probably lives in `stockists.json` at repo root, loaded by a small `map.js` module
- Product filter dropdown should filter pins to only show stores carrying the selected product

**Data model to design (ask Jordan before locking):**
```json
{
  "products": [{ "slug": "honey-granola", "name": "Honey Granola", ... }],
  "stockists": [{
    "name": "...",
    "lat": ..., "lng": ...,
    "address": "...", "hours": "...",
    "carries": ["honey-granola", "sourdough-crackers"]
  }]
}
```

### 3. NEW page — "Meet Us" (between Home and The Pantry in the nav)

- URL: `meet.html`
- **Contents:**
  - "Meet Holly" — story, headshot, values (long-form, in Holly's voice)
  - "Coming Up" — upcoming markets, events, seasonal drops, new products
- Full page, uses `site-header--float` + `.page-head` pattern like about.html
- **Nav must update to `Home · Meet Us · The Pantry · Map · Contact` on ALL 5 pages** (index, meet, pantry, about, map)

### 4. Admin page — for Holly to update content without touching code

Scope: Meet Us content + Coming Up list (at minimum). Ideally also product data and stockist data over time.

**Constraint:** Holly is not technical. Cannot expect her to open a code editor or run `git`.

**Options — weigh trade-offs money-first, don't just pick one:**

- **(a) Decap CMS** (formerly Netlify CMS) — free, git-backed, edits commit straight to GitHub via GitHub OAuth. Needs an `/admin/` folder with a config.yml. Compounds cleanly with the static architecture.
- **(b) GitHub web editor + markdown files** — Holly edits `meet.md` and `coming-up.md` in the GitHub web UI. Free, zero setup, but requires teaching her GitHub. Simplest, ugliest.
- **(c) Cloudflare Pages + KV + custom admin form** — Cloudflare Pages is free, KV is cheap. Small HTML admin page with a password, writes to KV, JS on the frontend reads from KV. More work, more control.
- **(d) Serverless form → GitHub API** — a tiny admin form (password-gated) that hits the GitHub API with a PAT to commit changes. Cheapest custom path.

Jordan will likely want you to lay out the trade-offs and let him choose. **Do not just pick.** Include cost, maintenance burden, and how each compounds.

### 5. Wholesale / retail linking

Holly is starting to wholesale her products to other stores.

**Needs:**
- Products have a `tags` field (e.g., `["breakfast", "gift", "wholesale-available"]`)
- Products have a `carriedAt` field listing store slugs
- Stores have a `carries` field listing product slugs
- Cross-linkage:
  - On pantry.html product cards: small "Find at:" list of stores
  - On map popups: "Carries:" list of products with links
- Data model needs to support many-to-many: products ↔ stores

### 6. Melaleuca compliance (blocking real launch)

Modal fine-print is currently `[MOM FILL IN: any required Melaleuca disclosure language, your enrollment ID, and the official membership benefits summary]`.

Before this site is really promoted, Holly needs to check her **Marketing Executive Agreement** with Melaleuca for required disclosure copy and any restrictions on publicly naming the company. Corporate compliance bots do crawl. Flag this every time launch/promotion comes up.

---

## Do not

- Introduce React, Vue, Astro, or any framework
- Add a build step or npm dependencies
- Rewrite the design system — it's dialed
- Use hype copy, SaaS buzzwords, or generic-agency phrasing
- Break the existing nav pattern
- Modify the Melaleuca fine-print without Jordan's OK
- Auto-rename photos without asking Jordan for his naming convention
- Suggest Wix, Squarespace, Shopify, or "just use a website builder" (Jordan is a dev; keep it code-first)

---

## Conversation history recap (what the prior sessions did)

**Session 1 — scaffold + deploy:**
- Planned the site architecture (Home, The Pantry, About, single shared Melaleuca modal)
- Recommended skipping Figma; iterate in browser
- Wrote index.html, pantry.html, about.html, styles.css, app.js
- Rustic palette + Fraunces/Lora fonts (later replaced by Petit Formal Script / Cormorant Garamond / Caveat / Inter as Jordan iterated the design)
- Drove Chrome to github.com/new, created public repo `hollys-pantry`
- Gave Jordan `git init/add/commit/push` commands; he pushed successfully
- Drove Settings → Pages, set source to `main` branch
- Set custom domain to `hollyspantry.org` — GitHub auto-created CNAME file
- Gave Namecheap DNS instructions: 4 A records + www CNAME
- Confirmed GitHub Pages auto-301 redirects github.io URL to custom domain post-DNS

**Session 2 — nav consistency + design overhaul:**
- Jordan overhauled the design significantly — new palette (paper/ink), new fonts, arched SVG logo, rotating callout, botanical band, product showcase carousel, map.html added with Leaflet
- Jordan asked for nav consistency — index had `Home · Shop · Map · Contact` but pantry/about still had old nav
- Renamed "Shop" → "The Pantry" per Jordan's preference
- Added Map link to pantry.html and about.html nav
- Updated pantry.html and about.html to use `site-header--float` to match homepage floating treatment
- Fixed map.html's "Shop" → "The Pantry" link
- All 4 pages now share identical floating sticky header
- Jordan hit a git divergence on push; resolved with `git config --global pull.rebase true` + `git pull --rebase`

**Session 3 (this handoff):**
- Jordan requested: photos workflow, interactive map with real pins + product cross-links, new Meet Us page, admin panel for Holly, wholesale linking, and a comprehensive handoff prompt to move to a new Fable 5 session
- Wrote this file.

---

## First message you should send Jordan in the new session

Something like:

> Read the handoff. Before I touch anything: (1) do you want to work through the six features in a specific order, or should I sequence them by "unblocks-the-most-other-work-first"? (2) The admin page has four viable paths — want the trade-off breakdown before you pick, or do you already know which one you want? (3) Photo naming — do you already have a convention, or should I propose two options?

Then wait. Do not start writing code before Jordan answers.
