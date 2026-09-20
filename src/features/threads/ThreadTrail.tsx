import React from 'react';
import type { Edge, Moment, Receipt } from '../../types';
import { ReceiptSlip } from '../../components/ui/ReceiptSlip';
import { RECEIPT_TYPE_META } from '../receipts/receiptTypeMeta';
import { Clock, ArrowDown, X, Sparkles } from 'lucide-react';
import { humanizeDuration } from '../../lib/time';
import { relationshipResolver } from '../../services';

interface ThreadTrailProps {
  moment: Moment | null;
  receipts: Receipt[];
  edges: Edge[];
  onSelectReceipt: (receiptId: string) => void;
  onClear: () => void;
}

export const ThreadTrail: React.FC<ThreadTrailProps> = ({
  moment,
  receipts,
  edges,
  onSelectReceipt,
  onClear,
}) => {
  if (receipts.length === 0) {
    return (
      <div className="bg-slip border border-dashed border-rule p-8 rounded-sm text-center text-ink-soft">
        <p className="font-display text-base font-bold text-ink mb-1">
          No Thread Selected
        </p>
        <p className="font-sans text-xs">
          Click any receipt node on the board or choose from the focus picker above to pull a thread.
        </p>
      </div>
    );
  }

  // Map edges between consecutive or connected receipts
  const getEdgeBetween = (fromId: string, toId: string): Edge | undefined => {
    return edges.find(
      e =>
        (e.fromReceiptId === fromId && e.toReceiptId === toId) ||
        (e.fromReceiptId === toId && e.toReceiptId === fromId)
    );
  };

  return (
    <div className="bg-slip border border-rule rounded-sm p-4 md:p-6 shadow-sm space-y-6" data-testid="active-thread-trail">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-dashed border-rule">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-stamp-red text-paper font-bold rounded-xs flex items-center gap-1">
              <Sparkles size={11} aria-hidden="true" />
              <span>Active Thread</span>
            </span>
            <span className="font-mono text-xs text-ink-soft">
              {receipts.length} moments · {humanizeDuration(moment?.spanMs || 0)} span
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink">
            {moment?.title || 'Connected Thread'}
          </h2>

          {/* Recipe of Types Icons */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="font-mono text-[11px] text-ink-soft mr-1">Recipe:</span>
            {receipts.map((r, i) => {
              const meta = RECEIPT_TYPE_META[r.type];
              const Icon = meta.icon;
              return (
                <React.Fragment key={r.receipt_id}>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-mono text-[10px] font-semibold"
                    style={{ backgroundColor: meta.bgTint, color: meta.colorHex }}
                    title={`${meta.label}: ${r.title}`}
                  >
                    <Icon size={12} aria-hidden="true" />
                    <span>{meta.label}</span>
                  </span>
                  {i < receipts.length - 1 && (
                    <span className="text-ink-soft text-xs">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClear}
          data-testid="clear-trail-btn"
          className="cursor-pointer p-1.5 rounded-xs hover:bg-paper-deep text-ink-soft hover:text-ink transition-colors"
          title="Clear thread selection (Esc)"
          aria-label="Clear thread selection"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Chronological Vertical Trail */}
      <div className="space-y-4">
        {receipts.map((receipt, index) => {
          const nextReceipt = receipts[index + 1];
          const edge = nextReceipt ? getEdgeBetween(receipt.receipt_id, nextReceipt.receipt_id) : undefined;
          const causal = relationshipResolver.getCausalInsight(receipt.receipt_id);

          return (
            <div key={receipt.receipt_id} className="space-y-4" data-testid={`thread-step-${receipt.receipt_id}`}>
              <div className="space-y-1">
                {causal.role !== 'Independent' && (
                  <div className="flex items-center justify-between px-1 text-[10px] font-mono">
                    <span className="uppercase font-bold text-stamp-red flex items-center gap-1">
                      <Sparkles size={10} aria-hidden="true" />
                      <span>{causal.role}</span>
                    </span>
                    <span className="text-ink-soft/70">Step {index + 1} of {receipts.length}</span>
                  </div>
                )}
                <ReceiptSlip
                  receipt={receipt}
                  variant="compact"
                  onClick={() => onSelectReceipt(receipt.receipt_id)}
                  className="hover:scale-[1.005]"
                />
              </div>

              {/* Connective Link Between Slips */}
              {nextReceipt && (
                <div className="py-1 px-4 my-1 flex items-center justify-center" data-testid={`thread-link-${receipt.receipt_id}-${nextReceipt.receipt_id}`}>
                  <div className="flex flex-col items-center text-center max-w-md w-full">
                    <div className="w-0.5 h-3 bg-rule" />
                    <div
                      className={`w-full py-1.5 px-3 rounded-xs border text-xs font-sans transition-all flex items-center justify-between gap-2 ${
                        edge?.origin === 'confirmed'
                          ? 'bg-paper border-rule text-ink shadow-xs'
                          : 'bg-paper/70 border-dashed border-rule text-ink-soft'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-soft">
                        <Clock size={11} aria-hidden="true" />
                        <span>
                          {edge ? edge.timeGapFormatted : humanizeDuration(nextReceipt.date.getTime() - receipt.date.getTime())} later
                        </span>
                      </div>

                      <div className="text-center font-medium line-clamp-1 flex-1 mx-2">
                        {edge?.reason || 'Sequential moment in this chapter'}
                      </div>

                      <span
                        className={`font-mono text-[9px] uppercase px-1 py-0.5 rounded-xs font-bold ${
                          edge?.origin === 'confirmed'
                            ? 'bg-ink text-paper'
                            : 'bg-paper-deep text-ink-soft border border-rule'
                        }`}
                      >
                        {edge?.origin || 'sequence'}
                      </span>
                    </div>
                    <div className="w-0.5 h-3 bg-rule" />
                    <ArrowDown size={14} className="text-rule -mt-1" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
