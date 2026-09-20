# Itemized — Your Life, In Receipts
**WebRush Challenge**: "Your Life, In Receipts"  
**Stage**: Stage 3 of 3 (Forensic QA + Final Release)  
**Tagline**: *Nine months. Fifty-five receipts. One story.*  
**Status**: 100% Complete & Verified  

---

## 1. Challenge & Concept Overview
The WebRush challenge asks for a frontend-only experience that transforms a fixed dataset of 55 fictional "life receipts" (spanning January–September 2025 across 9 receipt types) into a coherent, interactive narrative experience. The core progression is:
**Raw Data → Insights → Connections → Story**.

Rather than presenting a generic chronological feed of cards, **Itemized** approaches the challenge through the physical metaphor of a **tactile personal ledger**. Each digital moment is treated as a thermal-paper slip torn from a life register; causal chains form exploratory threads; and the nine months are itemized into a story of personal transformation:
> *"You began the year on a rainy night on Carter Road with an accidental phone photo and a decision to start running. You ended it with a promise to stay still and look: 'One photo a day.'"*

---

## 2. Architecture & Tech Stack

```
Frontend/
├── src/
│   ├── app/                    # App Shell, Router, Nav, ErrorBoundary
│   ├── components/
│   │   ├── reactbits/          # CountUp, DecryptedText, Stack
│   │   └── ui/                 # ReceiptSlip, TypeBadge, PhotoFrame, Barcode, Sheet, Chip, KeyboardHelpModal
│   ├── data/
│   │   ├── editorial/          # Chapters blurbs, Thesis, Method copy
│   │   └── raw/                # 10 CSVs imported via Vite ?raw
│   ├── features/
│   │   ├── archive/            # Archive search, multi-facet filter, results
│   │   ├── home/               # Cover receipt, CountUp totals, Stack shuffle
│   │   ├── map/                # SVG equirectangular map projection
│   │   ├── method/             # Data provenance & methodology
│   │   ├── patterns/           # 5 computed discovery blocks
│   │   ├── receipts/           # Receipt drawer & type metadata
│   │   ├── story/              # 9 chapters, moment chains, thesis
│   │   └── threads/            # 9-lane board & Thread Trail
│   ├── hooks/                  # useReceipt, usePersistentState
│   ├── lib/
│   │   ├── csv/                # RFC-4180 CSV parser
│   │   ├── dataset/            # buildDataset singleton, loaders, moments, chapters
│   │   ├── geo/                # Location normalization & coordinate resolution
│   │   ├── graph/              # Confirmed + Inferred graph builder
│   │   ├── insights/           # Pure discovery functions
│   │   └── time/               # Wall-clock local date parser, mm.ss duration, formatINR
│   └── types/                  # Discriminated union schema
├── docs/                       # Complete 9-file documentation suite
```

- **Frontend-Only**: 100% client-side computation. Zero backend APIs, zero database, zero external tracking.
- **Framework**: React 19 + TypeScript (strict mode) + Vite.
- **Styling**: Tailwind CSS v4 `@theme` design tokens (thermal paper `#FBF8F1`, ledger ink `#1C1B18`, stamp red `#B8321F`).
- **Typography**: Self-hosted Fontsource packages (Fraunces display, Inter sans, IBM Plex Mono).
- **Icons**: Lucide React.
- **Animation**: Motion (`motion/react`) with full `prefers-reduced-motion` support.
- **Routing**: React Router DOM v7 with query-string deep linking (`?r=RXXX`, `?focus=RXXX`).

---

## 3. Key Features Tour

### 🌟 Signature Feature #1: "Pull the Thread" & Threads Board (`/threads`)
- **9 Type Lanes**: Arranged chronologically across time with column widths weighted by receipt density.
- **Curved SVG Bezier Edges**: Solid ink (`#1C1B18`) for confirmed causal connections; dashed ink-soft (`#55514A`) for inferred thematic links; stroke-width reflects connection strength (86%–99%).
- **Interactive Moment Isolation**: Clicking any circular node highlights its entire multi-type chain with animated SVG strokes and highlighter underlay, dimming unrelated nodes.
- **Thread Trail**: A vertical chronological ledger showing the exact connective relationships ("35 minutes later · search led to purchase · strength 0.98").
- **Moment Recipe**: Displays the multi-type journey as a sequence of icons (e.g. `Movie → Search → Event → Place → Photo → Purchase`).

### 📖 Story Mode (`/story`)
- **9 Monthly Chapters**: Partitioned by calendar month, each with a working title, persona stamp (*The Restarter*, *The Wanderer*, *The Photographer*, *The Noticer*), and evidence chips.
- **Sticky Month Rail**: Responsive navigation rail with `IntersectionObserver` tracking the active chapter.
- **Moment Chains**: Horizontal scrollable chains of compact receipt slips joined by labeled connectors.
- **Inner Voice Pull Quotes**: Chronological reflections highlighting late-night thoughts.
- **What It All Means**: Epilogue synthesizing the year with bookend receipts (`R003` and `R055`).

### 🗄️ The Archive (`/archive`)
- **Multi-Facet Deep-Linked Filtering**: Search across title, context, location, tags, query, and message text. Filter by 9 receipt types, 9 months, 7 themes, and cities.
- **Views**: Slips grid view and compact tabular view (stacked on mobile).
- **URL-Preserved State**: All search and filter parameters serialize to URL query params for shareability.

### 🧾 Global Receipt Drawer (`?r=RXXX`)
- Accessible native `<dialog>` sheet (right drawer on desktop, bottom sheet on mobile).
- Type-specific details: audio duration, movie directors, geolocations, purchase amounts in INR, procedural photo frames, search queries.
- Connected moments list showing origin badges, match strength, time gaps, and "Pull Thread" navigation.

### 🗺️ Life Map (`/map`)
- Custom SVG equirectangular projection with cosine latitude correction (no third-party tiles or external servers).
- Regional India Route (Mumbai, Lonavala, Udaipur) and Mumbai Metro close-up views.
- Animated chronological route path and interactive place pins.

### 📊 Patterns & Discoveries (`/patterns`)
1. **Thematic Echoes Grid**: 7 themes across 9 months linking directly to filtered archive views.
2. **The Morning Shift**: Circadian shift showing Jan–Feb night concentration shifting to May–Jul morning dominance (62.5%).
3. **Intent-to-Action Lags**: Search-to-outcome deltas (tools bought in minutes vs. trips planned for days).
4. **Spending Concentration Tape**: 92% of ₹72,808 invested in camera gear.
5. **The Inner Voice**: Arc of 6 personal notes (5 written after 22:00, the last a morning resolve at 08:15).

### ℹ️ Method & Provenance (`/method`)
- Transparent explanation of dataset provenance, confirmed vs inferred logic, data traps handled (duration format, timezone traps, location normalization), and limitations.

---

## 4. Accessibility & Keyboard Navigation (WCAG 2.1 AA)

- **Keyboard Shortcuts**:
  - Press `?` on any page to open the **Keyboard Shortcuts cheat sheet**.
  - Sequential `g` navigation:
    - `g` then `h`: Home (`/`)
    - `g` then `s`: Story (`/story`)
    - `g` then `t`: Threads (`/threads`)
    - `g` then `m`: Life Map (`/map`)
    - `g` then `p`: Patterns (`/patterns`)
    - `g` then `a`: Archive (`/archive`)
    - `g` then `x`: Method (`/method`)
  - `Escape`: Close Drawer or Keyboard Help modal.
- **Screen Reader Support**:
  - Live announcements (`aria-live="polite"`) for route transitions and thread selection.
  - Programmatic focus moves to page `<h1>` on navigation.
  - Form controls have explicit `htmlFor` / `id` pairings.
  - Color contrast exceeds WCAG AAA on body text (13.8:1) and AA on all secondary elements.
- **Skip Link**: "Skip to main content" link accessible via `Tab` on first keystroke.

---

## 5. Getting Started & Development

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation & Execution
```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start local development server
npm run dev

# Run automated unit & integration tests
npm run test

# Run strict verification (TypeScript typecheck + Vitest + Vite build)
npm run verify
```

---

## 6. Verification & Test Suite
Itemized includes 25 Vitest tests across 6 test suites covering:
1. **RFC-4180 CSV Parsing**: Quotes, commas, escaped quotes, multiline values, line endings.
2. **Time Utilities**: Wall-clock parsing without UTC drift, mm.ss duration conversion, INR currency formatting.
3. **Dataset Integrity**: 55 receipts, ₹72,808 purchase total, 9 chapters, 11 moments.
4. **Graph Algorithms**: 29 confirmed edges, 14 inferred edges, 0 orphans, 100% receipt connectivity.
5. **Insights Computation**: Morning shift circadian math, intent lags, spending concentration.
6. **Archive Filtering**: Full-text indexing, multi-facet filter logic, sorting.

Run `npm run verify` to execute the full verification pipeline.
