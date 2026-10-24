<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Cat and panda artwork uses lossless WebP CDN derivatives sized for high-density displays; retain original PNG pointers for future edits and prefetch loading badges from Home to avoid waiting when AI begins.
- Checklist theme icons use display-sized lossless WebP derivatives through `src/lib/themes.ts`; keep original PNG artwork for future edits while avoiding oversized downloads.
- Share URL and message formatting live in `src/lib/share.ts`; detect SMS device syntax after hydration so desktop browsers omit SMS without SSR mismatches.
- Catalog content lives only in `src/data/catalog/*.json`; read it only through `src/services/catalog.ts` (swappable data source).
- Top Tips disaster advice is built separately from ranked item rows so the advice display cannot alter ranking, item counts, or share-message selection.
- Checklist item panels portal to document.body and lock/restore page scroll; viewport-relative sizing and an independently scrolling body keep details and the close control reachable without collapsing lists.
- App public URL comes only from `src/config/app.ts` (`VITE_APP_URL` override) so hosting can change without code edits.
- No database tables or logging for household input — privacy requirement (Cloud is used only for server-side AI).
- Brand UI primitives (StackedCard, PillButton, OptionCard, FlowNav) live in `src/components/brand/`; reuse them for consistent design.
- Homepage welcome styling uses a dedicated StackedCard variant, and its source count comes from catalog.getSources() so other cards and catalog updates remain consistent.
- Homepage disaster and region controls live in the brand DisasterPicker, with catalog-sourced country options and decorative SVG pen strokes; its RegionOutline is shared with options-page disaster bars so their artwork stays consistent.
- Region selection and form position live in visit-only session state; isIntakeReady gates disaster/region and isHouseholdReady gates household text separately so each step enforces its own inputs without persistence.
- The /questions route owns the household-first sequential form, and the root shell hides regular navigation/footer there so all question types share one immersive experience.
- All AI calls go through `runAI` in `src/lib/ai.server.ts` (provider, model, endpoint live only there) so the provider can be swapped in one place.
- AI on/off is the `AI_ENABLED` server env setting (unset = on; "false"/"off"/"0" = off); when off or failing, every AI step returns empty and the plain-logic flow is used.
- AI steps pass user text only inside delimited `<user_data>` and never log inputs/outputs.
- AI personalization = Suggest then Review server fns (`src/lib/personalize.functions.ts`), validated by plain logic (`personalize-validate.ts`, `checklists.ts`); any failure or ~25s timeout falls back to the plain-logic lists.
- All provider search calls live in `src/lib/search.server.ts`; catalog-owned domain restrictions and fixed generic query mapping prevent personal text from reaching search providers.
- Keep search attempts in visit-scoped memory (including failures), capped at three and reset only on Start over; searches run during questions and join the existing personalization deadline.
- AI citation URLs must exactly match allowed search-result links through Suggest and Review; preserve approved URLs in checklist rows without changing catalog sources.
