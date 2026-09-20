import React from 'react';
import type { Edge, Receipt } from '../../types';
import { TypeBadge } from './TypeBadge';
import { ArrowRight, Clock } from 'lucide-react';

interface ConnectionRowProps {
  edge: Edge;
  targetReceipt: Receipt;
  onSelectReceipt: (receiptId: string) => void;
  onPullThread?: (receiptId: string) => void;
}

export const ConnectionRow: React.FC<ConnectionRowProps> = ({
  edge,
  targetReceipt,
  onSelectReceipt,
  onPullThread,
}) => {
  const isConfirmed = edge.origin === 'confirmed';

  return (
    <div
      className={`p-3 rounded-sm border transition-all ${
        isConfirmed
          ? 'bg-slip border-rule hover:border-ink'
          : 'bg-paper border-dashed border-rule hover:border-ink'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-xs font-bold ${
              isConfirmed
                ? 'bg-ink text-paper'
                : 'bg-paper-deep text-ink-soft border border-rule'
            }`}
          >
            {edge.origin}
          </span>
          <span className="font-mono text-xs text-ink-soft flex items-center gap-1">
            <Clock size={11} aria-hidden="true" />
            {edge.timeGapFormatted}
          </span>
        </div>

        <span className="font-mono text-[10px] text-ink-soft" title="Strength">
          {(edge.strength * 100).toFixed(0)}% match
        </span>
      </div>

      <p className="font-sans text-xs text-ink mb-2 leading-relaxed">
        {edge.reason}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-dashed border-rule">
        <button
          onClick={() => onSelectReceipt(targetReceipt.receipt_id)}
          className="cursor-pointer group flex items-center gap-2 text-left"
          title={`View ${targetReceipt.title}`}
        >
          <TypeBadge type={targetReceipt.type} size="sm" showLabel={false} />
          <div>
            <div className="font-sans text-xs font-semibold text-ink group-hover:underline line-clamp-1">
              {targetReceipt.title}
            </div>
            <div className="font-mono text-[10px] text-ink-soft">
              {targetReceipt.dateLabel} · {targetReceipt.timeLabel}
            </div>
          </div>
          <ArrowRight size={12} className="text-ink-soft group-hover:translate-x-0.5 transition-transform" />
        </button>

        {onPullThread && (
          <button
            onClick={() => onPullThread(targetReceipt.receipt_id)}
            className="cursor-pointer font-mono text-[10px] uppercase font-bold text-stamp-red hover:underline ml-2 whitespace-nowrap"
          >
            Pull Thread
          </button>
        )}
      </div>
    </div>
  );
};
