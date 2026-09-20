import React from 'react';
import { DollarSign } from 'lucide-react';
import type { SpendingBreakdown } from '../../../types';

interface SpendingLedgerProps {
  spending: SpendingBreakdown;
  onOpenReceipt: (receiptId: string) => void;
}

export const SpendingLedger: React.FC<SpendingLedgerProps> = ({ spending, onOpenReceipt }) => {
  return (
    <section className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-ink-soft mb-1">
          <DollarSign size={14} aria-hidden="true" />
          <span>Pattern 04 · Spending Concentration</span>
        </div>
        <h2 className="font-display text-xl font-bold text-ink">
          Where the Money Went
        </h2>
        <p className="font-sans text-xs text-ink-soft mt-1">
          <strong>Finding:</strong> Out of <strong>₹{spending.total.toLocaleString('en-IN')}</strong> total spend, two camera bodies accounted for <strong>₹{spending.cameraTotal.toLocaleString('en-IN')} (~{Math.round(spending.cameraPercentage)}%)</strong>.
        </p>
      </div>

      <div className="bg-paper p-4 rounded-xs border border-rule font-mono text-xs space-y-2 max-w-lg">
        <div className="border-b border-dashed border-rule pb-2 text-[11px] uppercase tracking-wider text-ink-soft flex justify-between">
          <span>Item & Merchant</span>
          <span>Amount (INR)</span>
        </div>

        {spending.purchases.map(p => (
          <button
            key={p.receipt_id}
            type="button"
            onClick={() => onOpenReceipt(p.receipt_id)}
            data-testid={`spending-row-${p.receipt_id}`}
            aria-label={`View purchase receipt #${p.receipt_id}: ${p.item}, ₹${p.amount.toLocaleString('en-IN')}`}
            className="w-full text-left flex justify-between items-center py-1 hover:bg-slip px-1 rounded-xs cursor-pointer transition-colors"
          >
            <div>
              <span className="font-bold text-ink">{p.item}</span>
              <span className="text-ink-soft block text-[11px]">{p.merchant} ({p.city})</span>
            </div>
            <span className="font-bold text-stamp-red">
              ₹{p.amount.toLocaleString('en-IN')}
            </span>
          </button>
        ))}

        <div className="pt-2 border-t-2 border-ink flex justify-between font-bold text-sm text-ink">
          <span>TOTAL INVESTED</span>
          <span>₹{spending.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </section>
  );
};
