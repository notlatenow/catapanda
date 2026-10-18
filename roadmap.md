# Checklist redesign — done
- [x] 15 hand-drawn theme icons (src/assets/icons/, checklist = catch-all)
- [x] Theme mapping: src/lib/themes.ts (name → category → catch-all)
- [x] Clickable rows: icon + name + chevron (src/routes/checklist.tsx)
- [x] Sliding detail panel: src/components/brand/ItemPanel.tsx (bottom sheet mobile / centered desktop; label chip, What to include ticks visit-only, Take action = stores then sources)
- [x] Personal Picks: AI duplicates of Basics items dropped; sections expand/collapse
- [x] "Verify this": panel-open search via fixed generic queries only (VERIFY_NEEDS in search-policy.ts), within 3/visit budget
- [x] Verified in browser: Earthquake Basics list + First aid kit panel render correctly
- [ ] Later: Examples as comic drawings (deferred); household-sizing line needs structured people count (free text today)
