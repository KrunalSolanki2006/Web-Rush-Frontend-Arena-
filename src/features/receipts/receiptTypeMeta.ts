import type { ComponentType } from 'react';
import type { ReceiptType } from '../../types';
import {
  Headphones,
  Film,
  MapPin,
  ShoppingBag,
  Camera,
  MessageSquare,
  Search,
  Calendar,
  FileText,
} from 'lucide-react';

export interface ReceiptTypeMetadata {
  type: ReceiptType;
  label: string;
  pluralLabel: string;
  verb: string;
  colorHex: string;
  bgTint: string;
  borderColor: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false'; size?: number }>;
  description: string;
}

export const RECEIPT_TYPE_META: Record<ReceiptType, ReceiptTypeMetadata> = {
  music: {
    type: 'music',
    label: 'Music',
    pluralLabel: 'Music Tracks',
    verb: 'Listened to',
    colorHex: '#4A4FA6',
    bgTint: 'rgba(74, 79, 166, 0.12)',
    borderColor: '#4A4FA6',
    icon: Headphones,
    description: 'Songs and listening sessions captured across the year',
  },
  movie: {
    type: 'movie',
    label: 'Movie',
    pluralLabel: 'Movies',
    verb: 'Watched',
    colorHex: '#7A3E8E',
    bgTint: 'rgba(122, 62, 142, 0.12)',
    borderColor: '#7A3E8E',
    icon: Film,
    description: 'Films watched at home or indie cinema nights',
  },
  place: {
    type: 'place',
    label: 'Place',
    pluralLabel: 'Places',
    verb: 'Visited',
    colorHex: '#2E6B4F',
    bgTint: 'rgba(46, 107, 79, 0.12)',
    borderColor: '#2E6B4F',
    icon: MapPin,
    description: 'Geolocated cafes, landmarks, trails, and cultural spots',
  },
  purchase: {
    type: 'purchase',
    label: 'Purchase',
    pluralLabel: 'Purchases',
    verb: 'Bought',
    colorHex: '#96600F',
    bgTint: 'rgba(150, 96, 15, 0.12)',
    borderColor: '#96600F',
    icon: ShoppingBag,
    description: 'Gear, books, tickets, and supplies invested in new chapters',
  },
  photo: {
    type: 'photo',
    label: 'Photo',
    pluralLabel: 'Photos',
    verb: 'Captured',
    colorHex: '#0F6E7A',
    bgTint: 'rgba(15, 110, 122, 0.12)',
    borderColor: '#0F6E7A',
    icon: Camera,
    description: 'Visual frames taken on phone, mirrorless, or 35mm film',
  },
  message: {
    type: 'message',
    label: 'Message',
    pluralLabel: 'Messages',
    verb: 'Received',
    colorHex: '#A63D6B',
    bgTint: 'rgba(166, 61, 107, 0.12)',
    borderColor: '#A63D6B',
    icon: MessageSquare,
    description: 'Personal text exchanges with friends and organizers',
  },
  search: {
    type: 'search',
    label: 'Search',
    pluralLabel: 'Searches',
    verb: 'Searched',
    colorHex: '#4D5A6B',
    bgTint: 'rgba(77, 90, 107, 0.12)',
    borderColor: '#4D5A6B',
    icon: Search,
    description: 'Intent queries preceding trips, gear purchases, and habits',
  },
  event: {
    type: 'event',
    label: 'Event',
    pluralLabel: 'Events',
    verb: 'Attended',
    colorHex: '#2D5FA8',
    bgTint: 'rgba(45, 95, 168, 0.12)',
    borderColor: '#2D5FA8',
    icon: Calendar,
    description: 'Community runs, photo walks, meetups, and travel days',
  },
  note: {
    type: 'note',
    label: 'Personal Note',
    pluralLabel: 'Personal Notes',
    verb: 'Noted',
    colorHex: '#2B2A27',
    bgTint: 'rgba(43, 42, 39, 0.12)',
    borderColor: '#2B2A27',
    icon: FileText,
    description: 'Intimate reflections and intentions recorded in quiet hours',
  },
};
