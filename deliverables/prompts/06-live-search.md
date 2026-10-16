# Prompt 6: Live Web Search for Niche Needs

---

## Before you start

This stage uses the **Perplexity connector (Managed by Lovable)**. Check that it's connected and linked to this project. **If it isn't, stop and ask me to set it up.** Don't substitute another service.

## What this adds

Tier 3 of the system: for **niche needs only** (medical devices and their power needs, rare or severe allergies, region-specific rules), the app searches official websites and the AI builds items from the results. Those items link to the page they came from.

## 1. The single search function

- Create **one search function** that every search goes through. It calls Perplexity's Search API through the managed connector and returns results (title, link, snippet). Everything Perplexity-specific stays inside it, so we can switch search providers later by changing only this function.
- Searches run on the server, never in the browser.
- Add a **search on/off switch** (default on), stored as an **environment setting, not a value in the code**. When off, only live search stops: clarifying questions, AI items and Review keep working exactly as in stage 5. (The AI switch from stage 4 turns off everything, including search.)

## 2. Which sites are allowed

- Keep an **allowed-sites list as a data file**, not in code. Start with government and health-authority sites, for example Taiwan government sites (gov.tw, including the Ministry of Health and Welfare and Taiwan CDC), other national government sites, and the World Health Organization. Manufacturer websites can be added to the list later.
- Restrict every search to the allowed sites.
- Discard any result whose link isn't on the allowed list.

## 3. When searches run

- **During the clarifying questions:** as soon as Clarify returns its search needs (stage 4), start those searches **in the background** while the user answers.
- **After the answers:** if an answer reveals a new niche need (e.g. "Yes, my mother uses a CPAP machine"), search for it before Suggest runs.
- **At most 3 searches per visit.** Give each search about 8 seconds. Skip any that fail or time out; the rest of the app carries on.
- Common needs (pets, diets, sensitive skin, pregnancy) never trigger a search.

## 4. Privacy

- Search queries describe the **need** generically (e.g. "oxygen concentrator power outage backup"). **Never include the user's own words, names, ages, locations or other personal details.**
- Don't store or log queries tied to a user's description.

## 5. Using results

- Pass the results (title, link, snippet) to Suggest.
- An AI item based on a search result includes that result's link. The app accepts the link only if it exactly matches one of the returned results.
- That item's row shows **"AI: Source ↗"**, which opens the **outside page** in a new tab. AI items without a search link still go to the About page tiers section.
- All Suggest and Review rules from stage 5 still apply, including "Check with your doctor" on medical items, and no quantities, dosages or battery runtimes.

## 6. About page

In the AI section, complete **Tier 3**: live web search is used only for niche needs, searches only government, health-authority and manufacturer sites, never sends the user's own words, and links each item to its source.

## Test it

- [ ] **Busy family** (oxygen machine): a search runs in the background during the questions. An oxygen-related item appears with "AI: Source ↗" linking to an allowed official page, plus "Check with your doctor".
- [ ] **Lives alone:** no searches run.
- [ ] **Wheat-free dog food** does not trigger a search (common need).
- [ ] Search queries contain no personal details. Ask Lovable to show you the queries generated for the test descriptions (without adding permanent logging).
- [ ] With the search switch off, everything works as in stage 5.
- [ ] With search failing or slow, the lists still load within the stage 5 time limit.
