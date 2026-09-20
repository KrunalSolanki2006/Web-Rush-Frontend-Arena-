import React from 'react';
import { motion } from 'motion/react';
import { Navigation } from 'lucide-react';
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
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  view,
  selectedMonth,
  visiblePlaces,
  selectedPlace,
  onSelectPlace,
  routePoints,
  project,
  svgWidth,
  svgHeight,
}) => {
  return (
    <div className="lg:col-span-2 bg-slip border border-rule rounded-sm p-4 shadow-xs relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10 bg-paper/90 backdrop-blur-xs p-2.5 rounded-xs border border-rule font-mono text-xs text-ink space-y-1 shadow-xs">
        <div className="font-bold uppercase text-stamp-red flex items-center gap-1.5">
          <Navigation size={13} aria-hidden="true" />
          <span>{view === 'india' ? 'Regional View' : 'Mumbai Metro'}</span>
        </div>
        <div className="text-[11px] text-ink-soft">
          {visiblePlaces.length} places visible · dashed line indicates chronological trail
        </div>
      </div>

      <div className="w-full aspect-[8/5.5] bg-paper-deep/30 rounded-xs border border-rule/50 relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
        >
          {/* Subtle Equirectangular Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CFC5AE" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

          {/* Chronological Connecting Route with Draw Animation */}
          {routePoints.length > 1 && (
            <motion.polyline
              key={`${view}-${selectedMonth}`}
              points={routePoints.join(' ')}
              fill="none"
              stroke="#1C1B18"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          )}

          {/* Place Pins */}
          {visiblePlaces.map(place => {
            const pt = project(place.latitude, place.longitude);
            const isSelected = selectedPlace?.receipt_id === place.receipt_id;

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
                {/* Pulsing ring for selected pin */}
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="14"
                    fill="none"
                    stroke="#B8321F"
                    strokeWidth="2"
                    className="animate-ping opacity-50"
                  />
                )}

                {/* Outer pin ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 9 : 7}
                  fill={isSelected ? '#B8321F' : '#2E6B4F'}
                  stroke="#1C1B18"
                  strokeWidth="1.5"
                  className="transition-all group-hover:scale-125"
                />

                {/* Inner pin center */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="3"
                  fill="#FBF8F1"
                />

                {/* Pin Label */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className="font-mono text-[11px] font-bold fill-ink select-none drop-shadow-xs pointer-events-none"
                >
                  {place.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
