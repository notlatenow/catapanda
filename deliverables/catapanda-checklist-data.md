# CataPanda — Checklist Reference Data

This is the vetted, human-curated source of truth for the CataPanda app. Every checklist item, note and tip below was collected by hand from official government / civil-defense disaster-preparedness guidance. Use the items exactly as written. AI features must treat this catalog as the authoritative baseline. AI must never silently rename, remove, or alter these items, and must never present its own content as if it came from this catalog.

## How this data was made (provenance)

1. About 30 official disaster-preparedness PDFs were collected (Taiwan NFA, Singapore SCDF, Brunei NDMC, the Philippines handbook, Japan, and regional handbooks), along with a list of government agency websites for 16 Asia-Pacific countries.
2. The PDFs were read and cross-referenced against those agencies, then the live agency websites were checked for anything the PDFs missed.
3. General country handbooks (the CFE-DM series, UNDAC and similar) describe national relief systems, not personal go-bag contents, so they were not cited. Several agency sites had no reachable item list. That leaves **7 agencies** as item sources.
4. Every item is tagged with the source code(s) of the agencies that actually recommend it. Codes map to specific documents in the Source Index below. Sources are cited per agency document, not per page.

**Fields added by the CataPanda team (not from the government sources):**
- **Priority**: a team judgment call that loosely follows how many agencies name the item (5+ sources ≈ essential, 3–4 ≈ important, 2 ≈ nice-to-have). Disaster-specific items with a single source were ranked on judgment. For example, the fire extinguisher has one source (KR) but is ranked essential.
- **Where to buy**: a team-added shopping hint.
- **Short notes**: written by the team, max 50 characters, condensed from the detail notes. Four items had no source note; their short notes are team-written and marked.

## How the data fits together

- A disaster's full checklist = all **Core Items** (shared by every disaster) + that disaster's **Extra Items**.
- Item names are unique; the app identifies items by exact name.
- Every item has: a name, a category, a **short note (max 50 characters, always shown)**, optional longer detail notes from the sources, source codes, a priority, and where-to-buy store types (empty means it isn't something you buy, e.g. documents).
- **Priority order:** `essential` > `important` > `nice-to-have`. `conditional` items only apply to certain households (infant, elderly, personal aids, pet). They're hidden unless the household matches, and display and sort as Important once shown.
- **Category order:** Water & Food · First Aid & Medication · Hygiene & Sanitation · Light, Power & Communication · Documents & Money · Clothing & Protection · Tools & Support Aids · Household & Special Needs. These 8 are fixed: every item (core, disaster extra, CataPanda Tip or AI-added) uses one of them.

## Store types (where to buy)

A fixed list. Every item's "Where to buy" uses only these, or none for things you don't buy (documents, cash, things you make yourself). When an item has more than one store type, list them in **alphabetical order**. Store types are a team-added shopping hint, not from the government sources.

1. Grocery store
2. Hardware store
3. Pharmacy
4. Specialty store (catch-all for anything that doesn't fit the others, e.g. baby, pet or medical supplies)

**Not in this version:** "Online" is left out on purpose. In a disaster, people may not have time to order online and wait for delivery. It may return in a later version that splits checklists into proactive (prepare ahead) and reactive (disaster is coming) lists.

## Source index

| Code | Country | Agency | Document used | Website |
|---|---|---|---|---|
| BN | Brunei | Brunei National Disaster Management Centre (NDMC / Pusat Pengurusan Bencana Kebangsaan) | Public Safety Basics Guidebook (2025 ed.), “Penyediaan Beg Kecemasan (Beg 72 Jam)” – 72-Hour Bag | https://www.ndmc.gov.bn/ |
| HK | Hong Kong | Hong Kong Security Bureau | “Simple Guidelines in the Event of Major Mishaps,” Emergency Kit section | https://www.sb.gov.hk/eng/emergency/index.html |
| ID | Indonesia | BPBD DIY — Yogyakarta Regional Disaster Management Agency (under Indonesia's national BNPB) | “Tas Siaga Bencana” (Disaster Preparedness Bag) guide — live site; BNPB's national homepage has no item list, so its regional agency's published list is used | https://www.bnpb.go.id/ (national parent agency) |
| KR | South Korea | Republic of Korea Ministry of the Interior and Safety — Safe Korea | Safe Korea Action Guides — Typhoon, Heavy Rain & Earthquake (live site) | https://eng.safekorea.go.kr/safekorea-eng/acts/nacts/action-guide.do?&category=earthQuake (also category=heavyRain, category=typhoon) |
| PH | Philippines | Philippine Senate Committee on Climate Change, with PHIVOLCS, NDRRMC, DepEd, DOH, PAGASA, BFP & MGB | Disaster Preparedness & First Aid Handbook — Earthquake Survival Kit list | Supplied as a PDF; closest listed government site: https://climate.gov.ph/ |
| SG | Singapore | Singapore Civil Defence Force (SCDF) | SCDF Emergency Preparedness Handbook (2026 ed.), Chapter 3 – “Ready Bag”, cross-checked against the live Ready Bag page | https://www.scdf.gov.sg/home/community-and-volunteers/fire-emergency-guides/ready-bag-for-emergency |
| TW | Taiwan | Taiwan National Fire Agency (NFA) & Taipei Fire Department (TFDP) | 緊急避難包準備方向 (Emergency Evacuation Bag Preparation Guide) — 24/48/72-Hour editions, plus TFDP's live Earthquake “Daily Preparation” and Typhoon “Typhoon Preparation” pages | https://www.nfa.gov.tw/eng/index.php?code=list&flag=detail&ids=1371&article_id=8958 · https://www.tfdp.com.tw/en/index.php?code=list&flag=detail&ids=170&article_id=1261 |

## Disaster types

### Earthquake

- **Tagline:** Ground shaking causing structural damage
- **Extra items:** 5

**What to do — earthquake guidance** (source code in brackets)

_Five items above (sturdy rope, water-resistant matches, fire extinguisher, baby wrap, and head/neck protection) come from sources that name an earthquake-specific kit. The behaviours below are what the sources stress once the shaking starts or stops:_

- Taiwan's whole bag series is built around this scenario: keep the bag by the door so it can be grabbed immediately if a building is damaged and evacuation is required. [TW]
- Store roughly 3 days of food per person at home (in addition to your bag), and secure heavy furniture to the wall so it can't topple. [TW]
- Put on sturdy shoes before moving around afterward — broken glass on the floor is a common injury source. [SG]
- If trapped under debris, use a whistle, a torchlight, or tap on a pipe or wall to attract rescuers' attention — shouting tires you out and risks inhaling dust. [SG]
- If pinned down, move periodically to prevent blood clots, and keep your spirits up while waiting for rescue. [SG]
- Keep calm and douse any open flames immediately; take cover under sturdy furniture, away from glass. [HK]
- After the shaking stops, check for a gas leak before using any flame — open windows, shut off the main valve, and report it rather than lighting anything. [HK]
- Know how to give first aid and how to use a fire extinguisher — practise both before you need them. [KR]
- A stroller is hard to manoeuvre over debris; a baby wrap or carrier is easier to evacuate with. If sheltering in place, use a cushion, folded clothing or a thick book to protect your head and neck. [KR]

### Flood

- **Tagline:** Rising water from storms, rivers, or coastal surge
- **Extra items:** 1

**What to do — flood guidance** (source code in brackets)

_The sourced documents mostly focus on evacuation behaviour for floods rather than flood-only gear — the one addition is South Korea's Safe Korea heavy-rain guide, which adds a portable burner (see the checklist above). Otherwise, the core kit doubles as your flood bag; below is what the sources emphasise doing with it._

- Move to higher ground. Stay put but grab your bag and be ready to evacuate the moment authorities advise it. [SG]
- If it feels dangerous to remain home, call the emergency line and evacuate immediately, away from open areas, streams and storm drains. [SG]
- Don't walk through moving water higher than ankle height; if you must, use a stick to check the ground ahead of you. [SG]
- Flooding is more likely in low-lying or poorly-drained areas — check drains and clear blockages before the rainy season. [HK]
- If your home is at risk, leave early and shelter elsewhere until the rain subsides. [HK]
- In coastal or low-lying areas, a storm surge can flood the shoreline with little warning — move to high ground immediately and contact the police if you need help. [HK]
- Stock at least 3 days of food and water per person and keep it together in one place; also fill your bathtub in advance as a backup water supply in case the mains are cut. [KR]
- Fuel your car ahead of time or arrange transport with a neighbour, and clean drains and gutters and inspect nearby slopes/retaining walls before heavy rain arrives. [KR]

### Typhoon

- **Tagline:** Tropical storms with high winds & flooding
- **Extra items:** none — uses core items only

**What to do — typhoon guidance** (source code in brackets)

_No items beyond the core kit were uniquely specified for typhoons — checking Taiwan's and South Korea's live sites confirmed this, though both add useful home-hardening steps alongside the bag. The sources put particular weight on a few items and behaviours as storms escalate:_

- Keep a flashlight and first aid kit within reach — they're specifically called out for the power outages and storm-related injuries typhoons cause. [SG]
- Set your freezer to its lowest setting ahead of time to slow food spoilage if the power goes out. [SG]
- Tune in to the radio for updates throughout the storm — don't step outside during a lull, as winds can pick up again. [SG]
- Hong Kong grades storms on an escalating signal system (No. 1 through No. 10); as the signal rises, finish your preparations, stay indoors and lock windows and doors, and keep monitoring radio or TV broadcasts. [HK]
- A storm surge riding on a high tide can flood coastal areas — residents in low-lying coastal areas should move to high ground and contact police if assistance is needed. [HK]
- At home, lay in sandbags and waterproof flood gates, clear your gutters, and reinforce or bring in windows, signage and hanging planters before the storm arrives. [TW]
- Apply safety film or tape to windows, place sandbags or water barriers at basement entrances, and move parked vehicles and loose outdoor objects to safety. [KR]

## Using & maintaining the bag (applies to all disasters)

- Pack one bag per family member if possible; keep it lightweight and easy to carry. [TW]
- Store the bag near the front door or entryway so it's grabbed quickly in the dark. [TW]
- Suggested maximum weight per bag: about 15 kg for men, 10 kg for women. [TW]
- Check and update the bag's contents every six months — watch expiry dates on food, medication and masks. [TW]
- Store batteries alongside devices, not inside them, to avoid leakage or corrosion; swap in fresh ones periodically. [SG]
- If you carry a power bank, recharge it every 2–3 months so it's ready when needed. [SG]

## Core items (shared by all disasters, 25 items)

### Water & Food

#### Drinking water
- **Short note:** 3 L per person, per day
- **Category:** Water & Food
- **Priority:** essential
- **Sources:** TW, HK, BN, PH, KR, ID
- **Where to buy:** Grocery store
- **Detail notes (from sources):** Taiwan: at least 15 mL per kg of body weight, per person, per day. Brunei: 3 L per person, per day.

#### Non-perishable / ready-to-eat food
- **Short note:** Ready-to-eat: biscuits, instant meals, candy
- **Category:** Water & Food
- **Priority:** essential
- **Sources:** TW, HK, BN, PH, KR, ID
- **Where to buy:** Grocery store
- **Detail notes (from sources):** Biscuits, chocolate, emergency food packs, vacuum-packed instant meals, candies.

### First Aid & Medication

#### First aid kit
- **Short note:** Gauze, iodine, swabs, pain relief, thermometer
- **Category:** First Aid & Medication
- **Priority:** essential
- **Sources:** TW, SG, HK, BN, PH, KR, ID
- **Where to buy:** Pharmacy
- **Detail notes (from sources):** Iodine, cotton swabs, gauze, pain-relief patches or ointment, thermometer.

#### Personal medications
- **Short note:** Daily prescriptions; check expiry dates
- **Category:** First Aid & Medication
- **Priority:** important
- **Sources:** TW, SG, BN, ID
- **Where to buy:** Pharmacy
- **Detail notes (from sources):** Daily prescriptions and standby medication for chronic conditions (e.g. high blood pressure, asthma, diabetes). Note storage method and expiry dates.

### Hygiene & Sanitation

#### Face masks (N95 or surgical)
- **Short note:** Protects against dust, debris and pollutants
- **Category:** Hygiene & Sanitation
- **Priority:** important
- **Sources:** TW, SG, BN, PH
- **Where to buy:** Grocery store, Pharmacy
- **Detail notes (from sources):** Protection from dust, debris and airborne pollutants.

#### Hand sanitiser, wet wipes, tissues
- **Short note:** Keep hands clean when water is limited _(team-written — no source note existed)_
- **Category:** Hygiene & Sanitation
- **Priority:** nice-to-have
- **Sources:** TW, BN
- **Where to buy:** Grocery store, Pharmacy

#### Soap & personal hygiene items
- **Short note:** Include a toothbrush and toothpaste
- **Category:** Hygiene & Sanitation
- **Priority:** nice-to-have
- **Sources:** BN, ID
- **Where to buy:** Grocery store, Pharmacy
- **Detail notes (from sources):** Indonesia's BPBD DIY guide specifically names a toothbrush and toothpaste.

#### Sanitary pads / diapers
- **Short note:** Pads, liners; baby diapers if needed
- **Category:** Hygiene & Sanitation
- **Priority:** nice-to-have
- **Sources:** TW, BN
- **Where to buy:** Pharmacy, Specialty store
- **Detail notes (from sources):** Panty liners; baby diapers if needed.

### Light, Power & Communication

#### Flashlight or headlamp
- **Short note:** Store batteries separately to avoid leaks
- **Category:** Light, Power & Communication
- **Priority:** essential
- **Sources:** TW, SG, HK, BN, PH, KR, ID
- **Where to buy:** Hardware store
- **Detail notes (from sources):** Store separately from its batteries to avoid leakage or corrosion.

#### Spare batteries
- **Short note:** Store outside devices to prevent corrosion
- **Category:** Light, Power & Communication
- **Priority:** essential
- **Sources:** TW, SG, HK, BN, KR
- **Where to buy:** Grocery store, Hardware store
- **Detail notes (from sources):** Pack extra; don't leave batteries fitted in devices while stored.

#### Portable radio
- **Short note:** Solar or hand-crank models preferred
- **Category:** Light, Power & Communication
- **Priority:** essential
- **Sources:** TW, HK, BN, PH, SG, KR
- **Where to buy:** Hardware store, Specialty store
- **Detail notes (from sources):** Solar- or hand-crank-rechargeable preferred. Singapore's SCDF lists this as optional.

#### Power bank & charging cable
- **Short note:** Recharge every 2–3 months
- **Category:** Light, Power & Communication
- **Priority:** important
- **Sources:** TW, SG, KR, ID
- **Where to buy:** Hardware store, Specialty store
- **Detail notes (from sources):** Recharge it every 2-3 months so it stays usable. Singapore's SCDF lists this as optional.

### Documents & Money

#### Copies of ID card & health/insurance card
- **Short note:** Keep copies in a waterproof folder or phone
- **Category:** Documents & Money
- **Priority:** important
- **Sources:** TW, BN, SG, ID
- **Where to buy:** — (not a purchase)
- **Detail notes (from sources):** Physical copies or digital copies on your phone. Singapore's SCDF specifically recommends a waterproof folder for the physical copies.

#### Small amount of cash
- **Short note:** Small notes and coins
- **Category:** Documents & Money
- **Priority:** nice-to-have
- **Sources:** TW, SG
- **Where to buy:** — (not a purchase)
- **Detail notes (from sources):** Small notes/coins, useful for pay phones or vending machines. Singapore's SCDF lists this as optional.

#### List of essential phone numbers
- **Short note:** Family, utilities, insurer, out-of-area contact
- **Category:** Documents & Money
- **Priority:** nice-to-have
- **Sources:** SG, TW
- **Where to buy:** — (not a purchase)
- **Detail notes (from sources):** Utility companies, insurer, an out-of-area contact. Taiwan's TFDP frames this as a family emergency contact card.

### Clothing & Protection

#### Spare clothing, incl. a raincoat
- **Short note:** Pack a change of clothes and a raincoat _(team-written — no source note existed)_
- **Category:** Clothing & Protection
- **Priority:** important
- **Sources:** TW, BN, SG, ID
- **Where to buy:** Grocery store, Specialty store

#### Sturdy, closed-toe shoes
- **Short note:** For walking over debris and broken glass
- **Category:** Clothing & Protection
- **Priority:** important
- **Sources:** TW, BN, KR
- **Where to buy:** Grocery store, Specialty store
- **Detail notes (from sources):** For walking over debris or broken glass during evacuation. South Korea's Safe Korea calls these out as "thick indoor shoes."

#### Gloves
- **Short note:** Cut-resistant and durable
- **Category:** Clothing & Protection
- **Priority:** nice-to-have
- **Sources:** TW, BN
- **Where to buy:** Hardware store
- **Detail notes (from sources):** Cut-resistant, durable.

#### Blanket (incl. thermal/emergency blanket)
- **Short note:** Thermal/emergency blankets pack small _(team-written — no source note existed)_
- **Category:** Clothing & Protection
- **Priority:** important
- **Sources:** TW, PH, KR
- **Where to buy:** Hardware store, Specialty store

### Tools & Support Aids

#### Whistle
- **Short note:** Call for help without shouting
- **Category:** Tools & Support Aids
- **Priority:** essential
- **Sources:** TW, SG, HK, PH, ID
- **Where to buy:** Hardware store, Specialty store
- **Detail notes (from sources):** To call for help without shouting, which tires you and risks inhaling dust or smoke.

#### Multi-tool, small knife or scissors
- **Short note:** One compact tool for cutting and repairs _(team-written — no source note existed)_
- **Category:** Tools & Support Aids
- **Priority:** nice-to-have
- **Sources:** TW, BN
- **Where to buy:** Hardware store

#### Personal aids: vision, hearing, mobility
- **Short note:** Spare glasses, hearing aid batteries, cane
- **Category:** Tools & Support Aids
- **Priority:** conditional
- **Sources:** TW, BN
- **Where to buy:** Pharmacy
- **Detail notes (from sources):** Cane, dentures, hearing aids (+ batteries), reading glasses.
- **Team note:** Listed separately from "Elderly-care items" because these aids are used by people of any age. Same TW/BN sources.

### Household & Special Needs

#### Infant supplies
- **Short note:** Formula, bottles, baby food, diapers, pacifier
- **Category:** Household & Special Needs
- **Priority:** conditional
- **Sources:** TW, BN
- **Where to buy:** Pharmacy, Specialty store
- **Detail notes (from sources):** Formula, bottles, vacuum-packed/canned baby food, diapers, pacifiers, small toys.

#### Elderly-care items
- **Short note:** Adult diapers, easy-to-eat senior food
- **Category:** Household & Special Needs
- **Priority:** conditional
- **Sources:** TW, BN
- **Where to buy:** Grocery store, Pharmacy
- **Detail notes (from sources):** Adult diapers, easy-to-eat/senior-friendly food. (Original source list also included cane, dentures, hearing aids and reading glasses; those now live in "Personal aids: vision, hearing, mobility".)

#### Pet supplies
- **Short note:** Food, medication, carrier, leash, blanket
- **Category:** Household & Special Needs
- **Priority:** conditional
- **Sources:** TW
- **Where to buy:** Specialty store
- **Detail notes (from sources):** Pet food, regular medication, carrier, leash, warm blanket.

## Earthquake extra items (5)

#### Sturdy rope
- **Short note:** From the Philippines' earthquake survival kit
- **Category:** Tools & Support Aids
- **Priority:** important
- **Sources:** PH
- **Where to buy:** Hardware store
- **Detail notes (from sources):** Listed in the Philippines' named earthquake survival kit.

#### Water-resistant matches
- **Short note:** From the Philippines' earthquake survival kit
- **Category:** Tools & Support Aids
- **Priority:** important
- **Sources:** PH
- **Where to buy:** Grocery store, Hardware store
- **Detail notes (from sources):** Listed in the Philippines' named earthquake survival kit.

#### Fire extinguisher
- **Short note:** Keep one handy and learn how to use it
- **Category:** Tools & Support Aids
- **Priority:** essential
- **Sources:** KR
- **Where to buy:** Hardware store
- **Detail notes (from sources):** Keep one handy and learn how to use it.

#### Baby wrap / carrier
- **Short note:** Easier than a stroller over debris
- **Category:** Household & Special Needs
- **Priority:** conditional
- **Sources:** KR
- **Where to buy:** Specialty store
- **Detail notes (from sources):** A stroller is difficult to use over debris while evacuating with an infant.

#### Head/neck protection (cushion, folded clothing, or a thick book)
- **Short note:** Shield head and neck while taking cover
- **Category:** Clothing & Protection
- **Priority:** important
- **Sources:** KR
- **Where to buy:** — (not a purchase)
- **Detail notes (from sources):** To shield your head and neck while taking cover.

## Flood extra items (1)

#### Portable burner / camp stove
- **Short note:** For cooking if utilities are cut
- **Category:** Water & Food
- **Priority:** important
- **Sources:** KR
- **Where to buy:** Hardware store, Specialty store
- **Detail notes (from sources):** For cooking if utilities are cut during prolonged flooding.

## Typhoon extra items (0)

None. The typhoon checklist is the core items only.

## Always-included custom items — "CataPanda Tips"

These two items (called **CataPanda Tips** on the About page) appear in the **Custom** section of every personalized checklist, no matter what the user writes or what the AI adds. They are **not core items** (not part of the government-vetted catalog) and **not AI-generated**. They're added by plain app logic. The AI must not remove them or suggest duplicates of them.

#### Grab-and-go bag
- **Short note:** Lightweight, by the door, on back or shoulder
- **Priority:** essential (always)
- **Where to buy:** Hardware store, Specialty store
- **Category:** Tools & Support Aids
- **Basis:** Research-backed. Taiwan's NFA/TFDP guides are built around the evacuation bag: pack one bag per family member, keep it lightweight and easy to carry, store it near the front door, suggested maximum weight per bag about 15 kg for men and 10 kg for women, check contents every six months. [TW]

#### Personal medical info card
- **Short note:** Blood type, allergies, conditions, medications
- **Priority:** essential (always)
- **Where to buy:** — (not a purchase)
- **Category:** First Aid & Medication
- **Basis:** Team-added (not in the government sources). Complements the core "Personal medications" item.

## Conditional-item rules

These catalog items only appear when the household matches. Household facts come from the user's description and answers; they're never guessed.

| Item | Shown when |
|---|---|
| Infant supplies | The household has an infant, or is expecting a baby |
| Baby wrap / carrier (Earthquake) | The household has an infant, or is expecting a baby |
| Elderly-care items | Someone is 65+, or uses elderly-care aids |
| Personal aids: vision, hearing, mobility | Anyone uses glasses, hearing aids, a cane, dentures or similar aids (any age) |
| Pet supplies | The household has a pet |

- Other household needs (mobility, medical devices, allergies, special diets) don't unlock catalog items. The AI considers them when suggesting custom items and ranking the Top 10. For example, someone who uses a walker makes sturdy shoes and the whistle more important; someone on an oxygen machine or CPAP makes the power bank and batteries more important.
- Aids not in the sources (crutches, walkers, wheelchairs, safety goggles) and medical devices (oxygen, CPAP, dialysis) are never catalog items; the AI adds them as custom items (paired with "Personal aids: vision, hearing, mobility" when they're a specialization of it).
