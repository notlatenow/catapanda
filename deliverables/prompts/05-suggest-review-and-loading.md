# Prompt 5: AI Items, Review, Top 10 and Loading

---

This stage adds the two AI steps that personalize the lists (**Suggest** and **Review**), the AI-ranked Top 10, and the loading screen. Both steps go through the single AI function from stage 4 and follow its privacy rules.

## How the pieces fit

1. **Plain logic** (stage 2) builds the catalog lists and adds the two CataPanda Tips.
2. **Suggest (AI)** works out household facts and drafts household-specific items.
3. **Review (AI)** removes duplicates, pairs specializations, and ranks the Top 10.
4. **Plain logic** validates everything and places it on the lists.

**The vetted catalog is the source of truth.** AI may only add items alongside it. It can never rename, edit, hide or remove a catalog item or a CataPanda Tip.

## 1. Suggest step

**Input:** the description, the clarifying answers, the selected disasters, the catalog items for those disasters (from the catalog service), the CataPanda Tips, and any search results (none yet; stage 6 adds them).

**Output:**

**Household facts.** True only if stated or answered, never guessed:
- Infant: includes expecting a baby.
- Elderly: someone is 65+ or uses elderly-care aids.
- Personal aids: anyone uses glasses, hearing aids, a cane or similar, at any age.
- Pet.

The app uses these facts to unlock the matching household catalog items (logic built in stage 2).

**Draft AI items, up to 8.** Each has:
- **Name**
- **Category:** exactly one of the 8 categories
- **Priority:** Essential, Important or Nice-to-have, set by the AI
- **Short note:** 50 characters or fewer, saying what the item is or why it fits this household
- **Stores:** from Grocery store, Hardware store, Pharmacy, Specialty store; or none for things you don't buy
- **Medical:** yes or no
- **Specializes:** the exact name of a catalog item it specializes, or none (see Review)

**Rules for AI items:**
- Physical items and supplies only.
- No brand names, store names or medication doses.
- **Medical, medication or device items** must include "Check with your doctor" in their short note. Never state quantities, dosages or device battery runtimes.
- Don't suggest anything that just restates a catalog item or a CataPanda Tip (e.g. no "emergency backpack", no "emergency contacts card", which restates "List of essential phone numbers").
- **Do** suggest specializations: items that add a household-specific requirement a catalog item doesn't meet. Examples: "Wheat-free dog food" specializes "Pet supplies"; "Fragrance-free wipes and soap" specializes "Hand sanitiser, wet wipes, tissues".
- Aids and devices not in the catalog (crutches, walkers, wheelchairs, oxygen machines, CPAP) are AI items in Tools & Support Aids.
- Common needs (pets, diets, sensitive skin, pregnancy) use the AI's own knowledge.

## 2. Review step

**Input:** the draft AI items, the catalog items that will be shown on the Personalized checklist, and the CataPanda Tips.

**Output:**
- **Kept AI items.** Remove **restatements** of catalog items or Tips, and duplicates among the AI items. Keep **specializations**, each marked with the exact name of the catalog item it pairs with.
- **Top 10 positions #3–#10:** 8 items chosen purely by importance for this household from items shown on the Personalized checklist (catalog items, kept AI items and the medical info card). Each has a **"why for you"** line of 50 characters or fewer (e.g. "For your dad's oxygen machine"). The app fixes #1 Grab-and-go bag and #2 Drinking water.

**Review may only remove or pair AI items and rank the Top 10. It never adds items and never changes catalog items or Tips.**

## 3. Validation (plain logic, after Review)

- Drop any AI item with:
  - an invalid category, priority or store
  - a short note over 50 characters
  - a name matching a catalog item or Tip
  
  Keep at most 8.
- If a pairing names a catalog item that isn't shown, show the AI item unpaired.
- **Top 10:** all 8 names must exist on the Personalized checklist, be unique, and exclude #1 and #2. Otherwise, use the stage 2 Top 10.
- **Never show AI items that didn't pass Review.**

## 4. Placement

- **Custom:** CataPanda Tips first, then AI items in the fixed category order. A **specialization pair** shows the catalog item directly above its AI item. That catalog item then moves out of Combo/Core (it's never shown twice) and isn't counted in the overlap percentage.
- AI item rows:
  ```
  Item name
  Short note
  Category | Priority | AI: Source ↗ | Find at [stores]
  ```
  "Source ↗" links to the "How the tiers work" anchor on the About page (stage 6 adds outside links for searched items). "Find at" appears on the Personalized checklist only.
- **Top 10 rows:**
  ```
  Item name
  Why for you
  Short note
  Category | Priority | Source
  ```
  When the stage 2 Top 10 is used, leave out the "why for you" line.

## 5. Fallback

If Suggest or Review fails, returns invalid output, or the whole personalization takes longer than about 25 seconds:
- Show the stage 2 lists, both CataPanda Tips and the stage 2 Top 10.
- Show a friendly message that personalized suggestions aren't available right now (draft it in the brand voice).
- The user should never see an error screen or an empty list.

## 6. Loading screen

Shown between the clarifying questions and the lists while Suggest and Review run.
- Headline: **"Working hard on your lists"**
- The cat and panda mascots with gentle, playful motion (bobbing or wiggling the existing art). Design it so 2–3 hand-drawn frames (the pair digging with shovels) can replace it later.
- **Rotating progress messages** tied to the real steps, e.g. "Reading about your household…" → "Finding items just for you…" → "Removing duplicates…" → "Ranking your Top 10…".
- **Rotating tips from the catalog data:** the "what to do" tips for the selected disasters (with their source code) and the "Using & maintaining the bag" tips.
- If the phone has reduced motion turned on, show a still image.
- **Single-disaster lists don't need AI.** Users can open them right away from Checklist options; only Top 10 and Personalized wait.

## 7. About page: AI section

Replace the stage 3 placeholder:
- How CataPanda uses AI to personalize lists, and that every AI item is labeled "AI".
- **How the tiers work** (keep the anchor):
  - Tier 1: the vetted catalog, always used.
  - Tier 2: AI reasoning for common needs.
  - Tier 3: live web search for niche needs, coming next. Leave a spot to describe it.
- The guardrails: AI never changes vetted items; physical items only; no brands, store names or doses; "Check with your doctor" on medical items.
- That household descriptions are never stored or shared.

## Test it

Use Earthquake + Flood for each:
- [ ] **Busy family** ("i live on the 5th floor with my mom, dad, dog, and little sister. my dad uses an oxygen machine. …wheat…" with answers): Pet supplies unlocks. "Wheat-free dog food" is paired with Pet supplies in Custom. A fragrance-free hygiene item is paired with "Hand sanitiser, wet wipes, tissues". An oxygen-machine power item says "Check with your doctor". No item states a dosage or battery runtime.
- [ ] **Lives alone** ("i live alone in my home", all questions skipped): Custom shows the 2 Tips and few or no AI items. No contacts card.
- [ ] **Expecting family** ("4 people, me, son, daughter, preganant wife", baby due soon): Infant supplies and Baby wrap / carrier unlock. Pregnancy items say "Check with your doctor".
- [ ] Top 10 starts with Grab-and-go bag and Drinking water; #3–#10 have "why for you" lines.
- [ ] The overlap percentage updates when household items unlock or move into Custom.
- [ ] With the AI switch off, or a forced failure, the stage 2 lists appear with the friendly message.
- [ ] Loading shows mascots, progress messages and real tips; single-disaster lists open immediately.
