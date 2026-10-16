# Catastrophic Pandamonium: Lovable Build Prompts

Eight staged prompts for building the Catastrophic Pandamonium (CataPanda) MVP in Lovable. Paste them one at a time, in order. Test each stage before moving on.

## Before prompt 1

1. Create a new Lovable project.
2. **Connect the project to GitHub** so the code lives in your own repository.
3. Have these files ready to attach to prompt 1:
   - `catapanda-checklist-data.md`: the catalog, sources and tips (in the main folder)
   - `assets/web-logo.png`: the logo
   - `assets/web-mascots.png`: the cat and panda mascots

## Before prompt 6 (live search)

Add the Perplexity connector:
**Connectors → Perplexity → Add connection → App + chat connector → Configure connection: Managed by Lovable → Connect**, then link it to this project. No Perplexity account or API key is needed.

## The stages

| # | File | Builds | AI? |
|---|---|---|---|
| 1 | `01-foundation.md` | Design system, catalog data files, catalog service, app shell and navigation | No |
| 2 | `02-intake-and-checklists.md` | Start screen, checklist options, all three list types and item rows, built with plain logic | No |
| 3 | `03-about-and-share.md` | About page with Sources, Share screen, footer | No |
| 4 | `04-ai-foundation-and-clarify.md` | Lovable Cloud, the single AI function, privacy rules, clarifying questions screen | Yes |
| 5 | `05-suggest-review-and-loading.md` | AI-added items, review step, AI Top 10, loading screen, fallbacks | Yes |
| 6 | `06-live-search.md` | Live web search for niche needs, source links, background search | Yes |
| 7 | `07-polish-and-test.md` | Status messages, test scenarios, privacy and portability checks | — |
| 8 | `08-stretch-taiwan-guide.md` | **Stretch goal.** Taiwan educational page. Only when everything else works. | No |

Stages 1–3 produce a complete, working app with no AI. Stages 4–6 add AI on top. If AI ever fails, the app falls back to what stages 1–3 built.

## Before submitting (SheBuilds Season 04)

- Prompt 7 runs Lovable's security check and publishes the app. **Resolve security errors before submitting.**
- Test the published **.lovable.app** URL on a phone in a private window.
- Fill in the Hub form using the drafts in `../submission-checklist.md`.

## Tips

- **One prompt at a time.** Wait for Lovable to finish, then click through the "Test it" checklist at the end of each prompt before sending the next.
- **Test on a phone-sized screen.** The app is mobile-first.
- **If Lovable drifts** (adds features, changes earlier decisions, hardcodes catalog data), point it back to the prompt, or revert to the last good version.
- **Small fixes between stages are fine.** Use short follow-up messages; you don't need to resend a whole prompt.
- **Before the demo:** two hidden on/off switches, stored as environment settings, let you scale back if anything misbehaves. Ask Lovable to flip them:
  - **Search switch** (small dial): turns off only live web search. Questions and AI items still work.
  - **AI switch** (master switch): turns off all AI, including search. The app serves the gov-vetted lists, CataPanda Tips and standard Top 10.
