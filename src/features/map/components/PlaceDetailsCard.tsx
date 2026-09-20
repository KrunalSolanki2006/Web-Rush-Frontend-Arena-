import React from 'react';
import { MapPin } from 'lucide-react';
import type { PlaceReceipt, Receipt } from '../../../types';

interface PlaceDetailsCardProps {
  selectedPlace: PlaceReceipt | null;
  placeReceipts: Receipt[];
  onOpenReceipt: (receiptId: string) => void;
  onPullThread: (receiptId: string) => void;
}

export const PlaceDetailsCard: React.FC<PlaceDetailsCardProps> = ({
  selectedPlace,
  placeReceipts,
  onOpenReceipt,
  onPullThread,
}) => {
  return (
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
              onClick={() => onOpenReceipt(selectedPlace.receipt_id)}
              data-testid="map-view-receipt-btn"
              className="cursor-pointer flex-1 py-2 px-3 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-ink-soft transition-colors text-center"
            >
              View Receipt
            </button>
            <button
              onClick={() => onPullThread(selectedPlace.receipt_id)}
              data-testid="map-pull-thread-btn"
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
                <button
                  key={r.receipt_id}
                  type="button"
                  onClick={() => onOpenReceipt(r.receipt_id)}
                  data-testid={`map-moment-${r.receipt_id}`}
                  className="w-full text-left p-2.5 bg-paper rounded-xs border border-rule/70 hover:border-ink cursor-pointer transition-colors"
                  aria-label={`View receipt #${r.receipt_id}: ${r.title}`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-soft">
                    <span className="font-bold text-ink">#{r.receipt_id}</span>
                    <span>{r.timeLabel}</span>
                  </div>
                  <div className="font-sans text-xs font-semibold text-ink line-clamp-1 mt-0.5">
                    {r.title}
                  </div>
                </button>
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
  );
};
