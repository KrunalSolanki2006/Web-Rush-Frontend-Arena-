export interface NormalizedLocation {
  city: string;
  venue?: string;
  raw: string;
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  approximate: boolean;
  resolvedPlaceName?: string;
}

export const CITY_CENTROIDS: Record<string, { latitude: number; longitude: number }> = {
  Mumbai: { latitude: 19.0760, longitude: 72.8777 },
  Udaipur: { latitude: 24.5854, longitude: 73.7125 },
  Lonavala: { latitude: 18.7557, longitude: 73.4091 },
};

/**
 * Normalizes inconsistent location strings into a structured object.
 */
export function normalizeLocation(raw: string): NormalizedLocation {
  const trimmed = (raw || '').trim();
  if (!trimmed) {
    return { city: 'Unknown', raw: '' };
  }

  if (trimmed === 'Home') return { city: 'Home', raw: trimmed };
  if (trimmed === 'Chat') return { city: 'Chat', raw: trimmed };

  if (trimmed.includes('→') || trimmed.toLowerCase().includes(' to ')) {
    return { city: 'Transit', venue: trimmed, raw: trimmed };
  }

  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map(p => p.trim());
    const venue = parts[0];
    const city = parts[1];
    return { city, venue, raw: trimmed };
  }

  if (trimmed.toLowerCase().includes('mumbai')) {
    return { city: 'Mumbai', venue: trimmed === 'Mumbai' ? undefined : trimmed, raw: trimmed };
  }
  if (trimmed.toLowerCase().includes('udaipur')) {
    return { city: 'Udaipur', venue: trimmed === 'Udaipur' ? undefined : trimmed, raw: trimmed };
  }
  if (trimmed.toLowerCase().includes('lonavala')) {
    return { city: 'Lonavala', venue: trimmed === 'Lonavala' ? undefined : trimmed, raw: trimmed };
  }

  return { city: trimmed, raw: trimmed };
}

/**
 * Resolves coordinates for a receipt per §2.4:
 * 1. Explicit place coordinates from places.csv (approximate: false)
 * 2. Connected place coordinates via connection (approximate: true)
 * 3. Same-day place in same city (approximate: true)
 * 4. City centroid (approximate: true)
 * 5. null for Chat, Home, Unknown
 */
export function resolveCoordinates(
  receiptId: string,
  rawLocation: string,
  placesMap: Map<string, { name: string; latitude: number; longitude: number }>,
  connectedPlaceMap: Map<string, { name: string; latitude: number; longitude: number }>
): GeoCoordinate | undefined {
  // 1. Explicit place coords
  const directPlace = placesMap.get(receiptId);
  if (directPlace) {
    return {
      latitude: directPlace.latitude,
      longitude: directPlace.longitude,
      approximate: false,
      resolvedPlaceName: directPlace.name,
    };
  }

  // 2. Connected place coords
  const connectedPlace = connectedPlaceMap.get(receiptId);
  if (connectedPlace) {
    return {
      latitude: connectedPlace.latitude,
      longitude: connectedPlace.longitude,
      approximate: true,
      resolvedPlaceName: connectedPlace.name,
    };
  }

  // 3. Normalized city centroid
  const norm = normalizeLocation(rawLocation);
  if (CITY_CENTROIDS[norm.city]) {
    return {
      latitude: CITY_CENTROIDS[norm.city].latitude,
      longitude: CITY_CENTROIDS[norm.city].longitude,
      approximate: true,
      resolvedPlaceName: `${norm.city} (Centroid)`,
    };
  }

  return undefined;
}
