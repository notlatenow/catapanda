# Prompt 3: About Page and Sharing

---

This stage adds the About page, the Share screen and the footer. Still no AI.

## 1. About page

Write it in the brand voice: warm, casual, clear and honest. Use short sections and plenty of space.

**What CataPanda is:** a short intro.

**Sources section.** Every "Source ↗" link on a checklist points here. Give each part its own anchor so links land in the right place.

1. **Gov-vetted**
   - Explain that "core" items come from a catalog the CataPanda team hand-researched from official government and civil-defense disaster-preparedness guidance. Summarize the "How this data was made" section of the catalog file: about 30 official documents reviewed, cross-checked against agency websites, and 7 agencies used as item sources.
   - Say the catalog will be updated as more government sources are added.
   - **List the government sources by name, with links to their websites, generated from the source data** (not typed into the page). Adding a source to the data should make it appear here automatically.
   - Explain that on the Personalized checklist, both the Combo and Core sections are made of these vetted core items.
2. **CataPanda Tips:** the two items the CataPanda team always includes (Grab-and-go bag, Personal medical info card) and why.
3. **AI:** a short placeholder saying CataPanda uses AI to personalize lists. We'll fill this in during stage 5. Include an anchor for "How the tiers work".

**Privacy:** a short, plain statement: "The household description you enter is used only to build your lists. We don't store it or share it."

## 2. Share screen (from the Top 10)

A dedicated screen with ways to share the user's Top 10. Offer exactly these five:
- **Email:** opens the email app with the message filled in
- **SMS text message:** opens the messaging app with the message filled in
- **WhatsApp:** opens WhatsApp with the message filled in
- **Signal**
- **Instagram**

Signal and Instagram don't accept a pre-filled message from a link. For those two, open the phone's built-in share sheet with the message, so the user can pick the app. Where that isn't available, copy the message to the clipboard, tell the user it's copied, and let them paste it in.

Also include a **"Copy message"** button.

**Message format** (item names only, no notes or reasons):

```
Made for [disasters] disasters, here's my top 10 list for disaster prep in [country]! Use this free tool to prepare your own list: Catastrophic Pandamonium [app URL]

(1) [item 1], (2) [item 2], (3) [item 3], (4) [item 4], (5) [item 5], (6) [item 6], (7) [item 7], (8) [item 8], (9) [item 9], (10) [item 10]
```

- **[disasters]:** lowercase, in the order the user selected them: one → "flood"; two → "flood & earthquake"; three → "earthquake, flood & typhoon".
- **[country]:** "Taiwan".
- **[app URL]:** the full URL from the app URL configuration setting, written out in full (messaging apps send plain text, so the link can't hide behind words).
- **Item names:** exactly as shown in the app.
- **Never include the household description** or anything else the user typed.

Example:
> Made for flood & earthquake disasters, here's my top 10 list for disaster prep in Taiwan! Use this free tool to prepare your own list: Catastrophic Pandamonium https://[app URL]
>
> (1) Grab-and-go bag, (2) Drinking water, (3) …

Show a preview of the message on the screen.

## 3. Footer

On every screen, a small footer:
> "Gov-vetted items are checked against government sources. Items marked 'AI' are AI recommendations — check them against your own needs."

## Test it

- [ ] Every "Gov-vetted: Source ↗" link opens the Gov-vetted part of the About page.
- [ ] The government source list matches the data. Add a test source to the data file and confirm it appears without code changes, then remove it.
- [ ] Select Flood, then Earthquake: the share message says "Made for flood & earthquake disasters" and lists 10 items starting with Grab-and-go bag and Drinking water.
- [ ] The share message contains the full app URL and no household description.
- [ ] Email, SMS, WhatsApp, Signal, Instagram and Copy message all work on a phone.
