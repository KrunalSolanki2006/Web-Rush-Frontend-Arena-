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

export type TimeOfDayBand = 'night' | 'morning' | 'afternoon' | 'evening';

export interface BaseReceipt {
  receipt_id: string; // R001-R055
  timestamp: string;  // YYYY-MM-DD HH:mm (wall-clock)
  date: Date;         // Parsed local date
  type: ReceiptType;
  title: string;
  context: string;
  location: string;
  category: string;
  amount?: number;
  source?: string;
  tags: string[];
  month: number;      // 1-9
  day: number;
  timeOfDay: TimeOfDayBand;
  timeLabel: string;  // "21:10"
  dateLabel: string;  // "Jan 4, 2025"
  normalizedCity: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    approximate: boolean;
  };
}

export interface MusicReceipt extends BaseReceipt {
  type: 'music';
  music_id: string;
  track: string;
  artist: string;
  album: string;
  played_at: string;
  duration_min: string; // raw string like "4.03" or "5.2"
  duration_sec: number; // parsed: 4.03 -> 243, 5.2 -> 320
  duration_formatted: string; // "4:03", "5:20"
  genre: string;
}

export interface MovieReceipt extends BaseReceipt {
  type: 'movie';
  movie_id: string;
  watched_at: string;
  director: string;
  genre: string;
}

export interface PlaceReceipt extends BaseReceipt {
  type: 'place';
  place_id: string;
  name: string;
  place_type: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface PurchaseReceipt extends BaseReceipt {
  type: 'purchase';
  purchase_id: string;
  merchant: string;
  item: string;
  amount: number;
  currency: string;
  city: string;
}

export interface PhotoReceipt extends BaseReceipt {
  type: 'photo';
  photo_id: string;
  device: 'Phone Camera' | 'Mirrorless Camera' | '35mm Film Camera' | string;
  device_category: 'phone' | 'mirrorless' | 'film';
}

export interface MessageReceipt extends BaseReceipt {
  type: 'message';
  message_id: string;
  sender: string;
  text: string;
  message_type: string;
}

export interface SearchReceipt extends BaseReceipt {
  type: 'search';
  search_id: string;
  query: string;
  engine: string;
}

export interface EventReceipt extends BaseReceipt {
  type: 'event';
  event_id: string;
  name: string;
  organizer: string;
}

export interface NoteReceipt extends BaseReceipt {
  type: 'note';
  personal_note: string;
}

export type Receipt = 
  | MusicReceipt
  | MovieReceipt
  | PlaceReceipt
  | PurchaseReceipt
  | PhotoReceipt
  | MessageReceipt
  | SearchReceipt
  | EventReceipt
  | NoteReceipt;

export type EdgeOrigin = 'confirmed' | 'inferred' | 'echo';

export interface Edge {
  id: string;
  fromReceiptId: string;
  toReceiptId: string;
  connectionType: string;
  strength: number; // 0.0 - 1.0
  reason: string;
  origin: EdgeOrigin;
  timeGapMs: number;
  timeGapFormatted: string;
}

export interface Moment {
  id: string;
  title: string;
  receipts: Receipt[];
  receiptIds: string[];
  typeRecipe: ReceiptType[];
  startTime: Date;
  endTime: Date;
  spanMs: number;
  chapterMonth: number;
  isConfirmedChain: boolean;
}

export interface ChapterStats {
  receiptCount: number;
  typeCounts: Record<ReceiptType, number>;
  timeOfDayCounts: Record<TimeOfDayBand, number>;
  totalSpend: number;
  photoCount: number;
  photoDevices: Record<string, number>;
  topThemes: string[];
  cities: string[];
}

export interface Chapter {
  month: number; // 1-9
  monthName: string; // "Jan", "Feb", ...
  year: number; // 2025
  title: string;
  persona: string;
  blurb: string;
  signal: string;
  receipts: Receipt[];
  moments: Moment[];
  innerVoice?: NoteReceipt;
  stats: ChapterStats;
  previousChapterDiff?: string;
}

export type Theme = 
  | 'water'
  | 'light'
  | 'movement'
  | 'stillness'
  | 'seeing'
  | 'writing'
  | 'company';

export interface IntentActionLag {
  searchReceipt: SearchReceipt;
  outcomeReceipt: Receipt;
  lagMs: number;
  lagFormatted: string;
  hypothesis: string;
}

export interface SpendingBreakdown {
  total: number;
  currency: string;
  purchases: PurchaseReceipt[];
  cameraTotal: number;
  cameraPercentage: number;
  mirrorlessPercentage: number;
}

export interface MorningShiftData {
  chapters: {
    month: number;
    monthName: string;
    morningPercentage: number;
    nightPercentage: number;
    bands: Record<TimeOfDayBand, number>;
    total: number;
  }[];
  janFebMorningRatio: string;
  mayJulMorningRatio: string;
}

export interface InnerVoiceItem {
  receipt: NoteReceipt;
  order: number;
  timeLabel: string;
  dateLabel: string;
  isNight: boolean;
}
