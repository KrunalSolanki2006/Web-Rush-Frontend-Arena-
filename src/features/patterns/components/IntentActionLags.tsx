import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import type { IntentActionLag } from '../../../types';

interface IntentActionLagsProps {
  lags: IntentActionLag[];
  onOpenReceipt: (receiptId: string) => void;
}

export const IntentActionLags: React.FC<IntentActionLagsProps> = ({ lags, onOpenReceipt }) => {
  return (
    <section className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-ink-soft mb-1">
          <Clock size={14} aria-hidden="true" />
          <span>Pattern 03 · Causal Lag</span>
        </div>
        <h2 className="font-display text-xl font-bold text-ink">
          Intent to Action: Tools vs. Trips
        </h2>
        <p className="font-sans text-xs text-ink-soft mt-1">
          <strong>Hypothesis:</strong> You plan journeys for days, but commit to creative tools and rituals within hours.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {lags.map(item => (
          <div
            key={item.searchReceipt.receipt_id}
            className="bg-paper p-3 rounded-xs border border-rule space-y-1.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-ink">
                "{item.searchReceipt.query}" → {item.outcomeReceipt.title}
              </span>
              <span className="font-mono text-xs font-bold text-stamp-red bg-slip px-2 py-0.5 rounded-xs border border-rule">
                Lag: {item.lagFormatted}
              </span>
            </div>

            <p className="font-sans text-xs text-ink-soft">
              {item.hypothesis}
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
              <button
                onClick={() => onOpenReceipt(item.searchReceipt.receipt_id)}
                className="cursor-pointer text-ink hover:underline flex items-center gap-1"
              >
                <span>Search #{item.searchReceipt.receipt_id}</span>
                <ExternalLink size={10} aria-hidden="true" />
              </button>
              <span className="text-ink-soft">→</span>
              <button
                onClick={() => onOpenReceipt(item.outcomeReceipt.receipt_id)}
                className="cursor-pointer text-ink hover:underline flex items-center gap-1"
              >
                <span>Outcome #{item.outcomeReceipt.receipt_id}</span>
                <ExternalLink size={10} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
