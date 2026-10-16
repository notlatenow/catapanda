# Prompt 2: Start Screen and Checklists (no AI yet)

---

This stage builds the full checklist experience with **plain logic only**: no AI. Later stages add AI on top. If AI fails, the app falls back to exactly what you build here, so it must be complete on its own.

Get all catalog data through the catalog service from stage 1.

## 1. Start screen (Home)

- Logo and a short, friendly line explaining what CataPanda does (draft one in the brand voice: warm, casual, never fear-based).
- **"What are you preparing for?"**: option cards for Earthquake, Flood and Typhoon, each showing its name and tagline from the data. Users can select one or more. Remember the order they were selected in.
- **"Tell us about your household"**: a text box in an accent stacked card, with the placeholder "Describe your home (ex: I live with my elderly mother who uses a walker, we have a cat)".
  - Minimum 10 characters, maximum 250, with a live character count.
- **Next** stays disabled until at least one disaster is selected and the description meets the minimum.
- For now, Next goes straight to Checklist options. (The clarifying questions screen comes in stage 4.)
- Keep the description in memory for this visit only. Never save it anywhere.

## 2. Checklist options screen

Lets the user open:
- **Top 10**
- **Personalized checklist**
- **One list per selected disaster** (e.g. "Earthquake", "Flood"), in the order selected

## 3. The three kinds of list

**Single-disaster list.** All catalog items for that disaster: the shared items plus that disaster's extras.
- Household items (those with a household rule) go in a final group at the bottom headed **"If it applies to you"**.
- No CataPanda Tips.

**Personalized checklist.** Three sections, in this order:

| Section | Contents | Note under the heading |
|---|---|---|
| **Custom** | The two CataPanda Tips (AI items join them in stage 5) | "These are customized items based on the info you shared." |
| **Combo** | Catalog items that appear in **every** selected disaster's list | "These items overlap between the disasters you chose." |
| **Core** | All other catalog items from the selected disasters | "These are the remaining disaster-specific items." |

- Each catalog item appears once, matched by exact name.
- **Only one disaster selected:** hide Combo. Show Custom and Core only.
- **Household items stay hidden for now.** They appear only when a household fact unlocks them (infant, elderly, personal aids, pet). AI will supply those facts in stage 5. Build the unlocking logic now so the facts can simply be passed in later.
- **Overlap percentage** (shown with Combo): items shown in Combo ÷ (items shown in Combo + items shown in Core), rounded. Count only items actually displayed. Show it as "X% of your items prepare you for both" (2 disasters) or "…for all the disasters you chose" (3 disasters). Example: Earthquake + Flood with no household items unlocked = 21 ÷ 26 = 81%.

**Top 10.** One list across all selected disasters:
1. Grab-and-go bag (always #1)
2. Drinking water (always #2)
3. Then the highest-priority **catalog** items shown on the Personalized checklist (not the other CataPanda Tip), ties broken by the number of government sources, until there are 10.

In stage 5 the AI will rank #3–#10 and add a "why for you" line. For now, show each item's short note.

## 4. Ordering

- **Combo, Core and single-disaster lists:** one flat list by priority (Essential, then Important, then Nice-to-have), ties broken by number of government sources (more sources first). Don't group items under category headings.
- Unlocked household items sort as **Important**.
- **Custom:** CataPanda Tips first.

## 5. Item row

Items are read, never clicked into. Every row is plain text: no checkboxes, icons, colored pills or badges.

```
Item name
Short note
Category | Priority | Source | Find at [stores]
```

- **Priority** shows Essential, Important or Nice-to-have. Household items show Important.
- **Source** is one of:
  - Catalog items: **"Gov-vetted: Source ↗"**. "Source ↗" is a Bright Blue link to the Gov-vetted part of the About page's Sources section.
  - CataPanda Tips: **"CataPanda Tip"**. Plain text, no link.
- **"Find at"** appears **only on the Personalized checklist**. Stores are listed alphabetically, separated by commas, with full names (e.g. "Find at Grocery store, Pharmacy"). Items with no store type show no "Find at". On the Top 10 and single-disaster lists, the line ends after Source.
- Detail notes are never shown.
- Thin Linen dividers between rows.

Examples (metadata line):
- Drinking water: `Water & Food | Essential | Gov-vetted: Source ↗ | Find at Grocery store`
- Grab-and-go bag: `Tools & Support Aids | Essential | CataPanda Tip | Find at Hardware store, Specialty store`

## 6. Checklist view and navigation

- The checklist view shows one list at a time, with a simple way to switch between the user's lists. Keep it simple; we'll refine it later.
- The Top 10 view has a button that goes to the Share screen (built in stage 3).
- **Back, Start over, Next** work throughout. Going back and changing disasters or the description rebuilds the lists from scratch. Start over clears everything.

## Test it

- [ ] Next is disabled until a disaster is selected and the description has 10+ characters; it can't exceed 250.
- [ ] **Earthquake + Flood:** Personalized shows Custom (2 tips), Combo (21 items) and Core (5 items), with 81% overlap. Pet, infant, elderly and personal-aids items are hidden.
- [ ] **Earthquake only:** no Combo section.
- [ ] The Earthquake list ends with an "If it applies to you" group containing Infant supplies, Baby wrap / carrier, Elderly-care items, Personal aids: vision, hearing, mobility, and Pet supplies.
- [ ] Top 10 starts with Grab-and-go bag, then Drinking water.
- [ ] "Find at" appears only on the Personalized checklist, with stores in alphabetical order.
- [ ] Item rows match the format exactly.
