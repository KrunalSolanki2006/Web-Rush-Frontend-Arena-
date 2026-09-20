import React from 'react';
import type {
  EventReceipt,
  MessageReceipt,
  MovieReceipt,
  MusicReceipt,
  NoteReceipt,
  PhotoReceipt,
  PlaceReceipt,
  PurchaseReceipt,
  Receipt,
  SearchReceipt,
} from '../../types';
import { TypeBadge } from './TypeBadge';
import { Barcode } from './Barcode';
import { PhotoFrame } from './PhotoFrame';
import { Chip } from './Chip';
import { formatINR } from '../../lib/time';
import { MapPin, ArrowRight, ExternalLink } from 'lucide-react';

interface ReceiptSlipProps {
  receipt: Receipt;
  variant?: 'compact' | 'full' | 'inline';
  onClick?: () => void;
  onPullThread?: (receiptId: string) => void;
  className?: string;
  isSelected?: boolean;
}

export const ReceiptSlip: React.FC<ReceiptSlipProps> = ({
  receipt,
  variant = 'compact',
  onClick,
  onPullThread,
  className = '',
  isSelected = false,
}) => {
  const isFull = variant === 'full';
  const isInline = variant === 'inline';

  // Specific content renders based on type
  const renderTypeSpecificDetails = () => {
    switch (receipt.type) {
      case 'music': {
        const r = receipt as MusicReceipt;
        return (
          <div className="my-2 space-y-1 bg-paper/60 p-2.5 rounded-xs border border-rule/50 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-ink-soft">Track:</span>
              <span className="font-semibold text-ink">{r.track}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Artist:</span>
              <span className="text-ink">{r.artist}</span>
            </div>
            {r.album && (
              <div className="flex justify-between">
                <span className="text-ink-soft">Album:</span>
                <span className="text-ink truncate max-w-[180px]">{r.album}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-soft">Duration:</span>
              <span className="text-ink">{r.duration_formatted}</span>
            </div>
          </div>
        );
      }
      case 'movie': {
        const r = receipt as MovieReceipt;
        return (
          <div className="my-2 space-y-1 bg-paper/60 p-2.5 rounded-xs border border-rule/50 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-ink-soft">Director:</span>
              <span className="font-semibold text-ink">{r.director}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Context:</span>
              <span className="text-ink">{r.context}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Genre:</span>
              <span className="text-ink capitalize">{r.genre}</span>
            </div>
          </div>
        );
      }
      case 'place': {
        const r = receipt as PlaceReceipt;
        return (
          <div className="my-2 space-y-1 bg-paper/60 p-2.5 rounded-xs border border-rule/50 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-ink-soft">Category:</span>
              <span className="text-ink">{r.place_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">City:</span>
              <span className="text-ink">{r.city}</span>
            </div>
            {r.latitude !== 0 && (
              <div className="flex justify-between text-[11px] text-ink-soft">
                <span>Coords:</span>
                <span>
                  {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        );
      }
      case 'purchase': {
        const r = receipt as PurchaseReceipt;
        return (
          <div className="my-2 space-y-1 bg-paper/60 p-2.5 rounded-xs border border-rule/50 font-mono text-xs">
            <div className="flex justify-between items-center text-sm">
              <span className="text-ink-soft">Total:</span>
              <span className="font-bold text-stamp-red font-mono">
                {formatINR(r.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Item:</span>
              <span className="text-ink">{r.item}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Merchant:</span>
              <span className="text-ink">{r.merchant}</span>
            </div>
          </div>
        );
      }
      case 'photo': {
        const r = receipt as PhotoReceipt;
        return (
          <div className="my-2">
            <PhotoFrame receipt={r} />
            <div className="flex justify-between items-center font-mono text-[11px] text-ink-soft mt-1.5 px-1">
              <span>Device:</span>
              <span className="font-medium text-ink">{r.device}</span>
            </div>
          </div>
        );
      }
      case 'message': {
        const r = receipt as MessageReceipt;
        return (
          <div className="my-2 p-3 bg-paper/70 rounded-xs border border-rule/60">
            <div className="flex items-center justify-between text-xs font-mono text-ink-soft mb-1">
              <span>From: <strong className="text-ink">{r.sender}</strong></span>
              <span className="uppercase text-[10px]">{r.message_type}</span>
            </div>
            <p className="font-sans text-sm italic text-ink bg-white/50 p-2 rounded-xs border border-rule/30">
              "{r.text}"
            </p>
          </div>
        );
      }
      case 'search': {
        const r = receipt as SearchReceipt;
        return (
          <div className="my-2 p-2.5 bg-paper/60 rounded-xs border border-rule/50 font-mono text-xs">
            <div className="text-[11px] text-ink-soft mb-1">Query via {r.engine}:</div>
            <div className="font-semibold text-ink bg-paper p-1.5 rounded-xs border border-rule">
              🔍 {r.query}
            </div>
          </div>
        );
      }
      case 'event': {
        const r = receipt as EventReceipt;
        return (
          <div className="my-2 space-y-1 bg-paper/60 p-2.5 rounded-xs border border-rule/50 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-ink-soft">Event:</span>
              <span className="font-semibold text-ink">{r.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Organizer:</span>
              <span className="text-ink">{r.organizer}</span>
            </div>
          </div>
        );
      }
      case 'note': {
        const r = receipt as NoteReceipt;
        return (
          <div className="my-2 p-3 bg-highlighter/15 rounded-xs border-l-3 border-stamp-red">
            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-soft mb-1">
              Personal Note:
            </div>
            <p className="font-display text-base font-bold italic text-ink">
              "{r.personal_note}"
            </p>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <article
      onClick={onClick}
      data-testid={`receipt-slip-${receipt.receipt_id}`}
      data-receipt-id={receipt.receipt_id}
      className={`relative bg-slip border border-rule rounded-sm transition-all text-ink ${
        isInline
          ? 'p-3 text-xs min-w-[200px] max-w-[240px]'
          : isFull
          ? 'p-5 md:p-6 shadow-md'
          : 'p-4 hover:shadow-md cursor-pointer hover:border-ink'
      } ${isSelected ? 'ring-2 ring-stamp-red shadow-md bg-highlighter/10' : ''} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-dashed border-rule">
        <div className="flex items-center gap-2">
          <TypeBadge type={receipt.type} size={isInline ? 'sm' : 'md'} />
          <span className="font-mono text-xs font-bold text-ink-soft tracking-wider">
            #{receipt.receipt_id}
          </span>
        </div>

        <div className="text-right font-mono text-[11px] text-ink-soft">
          <div>{receipt.dateLabel}</div>
          <div>{receipt.timeLabel}</div>
        </div>
      </div>

      {/* Main Title & Context */}
      <div className="my-2.5">
        <h3
          className={`font-display font-bold text-ink leading-tight ${
            isInline ? 'text-sm line-clamp-1' : isFull ? 'text-xl md:text-2xl' : 'text-base line-clamp-2'
          }`}
        >
          {onClick && !isFull ? (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onClick();
              }}
              className="text-left font-display font-bold text-ink leading-tight hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-ink rounded-xs w-full"
              aria-label={`View receipt #${receipt.receipt_id}: ${receipt.title}`}
              data-testid={`receipt-title-${receipt.receipt_id}`}
            >
              {receipt.title}
            </button>
          ) : (
            receipt.title
          )}
        </h3>

        {receipt.context && receipt.context !== receipt.title && (
          <p className="font-sans text-xs text-ink-soft mt-0.5">
            {receipt.context}
          </p>
        )}

        {receipt.location && (
          <div className="flex items-center gap-1 font-mono text-[11px] text-ink-soft mt-1">
            <MapPin size={12} aria-hidden="true" />
            <span className="truncate">{receipt.location}</span>
          </div>
        )}
      </div>

      {/* Type Specific Fields */}
      {(isFull || !isInline) && renderTypeSpecificDetails()}

      {/* Tags */}
      {receipt.tags.length > 0 && !isInline && (
        <div className="flex flex-wrap gap-1 my-2.5">
          {receipt.tags.map(t => (
            <Chip key={t} label={t} size="sm" />
          ))}
        </div>
      )}

      {/* Amount callout for purchases in compact mode */}
      {receipt.type === 'purchase' && receipt.amount && !isFull && (
        <div className="mt-2 text-right">
          <span className="font-mono text-xs font-bold text-stamp-red bg-paper px-1.5 py-0.5 rounded-xs border border-rule">
            {formatINR(receipt.amount)}
          </span>
        </div>
      )}

      {/* Footer / Barcode */}
      <div className="mt-3 pt-2 border-t border-dashed border-rule flex items-center justify-between">
        <Barcode receiptId={receipt.receipt_id} height={14} />

        {onPullThread && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPullThread(receipt.receipt_id);
            }}
            data-testid={`receipt-pull-thread-${receipt.receipt_id}`}
            className="cursor-pointer inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-stamp-red hover:underline ml-2"
            title="Trace related receipts in Threads"
          >
            <span>Pull Thread</span>
            <ArrowRight size={12} aria-hidden="true" />
          </button>
        )}

        {onClick && !onPullThread && !isFull && (
          <span className="text-ink-soft group-hover:text-ink">
            <ExternalLink size={14} aria-hidden="true" />
          </span>
        )}
      </div>
    </article>
  );
};
