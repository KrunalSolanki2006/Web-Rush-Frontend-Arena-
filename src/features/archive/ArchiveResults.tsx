import React, { useState } from 'react';
import type { Receipt } from '../../types';
import { ReceiptSlip } from '../../components/ui/ReceiptSlip';
import { TypeBadge } from '../../components/ui/TypeBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { CountUp } from '../../components/reactbits/CountUp';
import { relationshipResolver } from '../../services';
import { LayoutGrid, Table, ArrowRight, GitFork } from 'lucide-react';

interface ArchiveResultsProps {
  receipts: Receipt[];
  onSelectReceipt: (receiptId: string) => void;
  onPullThread: (receiptId: string) => void;
  onClearFilters: () => void;
}

export const ArchiveResults: React.FC<ArchiveResultsProps> = ({
  receipts,
  onSelectReceipt,
  onPullThread,
  onClearFilters,
}) => {
  const [viewMode, setViewMode] = useState<'slips' | 'table'>('slips');

  if (receipts.length === 0) {
    return <EmptyState onAction={onClearFilters} />;
  }

  return (
    <div className="space-y-4" data-testid="archive-results">
      {/* Result Count & View Toggle */}
      <div className="flex items-center justify-between">
        <div
          className="font-mono text-xs text-ink-soft flex items-center gap-1.5"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>Showing</span>
          <span className="font-bold text-ink px-1.5 py-0.5 bg-paper rounded-xs border border-rule">
            <CountUp to={receipts.length} />
          </span>
          <span>receipt{receipts.length === 1 ? '' : 's'}</span>
        </div>

        <div className="flex items-center gap-1 bg-paper border border-rule p-0.5 rounded-xs">
          <button
            onClick={() => setViewMode('slips')}
            data-testid="view-mode-slips"
            className={`cursor-pointer p-1.5 rounded-xs transition-colors ${
              viewMode === 'slips'
                ? 'bg-ink text-paper'
                : 'text-ink-soft hover:text-ink'
            }`}
            aria-label="Slips grid view"
            title="Slips view"
          >
            <LayoutGrid size={15} aria-hidden="true" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            data-testid="view-mode-table"
            className={`cursor-pointer p-1.5 rounded-xs transition-colors ${
              viewMode === 'table'
                ? 'bg-ink text-paper'
                : 'text-ink-soft hover:text-ink'
            }`}
            aria-label="Table view"
            title="Table view"
          >
            <Table size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Slips Grid View */}
      {viewMode === 'slips' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="slips-grid">
          {receipts.map(r => (
            <ReceiptSlip
              key={r.receipt_id}
              receipt={r}
              variant="compact"
              onClick={() => onSelectReceipt(r.receipt_id)}
              onPullThread={onPullThread}
            />
          ))}
        </div>
      ) : (
        /* Table View (stacked on mobile) */
        <div className="bg-slip border border-rule rounded-sm overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse font-sans text-xs" data-testid="receipts-table">
            <thead>
              <tr className="bg-paper-deep border-b border-rule font-mono text-[11px] text-ink-soft uppercase tracking-wider">
                <th className="p-3">ID</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Type</th>
                <th className="p-3">Title & Context</th>
                <th className="p-3">Location</th>
                <th className="p-3">Connections</th>
                <th className="p-3">Amount</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/60">
              {receipts.map(r => {
                const connCount = relationshipResolver.getConnections(r.receipt_id).length;

                return (
                  <tr
                    key={r.receipt_id}
                    data-testid={`table-receipt-row-${r.receipt_id}`}
                    onClick={() => onSelectReceipt(r.receipt_id)}
                    className="hover:bg-paper cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-ink-soft">
                      #{r.receipt_id}
                    </td>
                    <td className="p-3 font-mono text-ink-soft whitespace-nowrap">
                      {r.dateLabel} · {r.timeLabel}
                    </td>
                    <td className="p-3">
                      <TypeBadge type={r.type} size="sm" />
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReceipt(r.receipt_id);
                        }}
                        className="text-left font-semibold text-ink line-clamp-1 hover:underline cursor-pointer"
                        aria-label={`View receipt #${r.receipt_id}: ${r.title}`}
                        data-testid={`table-receipt-title-${r.receipt_id}`}
                      >
                        {r.title}
                      </button>
                      {r.context && r.context !== r.title && (
                        <div className="text-[11px] text-ink-soft line-clamp-1">
                          {r.context}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-ink-soft truncate max-w-[140px]">
                      {r.location || '—'}
                    </td>
                    <td className="p-3">
                      {connCount > 0 ? (
                        <span className="font-mono text-[10px] text-ink-soft bg-paper px-1.5 py-0.5 rounded-xs border border-rule inline-flex items-center gap-1">
                          <GitFork size={10} aria-hidden="true" className="text-stamp-red" />
                          <span>{connCount}</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-ink-soft/40">—</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-xs font-bold text-stamp-red whitespace-nowrap">
                      {r.amount ? `₹${r.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPullThread(r.receipt_id);
                        }}
                        data-testid={`table-pull-thread-${r.receipt_id}`}
                        className="cursor-pointer inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-stamp-red hover:underline"
                      >
                        <span>Pull</span>
                        <ArrowRight size={11} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
