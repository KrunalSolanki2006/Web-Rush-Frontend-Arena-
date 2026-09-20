import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReceipt } from '../../hooks/useReceipt';
import { getDataset } from '../../lib/dataset';
import { Sheet } from '../../components/ui/Sheet';
import { ReceiptSlip } from '../../components/ui/ReceiptSlip';
import { ConnectionRow } from '../../components/ui/ConnectionRow';
import { ArrowLeft, ArrowRight, GitFork } from 'lucide-react';

export const ReceiptDrawer: React.FC = () => {
  const { activeReceiptId, isOpen, closeReceipt, openReceipt } = useReceipt();
  const navigate = useNavigate();
  const dataset = useMemo(() => getDataset(), []);

  const currentReceipt = useMemo(() => {
    if (!activeReceiptId) return null;
    return dataset.receiptsMap.get(activeReceiptId) || null;
  }, [activeReceiptId, dataset]);

  // Find chronological index
  const currentIndex = useMemo(() => {
    if (!activeReceiptId) return -1;
    return dataset.receipts.findIndex(r => r.receipt_id === activeReceiptId);
  }, [activeReceiptId, dataset]);

  const prevReceipt = currentIndex > 0 ? dataset.receipts[currentIndex - 1] : null;
  const nextReceipt = currentIndex >= 0 && currentIndex < dataset.receipts.length - 1 ? dataset.receipts[currentIndex + 1] : null;

  // Find connections (incoming and outgoing)
  const connections = useMemo(() => {
    if (!activeReceiptId) return [];
    const outgoing = dataset.graph.outgoing.get(activeReceiptId) || [];
    const incoming = dataset.graph.incoming.get(activeReceiptId) || [];

    const list: { edge: typeof outgoing[0]; targetReceiptId: string }[] = [];

    for (const edge of outgoing) {
      list.push({ edge, targetReceiptId: edge.toReceiptId });
    }
    for (const edge of incoming) {
      list.push({ edge, targetReceiptId: edge.fromReceiptId });
    }

    // Sort confirmed first, then by strength descending
    return list.sort((a, b) => {
      if (a.edge.origin !== b.edge.origin) {
        return a.edge.origin === 'confirmed' ? -1 : 1;
      }
      return b.edge.strength - a.edge.strength;
    });
  }, [activeReceiptId, dataset]);

  const handlePullThread = (receiptId: string) => {
    closeReceipt();
    navigate(`/threads?focus=${receiptId}`);
  };

  if (!isOpen || !currentReceipt) {
    return null;
  }

  return (
    <Sheet
      isOpen={isOpen}
      onClose={closeReceipt}
      title={`Receipt #${currentReceipt.receipt_id}`}
    >
      <div className="space-y-6">
        {/* Navigation bar between receipts */}
        <div className="flex items-center justify-between font-mono text-xs text-ink-soft pb-2 border-b border-dashed border-rule">
          <button
            onClick={() => prevReceipt && openReceipt(prevReceipt.receipt_id)}
            disabled={!prevReceipt}
            className={`cursor-pointer inline-flex items-center gap-1.5 p-1 rounded-xs transition-colors ${
              prevReceipt ? 'hover:text-ink font-semibold' : 'opacity-30 cursor-not-allowed'
            }`}
            title={prevReceipt ? `Previous: #${prevReceipt.receipt_id} ${prevReceipt.title}` : undefined}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Prev ({prevReceipt?.receipt_id || '—'})</span>
          </button>

          <span className="text-[11px]">
            {currentIndex + 1} of {dataset.receipts.length}
          </span>

          <button
            onClick={() => nextReceipt && openReceipt(nextReceipt.receipt_id)}
            disabled={!nextReceipt}
            className={`cursor-pointer inline-flex items-center gap-1.5 p-1 rounded-xs transition-colors ${
              nextReceipt ? 'hover:text-ink font-semibold' : 'opacity-30 cursor-not-allowed'
            }`}
            title={nextReceipt ? `Next: #${nextReceipt.receipt_id} ${nextReceipt.title}` : undefined}
          >
            <span>Next ({nextReceipt?.receipt_id || '—'})</span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => handlePullThread(currentReceipt.receipt_id)}
          className="cursor-pointer w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stamp-red text-paper font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-stamp-red/90 transition-all shadow-xs"
        >
          <GitFork size={16} aria-hidden="true" />
          <span>Pull the Thread for this Receipt</span>
        </button>

        {/* Full Receipt Slip */}
        <ReceiptSlip
          receipt={currentReceipt}
          variant="full"
        />

        {/* Connected Receipts Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-lg text-ink">
              Connected Moments ({connections.length})
            </h3>
            <span className="font-mono text-[11px] text-ink-soft">
              {connections.filter(c => c.edge.origin === 'confirmed').length} confirmed ·{' '}
              {connections.filter(c => c.edge.origin === 'inferred').length} inferred
            </span>
          </div>

          {connections.length === 0 ? (
            <p className="font-sans text-xs text-ink-soft italic">
              No direct connections recorded.
            </p>
          ) : (
            <div className="space-y-2.5">
              {connections.map(({ edge, targetReceiptId }) => {
                const target = dataset.receiptsMap.get(targetReceiptId);
                if (!target) return null;

                return (
                  <ConnectionRow
                    key={`${edge.id}_${targetReceiptId}`}
                    edge={edge}
                    targetReceipt={target}
                    onSelectReceipt={openReceipt}
                    onPullThread={handlePullThread}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
};
