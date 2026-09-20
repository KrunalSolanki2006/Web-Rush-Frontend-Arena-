import React, { useState } from 'react';
import type { Receipt } from '../../types';
import { ReceiptSlip } from '../ui/ReceiptSlip';
import { Layers } from 'lucide-react';

interface StackProps {
  receipts: Receipt[];
  onSelectReceipt: (receiptId: string) => void;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  receipts,
  onSelectReceipt,
  className = '',
}) => {
  const [order, setOrder] = useState<number[]>(
    receipts.slice(0, 5).map((_, i) => i)
  );

  const handleShuffle = () => {
    setOrder(prev => {
      const next = [...prev];
      const first = next.shift()!;
      next.push(first);
      return next;
    });
  };

  const stackReceipts = receipts.slice(0, 5);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <div className="relative w-full max-w-sm h-96 flex items-center justify-center">
        {order.map((receiptIndex, stackPosition) => {
          const receipt = stackReceipts[receiptIndex];
          if (!receipt) return null;

          // Compute offset and rotation for physical paper stack feel
          const offset = stackPosition * 6;
          const rotation = (stackPosition % 2 === 0 ? 1 : -1) * (stackPosition * 2.5);
          const isTop = stackPosition === 0;

          return (
            <div
              key={receipt.receipt_id}
              data-testid={isTop ? 'stack-top-receipt' : `stack-receipt-${receipt.receipt_id}`}
              onClick={() => {
                if (isTop) {
                  onSelectReceipt(receipt.receipt_id);
                } else {
                  handleShuffle();
                }
              }}
              className="absolute w-full cursor-pointer transition-all duration-300 ease-out"
              style={{
                top: `${offset}px`,
                transform: `rotate(${rotation}deg) scale(${1 - stackPosition * 0.03})`,
                zIndex: 10 - stackPosition,
                opacity: 1 - stackPosition * 0.15,
              }}
            >
              <ReceiptSlip
                receipt={receipt}
                variant="compact"
                className="shadow-lg hover:border-ink hover:scale-[1.01]"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={handleShuffle}
          data-testid="stack-shuffle-btn"
          className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs uppercase font-bold tracking-wider bg-paper border border-ink text-ink rounded-xs hover:bg-paper-deep transition-all shadow-xs"
          title="Cycle through receipts pile"
        >
          <Layers size={14} aria-hidden="true" />
          <span>Shuffle Receipts</span>
        </button>

        <span className="font-mono text-xs text-ink-soft">
          Click top receipt to inspect
        </span>
      </div>
    </div>
  );
};
