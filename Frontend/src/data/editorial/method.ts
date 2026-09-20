export const METHOD_CONTENT = {
  title: 'Methodology & Data Provenance',
  subtitle: 'How 55 discrete life receipts were connected, validated, and turned into an honest story.',
  datasetProvenance: {
    heading: 'The Dataset',
    body: 'The dataset consists of 55 fictional "life receipts" spanning January 4 to September 19, 2025 across 9 receipt types: Photos (9), Places (8), Events (8), Searches (7), Music (6), Purchases (6), Personal Notes (6), Movies (3), and Messages (2). All files are joined via the shared identifier `receipt_id`.',
  },
  confirmedVsInferred: {
    heading: 'Confirmed vs. Inferred Connections',
    confirmedBody: 'Confirmed links (solid ink lines) come directly from `connections.csv` with explicit causal relationship types (e.g. search_purchase, travel_sequence, location_time) and strength ratings between 0.86 and 0.99. All 29 confirmed links point forward in chronological time.',
    inferredBody: 'Inferred links (dashed lines) connect the 15 orphan receipts that had no explicit edge in `connections.csv`. These links are generated through a deterministic multi-factor scoring function evaluating: 1) time proximity within 72 hours and the same calendar month, 2) shared tags weighted by inverse document frequency (IDF), 3) normalized city/location matches, and 4) shared title keywords. Inferred edges never override confirmed edges and never artificially bridge two separate confirmed chains.',
  },
  dataTraps: [
    {
      name: 'Duration Format (mm.ss)',
      trap: '`music.duration_min` was encoded as minutes.seconds (e.g. 4.03 = 4:03; 5.2 = 5:20 with trailing zero omitted). Standard float parsing yields incorrect durations.',
      solution: 'Split by decimal point, right-padded second strings with zero, and parsed strictly into minutes and seconds (243s and 320s).',
    },
    {
      name: 'Timezone Drift',
      trap: 'Timestamps like "2025-01-04 21:10" lack timezone offsets. Standard Date.parse() or UTC conversions can shift moments across midnight in different user browser locales.',
      solution: 'Constructed local dates directly from component integers (year, month, day, hour, minute), completely avoiding timezone-dependent shifts.',
    },
    {
      name: 'Inconsistent Locations',
      trap: 'Location strings varied between "Bandra, Mumbai", "Mumbai → Lonavala", "Chat", "Home", and empty strings.',
      solution: 'Normalized into a structured city key (Mumbai, Udaipur, Lonavala) while preserving venue details and original raw strings.',
    },
    {
      name: 'Zero Fake Images',
      trap: 'No photo image files exist in the dataset. Hotlinking random stock photos violates dataset fidelity.',
      solution: 'Generated deterministic procedural PhotoFrames whose color palette is derived mathematically from photo tags (e.g. sunset, rain, forest) with authentic camera aspect ratios and device borders (Phone, Mirrorless, 35mm film).',
    },
  ],
  limitations: [
    'Coordinates are only explicitly recorded for 8 places; all other geographic positions are derived via connections or city centroids and marked as approximate.',
    'The dataset represents a single individual’s fictional persona over 9 months, ending on the morning of September 19, 2025.',
  ],
};
