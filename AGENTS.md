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
- Catalog content lives only in `src/data/catalog/*.json`; read it only through `src/services/catalog.ts` (swappable data source).
- App public URL comes only from `src/config/app.ts` (`VITE_APP_URL` override) so hosting can change without code edits.
- No database or logging for household input — privacy requirement.
- Brand UI primitives (StackedCard, PillButton, OptionCard, FlowNav) live in `src/components/brand/`; reuse them for consistent design.
