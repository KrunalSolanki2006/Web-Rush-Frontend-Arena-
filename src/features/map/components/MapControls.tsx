import React from 'react';
import type { Chapter } from '../../../types';

interface MapControlsProps {
  view: 'india' | 'mumbai';
  onViewChange: (view: 'india' | 'mumbai') => void;
  selectedMonth: number | null;
  onMonthChange: (month: number | null) => void;
  chapters: Chapter[];
}

export const MapControls: React.FC<MapControlsProps> = ({
  view,
  onViewChange,
  selectedMonth,
  onMonthChange,
  chapters,
}) => {
  return (
    <div className="bg-slip border border-rule p-4 rounded-sm shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* View Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewChange('india')}
          data-testid="map-view-india"
          className={`cursor-pointer px-3 py-1.5 font-mono text-xs uppercase font-bold rounded-xs border transition-colors ${
            view === 'india'
              ? 'bg-ink text-paper border-ink'
              : 'bg-paper text-ink-soft border-rule hover:border-ink hover:text-ink'
          }`}
        >
          India Route (Mumbai · Lonavala · Udaipur)
        </button>
        <button
          onClick={() => onViewChange('mumbai')}
          data-testid="map-view-mumbai"
          className={`cursor-pointer px-3 py-1.5 font-mono text-xs uppercase font-bold rounded-xs border transition-colors ${
            view === 'mumbai'
              ? 'bg-ink text-paper border-ink'
              : 'bg-paper text-ink-soft border-rule hover:border-ink hover:text-ink'
          }`}
        >
          Mumbai Close-up
        </button>
      </div>

      {/* Month Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto font-mono text-xs">
        <span className="text-ink-soft mr-1">Filter Month:</span>
        <button
          onClick={() => onMonthChange(null)}
          data-testid="map-filter-all"
          className={`cursor-pointer px-2 py-0.5 rounded-xs border ${
            selectedMonth === null
              ? 'bg-ink text-paper border-ink font-bold'
              : 'bg-paper text-ink-soft border-rule hover:border-ink'
          }`}
        >
          All
        </button>
        {chapters.map(ch => (
          <button
            key={ch.month}
            data-testid={`map-filter-month-${ch.month}`}
            onClick={() => onMonthChange(selectedMonth === ch.month ? null : ch.month)}
            className={`cursor-pointer px-2 py-0.5 rounded-xs border ${
              selectedMonth === ch.month
                ? 'bg-ink text-paper border-ink font-bold'
                : 'bg-paper text-ink-soft border-rule hover:border-ink'
            }`}
          >
            {ch.monthName}
          </button>
        ))}
      </div>
    </div>
  );
};
