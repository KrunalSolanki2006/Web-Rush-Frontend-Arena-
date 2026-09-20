import lifeReceiptsRaw from '../../data/raw/life_receipts.csv?raw';
import musicRaw from '../../data/raw/music.csv?raw';
import moviesRaw from '../../data/raw/movies.csv?raw';
import placesRaw from '../../data/raw/places.csv?raw';
import purchasesRaw from '../../data/raw/purchases.csv?raw';
import photosRaw from '../../data/raw/photos.csv?raw';
import messagesRaw from '../../data/raw/messages.csv?raw';
import searchesRaw from '../../data/raw/searches.csv?raw';
import eventsRaw from '../../data/raw/events.csv?raw';
import connectionsRaw from '../../data/raw/connections.csv?raw';

import { parseCSV } from '../csv';

export interface RawLifeReceipt {
  receipt_id: string;
  timestamp: string;
  type: string;
  title: string;
  context: string;
  location: string;
  category: string;
  amount: string;
  source: string;
  tags: string;
}

export interface RawMusic {
  music_id: string;
  receipt_id: string;
  track: string;
  artist: string;
  album: string;
  played_at: string;
  duration_min: string;
  genre: string;
  tags: string;
}

export interface RawMovie {
  movie_id: string;
  receipt_id: string;
  watched_at: string;
  title: string;
  director: string;
  context: string;
  genre: string;
  tags: string;
}

export interface RawPlace {
  place_id: string;
  receipt_id: string;
  name: string;
  type: string;
  city: string;
  latitude: string;
  longitude: string;
  tags: string;
}

export interface RawPurchase {
  purchase_id: string;
  receipt_id: string;
  timestamp: string;
  merchant: string;
  item: string;
  category: string;
  amount: string;
  currency: string;
  city: string;
}

export interface RawPhoto {
  photo_id: string;
  receipt_id: string;
  timestamp: string;
  title: string;
  device: string;
  location: string;
  tags: string;
}

export interface RawMessage {
  message_id: string;
  receipt_id: string;
  timestamp: string;
  sender: string;
  text: string;
  type: string;
  tags: string;
}

export interface RawSearch {
  search_id: string;
  receipt_id: string;
  timestamp: string;
  query: string;
  engine: string;
  category: string;
  tags: string;
}

export interface RawEvent {
  event_id: string;
  receipt_id: string;
  timestamp: string;
  name: string;
  organizer: string;
  location: string;
  category: string;
  tags: string;
}

export interface RawConnection {
  connection_id: string;
  from_receipt_id: string;
  to_receipt_id: string;
  connection_type: string;
  strength: string;
  reason: string;
}

export function loadRawDataset() {
  const lifeReceipts = parseCSV(lifeReceiptsRaw) as unknown as RawLifeReceipt[];
  const music = parseCSV(musicRaw) as unknown as RawMusic[];
  const movies = parseCSV(moviesRaw) as unknown as RawMovie[];
  const places = parseCSV(placesRaw) as unknown as RawPlace[];
  const purchases = parseCSV(purchasesRaw) as unknown as RawPurchase[];
  const photos = parseCSV(photosRaw) as unknown as RawPhoto[];
  const messages = parseCSV(messagesRaw) as unknown as RawMessage[];
  const searches = parseCSV(searchesRaw) as unknown as RawSearch[];
  const events = parseCSV(eventsRaw) as unknown as RawEvent[];
  const connections = parseCSV(connectionsRaw) as unknown as RawConnection[];

  // Validate Ground Truth assertions (§2.3)
  if (lifeReceipts.length !== 55) {
    throw new Error(`Expected 55 life receipts, found ${lifeReceipts.length}`);
  }
  if (connections.length !== 29) {
    throw new Error(`Expected 29 connections, found ${connections.length}`);
  }
  if (places.length !== 8) {
    throw new Error(`Expected 8 places with coordinates, found ${places.length}`);
  }
  if (purchases.length !== 6) {
    throw new Error(`Expected 6 purchases, found ${purchases.length}`);
  }

  return {
    lifeReceipts,
    music,
    movies,
    places,
    purchases,
    photos,
    messages,
    searches,
    events,
    connections,
  };
}
