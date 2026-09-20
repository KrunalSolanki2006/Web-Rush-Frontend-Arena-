import React from 'react';
import { MessageSquareQuote } from 'lucide-react';
import type { InnerVoiceItem } from '../../../types';

interface InnerVoiceArcProps {
  innerVoice: InnerVoiceItem[];
  onOpenReceipt: (receiptId: string) => void;
}

export const InnerVoiceArc: React.FC<InnerVoiceArcProps> = ({ innerVoice, onOpenReceipt }) => {
  return (
    <section className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-ink-soft mb-1">
          <MessageSquareQuote size={14} aria-hidden="true" />
          <span>Pattern 05 · The Inner Voice</span>
        </div>
        <h2 className="font-display text-xl font-bold text-ink">
          Six Notes, One Arc
        </h2>
        <p className="font-sans text-xs text-ink-soft mt-1">
          <strong>Finding:</strong> The first five notes were written in solitude after 22:00. The sixth and final note broke the pattern—written at <strong>08:15</strong> as a morning promise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {innerVoice.map(item => (
          <button
            key={item.receipt.receipt_id}
            type="button"
            onClick={() => onOpenReceipt(item.receipt.receipt_id)}
            data-testid={`inner-voice-card-${item.receipt.receipt_id}`}
            aria-label={`View personal note #${item.receipt.receipt_id}: "${item.receipt.personal_note}"`}
            className="w-full text-left bg-paper p-4 rounded-xs border-l-4 border-stamp-red border-t border-r border-b border-rule cursor-pointer hover:shadow-xs transition-all space-y-2"
          >
            <div className="flex justify-between font-mono text-[11px] text-ink-soft">
              <span>Note 0{item.order}</span>
              <span>{item.dateLabel} · {item.timeLabel}</span>
            </div>
            <p className="font-display text-sm font-bold italic text-ink">
              "{item.receipt.personal_note}"
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};
