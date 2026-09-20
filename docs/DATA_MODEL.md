# DATA MODEL: Itemized — Your Life, In Receipts
**Challenge**: WebRush — "Your Life, In Receipts"  
**Stage**: Stage 3 of 3 (Forensic QA + Final Score Maximization)  

---

## 1. Core Schema

The data model centers on the `Receipt` discriminated union, joined by shared `receipt_id`.

```typescript
export type ReceiptType = 
  | 'music'
  | 'movie'
  | 'place'
  | 'purchase'
  | 'photo'
  | 'message'
  | 'search'
  | 'event'
  | 'note';

export interface BaseReceipt {
  receipt_id: string; // R001-R055
  timestamp: string;  // YYYY-MM-DD HH:mm (wall-clock, no timezone)
  date: Date;         // Parsed local wall-clock date
  month: number;      // 1-9
  day: number;        // 1-31
  type: ReceiptType;
  title: string;
  context: string;
  location: string;
  category: string;
  amount?: number;
  source?: string;
  tags: string[];     // Normalized array of lowercase strings
}
```

### Type-Specific Extensions
- **MusicReceipt**: `track`, `artist`, `album`, `played_at`, `duration_min` (parsed mm.ss), `duration_sec`, `genre`
- **MovieReceipt**: `director`, `watched_at`, `genre`
- **PlaceReceipt**: `place_id`, `name`, `place_type`, `city`, `latitude`, `longitude`
- **PurchaseReceipt**: `purchase_id`, `merchant`, `item`, `amount` (INR), `currency`, `city`
- **PhotoReceipt**: `photo_id`, `device` ('Phone Camera' | 'Mirrorless Camera' | '35mm Film Camera'), `device_category`
- **MessageReceipt**: `message_id`, `sender`, `text`, `message_type`
- **SearchReceipt**: `search_id`, `query`, `engine`
- **EventReceipt**: `event_id`, `name`, `organizer`
- **NoteReceipt**: `personal_note` (title is note text)

---

## 2. Join Rules & Ground Truth Assertions (§2.3)

1. **Master Index**: `life_receipts.csv` contains 55 rows (R001 to R055). Personal Notes exist solely in this master file.
2. **Sub-file Joins**:
   - `music.csv` (6 rows) joins on `receipt_id`
   - `movies.csv` (3 rows) joins on `receipt_id`
   - `places.csv` (8 rows) joins on `receipt_id`
   - `purchases.csv` (6 rows) joins on `receipt_id`
   - `photos.csv` (9 rows) joins on `receipt_id`
   - `messages.csv` (2 rows) joins on `receipt_id`
   - `searches.csv` (7 rows) joins on `receipt_id`
   - `events.csv` (8 rows) joins on `receipt_id`
3. **Purchases Total**: Master amounts and purchase file amounts match exactly: ₹72,808.
4. **Connections**: `connections.csv` contains 29 confirmed edges (C001–C029), all pointing forward in time.
5. **Orphans**: Exactly 15 receipts have no explicit connection in `connections.csv`:
   `R004, R005, R013, R015, R020, R021, R025, R026, R027, R028, R040, R043, R044, R050, R051`.

---

## 3. Data Traps & Handling (§2.4)

| Trap | Problem | Resolution |
|---|---|---|
| **mm.ss Duration** | `music.duration_min` is formatted as minutes.seconds (e.g. `4.03` = 4:03 = 243s; `5.2` = 5:20 = 320s). Decimal parsing (`5.2 * 60 = 312s`) is wrong. | Split on `.`, right-pad seconds string to 2 digits, compute `minutes * 60 + seconds`. |
| **No Timezone** | Timestamps like `2025-01-04 21:10` have no timezone offset. Using `new Date(str)` or UTC methods shifts times across midnight in non-UTC browsers. | Parse components `(YYYY, MM, DD, HH, mm)` manually and construct wall-clock representation. Zero `Date.now()`. |
| **Inconsistent Locations** | Values include `"Mumbai"`, `"Bandra, Mumbai"`, `"Mumbai → Lonavala"`, `"Mumbai to Udaipur"`, `"Chat"`, `"Home"`, `""`. | Normalize into `{ city: string; venue?: string; raw: string }`. Preserve original string for display. |
| **Tags Format** | Comma-separated with underscore tokens (`new_start`, `late_night`, `slow_life`). | Split, trim, humanize for display (`"new_start"` → `"New start"`), retain slug for filtering. |
| **No Images** | No image files exist in dataset. Hotlinking stock photos is prohibited. | Photo receipts render as procedural `PhotoFrame` components with palette deterministically hashed from tags, frame number, and device styling. |
| **Sparse Coordinates** | Only 8 places have lat/lon coordinates. | Resolve other receipts by: 1. explicit place connection, 2. same-day place, 3. city centroid. Mark all non-explicit coordinates as `approximate: true`. Never invent precise coordinates. |

---

## 4. Inferred Edge Scoring Algorithm

To ensure all 55 receipts participate in the story without falsifying dataset provenance, an explainable scoring function connects the 15 orphan receipts:

```
Score = (TimeProximityScore * 0.40) + (TagSimilarityScore * 0.35) + (LocationScore * 0.15) + (TitleWordScore * 0.10)
```
- **Time Proximity**: Exponential decay within 72 hours and same chapter.
- **Tag Similarity**: IDF-weighted Jaccard similarity across tags.
- **Location**: 1.0 if normalized city matches.
- **Title Words**: Overlapping non-stopword tokens.
- **Constraints**:
  - Inferred edges never override confirmed edges.
  - Inferred edges attach orphans to existing moments but never bridge two confirmed chains.
  - Every edge is tagged with `origin: 'inferred'` and a human-readable reason.
