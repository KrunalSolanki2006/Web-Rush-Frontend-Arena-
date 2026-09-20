import React from 'react';
import type { Moment } from '../../types';
import { ReceiptSlip } from '../../components/ui/ReceiptSlip';
import { ArrowRight, GitFork } from 'lucide-react';

interface MomentChainProps {
  moment: Moment;
  onSelectReceipt: (receiptId: string) => void;
  onPullThread: (receiptId: string) => void;
}

export const MomentChain: React.FC<MomentChainProps> = ({
  moment,
  onSelectReceipt,
  onPullThread,
}) => {
  return (
    <div className="bg-slip/70 border border-rule/70 rounded-sm p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-display font-bold text-sm text-ink flex items-center gap-2">
          <span>{moment.title}</span>
          <span className="font-mono text-[10px] text-ink-soft font-normal">
            ({moment.receipts.length} moments)
          </span>
        </h4>

        <button
          onClick={() => onPullThread(moment.receiptIds[0])}
          className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase font-bold text-stamp-red border border-stamp-red/30 rounded-xs hover:bg-stamp-red/10 transition-colors"
          title="Inspect full relationship thread in Threads view"
        >
          <GitFork size={12} aria-hidden="true" />
          <span>Pull this thread</span>
        </button>
      </div>

      {/* Horizontal Scrollable Chain of ReceiptSlips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
        {moment.receipts.map((receipt, index) => (
          <React.Fragment key={receipt.receipt_id}>
            <ReceiptSlip
              receipt={receipt}
              variant="inline"
              onClick={() => onSelectReceipt(receipt.receipt_id)}
            />
            {index < moment.receipts.length - 1 && (
              <div className="flex flex-col items-center px-1 text-ink-soft select-none shrink-0">
                <ArrowRight size={14} aria-hidden="true" />
                <span className="font-mono text-[9px] mt-0.5">then</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
