import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { getDataset } from '../../lib/dataset';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { useReceipt } from '../../hooks/useReceipt';
import { useNavigate } from 'react-router-dom';
import type { PlaceReceipt, Receipt } from '../../types';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';

interface Bounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

const INDIA_BOUNDS: Bounds = {
  minLat: 18.2,
  maxLat: 25.2,
  minLon: 72.4,
  maxLon: 74.2,
};

const MUMBAI_BOUNDS: Bounds = {
  minLat: 18.88,
  maxLat: 19.28,
  minLon: 72.78,
  maxLon: 72.96,
};

export const MapPage: React.FC = () => {
  const dataset = useMemo(() => getDataset(), []);
  const { openReceipt } = useReceipt();
  const navigate = useNavigate();

  const [view, setView] = useState<'india' | 'mumbai'>('india');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceReceipt | null>(
    dataset.placesWithCoords[0] || null
  );

  const bounds = view === 'india' ? INDIA_BOUNDS : MUMBAI_BOUNDS;
  const svgWidth = 800;
  const svgHeight = 550;

  // Cosine latitude correction for equirectangular projection
  const midLatRad = (((bounds.minLat + bounds.maxLat) / 2) * Math.PI) / 180;
  const cosMidLat = Math.cos(midLatRad);

  const project = (lat: number, lon: number): { x: number; y: number } => {
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * svgWidth;
    // Invert y since SVG y is top-down
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * svgHeight;
    return { x, y: y * cosMidLat + (1 - cosMidLat) * (svgHeight / 2) };
  };

  // Filter places based on view and selected month
  const visiblePlaces = useMemo(() => {
    return dataset.placesWithCoords.filter(p => {
      if (view === 'mumbai') {
        const isMumbaiArea = p.city.toLowerCase().includes('mumbai');
        if (!isMumbaiArea) return false;
      }
      if (selectedMonth !== null) {
        if (p.month !== selectedMonth) return false;
      }
      return true;
    });
  }, [dataset.placesWithCoords, view, selectedMonth]);

  // Receipts connected to or situated at the selected place
  const placeReceipts = useMemo<Receipt[]>(() => {
    if (!selectedPlace) return [];
    return dataset.receipts.filter(
      r =>
        r.receipt_id === selectedPlace.receipt_id ||
        (r.location && r.location.toLowerCase().includes(selectedPlace.name.toLowerCase())) ||
        (r.context && r.context.toLowerCase().includes(selectedPlace.name.toLowerCase()))
    );
  }, [selectedPlace, dataset.receipts]);

  // Chronological route line points
  const routePoints = useMemo(() => {
    const sorted = [...visiblePlaces].sort((a, b) => a.date.getTime() - b.date.getTime());
    return sorted.map(p => {
      const pt = project(p.latitude, p.longitude);
      return `${pt.x},${pt.y}`;
    });
  }, [visiblePlaces, bounds]);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Life Map"
        subtitle="Geographic projection of the eight geolocated places across Mumbai, Lonavala, and Udaipur. No third-party tiles or external servers."
        badge="SVG PROJECTION"
      />

      {/* Map Controls */}
      <div className="bg-slip border border-rule p-4 rounded-sm shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('india')}
            className={`cursor-pointer px-3 py-1.5 font-mono text-xs uppercase font-bold rounded-xs border transition-colors ${
              view === 'india'
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper text-ink-soft border-rule hover:border-ink hover:text-ink'
            }`}
          >
            India Route (Mumbai · Lonavala · Udaipur)
          </button>
          <button
            onClick={() => setView('mumbai')}
            className={`cursor-pointer px-3 py-1.5 font-mono text-xs uppercase font-bold rounded-xs border transition-colors ${
              view === 'mumbai'
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper text-ink-soft border-rule hover:border-ink hover:text-ink'
            }`}
          >
            Mumbai Close-up
          </button>
        </div>

        {/* Month Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto font-mono text-xs">
          <span className="text-ink-soft mr-1">Filter Month:</span>
          <button
            onClick={() => setSelectedMonth(null)}
            className={`cursor-pointer px-2 py-0.5 rounded-xs border ${
              selectedMonth === null
                ? 'bg-ink text-paper border-ink font-bold'
                : 'bg-paper text-ink-soft border-rule hover:border-ink'
            }`}
          >
            All
          </button>
          {dataset.chapters.map(ch => (
            <button
              key={ch.month}
              onClick={() => setSelectedMonth(selectedMonth === ch.month ? null : ch.month)}
              className={`cursor-pointer px-2 py-0.5 rounded-xs border ${
                selectedMonth === ch.month
                  ? 'bg-ink text-paper border-ink font-bold'
                  : 'bg-paper text-ink-soft border-rule hover:border-ink'
              }`}
            >
              {ch.monthName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SVG Map Projection */}
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
                    className="cursor-pointer group"
                    onClick={() => setSelectedPlace(place)}
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

        {/* Right 1 Col: Selected Place Details Panel */}
        <div className="lg:col-span-1 bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
          {selectedPlace ? (
            <div className="space-y-4">
              <div className="border-b border-dashed border-rule pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-paper text-ink font-bold rounded-xs border border-rule">
                    Place #{selectedPlace.receipt_id}
                  </span>
                  <span className="font-mono text-xs text-ink-soft">
                    {selectedPlace.dateLabel}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-ink">
                  {selectedPlace.name}
                </h3>
                <div className="flex items-center gap-1.5 font-mono text-xs text-ink-soft mt-1">
                  <MapPin size={13} aria-hidden="true" />
                  <span>
                    {selectedPlace.place_type} · {selectedPlace.city}
                  </span>
                </div>
              </div>

              {/* Coordinates Details */}
              <div className="bg-paper p-3 rounded-xs border border-rule font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Latitude:</span>
                  <span className="font-bold text-ink">{selectedPlace.latitude.toFixed(4)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Longitude:</span>
                  <span className="font-bold text-ink">{selectedPlace.longitude.toFixed(4)}° E</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openReceipt(selectedPlace.receipt_id)}
                  className="cursor-pointer flex-1 py-2 px-3 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-ink-soft transition-colors text-center"
                >
                  View Receipt
                </button>
                <button
                  onClick={() => navigate(`/threads?focus=${selectedPlace.receipt_id}`)}
                  className="cursor-pointer py-2 px-3 bg-paper border border-rule text-ink font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-paper-deep transition-colors"
                  title="Pull thread in Threads"
                >
                  Pull Thread
                </button>
              </div>

              {/* Connected Moments at this place */}
              <div className="pt-3 border-t border-dashed border-rule space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                  Moments Recorded Here ({placeReceipts.length})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {placeReceipts.map(r => (
                    <div
                      key={r.receipt_id}
                      onClick={() => openReceipt(r.receipt_id)}
                      className="p-2.5 bg-paper rounded-xs border border-rule/70 hover:border-ink cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-ink-soft">
                        <span className="font-bold text-ink">#{r.receipt_id}</span>
                        <span>{r.timeLabel}</span>
                      </div>
                      <div className="font-sans text-xs font-semibold text-ink line-clamp-1 mt-0.5">
                        {r.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-ink-soft font-mono text-xs">
              Select any place pin on the map to inspect its moments.
            </div>
          )}
        </div>
      </div>

      {/* Accessible Alternative: Places Visited Table */}
      <div className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-3">
        <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
          <Compass size={18} aria-hidden="true" />
          <span>Places Visited (Accessible Ledger)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-paper border-b border-rule text-ink-soft uppercase tracking-wider">
                <th className="p-2.5">Place Name</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">City / Region</th>
                <th className="p-2.5">Coordinates</th>
                <th className="p-2.5">Date Visited</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/50">
              {dataset.placesWithCoords.map(p => (
                <tr key={p.receipt_id} className="hover:bg-paper/60 transition-colors">
                  <td className="p-2.5 font-bold text-ink">{p.name}</td>
                  <td className="p-2.5 text-ink-soft">{p.place_type}</td>
                  <td className="p-2.5 text-ink">{p.city}</td>
                  <td className="p-2.5 text-ink-soft">
                    {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                  </td>
                  <td className="p-2.5 text-ink-soft">{p.dateLabel}</td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => openReceipt(p.receipt_id)}
                      className="cursor-pointer text-stamp-red font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Receipt</span>
                      <ExternalLink size={11} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
