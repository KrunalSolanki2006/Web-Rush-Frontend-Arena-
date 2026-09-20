# PROJECT CONTRACT: Itemized — Your Life, In Receipts
**Challenge**: WebRush — "Your Life, In Receipts"  
**Stage**: Stage 3 of 3 (Forensic QA + Final Score Maximization — Final Release)  
**Timeline**: 6 Hours Hackathon  
**Architecture**: Frontend-Only Single Page Application (React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion + Lucide)  
**Status**: APPROVED FOR FINAL RELEASE  

---

## 1. Problem Interpretation
The WebRush challenge requires transforming a fixed dataset of 55 fictional "life receipts" spanning 9 months (January–September 2025) into a coherent, interactive narrative experience. 
The core progression is **Raw Data → Insights → Connections → Story**.
The brief explicitly rejects a "chronological list of receipts with cards underneath". The user experience must make cross-type relationships (Music → Place → Photo → Purchase → Event → Movie → Message → Search → Personal Note) discoverable, answer who the user was across different periods, identify recurring patterns, and provide an engaging interactive journey.

## 2. Target Users & Core User Need
- **Target User**: Anyone exploring digital footprints, quantified-self enthusiasts, storytellers, evaluators.
- **Core User Need**: Make sense of fragmented digital records (purchases, searches, tracks played, photos snapped) as a unified, emotionally resonant life journey.
- **Primary Outcome**: The user discovers how a rainy night in January sparked a desire for change, leading through adventures, photography, community, and culminating in a mindful promise: "One photo a day."

## 3. Explicit & Implicit Requirements
### Explicit Requirements
1. Way to explore provided receipts (Archive, Drawer, Story, Map, Threads).
2. Meaningful filtering, searching, or navigation (type, month, theme, city, tags, text search).
3. At least one meaningful mechanism for discovering relationships/patterns (Threads Board, Thread Trail, Patterns page).
4. An interactive storytelling experience (Story mode with 9 monthly chapters, persona stamps, moment chains).
5. Clear visual representation of the digital journey (Life Map, Threads graph, timeline).
6. Responsive design across mobile (320px), tablet (768px), and desktop (1024px+).
7. Cross-type connections discoverable beyond simple chronologies.

### Implicit Requirements
1. **Data integrity**: 100% adherence to 55 receipts, 29 connections, ₹72,808 purchases.
2. **Honest attribution**: Distinct visual & semantic indication of confirmed vs. inferred edges.
3. **Pure Frontend**: No external backend/APIs/database; local deterministic computation.
4. **Production-level accessibility**: WCAG 2.1 AA compliance, keyboard navigation, aria labels, reduced motion support.
5. **High aesthetic quality**: Thermal-paper and ledger-ink theme, Fraunces + Inter + IBM Plex Mono typography.

## 4. Feature List
- **F-001**: Dataset Pipeline (RFC-4180 CSV parser, validation, typing, join)
- **F-002**: Connection Graph (29 confirmed edges + algorithmic inferred edges for 15 orphans)
- **F-003**: Moments & Chapters Model (connected components, 9 monthly chapters, persona stats)
- **F-004**: App Shell & Navigation (skip links, focus management, responsive nav, polite live regions, keyboard shortcuts)
- **F-005**: Home Cover ("Total: One Story", CountUp metrics, DecryptedText headline, Stack shuffle)
- **F-006**: Story Mode (9 chapters, sticky month rail, moment chains, inner-voice pull quotes, thesis)
- **F-007**: Archive (multi-facet search, type chips, month/theme/city filters, slips & table views)
- **F-008**: Receipt Drawer (full thermal slip, type-specific metadata, connection rows, pull thread)
- **F-009**: Threads Board & Thread Trail (Signature #1: 9 type lanes, SVG edges, pathLength animation, interactive moment isolation)
- **F-010**: Life Map (SVG equirectangular projection, India & Mumbai views, animated routes, place receipts)
- **F-011**: Patterns (5 computed insight blocks: theme recurrence, morning shift, intent-action lag, spending tape, inner voice)
- **F-012**: Method Page (data provenance, inferred scoring explanation, data traps handled, limitations)

## 5. Route List
- `/`: Home (Cover receipt, hook, Stack shuffle, CTAs)
- `/story`: Story (9 chapters, moment chains, thesis)
- `/threads`: Threads (Relationship board + Thread Trail; `?focus=RXXX`)
- `/map`: Life Map (India route & Mumbai close-up, place details)
- `/patterns`: Patterns (5 evidence-backed analytical visualisations)
- `/archive`: Archive (Deep-linked search, filter, sort; slips and table views)
- `/method`: Method (Data provenance, inferred algorithm, data traps)
- `*`: 404 (Custom "Item Not Found" receipt slip)
- Global Drawer: `?r=RXXX` active on any route

## 6. Design System Summary
- **Concept**: Warm thermal paper and ledger ink.
- **Palette**: Paper `#F5EFE3`, Paper-deep `#ECE3D0`, Slip `#FBF8F1`, Ink `#1C1B18`, Ink-soft `#55514A`, Rule `#CFC5AE`, Stamp Red `#B8321F`, Highlighter `#F3D34A`.
- **9 Type Colors**: Music `#4A4FA6`, Movie `#7A3E8E`, Place `#2E6B4F`, Purchase `#96600F`, Photo `#0F6E7A`, Message `#A63D6B`, Search `#4D5A6B`, Event `#2D5FA8`, Note `#2B2A27`.
- **Typography**: Fraunces (Headings/Display), Inter (UI/Body), IBM Plex Mono (Data/Receipts/Amounts).

## 7. Frontend-Only Constraints & Persistence
- Zero backend dependencies; CSVs embedded via Vite `?raw`.
- Shareable state stored in URL query parameters (`?r=`, `?focus=`, filter params).
- Ephemeral UI state in component React hooks.
- `usePersistentState` backed by `localStorage` (with try/catch) only for last-read chapter.

## 8. Verification Strategy
- Automated unit & integration tests via Vitest: CSV parser, time utilities, dataset integrity, graph completeness, insight computation, archive filters (25 tests).
- Type check: `tsc -b` (0 errors).
- Production build: `vite build` (~1.09s, zero errors).
