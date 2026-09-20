import React from 'react';
import { useThreadState } from './useThreadState';
import { ThreadsBoard } from './ThreadsBoard';
import { ThreadTrail } from './ThreadTrail';
import { useReceipt } from '../../hooks/useReceipt';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Sliders, Eye, EyeOff, X } from 'lucide-react';

export const ThreadsPage: React.FC = () => {
  const {
    dataset,
    focusReceiptId,
    setFocus,
    showInferred,
    setShowInferred,
    minStrength,
    setMinStrength,
    selectedReceiptIds,
    selectedMoment,
    selectedReceipts,
    activeEdges,
  } = useThreadState();

  const { openReceipt } = useReceipt();

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Threads & Connections"
        subtitle="Discover how moments connect across 9 types: searches lead to purchases, films inspire travel journals, and rainy nights ignite new habits."
        badge="SIGNATURE FEATURE"
      />

      {/* Screen Reader Live Announcement for thread selection */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedReceipts.length > 0
          ? `Thread selected with ${selectedReceipts.length} connected receipts${selectedMoment ? `: ${selectedMoment.title}` : ''}`
          : 'No thread selected'}
      </div>

      {/* Controls Bar */}
      <div className="bg-slip border border-rule p-4 rounded-sm shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Toggles and Sliders */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {/* Show Inferred Toggle */}
          <button
            onClick={() => setShowInferred(prev => !prev)}
            data-testid="toggle-inferred"
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border transition-colors ${
              showInferred
                ? 'bg-ink text-paper border-ink font-bold'
                : 'bg-paper text-ink-soft border-rule hover:border-ink'
            }`}
          >
            {showInferred ? <Eye size={14} aria-hidden="true" /> : <EyeOff size={14} aria-hidden="true" />}
            <span>Inferred Links {showInferred ? 'Visible' : 'Hidden'}</span>
          </button>

          {/* Strength Slider */}
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-ink-soft" aria-hidden="true" />
            <label htmlFor="strength-slider" className="text-ink-soft">
              Min Strength:
            </label>
            <input
              id="strength-slider"
              name="minStrength"
              data-testid="strength-slider"
              type="range"
              min="0.80"
              max="0.99"
              step="0.01"
              value={minStrength}
              onChange={e => setMinStrength(parseFloat(e.target.value))}
              className="cursor-pointer w-24 accent-ink"
            />
            <span className="font-bold text-ink">
              {(minStrength * 100).toFixed(0)}%
            </span>
          </div>

          {/* Quick Focus Picker */}
          <div className="flex items-center gap-2">
            <label htmlFor="focus-picker" className="text-ink-soft">
              Jump to Chain:
            </label>
            <select
              id="focus-picker"
              name="focusMoment"
              data-testid="focus-picker"
              value={focusReceiptId || ''}
              onChange={e => setFocus(e.target.value || null)}
              className="cursor-pointer bg-paper border border-rule rounded-xs py-1 px-2 text-xs font-mono text-ink"
            >
              <option value="">Select a moment...</option>
              {dataset.moments.map(m => (
                <option key={m.id} value={m.receiptIds[0]}>
                  {m.title} ({m.receipts.length} receipts)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Legend & Clear */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-ink-soft">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 bg-ink" />
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 border-b-2 border-dashed border-ink-soft" />
              <span>Inferred</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-1 bg-stamp-red rounded-xs" />
              <span className="text-stamp-red font-bold">Selected</span>
            </div>
          </div>

          {focusReceiptId && (
            <button
              onClick={() => setFocus(null)}
              data-testid="clear-focus-btn"
              className="cursor-pointer inline-flex items-center gap-1 text-stamp-red font-bold hover:underline"
              title="Clear selection (Esc)"
            >
              <X size={13} aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Board & Thread Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Threads Board */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-soft px-1">
            <span>Click any circular node to trace its connected thread across time.</span>
            <span className="hidden sm:inline">Scroll horizontally for all 9 months →</span>
          </div>

          <ThreadsBoard
            receipts={dataset.receipts}
            edges={dataset.graph.edges.filter(
              e => (showInferred || e.origin === 'confirmed') && e.strength >= minStrength
            )}
            selectedReceiptIds={selectedReceiptIds}
            onSelectReceipt={setFocus}
          />
        </div>

        {/* Right 1 Col: Thread Trail */}
        <div className="lg:col-span-1">
          <ThreadTrail
            moment={selectedMoment}
            receipts={selectedReceipts}
            edges={activeEdges}
            onSelectReceipt={openReceipt}
            onClear={() => setFocus(null)}
          />
        </div>
      </div>
    </div>
  );
};
