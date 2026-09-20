import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReceipt } from '../../hooks/useReceipt';
import { useDataset } from '../../hooks/useDataset';
import { Sheet } from '../../components/ui/Sheet';
import { ReceiptSlip } from '../../components/ui/ReceiptSlip';
import { ConnectionRow } from '../../components/ui/ConnectionRow';
import { ArrowLeft, ArrowRight, GitFork, Sparkles } from 'lucide-react';

export const ReceiptDrawer: React.FC = () => {
  const { activeReceiptId, isOpen, closeReceipt, openReceipt } = useReceipt();
  const navigate = useNavigate();
  const { receipts, getReceipt, getConnections, getCausalInsight } = useDataset();

  const currentReceipt = useMemo(() => {
    if (!activeReceiptId) return null;
    return getReceipt(activeReceiptId) || null;
  }, [activeReceiptId, getReceipt]);

  // Find chronological index
  const currentIndex = useMemo(() => {
    if (!activeReceiptId) return -1;
    return receipts.findIndex(r => r.receipt_id === activeReceiptId);
  }, [activeReceiptId, receipts]);

  const prevReceipt = currentIndex > 0 ? receipts[currentIndex - 1] : null;
  const nextReceipt = currentIndex >= 0 && currentIndex < receipts.length - 1 ? receipts[currentIndex + 1] : null;

  // Causal Intelligence: "Why This Moment Matters"
  const causalInsight = useMemo(() => {
    if (!activeReceiptId) return null;
    return getCausalInsight(activeReceiptId);
  }, [activeReceiptId, getCausalInsight]);

  // Find connections (incoming and outgoing)
  const connections = useMemo(() => {
    if (!activeReceiptId) return [];
    return getConnections(activeReceiptId);
  }, [activeReceiptId, getConnections]);

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
            data-testid="drawer-prev-btn"
            className={`cursor-pointer inline-flex items-center gap-1.5 p-1 rounded-xs transition-colors ${
              prevReceipt ? 'hover:text-ink font-semibold' : 'opacity-30 cursor-not-allowed'
            }`}
            title={prevReceipt ? `Previous: #${prevReceipt.receipt_id} ${prevReceipt.title}` : undefined}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Prev ({prevReceipt?.receipt_id || '—'})</span>
          </button>

          <span className="text-[11px]">
            {currentIndex + 1} of {receipts.length}
          </span>

          <button
            onClick={() => nextReceipt && openReceipt(nextReceipt.receipt_id)}
            disabled={!nextReceipt}
            data-testid="drawer-next-btn"
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
          data-testid="drawer-pull-thread-btn"
          className="cursor-pointer w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stamp-red text-paper font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-stamp-red/90 transition-all shadow-xs"
        >
          <GitFork size={16} aria-hidden="true" />
          <span>Pull the Thread for this Receipt</span>
        </button>

        {/* Why This Moment Matters — Causal Intelligence Banner */}
        {causalInsight && causalInsight.role !== 'Independent' && (
          <div className="bg-paper p-3.5 rounded-xs border-l-4 border-stamp-red border-t border-r border-b border-rule space-y-1 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-stamp-red flex items-center gap-1">
                <Sparkles size={12} aria-hidden="true" />
                <span>Causal Role: {causalInsight.role}</span>
              </span>
              <span className="font-mono text-[10px] text-ink-soft">
                {causalInsight.connectionCount} relationship{causalInsight.connectionCount === 1 ? '' : 's'}
              </span>
            </div>
            <p className="font-sans text-xs text-ink leading-relaxed">
              {causalInsight.description}
            </p>
          </div>
        )}

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
              {connections.map(({ edge, targetReceipt }) => (
                <ConnectionRow
                  key={`${edge.id}_${targetReceipt.receipt_id}`}
                  edge={edge}
                  targetReceipt={targetReceipt}
                  onSelectReceipt={openReceipt}
                  onPullThread={handlePullThread}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
};
