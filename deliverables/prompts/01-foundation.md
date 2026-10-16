# Prompt 1: Foundation

**Attach before sending:** `catapanda-checklist-data.md`, `web-logo.png`, `web-mascots.png`

---

## Before you start

Check that these three files are attached: `catapanda-checklist-data.md`, `web-logo.png` and `web-mascots.png`. **If any are missing, stop and ask me for them. Don't build anything until you have all three.**

## What we're building

Catastrophic Pandamonium (nickname: CataPanda) is a mobile-first web app that helps people in Taiwan prepare for earthquakes, floods and typhoons. A user picks the disasters they're preparing for and describes their household. The app then builds personalized checklists from a government-vetted catalog, with AI adding household-specific items. Every item shows where it came from.

We'll build it in stages. **This stage: the design system, the catalog data, and the app shell. No AI and no checklist logic yet.**

## Principles for the whole project

Follow these in every stage:

1. **Mobile-first.** Design every screen for a phone first.
2. **Built to scale with multiple AI solutions.** Every service-specific piece sits behind one replaceable part: one AI function, one search function, one catalog service, and one configuration setting for the app's public URL. Keep backend functions small and isolated. We may change AI providers, search providers or hosting in later versions without a rebuild.
3. **Catalog data is data, not code.** Items, disasters, tips, sources and store types live in data files. Adding an item, a disaster or a source must only require editing data. Never write catalog content into components, page text or AI prompts.
4. **Privacy.** Household descriptions and answers are never stored or reshared. No database for user input, no logging of it, no analytics on it.
5. **No accounts, no checkboxes, no progress tracking.** Checklists are read-only.
6. **English only.**

## 1. Design system

Use the logo and mascot images exactly as supplied: don't recolor, redraw or crop them.

**Colors**

| Name | Hex | Use |
|---|---|---|
| Deep Sky Blue | #04508A | Page background |
| Panda Black | #1C1C1E | Top tab of stacked cards, header band, primary buttons |
| Sunset Gold | #DB903D | Bottom tab of standard stacked cards |
| Brick Red | #B6423C | Accent cards, secondary buttons |
| Deep Red | #6B1613 | Hover and pressed states, outlines on red |
| White | #FFFFFF | Card surfaces, option cards, text fields, text on dark backgrounds |
| Bright Blue | #3F7FD1 | Selected states and links |
| Pale Blue | #EAF4FB | Fill for a selected option card |
| Ink | #2A2A2E | Main text |
| Slate Grey | #6B6B70 | Secondary text |
| Sand | #E3E0D6 | Borders on option cards and text fields |
| Linen | #EFECE3 | Dividers between checklist items |

Avoid these first-aid-style colors: #4CAF50, #FF5252, #E6CCB2, #2196F3, #FFEB3B.

**Layered stacked card (signature component).** Each main content block is a White card with large rounded corners. A Panda Black tab peeks out above it and a Sunset Gold tab peeks out below it. Both tabs are slightly narrower than the card, share its rounded corners, and show only a thin band. **Accent variant** (at most one per screen, for the main thing the user must do): a Brick Red card with Panda Black headings and White body text, a Panda Black top tab and a White bottom tab.

**Buttons.** Fully rounded pills with bold labels.
- Primary: Panda Black fill, White text; Deep Red on hover or press.
- Secondary: Brick Red fill, 2-point Deep Red outline, Deep Red text; Deep Red fill with White text on hover or press.
- Disabled: reduced opacity.

**Option cards** (selectable choices): White, thin Sand border, bold name, Slate Grey tagline. Selected: Bright Blue border, Pale Blue fill.

**Text fields:** White, thin Sand border, rounded, Slate Grey placeholder.

**Typography:** your choice. Friendly and rounded, not corporate; very legible on phones; bold headings with personality.

**Feel:** soft shadows, rounded corners, generous spacing, scannable sections. Approachable, bright and a little joyful. Never fear-based, dense or corporate.

## 2. Catalog data files

Convert `catapanda-checklist-data.md` into plain data files in the project. Copy the content **exactly**: names, short notes, detail notes, sources and priorities. Don't rewrite, add or drop anything.

Include:
- **Disasters:** Earthquake, Flood, Typhoon, each with its tagline and its "what to do" tips (with source codes).
- **Items:** the 25 items shared by all disasters, plus the extra items for each disaster (Earthquake 5, Flood 1, Typhoon 0). Each item has: name, category, short note, priority, source codes, where-to-buy store types, and detail notes.
- **Household rule** for conditional items: which household fact makes each one appear (infant, elderly, personal aids, pet), as described in the "Conditional-item rules" section of the file.
- **CataPanda Tips:** Grab-and-go bag and Personal medical info card, with short notes, categories, store types and priority Essential.
- **Categories:** the fixed 8, in this order: Water & Food, First Aid & Medication, Hygiene & Sanitation, Light, Power & Communication, Documents & Money, Clothing & Protection, Tools & Support Aids, Household & Special Needs.
- **Store types:** Grocery store, Hardware store, Pharmacy, Specialty store.
- **Sources:** the source index (code, country, agency, document, website).
- **Bag tips:** the "Using & maintaining the bag" tips.

Item names are unique, so the app identifies items by **exact name**.

## 3. Catalog service

Create **one catalog service** that is the only part of the app that reads the data files. Everything else (screens now, the About page and AI steps later) gets catalog data through it. It should be easy to point it at a different data source later.

## 4. App shell and navigation

- **Site navigation:** Home, About.
- **Screens to create as simple placeholders for now** (we'll build them in later stages): Start (Home), Clarifying questions, Checklist options, Checklist view, Share, About.
- **Flow navigation** on the flow screens: Back, Start over, Next.
- Browser tab title: **"CataPanda — Disaster Prep, Personalized"**
- Use the logo on the Start screen and the mascots where they add warmth. You choose the placement.
- **App URL setting:** create one configuration setting for the app's public URL (used later in share messages).

## Don't

- Don't build checklists, AI or search yet.
- Don't create a database.
- Don't hardcode catalog content anywhere except the data files.

## Test it

- [ ] On a phone-sized screen, the shell shows the brand colors, a stacked card, both button styles and the logo.
- [ ] Home and About navigation works; the placeholder screens exist.
- [ ] Spot-check the data: "Drinking water" has the short note "3 L per person, per day", priority essential, and store "Grocery store".
- [ ] The Fire extinguisher is an Earthquake extra in the category Tools & Support Aids.
- [ ] Changing a short note in the data file changes it in the app, with no code changes.
