import type {
  BaseReceipt,
  Chapter,
  EventReceipt,
  MessageReceipt,
  Moment,
  MovieReceipt,
  MusicReceipt,
  NoteReceipt,
  PhotoReceipt,
  PlaceReceipt,
  PurchaseReceipt,
  Receipt,
  ReceiptType,
  SearchReceipt,
} from '../../types';

import { loadRawDataset } from './loaders';
import { formatDateLabel, formatTimeLabel, getTimeOfDayBand, parseDateLocal, parseDurationMin } from '../time';
import { normalizeLocation, resolveCoordinates } from '../geo';
import { buildGraph, type AdjacencyGraph } from '../graph';
import { buildMoments } from './moments';
import { buildChapters } from './chapters';

export interface Dataset {
  receipts: Receipt[];
  receiptsMap: Map<string, Receipt>;
  graph: AdjacencyGraph;
  moments: Moment[];
  chapters: Chapter[];
  purchasesTotal: number;
  placesWithCoords: PlaceReceipt[];
}

function parseType(rawType: string): ReceiptType {
  const lower = (rawType || '').toLowerCase().trim();
  if (lower.includes('music')) return 'music';
  if (lower.includes('movie')) return 'movie';
  if (lower.includes('place')) return 'place';
  if (lower.includes('purchase')) return 'purchase';
  if (lower.includes('photo')) return 'photo';
  if (lower.includes('message')) return 'message';
  if (lower.includes('search')) return 'search';
  if (lower.includes('event')) return 'event';
  return 'note';
}

export function buildDataset(): Dataset {
  const raw = loadRawDataset();

  // Index sub-files by receipt_id
  const musicMap = new Map(raw.music.map(m => [m.receipt_id, m]));
  const moviesMap = new Map(raw.movies.map(m => [m.receipt_id, m]));
  const placesMap = new Map(raw.places.map(p => [p.receipt_id, p]));
  const purchasesMap = new Map(raw.purchases.map(p => [p.receipt_id, p]));
  const photosMap = new Map(raw.photos.map(p => [p.receipt_id, p]));
  const messagesMap = new Map(raw.messages.map(m => [m.receipt_id, m]));
  const searchesMap = new Map(raw.searches.map(s => [s.receipt_id, s]));
  const eventsMap = new Map(raw.events.map(e => [e.receipt_id, e]));

  // Place coords index for fast lookup
  const placesCoordsMap = new Map<string, { name: string; latitude: number; longitude: number }>();
  for (const p of raw.places) {
    placesCoordsMap.set(p.receipt_id, {
      name: p.name,
      latitude: parseFloat(p.latitude),
      longitude: parseFloat(p.longitude),
    });
  }

  // Connected place lookup
  const connectedPlaceMap = new Map<string, { name: string; latitude: number; longitude: number }>();
  for (const c of raw.connections) {
    if (placesCoordsMap.has(c.to_receipt_id)) {
      connectedPlaceMap.set(c.from_receipt_id, placesCoordsMap.get(c.to_receipt_id)!);
    }
    if (placesCoordsMap.has(c.from_receipt_id)) {
      connectedPlaceMap.set(c.to_receipt_id, placesCoordsMap.get(c.from_receipt_id)!);
    }
  }

  const receipts: Receipt[] = [];
  const receiptsMap = new Map<string, Receipt>();
  let purchasesTotal = 0;
  const placesWithCoords: PlaceReceipt[] = [];

  for (const r of raw.lifeReceipts) {
    const date = parseDateLocal(r.timestamp);
    const type = parseType(r.type);
    const tags = (r.tags || '')
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const normLoc = normalizeLocation(r.location);
    const coords = resolveCoordinates(r.receipt_id, r.location, placesCoordsMap, connectedPlaceMap);

    const base: BaseReceipt = {
      receipt_id: r.receipt_id,
      timestamp: r.timestamp,
      date,
      type,
      title: r.title,
      context: r.context,
      location: r.location,
      category: r.category,
      amount: r.amount ? parseFloat(r.amount) : undefined,
      source: r.source || undefined,
      tags,
      month: date.getMonth() + 1,
      day: date.getDate(),
      timeOfDay: getTimeOfDayBand(date),
      timeLabel: formatTimeLabel(date),
      dateLabel: formatDateLabel(date),
      normalizedCity: normLoc.city,
      coordinates: coords,
    };

    let fullReceipt: Receipt;

    switch (type) {
      case 'music': {
        const sub = musicMap.get(r.receipt_id);
        const dur = parseDurationMin(sub?.duration_min || '');
        fullReceipt = {
          ...base,
          type: 'music',
          music_id: sub?.music_id || '',
          track: sub?.track || r.title,
          artist: sub?.artist || r.context,
          album: sub?.album || '',
          played_at: sub?.played_at || r.timestamp,
          duration_min: sub?.duration_min || '',
          duration_sec: dur.seconds,
          duration_formatted: dur.formatted,
          genre: sub?.genre || '',
        } as MusicReceipt;
        break;
      }
      case 'movie': {
        const sub = moviesMap.get(r.receipt_id);
        fullReceipt = {
          ...base,
          type: 'movie',
          movie_id: sub?.movie_id || '',
          watched_at: sub?.watched_at || r.timestamp,
          director: sub?.director || r.context,
          genre: sub?.genre || '',
        } as MovieReceipt;
        break;
      }
      case 'place': {
        const sub = placesMap.get(r.receipt_id);
        const lat = sub ? parseFloat(sub.latitude) : 0;
        const lon = sub ? parseFloat(sub.longitude) : 0;
        const placeR: PlaceReceipt = {
          ...base,
          type: 'place',
          place_id: sub?.place_id || '',
          name: sub?.name || r.title,
          place_type: sub?.type || r.context,
          city: sub?.city || r.location,
          latitude: lat,
          longitude: lon,
        };
        fullReceipt = placeR;
        placesWithCoords.push(placeR);
        break;
      }
      case 'purchase': {
        const sub = purchasesMap.get(r.receipt_id);
        const amt = sub ? parseFloat(sub.amount) : (base.amount || 0);
        purchasesTotal += amt;
        fullReceipt = {
          ...base,
          type: 'purchase',
          purchase_id: sub?.purchase_id || '',
          merchant: sub?.merchant || r.context,
          item: sub?.item || r.title,
          amount: amt,
          currency: sub?.currency || 'INR',
          city: sub?.city || r.location,
        } as PurchaseReceipt;
        break;
      }
      case 'photo': {
        const sub = photosMap.get(r.receipt_id);
        const device = sub?.device || 'Phone Camera';
        let device_category: 'phone' | 'mirrorless' | 'film' = 'phone';
        if (device.toLowerCase().includes('mirrorless')) device_category = 'mirrorless';
        else if (device.toLowerCase().includes('film') || device.toLowerCase().includes('35mm')) device_category = 'film';

        fullReceipt = {
          ...base,
          type: 'photo',
          photo_id: sub?.photo_id || '',
          device,
          device_category,
        } as PhotoReceipt;
        break;
      }
      case 'message': {
        const sub = messagesMap.get(r.receipt_id);
        fullReceipt = {
          ...base,
          type: 'message',
          message_id: sub?.message_id || '',
          sender: sub?.sender || r.context,
          text: sub?.text || r.title,
          message_type: sub?.type || '',
        } as MessageReceipt;
        break;
      }
      case 'search': {
        const sub = searchesMap.get(r.receipt_id);
        fullReceipt = {
          ...base,
          type: 'search',
          search_id: sub?.search_id || '',
          query: sub?.query || r.title,
          engine: sub?.engine || 'Google',
        } as SearchReceipt;
        break;
      }
      case 'event': {
        const sub = eventsMap.get(r.receipt_id);
        fullReceipt = {
          ...base,
          type: 'event',
          event_id: sub?.event_id || '',
          name: sub?.name || r.title,
          organizer: sub?.organizer || r.context,
        } as EventReceipt;
        break;
      }
      case 'note':
      default: {
        fullReceipt = {
          ...base,
          type: 'note',
          personal_note: r.title,
        } as NoteReceipt;
        break;
      }
    }

    receipts.push(fullReceipt);
    receiptsMap.set(fullReceipt.receipt_id, fullReceipt);
  }

  // Build Adjacency Graph
  const graph = buildGraph(raw.connections, receiptsMap);

  // Build Connected Moments
  const moments = buildMoments(receipts, graph);

  // Build Monthly Chapters
  const chapters = buildChapters(receipts, moments);

  return {
    receipts,
    receiptsMap,
    graph,
    moments,
    chapters,
    purchasesTotal,
    placesWithCoords,
  };
}

// Module Singleton
let cachedDataset: Dataset | null = null;

export function getDataset(): Dataset {
  if (!cachedDataset) {
    cachedDataset = buildDataset();
  }
  return cachedDataset;
}
