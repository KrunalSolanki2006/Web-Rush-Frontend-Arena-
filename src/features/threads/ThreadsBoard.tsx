import React, { useMemo } from 'react';
import type { Edge, Receipt, ReceiptType } from '../../types';
import { RECEIPT_TYPE_META } from '../receipts/receiptTypeMeta';

interface ThreadsBoardProps {
  receipts: Receipt[];
  edges: Edge[];
  selectedReceiptIds: Set<string>;
  onSelectReceipt: (receiptId: string) => void;
  className?: string;
}

const LANES: ReceiptType[] = [
  'movie',
  'search',
  'purchase',
  'place',
  'event',
  'photo',
  'music',
  'message',
  'note',
];

export const ThreadsBoard: React.FC<ThreadsBoardProps> = ({
  receipts,
  edges,
  selectedReceiptIds,
  onSelectReceipt,
  className = '',
}) => {
  // Board dimensions
  const laneHeight = 54;
  const boardHeight = LANES.length * laneHeight + 60; // 9 lanes + header
  const totalWidth = 1100;
  const laneHeaderWidth = 120;
  const plotWidth = totalWidth - laneHeaderWidth;

  // Compute x position for each month (weighted by receipt count)
  const monthWeights = useMemo(() => {
    const counts = Array(9).fill(0);
    for (const r of receipts) {
      counts[r.month - 1]++;
    }
    return counts;
  }, [receipts]);

  const monthXPositions = useMemo(() => {
    const totalReceipts = receipts.length;
    let currentX = laneHeaderWidth + 20;
    const positions: { month: number; startX: number; width: number }[] = [];

    for (let m = 1; m <= 9; m++) {
      const count = monthWeights[m - 1];
      // Allocate width proportional to receipt count with a minimum width
      const width = Math.max(60, (count / totalReceipts) * (plotWidth - 40));
      positions.push({ month: m, startX: currentX, width });
      currentX += width;
    }
    return positions;
  }, [receipts.length, monthWeights, plotWidth]);

  // Compute (x, y) coordinates for each receipt node
  const nodeCoords = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();

    for (const r of receipts) {
      const laneIndex = LANES.indexOf(r.type);
      const y = 50 + laneIndex * laneHeight + laneHeight / 2;

      // Find month column
      const monthPos = monthXPositions[r.month - 1];
      if (!monthPos) continue;

      // Position within month based on day of month (1 to 31)
      const dayFraction = (r.day - 1) / 30;
      const x = monthPos.startX + dayFraction * (monthPos.width - 24) + 12;

      map.set(r.receipt_id, { x, y });
    }

    return map;
  }, [receipts, monthXPositions]);

  const hasSelection = selectedReceiptIds.size > 0;

  return (
    <div
      role="region"
      aria-label="Threads and connections timeline"
      tabIndex={0}
      className={`relative overflow-x-auto bg-slip border border-rule rounded-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ink ${className}`}
    >
      <div
        className="relative select-none"
        style={{ width: `${totalWidth}px`, height: `${boardHeight}px` }}
      >
        {/* Month Header Grid */}
        <div className="absolute top-0 left-0 right-0 h-10 border-b border-rule flex items-center bg-paper-deep/60">
          <div
            className="h-full border-r border-rule flex items-center px-3 font-mono text-[11px] font-bold uppercase text-ink-soft"
            style={{ width: `${laneHeaderWidth}px` }}
          >
            Lanes
          </div>

          {monthXPositions.map(({ month, startX, width }) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
            return (
              <div
                key={month}
                className="absolute top-0 h-full border-r border-dashed border-rule/60 flex items-center justify-center font-mono text-xs font-bold text-ink-soft"
                style={{ left: `${startX}px`, width: `${width}px` }}
              >
                {months[month - 1]}
              </div>
            );
          })}
        </div>

        {/* Lane Background Bands & Sticky Labels */}
        {LANES.map((laneType, index) => {
          const meta = RECEIPT_TYPE_META[laneType];
          const Icon = meta.icon;
          const y = 40 + index * laneHeight;

          return (
            <div
              key={laneType}
              className="absolute left-0 right-0 border-b border-rule/40 flex items-center"
              style={{
                top: `${y}px`,
                height: `${laneHeight}px`,
                backgroundColor: index % 2 === 0 ? 'rgba(245, 239, 227, 0.4)' : 'transparent',
              }}
            >
              <div
                className="h-full border-r border-rule flex items-center gap-2 px-3 bg-slip font-mono text-xs font-semibold"
                style={{ width: `${laneHeaderWidth}px`, color: meta.colorHex }}
              >
                <Icon size={14} aria-hidden="true" />
                <span className="truncate">{meta.label}</span>
              </div>
            </div>
          );
        })}

        {/* SVG Edge Layer */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={totalWidth}
          height={boardHeight}
          aria-hidden="true"
        >
          {edges.map(edge => {
            const from = nodeCoords.get(edge.fromReceiptId);
            const to = nodeCoords.get(edge.toReceiptId);
            if (!from || !to) return null;

            const isSelectedEdge =
              selectedReceiptIds.has(edge.fromReceiptId) &&
              selectedReceiptIds.has(edge.toReceiptId);

            // Compute bezier curve control points
            const dx = to.x - from.x;
            const cx1 = from.x + dx * 0.4;
            const cy1 = from.y;
            const cx2 = from.x + dx * 0.6;
            const cy2 = to.y;

            const pathData = `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;

            const isConfirmed = edge.origin === 'confirmed';
            const strokeColor = isSelectedEdge
              ? '#B8321F' // Stamp red for selected thread
              : isConfirmed
              ? '#1C1B18'
              : '#55514A';

            const strokeWidth = isSelectedEdge ? 3 : Math.max(1.5, edge.strength * 2.5);
            const opacity = isSelectedEdge ? 1 : hasSelection ? 0.15 : isConfirmed ? 0.75 : 0.45;

            return (
              <g key={edge.id}>
                {/* Highlighter Underlay for selected edge */}
                {isSelectedEdge && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#F3D34A"
                    strokeWidth={strokeWidth + 5}
                    strokeOpacity={0.6}
                  />
                )}

                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isConfirmed ? undefined : '5,4'}
                  strokeOpacity={opacity}
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* HTML Interactive Nodes (in chronological DOM order) */}
        {receipts.map(receipt => {
          const coords = nodeCoords.get(receipt.receipt_id);
          if (!coords) return null;

          const meta = RECEIPT_TYPE_META[receipt.type];
          const Icon = meta.icon;
          const isSelected = selectedReceiptIds.has(receipt.receipt_id);
          const isDimmed = hasSelection && !isSelected;

          return (
            <button
              key={receipt.receipt_id}
              onClick={() => onSelectReceipt(receipt.receipt_id)}
              className={`cursor-pointer absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? 'ring-3 ring-stamp-red ring-offset-2 z-30 scale-125 bg-stamp-red text-paper shadow-md'
                  : isDimmed
                  ? 'opacity-25 z-10 hover:opacity-100 hover:scale-110'
                  : 'z-20 hover:scale-120 hover:ring-2 hover:ring-ink hover:z-30 shadow-xs'
              }`}
              style={{
                left: `${coords.x}px`,
                top: `${coords.y}px`,
                width: '26px',
                height: '26px',
                backgroundColor: isSelected ? '#B8321F' : meta.colorHex,
                color: '#FFFFFF',
              }}
              title={`${receipt.type.toUpperCase()}: ${receipt.title} (${receipt.dateLabel}) · Click to pull thread`}
              aria-label={`${meta.label}: ${receipt.title}, ${receipt.dateLabel}`}
            >
              <Icon size={13} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
