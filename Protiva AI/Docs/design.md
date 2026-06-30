# Portiva AI — Design System & Build Playbook
A complete reference for reproducing the look, feel, structure, and engineering decisions behind the Portiva AI landing page. Hand this file to any AI (or developer) and ask it to "build in the Portiva style." Everything it needs is here.
---
## 1. Design Philosophy
The whole page is built on **four rules**. Break any of them and it stops feeling like Portiva.
1. **Editorial over corporate.** Use a serif display face with real italics. Treat headlines like magazine pull-quotes, not marketing slogans.
2. **One accent, used sparingly.** A single deep emerald is the only saturated color on a warm cream page. No purple gradients, no rainbow icon sets.
3. **Whitespace is a feature.** Generous vertical rhythm (`py-24 md:py-32`), wide max-widths (`max-w-6xl`), and short paragraph measures (`max-w-xl`). Nothing is cramped.
4. **No AI-slop tells.** No "Trusted by Google/Meta/Apple" logo wall. No two-CTA hero ("Get Started" + "Learn More"). No 3-column generic feature grid with Lucide icons in pastel circles. Replace those with one confident CTA + one secondary text link, an emerald icon on a tinted-accent square, and copy that sounds like a person wrote it.
---
## 2. Visual Language
### Color (oklch, defined as CSS tokens)
| Token              | Value                          | Role                                    |
| ------------------ | ------------------------------ | --------------------------------------- |
| `--cream`          | `oklch(0.975 0.012 85)`        | Page background. Warm off-white, never `#fff`. |
| `--ink`            | `oklch(0.18 0.015 220)`        | Body + headlines. Deep blue-black, never pure `#000`. |
| `--emerald-deep`   | `oklch(0.52 0.13 165)`         | The only saturated color. CTAs, accents, links on hover. |
| `--emerald-glow`   | `oklch(0.72 0.16 160)`         | Lighter emerald for gradients only.      |
| `--muted-foreground` | `oklch(0.45 0.015 220)`      | Secondary body text. Subtitles, captions. |
| `--border`         | `oklch(0.88 0.012 85)`         | Hairlines. Always warm, never gray.      |
**Hard rule:** never write `text-white`, `bg-black`, or `bg-[#hex]` in a component. Everything goes through tokens.
### Typography
- **Display:** `Instrument Serif` (regular + italic). Used for `h1`, `h2`, big numbers, the logo wordmark. Tight tracking (`-0.02em`). Real italics for emphasis inside headlines — this is the single most recognizable Portiva move.
- **Body:** `Geist Variable`. Used for everything else. Antialiased, with OpenType features `ss01, cv11` enabled.
- **Eyebrow labels:** small uppercase, wide tracking — `text-xs uppercase tracking-[0.2em]`. Always emerald or muted.
**The italic move:**
```tsx
<h1 className="font-display text-7xl">
  Your professional portfolio,{" "}
  <span className="italic text-primary">built in the time</span> it takes to describe yourself.
</h1>
```
This pattern — roman headline with one italic emerald phrase mid-sentence — appears in the hero, the "How it works" section, and the "Capabilities" section. Use it once per major section.
### Spacing & Sizing
- Container: `mx-auto max-w-6xl px-6`. Always.
- Vertical section rhythm: `py-24 md:py-32` (smaller `py-20 md:py-36` for hero).
- Headline scale: hero `text-5xl md:text-7xl lg:text-[5.5rem]`, section heads `text-4xl md:text-5xl`. Line height `leading-[0.95]` for hero, `leading-tight` for section heads.
- Radius: `--radius: 0.75rem`. Buttons are **fully rounded** (`rounded-full`), cards are `rounded-xl`, large feature blocks `rounded-2xl`/`rounded-3xl`.
### Shadows
Two named shadows only:
- `--shadow-soft` — for cards on hover and the 3-step grid.
- `--shadow-elev` — for the primary CTA only.
Both use ink at low opacity, never pure black.
### Motion
Minimal. Three approved movements:
1. CTA lifts on hover: `hover:translate-y-[-1px]`.
2. Card border tints emerald on hover: `hover:border-primary/40`.
3. One pulsing dot in the announcement chip (`animate-pulse`).
No fade-ins on scroll, no stagger animations, no parallax. Restraint is the brand.
---
## 3. Layout System
Every page is a vertical stack of these blocks, in this order:
```
<Nav>                  sticky, backdrop-blur, hairline border-bottom
<Hero>                 dot-grid bg, chip, h1 with italic phrase, lede, CTA pair, 3-stat row
<Marquee>              eyebrow + horizontal row of icon+label pills, card-tinted bg
<HowItWorks>           eyebrow + h2, 3-cell grid w/ giant serif numerals (01, 02, 03)
<Capabilities>         eyebrow + h2 + counter-paragraph, 3-col card grid, hairline borders
<Closer>               full-bleed dark gradient panel inside rounded-3xl, centered serif h2
<Footer>               hairline border-top, logo + © + 3 links
```
### Section template
Every section follows this exact structure:
```tsx
<section id="..." className="mx-auto max-w-6xl px-6 py-24 md:py-32">
  <div className="max-w-2xl">
    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Section eyebrow</p>
    <h2 className="font-display text-4xl md:text-5xl leading-tight">
      Roman opening. <span className="italic">Italic closer.</span>
    </h2>
  </div>
  {/* content */}
</section>
```
Alternating sections swap to `bg-card/40` with a `border-t border-border` to break the page into bands without ever changing the color story.
---
## 4. Component Recipes
### Primary CTA (use once per section, max)
```tsx
<a className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium hover:bg-primary/90 transition-all shadow-[var(--shadow-elev)] hover:translate-y-[-1px]">
  Build mine free
  <ArrowUpRight className="h-4 w-4" />
</a>
```
### Secondary CTA
```tsx
<a className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium hover:bg-secondary transition-colors">
  Watch a 90-second demo
</a>
```
Notice: no "Learn More." Real verbs, specific promises.
### Announcement chip
```tsx
<div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-8">
  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
  Now in private beta — invite the next person
</div>
```
### Stat block (always in rows of 3)
```tsx
<div>
  <div className="font-display text-3xl">{value}</div>
  <div className="text-muted-foreground mt-1 text-xs uppercase tracking-wider">{label}</div>
</div>
```
### Feature card
```tsx
<div className="group rounded-xl border border-border bg-background p-6 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition-all">
  <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
    <Icon className="h-4.5 w-4.5" />
  </div>
  <h3 className="font-medium mb-2">{title}</h3>
  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
</div>
```
### Numbered step (the 3-up grid)
```tsx
<div className="mt-14 grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
  {steps.map(s => (
    <div className="bg-card p-8 md:p-10">
      <div className="font-display text-5xl text-primary mb-6">{s.n}</div>
      <h3 className="text-xl font-medium mb-3">{s.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{s.body}</p>
    </div>
  ))}
</div>
```
The `gap-px bg-border` trick produces hairline dividers between cells without per-cell borders — cleaner than a 3-card row.
### Dark closing panel
```tsx
<div
  className="relative overflow-hidden rounded-3xl px-8 py-20 md:px-20 md:py-28 text-center"
  style={{ background: "var(--gradient-ink)" }}
>
  <div aria-hidden className="absolute inset-0 opacity-20" style={{
    backgroundImage: "radial-gradient(circle at 30% 20%, oklch(0.72 0.16 160 / 0.6), transparent 50%), radial-gradient(circle at 70% 80%, oklch(0.52 0.13 165 / 0.5), transparent 50%)"
  }}/>
  {/* content */}
</div>
```
The two emerald radial gradients at opposite corners are the only place gradients are allowed.
---
## 5. Copywriting Rules
Design fails without the right voice. Portiva copy follows:
- **Headlines:** complete sentences with one italic phrase. End in a period.
  - Good: "Your professional portfolio, *built in the time* it takes to describe yourself."
  - Bad: "AI-powered portfolio builder for everyone"
- **Eyebrows:** 2–3 words, sentence-case after the uppercase styling. "How it works," "What it does," "For who."
- **CTAs:** verb + concrete object. "Build mine free." "Watch a 90-second demo." Never "Get Started" / "Learn More."
- **Body:** short clauses, contractions, em-dashes. Mention a real number when possible ("4 min median build time"). One concrete refusal beats five vague claims.
- **Section closers:** include a one-line counter-paragraph next to section headlines on `md:flex-row md:items-end md:justify-between` — it makes the page feel edited, not generated.
---
## 6. The Files
The entire landing page is **three files**. Keep it that way.
```
src/
├── styles.css           # design tokens + utilities
└── routes/
    ├── __root.tsx       # html shell + global head/meta
    └── index.tsx        # the whole landing page in one file
```
If a section gets reused across pages, extract it to `src/components/`. Until then, one-file-per-route is the right tradeoff.
---
## 7. Stack Conventions (TanStack Start + Tailwind v4)
These are non-obvious gotchas that wreck the build if you skip them:
- **Tailwind v4 config lives in `src/styles.css`**, never in `tailwind.config.js`. Use `@theme inline { --color-x: var(--x); }` to wire CSS variables to Tailwind utility classes.
- **Fonts:** install via `@fontsource/*` packages, then `@import` them at the **top** of `src/styles.css` before `@import "tailwindcss"`. Never `@import` a Google Fonts URL — Lightning CSS resolves filesystem only and the build dies.
- **Custom utilities** use `@utility name { ... }`, not `@layer utilities`.
- **Routes** live in `src/routes/` with filename-to-URL mapping (`index.tsx` → `/`, `about.tsx` → `/about`). The route tree is auto-generated — never edit `routeTree.gen.ts`.
- **Every public section** that could be its own page should be its own route file with its own `head()` metadata, not a hash anchor on the home page.
---
## 8. Replication Prompt (for handing to another AI)
Paste this verbatim when asking another AI to build in the Portiva style:
> Build a [page type] in the Portiva AI style. Strict rules:
>
> 1. Palette is cream `oklch(0.975 0.012 85)` background, ink `oklch(0.18 0.015 220)` foreground, deep emerald `oklch(0.52 0.13 165)` as the single accent. No other saturated colors anywhere.
> 2. Display font is Instrument Serif (use the italic). Body font is Geist Variable. Install both via `@fontsource` packages.
> 3. Every section uses this template: `max-w-6xl px-6 py-24 md:py-32`, with an uppercase emerald eyebrow `text-xs uppercase tracking-[0.2em] text-primary`, then a serif h2 `font-display text-4xl md:text-5xl` containing one italic phrase mid-sentence.
> 4. Primary CTA is `rounded-full bg-primary px-6 py-3.5` with an `ArrowUpRight` icon, paired with a single secondary text-link CTA. Never two primary buttons.
> 5. Cards: `rounded-xl border border-border bg-background p-6` with a `bg-accent` icon square that turns emerald on `group-hover`. No pastel gradient icon backgrounds.
> 6. Use a dark gradient panel `rounded-3xl` as the final pre-footer section, with two emerald radial gradients at opposing corners.
> 7. No animations beyond CTA hover-lift, card border-tint, and one pulsing announcement dot.
> 8. Copy: one italic phrase per headline; CTAs use verb + concrete object; include real numbers in stat rows; eyebrow labels are 2–3 words.
> 9. Forbidden: "Trusted by [logos]" sections, two-CTA heroes with "Get Started"/"Learn More," generic 3-col grids with circular pastel icons, purple gradients, pure white or pure black, hardcoded color classes (`text-white`, `bg-black`, `bg-[#xxxxxx]`).
>
> Use the design tokens defined in `src/styles.css` — never inline color values in components.
---
## 9. Sectional Map of `src/routes/index.tsx`
Quick reference of what each component in the source does:
| Component       | Purpose                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| `Nav`           | Sticky top bar. Logo wordmark, 4 anchor links, sign-in text, pill CTA.  |
| `Hero`          | Dot-grid background, beta chip, italic headline, lede, CTA pair, stats. |
| `Marquee`       | Profession strip on tinted band. Icons + labels, no logos.              |
| `HowItWorks`    | 3-cell hairline grid with giant serif numerals.                         |
| `Capabilities`  | 6-card feature grid with counter-paragraph next to the heading.         |
| `Closer`        | Dark gradient CTA panel inside rounded-3xl.                             |
| `Footer`        | Logo, ©, 3 utility links. Hairline border-top.                          |
---
## 10. Quality Checklist
Before shipping any Portiva-style page, verify:
- [ ] No pure `#000` or `#fff` anywhere — only ink and cream tokens.
- [ ] Exactly one italic phrase per major headline.
- [ ] Hero has one primary CTA + one secondary text link (not two buttons).
- [ ] Every section has an emerald uppercase eyebrow.
- [ ] All buttons are `rounded-full`. All cards are `rounded-xl` or larger.
- [ ] Icons are emerald on accent-tinted squares, not pastel circles.
- [ ] No logo wall, no fake testimonials, no animated counters.
- [ ] All colors come from CSS tokens, not hex literals in JSX.
- [ ] Container is `max-w-6xl px-6` everywhere.
- [ ] Final section is the dark gradient closer, not a contact form.
If every box is checked, it's Portiva. If any are unchecked, fix before shipping.
