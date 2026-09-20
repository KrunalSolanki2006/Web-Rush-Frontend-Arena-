# Itemized: Your Life, In Receipts
**Challenge**: WebRush — "Your Life, In Receipts"  
**Stage**: Stage 3 of 3 (Forensic QA + Final Score Maximization — Final Release)  
**Tagline**: *Nine months. Fifty-five receipts. One story.*

---

## 1. Challenge & Solution Overview
The WebRush challenge asks for a frontend-only experience that turns a fixed dataset of 55 fictional "life receipts" (across 9 types, spanning January–September 2025) into a coherent, interactive narrative experience. 

The core progression is **Raw Data → Insights → Connections → Story**.

**Itemized** approaches this challenge through the physical metaphor of a **personal ledger**. Each digital moment is treated as a thermal-paper slip; chains of causal moments form exploratory threads; and the nine months are itemized into a story of personal transformation:
> *You began the year on a rainy night on Carter Road with an accidental phone photo and a decision to start running. You ended it with a promise to stay still and look: "One photo a day."*

---

## 2. Key Features

### 🌟 Signature Feature #1: "Pull the Thread" & Threads Board (`/threads`)
- **9 Type Lanes**: Arranged chronologically across time with column widths weighted by receipt density.
- **Curved SVG Bezier Edges**: Solid ink (`#1C1B18`) for confirmed causal connections; dashed ink-soft (`#55514A`) for inferred thematic links; stroke-width reflects connection strength (86%–99%).
- **Interactive Moment Isolation**: Clicking any circular node highlights its entire multi-type chain with animated SVG strokes and highlighter underlay, dimming unrelated nodes.
- **Thread Trail**: A vertical chronological ledger showing the exact connective relationships ("35 minutes later · search led to purchase · strength 0.98").
- **Moment Recipe**: Displays the multi-type journey as a sequence of icons (e.g. `Movie → Search → Event → Place → Photo → Purchase`).

### 📖 Story Mode (`/story`)
- **9 Monthly Chapters**: Partitioned by calendar month, each with a working title, persona stamp (e.g. *The Restarter*, *The Wanderer*, *The Photographer*, *The Noticer*), and evidence chips.
- **Sticky Month Rail**: Responsive navigation rail with `IntersectionObserver` tracking active chapter.
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

---

## 3. Architecture & Tech Stack

```
Frontend/
├── src/
│   ├── app/                    # App shell, Router, Nav, ErrorBoundary
│   ├── components/
│   │   ├── reactbits/          # CountUp, DecryptedText, Stack
│   │   └── ui/                 # ReceiptSlip, TypeBadge, PhotoFrame, Barcode, Sheet, Chip
│   ├── data/
│   │   ├── editorial/          # Chapters blurbs, Thesis, Method copy
│   │   └── raw/                # 10 CSVs imported via Vite ?raw
│   ├── features/
│   │   ├── archive/            # Archive search, filter, and results
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
```

- **Frontend-Only**: Pure client-side computation. Zero backend APIs, zero database.
- **Framework**: React 19 + TypeScript (strict) + Vite.
- **Styling**: Tailwind CSS v4 `@theme` design tokens (thermal-paper `#FBF8F1`, ledger ink `#1C1B18`, stamp red `#B8321F`).
- **Typography**: Self-hosted Fontsource packages (Fraunces display, Inter sans, IBM Plex Mono).
- **Icons**: Lucide React.
- **Animation**: Motion (`motion/react`) with user reduced-motion support.

---

## 4. Getting Started

### Prerequisites
- Node.js 20+

### Installation & Execution
```bash
# Navigate to the frontend project
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run automated tests
npm run test

# Run strict verification (typecheck + test + production build)
npm run verify
```

---

## 5. Requirement Verification Matrix

| Requirement | Description | Status | Evidence |
|---|---|---|---|
| **REQ-001** | Explore all receipts | ✅ Complete | `/archive` displays all 55 receipts with full drawer details. |
| **REQ-002** | Search, filter, navigation | ✅ Complete | Multi-facet filter by query, 9 types, month, theme, city, and sort. |
| **REQ-003** | Relationship discovery | ✅ Complete | `/threads` board with 9 lanes and Thread Trail. |
| **REQ-004** | Interactive storytelling | ✅ Complete | `/story` with 9 monthly chapters, persona stamps, and moment chains. |
| **REQ-005** | Visual representation of journey | ✅ Complete | `/map` equirectangular SVG projection and Home cover receipt. |
| **REQ-006** | Responsive design | ✅ Complete | Responsive at 320px, 375px, 768px, 1024px, 1440px. |
| **REQ-007** | Cross-type connections | ✅ Complete | Multi-type chains (e.g. Movie → Search → Event → Place → Photo → Purchase). |
| **REQ-008** | Raw → Insights → Connections → Story | ✅ Complete | Full pipeline from raw CSVs to computed insights and narrative. |
| **REQ-009** | Who the user was in different periods | ✅ Complete | Monthly persona evolution tracked in Story and stats. |
| **REQ-010** | Recurring patterns | ✅ Complete | 5 computed insight visualisations on `/patterns`. |
| **REQ-011** | All nine receipt types represented | ✅ Complete | Music, Movie, Place, Purchase, Photo, Message, Search, Event, Note. |
| **REQ-012** | Frontend-only & deployable | ✅ Complete | Static Vite build with SPA routing for Vercel/Netlify. |
| **REQ-013** | Data integrity & honesty | ✅ Complete | Solid lines for confirmed edges; dashed lines for inferred links. |
| **REQ-014** | Realistic UI states | ✅ Complete | Thermal paper loading skeleton, empty states, and error boundary. |
| **REQ-015** | Accessibility | ✅ Complete | WCAG 2.1 AA, keyboard focus traps, aria labels, reduced motion. |
| **REQ-016** | Performance | ✅ Complete | Lazy-loaded routes, precomputed dataset singleton, fast load. |
| **REQ-017** | Documentation | ✅ Complete | Complete docs: CONTRACT, MATRIX, REGISTRY, BUILD_STATE, DATA_MODEL, DESIGN_SYSTEM. |
| **REQ-018** | Deployment readiness | ✅ Complete | `vercel.json` and `_redirects` included. |
| **REQ-019** | Consistent design system | ✅ Complete | Thermal paper, ledger ink, Fraunces + Inter + IBM Plex Mono fonts. |
| **REQ-020** | Persistence & deep links | ✅ Complete | Shareable `?r=RXXX`, `?focus=RXXX`, filter params, localStorage session. |
| **REQ-021** | Curiosity & discovery | ✅ Complete | Interactive card stack shuffle, DecryptedText headline, CountUp metrics. |
| **REQ-022** | Geographic view | ✅ Complete | SVG equirectangular map with regional and city zoom. |
| **REQ-023** | Automated tests | ✅ Complete | 25 Vitest tests covering CSV, time, dataset, graph, insights, archive. |
