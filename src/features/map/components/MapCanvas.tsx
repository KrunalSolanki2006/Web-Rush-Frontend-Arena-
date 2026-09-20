import React from 'react';
import { motion } from 'motion/react';
import { Navigation, ZoomIn } from 'lucide-react';
import type { PlaceReceipt } from '../../../types';

interface MapCanvasProps {
  view: 'india' | 'mumbai';
  selectedMonth: number | null;
  visiblePlaces: PlaceReceipt[];
  selectedPlace: PlaceReceipt | null;
  onSelectPlace: (place: PlaceReceipt) => void;
  routePoints: string[];
  project: (lat: number, lon: number) => { x: number; y: number };
  svgWidth: number;
  svgHeight: number;
  onViewChange?: (view: 'india' | 'mumbai') => void;
}

// Hand-tuned, collision-free cartographic positions & label placements
interface PlaceLayout {
  x: number;
  y: number;
  labelAlign: 'left' | 'right' | 'center';
  dx: number;
  dy: number;
  category: 'landmark' | 'cafe' | 'park' | 'nature' | 'heritage' | 'arts';
}

const REGIONAL_LAYOUT: Record<string, PlaceLayout> = {
  // Udaipur cluster (displaced so Lake Pichola and Jheel's Coffee Bar NEVER collide)
  R017: { x: 480, y: 88, labelAlign: 'left', dx: -16, dy: -4, category: 'landmark' }, // Lake Pichola
  R023: { x: 570, y: 104, labelAlign: 'right', dx: 16, dy: 4, category: 'cafe' },      // Jheel's Ginger Coffee Bar

  // Lonavala / Western Ghats
  R037: { x: 460, y: 470, labelAlign: 'right', dx: 16, dy: 2, category: 'nature' },    // Pawna Lake

  // Mumbai Hub (displaced radially across the hub so all 5 places are 100% distinct and readable)
  R031: { x: 235, y: 365, labelAlign: 'center', dx: 0, dy: -24, category: 'park' },     // Sanjay Gandhi National Park
  R001: { x: 160, y: 425, labelAlign: 'left', dx: -16, dy: -2, category: 'cafe' },      // Blue Tokai Bandra
  R043: { x: 310, y: 420, labelAlign: 'right', dx: 16, dy: -2, category: 'heritage' },  // Sion Fort
  R009: { x: 165, y: 495, labelAlign: 'left', dx: -16, dy: 6, category: 'landmark' },   // Marine Drive
  R048: { x: 295, y: 505, labelAlign: 'right', dx: 16, dy: 6, category: 'arts' },       // Kala Ghoda
};

const MUMBAI_LAYOUT: Record<string, PlaceLayout> = {
  // Mumbai close-up (expanded across the peninsula)
  R031: { x: 440, y: 95, labelAlign: 'center', dx: 0, dy: -24, category: 'park' },      // Sanjay Gandhi NP (North)
  R001: { x: 240, y: 260, labelAlign: 'left', dx: -16, dy: 0, category: 'cafe' },       // Blue Tokai Bandra (West)
  R043: { x: 530, y: 275, labelAlign: 'right', dx: 16, dy: 0, category: 'heritage' },   // Sion Fort (East)
  R009: { x: 210, y: 445, labelAlign: 'left', dx: -16, dy: 0, category: 'landmark' },   // Marine Drive (Southwest)
  R048: { x: 450, y: 465, labelAlign: 'right', dx: 16, dy: 0, category: 'arts' },       // Kala Ghoda (South/East)
};

const CATEGORY_COLORS: Record<string, { bg: string; dot: string }> = {
  landmark: { bg: '#FDF0EC', dot: '#B8321F' },
  cafe: { bg: '#FEF7E6', dot: '#D97706' },
  park: { bg: '#EAF5EF', dot: '#2E6B4F' },
  nature: { bg: '#EAF5EF', dot: '#2E6B4F' },
  heritage: { bg: '#F3EFE6', dot: '#854D0E' },
  arts: { bg: '#F5EEF8', dot: '#7C3AED' },
};

export const MapCanvas: React.FC<MapCanvasProps> = ({
  view,
  visiblePlaces,
  selectedPlace,
  onSelectPlace,
  svgWidth,
  svgHeight,
  onViewChange,
}) => {
  const layoutMap = view === 'india' ? REGIONAL_LAYOUT : MUMBAI_LAYOUT;

  // Compute position for each place (using collision-free layout with fallback to projection)
  const getCoordinates = (place: PlaceReceipt) => {
    const layout = layoutMap[place.receipt_id];
    if (layout) {
      return { x: layout.x, y: layout.y, layout };
    }
    return { x: 400, y: 275, layout: { x: 400, y: 275, labelAlign: 'center' as const, dx: 0, dy: -20, category: 'landmark' as const } };
  };

  return (
    <div className="lg:col-span-2 bg-slip border border-rule rounded-sm p-4 shadow-xs relative overflow-hidden">
      {/* Top Banner with View and Count */}
      <div className="absolute top-6 left-6 z-10 bg-paper/95 backdrop-blur-xs p-3 rounded-xs border border-rule font-mono text-xs text-ink space-y-1 shadow-xs max-w-xs">
        <div className="font-bold uppercase text-stamp-red flex items-center gap-1.5">
          <Navigation size={13} aria-hidden="true" />
          <span>{view === 'india' ? 'Regional Journey View' : 'Mumbai Metro Close-up'}</span>
        </div>
        <div className="text-[11px] text-ink-soft">
          {visiblePlaces.length} places visible · {view === 'india' ? 'Curved arcs trace regional expeditions' : 'Local connections across Mumbai'}
        </div>
        {view === 'india' && onViewChange && (
          <button
            onClick={() => onViewChange('mumbai')}
            className="cursor-pointer mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-paper-deep border border-rule hover:border-ink rounded-xs font-mono text-[10px] text-ink font-bold transition-colors"
          >
            <ZoomIn size={11} aria-hidden="true" />
            <span>Zoom into Mumbai Metro (5 places)</span>
          </button>
        )}
      </div>

      <div className="w-full aspect-[8/5.5] bg-[#FAF6EE] rounded-xs border border-rule/70 relative overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
          role="img"
          aria-label="Interactive map of places visited"
        >
          <defs>
            {/* Subtle Cartographic Grid Pattern */}
            <pattern id="carto-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#DCD3C1" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Ocean Water Pattern */}
            <pattern id="sea-waves" width="30" height="15" patternUnits="userSpaceOnUse">
              <path d="M 0 7 Q 7.5 4, 15 7 T 30 7" fill="none" stroke="#CFC5AE" strokeWidth="0.6" strokeOpacity="0.45" />
            </pattern>
          </defs>

          {/* Canvas Background */}
          <rect width={svgWidth} height={svgHeight} fill="#FAF6EE" />
          <rect width={svgWidth} height={svgHeight} fill="url(#carto-grid)" />

          {/* ============================================================ */}
          {/* CARTOGRAPHIC BACKGROUND & COASTLINE */}
          {/* ============================================================ */}
          {view === 'india' ? (
            <g className="pointer-events-none">
              {/* Arabian Sea on West */}
              <path
                d="M 0 0 L 105 0 C 130 140, 95 280, 135 410 C 145 450, 125 500, 140 550 L 0 550 Z"
                fill="#EFE8D9"
                fillOpacity="0.65"
              />
              <path
                d="M 0 0 L 105 0 C 130 140, 95 280, 135 410 C 145 450, 125 500, 140 550 L 0 550 Z"
                fill="url(#sea-waves)"
              />
              {/* Coastline Stroke */}
              <path
                d="M 105 0 C 130 140, 95 280, 135 410 C 145 450, 125 500, 140 550"
                fill="none"
                stroke="#B8A88F"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Water Label */}
              <text x="50" y="275" className="font-serif italic text-xs fill-ink-soft/40 tracking-widest select-none">
                Arabian Sea
              </text>

              {/* State & Region Typography */}
              <text x="525" y="48" textAnchor="middle" className="font-mono text-[10px] uppercase tracking-[0.3em] fill-ink-soft/35 font-bold select-none">
                RAJASTHAN
              </text>
              <text x="350" y="535" textAnchor="middle" className="font-mono text-[10px] uppercase tracking-[0.3em] fill-ink-soft/35 font-bold select-none">
                MAHARASHTRA
              </text>
              <text x="495" y="515" textAnchor="start" className="font-mono text-[9px] uppercase tracking-wider fill-ink-soft/45 italic select-none">
                Western Ghats
              </text>

              {/* Udaipur Hub Region Box */}
              <rect
                x="410"
                y="55"
                width="290"
                height="80"
                rx="6"
                fill="none"
                stroke="#CFC5AE"
                strokeWidth="0.8"
                strokeDasharray="4 3"
              />
              <text x="420" y="70" className="font-mono text-[9px] uppercase tracking-wider fill-stamp-red font-bold select-none">
                UDAIPUR EXPEDITION · FEB 2025
              </text>

              {/* Mumbai Metro Region Box */}
              <rect
                x="115"
                y="330"
                width="235"
                height="205"
                rx="6"
                fill="none"
                stroke="#CFC5AE"
                strokeWidth="0.8"
                strokeDasharray="4 3"
              />
              <text x="125" y="346" className="font-mono text-[9px] uppercase tracking-wider fill-ink-soft font-bold select-none">
                MUMBAI METRO · 5 PLACES
              </text>
            </g>
          ) : (
            <g className="pointer-events-none">
              {/* Mumbai Peninsula Coastline */}
              <path
                d="M 0 0 L 160 0 C 180 120, 150 200, 190 310 C 220 370, 160 480, 180 550 L 0 550 Z"
                fill="#EFE8D9"
                fillOpacity="0.75"
              />
              <path
                d="M 0 0 L 160 0 C 180 120, 150 200, 190 310 C 220 370, 160 480, 180 550 L 0 550 Z"
                fill="url(#sea-waves)"
              />
              <path
                d="M 160 0 C 180 120, 150 200, 190 310 C 220 370, 160 480, 180 550"
                fill="none"
                stroke="#B8A88F"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Thane Creek / Harbour on East */}
              <path
                d="M 640 0 C 600 150, 630 300, 590 450 C 580 490, 600 550, 610 550 L 800 550 L 800 0 Z"
                fill="#EFE8D9"
                fillOpacity="0.45"
              />

              <text x="75" y="275" className="font-serif italic text-xs fill-ink-soft/40 tracking-widest select-none">
                Arabian Sea
              </text>
              <text x="680" y="275" className="font-serif italic text-xs fill-ink-soft/40 tracking-widest select-none">
                Thane Creek
              </text>

              <text x="440" y="55" textAnchor="middle" className="font-mono text-[9px] uppercase tracking-widest fill-ink-soft/40 select-none">
                North Mumbai · Borivali
              </text>
              <text x="240" y="235" textAnchor="middle" className="font-mono text-[9px] uppercase tracking-widest fill-ink-soft/40 select-none">
                Bandra West
              </text>
              <text x="340" y="525" textAnchor="middle" className="font-mono text-[9px] uppercase tracking-widest fill-ink-soft/40 select-none">
                South Mumbai District
              </text>
            </g>
          )}

          {/* ============================================================ */}
          {/* COMPASS ROSE & SCALE BAR */}
          {/* ============================================================ */}
          <g transform="translate(745, 55)" className="pointer-events-none">
            <circle r="18" fill="none" stroke="#CFC5AE" strokeWidth="0.8" strokeDasharray="2 2" />
            {/* North Point */}
            <polygon points="0,-16 3,-4 0,0 -3,-4" fill="#B8321F" />
            <polygon points="0,16 3,4 0,0 -3,4" fill="#1C1B18" opacity="0.3" />
            <polygon points="16,0 4,3 0,0 4,-3" fill="#1C1B18" opacity="0.3" />
            <polygon points="-16,0 -4,3 0,0 -4,-3" fill="#1C1B18" opacity="0.3" />
            <text y="-20" textAnchor="middle" className="font-mono text-[9px] font-bold fill-stamp-red">N</text>
          </g>

          <g transform="translate(35, 520)" className="font-mono text-[9px] fill-ink-soft pointer-events-none">
            <line x1="0" y1="0" x2="80" y2="0" stroke="#1C1B18" strokeWidth="1.2" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#1C1B18" strokeWidth="1.2" />
            <line x1="40" y1="-2" x2="40" y2="2" stroke="#1C1B18" strokeWidth="0.8" />
            <line x1="80" y1="-3" x2="80" y2="3" stroke="#1C1B18" strokeWidth="1.2" />
            <text x="0" y="-5" textAnchor="middle">0</text>
            <text x="40" y="-5" textAnchor="middle">{view === 'india' ? '100' : '5'}</text>
            <text x="80" y="-5" textAnchor="middle">{view === 'india' ? '250 km' : '15 km'}</text>
          </g>

          {/* ============================================================ */}
          {/* ELEGANT CURVED JOURNEY PATHS */}
          {/* ============================================================ */}
          {view === 'india' ? (
            <g className="pointer-events-none">
              {/* Outbound Arc: Mumbai -> Udaipur */}
              <motion.path
                d="M 165 495 C 200 300, 360 160, 480 88"
                fill="none"
                stroke="#B8321F"
                strokeWidth="2"
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
              {/* Udaipur local: Lake Pichola <-> Jheel's */}
              <path
                d="M 480 88 Q 525 96 570 104"
                fill="none"
                stroke="#1C1B18"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.5"
              />
              {/* Return Arc: Udaipur -> SGNP Mumbai */}
              <motion.path
                d="M 570 104 C 470 200, 340 280, 235 365"
                fill="none"
                stroke="#1C1B18"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
              />
              {/* Mumbai -> Pawna Lake (Lonavala) */}
              <motion.path
                d="M 235 365 C 290 420, 370 480, 460 470"
                fill="none"
                stroke="#2E6B4F"
                strokeWidth="2"
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
              />
              {/* Pawna Lake -> Sion Fort */}
              <path
                d="M 460 470 Q 380 435, 310 420"
                fill="none"
                stroke="#1C1B18"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.4"
              />
              {/* Local Mumbai Trails */}
              <path
                d="M 160 425 L 310 420 L 295 505 L 165 495"
                fill="none"
                stroke="#1C1B18"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.3"
              />

              {/* Journey Route Labels */}
              <g transform="translate(305, 230)">
                <rect x="-65" y="-10" width="130" height="20" rx="3" fill="#FCFAF6" stroke="#CFC5AE" strokeWidth="0.8" />
                <text textAnchor="middle" y="3" className="font-mono text-[9px] font-bold fill-stamp-red">
                  ✈ 650 km · Udaipur Trip
                </text>
              </g>

              <g transform="translate(365, 455)">
                <rect x="-55" y="-9" width="110" height="18" rx="3" fill="#FCFAF6" stroke="#CFC5AE" strokeWidth="0.8" />
                <text textAnchor="middle" y="3" className="font-mono text-[9px] font-bold fill-[#2E6B4F]">
                  🚗 85 km · Western Ghats
                </text>
              </g>
            </g>
          ) : (
            <g className="pointer-events-none">
              {/* Chronological route within Mumbai */}
              <motion.path
                d="M 240 260 L 210 445 L 440 95 L 530 275 L 450 465"
                fill="none"
                stroke="#1C1B18"
                strokeWidth="1.8"
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </g>
          )}

          {/* ============================================================ */}
          {/* PLACE PINS & PILL LABELS */}
          {/* ============================================================ */}
          {visiblePlaces.map(place => {
            const { x, y, layout } = getCoordinates(place);
            const isSelected = selectedPlace?.receipt_id === place.receipt_id;
            const categoryStyle = CATEGORY_COLORS[layout.category] || { bg: '#FCFAF6', dot: '#1C1B18' };

            // Calculate label pill dimensions and anchor
            const labelText = place.name;
            const approxWidth = Math.max(labelText.length * 6.5 + 24, 80);
            const pillHeight = 20;

            let pillX = x + layout.dx;
            if (layout.labelAlign === 'right') {
              pillX = x + layout.dx;
            } else if (layout.labelAlign === 'left') {
              pillX = x + layout.dx - approxWidth;
            } else {
              pillX = x - approxWidth / 2;
            }
            const pillY = y + layout.dy - pillHeight / 2;

            return (
              <g
                key={place.receipt_id}
                role="button"
                tabIndex={0}
                aria-label={`Place #${place.receipt_id}: ${place.name}, ${place.city}`}
                data-testid={`map-pin-${place.receipt_id}`}
                className="cursor-pointer group focus:outline-none"
                onClick={() => onSelectPlace(place)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPlace(place);
                  }
                }}
              >
                {/* Connecting lead line from pin to label */}
                <line
                  x1={x}
                  y1={y}
                  x2={layout.labelAlign === 'center' ? x : (layout.labelAlign === 'right' ? pillX : pillX + approxWidth)}
                  y2={pillY + pillHeight / 2}
                  stroke="#8C8270"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />

                {/* Selected Pulsing Glow */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill="none"
                    stroke="#B8321F"
                    strokeWidth="2"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Pin Outer Ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8.5 : 6.5}
                  fill={isSelected ? '#B8321F' : categoryStyle.dot}
                  stroke="#1C1B18"
                  strokeWidth="1.5"
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Pin Center Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="#FCFAF6"
                />

                {/* Label Pill Box */}
                <g className="transition-transform duration-150 group-hover:scale-105" style={{ transformOrigin: `${x}px ${y}px` }}>
                  <rect
                    x={pillX}
                    y={pillY}
                    width={approxWidth}
                    height={pillHeight}
                    rx="3.5"
                    fill={isSelected ? '#1C1B18' : '#FCFAF6'}
                    stroke={isSelected ? '#1C1B18' : '#CFC5AE'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    className="drop-shadow-xs group-hover:stroke-ink transition-colors"
                  />

                  {/* Category color dot inside pill */}
                  <circle
                    cx={pillX + 8}
                    cy={pillY + pillHeight / 2}
                    r="3"
                    fill={isSelected ? '#FAF6EE' : categoryStyle.dot}
                  />

                  {/* Label Text */}
                  <text
                    x={pillX + 16}
                    y={pillY + pillHeight / 2 + 3.5}
                    className={`font-mono text-[10px] font-bold select-none ${
                      isSelected ? 'fill-paper' : 'fill-ink'
                    }`}
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
