# DESIGN SYSTEM: Itemized — Your Life, In Receipts
**Challenge**: WebRush — "Your Life, In Receipts"  
**Stage**: Stage 3 of 3 (Forensic QA + Final Score Maximization)  

---

## 1. Visual Metaphor
**Concept**: Warm thermal paper and ledger ink.  
The interface evokes a tactile, physical register of life: receipt slips torn from a spool, ink stamped onto aged paper, and itemized accounts of personal moments. Not neon, not glassmorphism, not generic SaaS purple.

---

## 2. Color Palette & Tokens

### Base Surface & Ink Tokens
| Token | Hex | Role | Contrast vs Paper |
|---|---|---|---|
| `--color-paper` | `#F5EFE3` | Primary page background | Base |
| `--color-paper-deep` | `#ECE3D0` | Subtle contrast panels, borders | Surface |
| `--color-slip` | `#FBF8F1` | Thermal paper receipt slip background | High |
| `--color-ink` | `#1C1B18` | Primary text and solid strokes | 13.8:1 (AAA) |
| `--color-ink-soft` | `#55514A` | Secondary text, inferred dashed strokes | 6.8:1 (AAA) |
| `--color-rule` | `#CFC5AE` | Dividers, dashed guidelines | 1.8:1 (Graphic) |
| `--color-stamp-red` | `#B8321F` | Persona stamps, highlight alerts | 5.2:1 (AA) |
| `--color-highlighter` | `#F3D34A` | Selection underlay, active thread glow | Always paired with Ink text |

### 9 Receipt-Type Tokens
Each receipt type has a dedicated color, background tint, Lucide icon, and label. Color is never the sole indicator.

| Type | Color Hex | Background Tint | Lucide Icon | Meaning / Verb |
|---|---|---|---|---|
| **Music** | `#4A4FA6` | `#4A4FA615` | `Headphones` | Listened to |
| **Movie** | `#7A3E8E` | `#7A3E8E15` | `Film` | Watched |
| **Place** | `#2E6B4F` | `#2E6B4F15` | `MapPin` | Visited |
| **Purchase** | `#96600F` | `#96600F15` | `ShoppingBag` | Bought |
| **Photo** | `#0F6E7A` | `#0F6E7A15` | `Camera` | Captured |
| **Message** | `#A63D6B` | `#A63D6B15` | `MessageSquare` | Received |
| **Search** | `#4D5A6B` | `#4D5A6B15` | `Search` | Searched |
| **Event** | `#2D5FA8` | `#2D5FA815` | `Calendar` | Attended |
| **Personal Note** | `#2B2A27` | `#2B2A2715` | `FileText` | Noted |

---

## 3. Typography

All fonts are self-hosted via `@fontsource` packages (zero external Google Fonts or CDN requests):
- **Display / Headings**: `Fraunces` (Serif, warm, confident, literary).
- **Body / Interface**: `Inter` (Sans-serif, clean, readable, neutral).
- **Data / Ledger / Receipts**: `IBM Plex Mono` (Monospace, uppercase, tracked, tabular numbers).

---

## 4. Tactile Motifs & Shapes
- **Perforated Edge**: CSS `mask-image` or SVG zigzag pattern simulating torn thermal-paper slips.
- **Barcode**: Deterministic SVG pattern generated from receipt ID hash for authenticity on receipt footers.
- **Stamp**: Rotated rectangular badge (`transform: rotate(-3deg)`) used for monthly persona labels.
- **Photo Frame**: Aspect-ratio frame styled according to camera type:
  - Phone Camera: Rounded corners, clean bezel.
  - Mirrorless Camera: Crisp borders, technical ratio.
  - 35mm Film Camera: Sprocket hole borders, warm analog tint.

---

## 5. React Bits Components

Adapted directly to the design tokens (zero heavy external dependencies):

| Component | Usage Location | Purpose | Adaptation |
|---|---|---|---|
| `CountUp` | Home cover receipt & ledger totals | Animated count-up of figures on initial view | Monospace styling, INR formatting support |
| `DecryptedText` | Hero headline reveal on Home | Cinematic typewriter/scramble reveal | Respects `prefers-reduced-motion` |
| `Stack` | Home receipt shuffle pile | Interactive deck of receipts that user can shuffle | Thermal-paper slip cards, click to view Drawer |

---

## 6. Motion & Accessibility
- **Motion Tokens**: Fast `120ms`, Normal `200ms`, Slow `320ms`, Ease `[0.22, 1, 0.36, 1]`.
- **Reduced Motion**: Wrapped in `<MotionConfig reducedMotion="user">`. Fades or instant transitions only when requested.
- **Focus Rings**: `outline: 2px solid #1C1B18; outline-offset: 2px;`.
- **Touch Targets**: Minimum 44px on all interactive mobile elements.
