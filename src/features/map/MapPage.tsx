import React, { useState, useMemo, useCallback } from 'react';
import { useDataset } from '../../hooks/useDataset';
import { useReceipt } from '../../hooks/useReceipt';
import { useNavigate } from 'react-router-dom';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { PlaceReceipt, Receipt } from '../../types';
import { MapControls } from './components/MapControls';
import { MapCanvas } from './components/MapCanvas';
import { PlaceDetailsCard } from './components/PlaceDetailsCard';
import { PlacesTable } from './components/PlacesTable';

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
  const { places, receipts, chapters } = useDataset();
  const { openReceipt } = useReceipt();
  const navigate = useNavigate();

  const [view, setView] = useState<'india' | 'mumbai'>('india');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceReceipt | null>(
    places[0] || null
  );

  const bounds = view === 'india' ? INDIA_BOUNDS : MUMBAI_BOUNDS;
  const svgWidth = 800;
  const svgHeight = 550;

  // Cosine latitude correction for equirectangular projection
  const midLatRad = (((bounds.minLat + bounds.maxLat) / 2) * Math.PI) / 180;
  const cosMidLat = Math.cos(midLatRad);

  const project = useCallback(
    (lat: number, lon: number): { x: number; y: number } => {
      const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * svgWidth;
      // Invert y since SVG y is top-down
      const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * svgHeight;
      return { x, y: y * cosMidLat + (1 - cosMidLat) * (svgHeight / 2) };
    },
    [bounds, cosMidLat]
  );

  // Filter places based on view and selected month
  const visiblePlaces = useMemo(() => {
    return places.filter(p => {
      if (view === 'mumbai') {
        const isMumbaiArea = p.city.toLowerCase().includes('mumbai');
        if (!isMumbaiArea) return false;
      }
      if (selectedMonth !== null) {
        if (p.month !== selectedMonth) return false;
      }
      return true;
    });
  }, [places, view, selectedMonth]);

  // Receipts connected to or situated at the selected place
  const placeReceipts = useMemo<Receipt[]>(() => {
    if (!selectedPlace) return [];
    return receipts.filter(
      r =>
        r.receipt_id === selectedPlace.receipt_id ||
        (r.location && r.location.toLowerCase().includes(selectedPlace.name.toLowerCase())) ||
        (r.context && r.context.toLowerCase().includes(selectedPlace.name.toLowerCase()))
    );
  }, [selectedPlace, receipts]);

  // Chronological route line points
  const routePoints = useMemo(() => {
    const sorted = [...visiblePlaces].sort((a, b) => a.date.getTime() - b.date.getTime());
    return sorted.map(p => {
      const pt = project(p.latitude, p.longitude);
      return `${pt.x},${pt.y}`;
    });
  }, [visiblePlaces, project]);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Life Map"
        subtitle="Geographic projection of the eight geolocated places across Mumbai, Lonavala, and Udaipur. No third-party tiles or external servers."
        badge="SVG PROJECTION"
      />

      {/* Map Controls */}
      <MapControls
        view={view}
        onViewChange={setView}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        chapters={chapters}
      />

      {/* Main Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MapCanvas
          view={view}
          selectedMonth={selectedMonth}
          visiblePlaces={visiblePlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={setSelectedPlace}
          routePoints={routePoints}
          project={project}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
        />

        <PlaceDetailsCard
          selectedPlace={selectedPlace}
          placeReceipts={placeReceipts}
          onOpenReceipt={openReceipt}
          onPullThread={(id) => navigate(`/threads?focus=${id}`)}
        />
      </div>

      {/* Accessible Alternative: Places Visited Table */}
      <PlacesTable places={places} onOpenReceipt={openReceipt} />
    </div>
  );
};
