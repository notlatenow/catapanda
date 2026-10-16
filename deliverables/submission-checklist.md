# SheBuilds Season 04: Submission Checklist

Draft answers for each field of the Hub submission form. Edit them to match what you actually built. Replace anything in [brackets].

**Reminders from the organizers**
- No demo video is required, and none will be reviewed.
- A GitHub or custom-domain link **doesn't replace** the required .lovable.app URL.
- Test the published link before submitting.
- Resolve security errors before submitting. Warnings alone don't disqualify you.

---

## Required

### Project name
> Catastrophic Pandamonium (CataPanda)

### Published .lovable.app URL
> https://[your-project].lovable.app

Test it on a phone, in a private or incognito window, before submitting.

### Short description
> Catastrophic Pandamonium (CataPanda) builds a personalized disaster-prep checklist in under 3 minutes. Pick the disasters you're preparing for, describe your household in a sentence, answer a few quick questions, and get a Top 10, a full personalized list and a list for each disaster. Every item comes from government-vetted guidance or is clearly labeled as an AI suggestion, and you can share your Top 10 with family in one tap.

### The problem you're solving and your intended user
> **Problem:** Disaster-prep information is fragmented, outdated, one-size-fits-all and hard to act on. Many government websites don't offer public checklists, or split guidance by disaster type, so people click through five pages to build one plan. Generic lists don't fit real households, from a toddler with allergies to a grandparent with a cane. And general AI chatbots give advice you can't trace, which is risky for safety.
>
> **Solution:** CataPanda combines a hand-researched catalog from 7 government and civil-defense agencies with AI that personalizes it. The AI asks clarifying questions instead of guessing, adds household-specific items, removes duplicates and ranks the Top 10. It never changes the vetted items, and medical suggestions say "Check with your doctor."
>
> **Intended user:** The general public living with recurring natural disasters, starting with Taiwan (earthquakes, floods, typhoons). That includes people moving to a disaster-prone area, households needing tailored plans (disability, age, pregnancy, pets, medical devices), people packing a go-bag before disaster season, and people preparing for an impending disaster. Secondary users are disaster-response advocates and relief professionals using it as an educational tool.

### Final category
> Social Good: Civic Engagement

(Confirm this exact option is among the 6 on the form.)

### Up to 3 screenshots
Take them on a phone-sized screen. Suggested:
1. **Start screen:** the logo, the three disaster options selected, and a household description typed in.
2. **Personalized checklist:** the Custom section showing CataPanda Tips, an AI item with "AI: Source ↗", and a specialization pair (e.g. Pet supplies + Wheat-free dog food). Ideally also the Combo overlap percentage.
3. **Top 10 with the Share screen:** "why for you" lines and the share options.

---

## Optional

### Additional context
> CataPanda is designed so AI is core but constrained. Tier 1 is a vetted catalog researched from about 30 official documents, with 7 agencies as item sources (Taiwan, Singapore, Hong Kong, South Korea, the Philippines, Brunei, Indonesia). Tier 2 is AI reasoning for common needs. Tier 3 is live web search for niche needs, restricted to government and health-authority sites, with a link to each source. Every item shows its source label. If AI or search is unavailable, the app falls back to the complete gov-vetted lists. Household descriptions are never stored or reshared. Built by Alex Hana, who lives in Taiwan on the Pacific Ring of Fire.

### Testing instructions
> No login needed. Open the link on a phone.
> 1. Select **Earthquake** and **Flood**.
> 2. Paste this household description: "i live on the 5th floor with my mom, dad, dog, and little sister. my dad uses an oxygen machine. my sister has sensitive skins and gets rashes easily. my dog can't eat any dog food with wheat in it."
> 3. Answer or skip the clarifying questions.
> 4. Open the **Personalized** checklist: see the custom items (e.g. wheat-free dog food paired with Pet supplies; an oxygen-machine item linking to an official source), then the Combo overlap section.
> 5. Open the **Top 10** and tap Share.
> 6. Try again with "i live alone in my home" to see how the lists change.

### Safe demo access if login is required
> Not applicable: no login.

### Known limitations
> - MVP covers Taiwan only, with three disasters (earthquake, flood, typhoon), in English.
> - No accounts: lists aren't saved between visits.
> - Store suggestions are generic types (e.g. Pharmacy), not specific shops.
> - AI suggestions can be imperfect; they're labeled "AI", and medical items say "Check with your doctor."
> - Live search only covers government and health-authority sites listed in the app's allowed-sites list.
> - Full WCAG AA accessibility is planned for v2.
> - [Add anything that didn't make it into the build, e.g. the Taiwan educational page.]

---

## Final checks
- [ ] Published .lovable.app URL works in a private window on a phone
- [ ] No security errors remain
- [ ] 3 screenshots ready
- [ ] All required fields filled in
