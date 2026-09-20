import React from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ReceiptType } from '../../types';
import { RECEIPT_TYPE_META } from '../receipts/receiptTypeMeta';
import { Search, X, SlidersHorizontal, ArrowUpDown, GitFork } from 'lucide-react';

const ALL_TYPES: ReceiptType[] = [
  'music',
  'movie',
  'place',
  'purchase',
  'photo',
  'message',
  'search',
  'event',
  'note',
];

const MONTHS = [
  { value: '1', label: 'Jan' },
  { value: '2', label: 'Feb' },
  { value: '3', label: 'Mar' },
  { value: '4', label: 'Apr' },
  { value: '5', label: 'May' },
  { value: '6', label: 'Jun' },
  { value: '7', label: 'Jul' },
  { value: '8', label: 'Aug' },
  { value: '9', label: 'Sep' },
];

const THEMES = [
  'water',
  'light',
  'movement',
  'stillness',
  'seeing',
  'writing',
  'company',
];

const CITIES = ['Mumbai', 'Udaipur', 'Lonavala'];

export const ArchiveFilters: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const selectedType = searchParams.get('type') as ReceiptType | null;
  const selectedMonth = searchParams.get('month') || '';
  const selectedTheme = searchParams.get('theme') || '';
  const selectedCity = searchParams.get('city') || '';
  const selectedSort = searchParams.get('sort') || 'oldest';
  const connectedOnly = searchParams.get('connected') === 'true';

  const updateParam = (key: string, value: string | null) => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true }
    );
  };

  const clearAllFilters = () => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams();
        const r = prev.get('r');
        if (r) next.set('r', r);
        return next;
      },
      { replace: true }
    );
  };

  const hasActiveFilters = Boolean(
    query || selectedType || selectedMonth || selectedTheme || selectedCity || connectedOnly || selectedSort !== 'oldest'
  );

  return (
    <div className="bg-slip border border-rule p-4 md:p-5 rounded-sm shadow-xs space-y-4">
      {/* Top row: Search input & sort dropdown & connected-only toggle */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input wrapped in semantic search form */}
        <form
          role="search"
          onSubmit={e => e.preventDefault()}
          className="relative flex-1 min-w-[260px]"
          data-testid="archive-search-form"
        >
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="archive-search-input"
            name="search"
            type="text"
            value={query}
            onChange={e => updateParam('q', e.target.value || null)}
            placeholder="Search receipts by title, text, location, or tags..."
            className="w-full pl-9 pr-8 py-2 bg-paper border border-rule rounded-xs font-sans text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:ring-1 focus:ring-ink"
            aria-label="Search receipts"
            data-testid="archive-search-input"
          />
          {query && (
            <button
              type="button"
              onClick={() => updateParam('q', null)}
              className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink p-0.5"
              aria-label="Clear search text"
              data-testid="archive-search-clear"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Connected Moments Only Toggle */}
          <button
            onClick={() => updateParam('connected', connectedOnly ? null : 'true')}
            data-testid="filter-connected-only"
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase tracking-wider rounded-xs border transition-all ${
              connectedOnly
                ? 'bg-stamp-red text-paper border-stamp-red font-bold shadow-xs'
                : 'bg-paper text-ink-soft border-rule hover:border-ink hover:text-ink'
            }`}
            title="Filter only receipts with connections"
          >
            <GitFork size={13} aria-hidden="true" />
            <span>Connected Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown size={14} className="absolute left-2.5 text-ink-soft pointer-events-none" />
            <select
              id="archive-sort-select"
              name="sort"
              data-testid="archive-sort-select"
              value={selectedSort}
              onChange={e => updateParam('sort', e.target.value)}
              className="cursor-pointer pl-8 pr-6 py-2 bg-paper border border-rule rounded-xs font-mono text-xs text-ink focus:border-ink"
              aria-label="Sort receipts"
            >
              <option value="oldest">Sort: Oldest First</option>
              <option value="newest">Sort: Newest First</option>
              <option value="connected">Sort: Most Connected</option>
              <option value="amount">Sort: Highest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Type Filter Chips */}
      <div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft mb-2 flex items-center gap-1.5">
          <SlidersHorizontal size={12} aria-hidden="true" />
          <span>Receipt Type</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateParam('type', null)}
            data-testid="filter-type-all"
            className={`cursor-pointer px-2.5 py-1 font-mono text-xs uppercase tracking-wider rounded-xs border transition-all ${
              !selectedType
                ? 'bg-ink text-paper border-ink font-bold'
                : 'bg-paper text-ink-soft border-rule hover:border-ink hover:text-ink'
            }`}
          >
            All Types
          </button>
          {ALL_TYPES.map(type => {
            const meta = RECEIPT_TYPE_META[type];
            const Icon = meta.icon;
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => updateParam('type', isSelected ? null : type)}
                data-testid={`filter-type-${type}`}
                className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs uppercase tracking-wider rounded-xs border transition-all ${
                  isSelected
                    ? 'bg-ink text-paper border-ink font-bold shadow-xs'
                    : 'bg-paper text-ink-soft border-rule hover:border-ink hover:text-ink'
                }`}
                style={isSelected ? { backgroundColor: meta.colorHex, borderColor: meta.colorHex } : undefined}
              >
                <Icon size={12} aria-hidden="true" />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filters: Month, Theme, City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-dashed border-rule">
        {/* Month */}
        <div>
          <label htmlFor="archive-filter-month" className="block font-mono text-[11px] uppercase tracking-wider text-ink-soft mb-1">
            Month
          </label>
          <select
            id="archive-filter-month"
            name="month"
            data-testid="archive-filter-month"
            value={selectedMonth}
            onChange={e => updateParam('month', e.target.value || null)}
            className="cursor-pointer w-full py-1.5 px-2.5 bg-paper border border-rule rounded-xs font-mono text-xs text-ink"
          >
            <option value="">All Months (Jan–Sep)</option>
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>
                {m.label} 2025
              </option>
            ))}
          </select>
        </div>

        {/* Theme */}
        <div>
          <label htmlFor="archive-filter-theme" className="block font-mono text-[11px] uppercase tracking-wider text-ink-soft mb-1">
            Theme
          </label>
          <select
            id="archive-filter-theme"
            name="theme"
            data-testid="archive-filter-theme"
            value={selectedTheme}
            onChange={e => updateParam('theme', e.target.value || null)}
            className="cursor-pointer w-full py-1.5 px-2.5 bg-paper border border-rule rounded-xs font-mono text-xs text-ink capitalize"
          >
            <option value="">All Themes</option>
            {THEMES.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label htmlFor="archive-filter-city" className="block font-mono text-[11px] uppercase tracking-wider text-ink-soft mb-1">
            Location
          </label>
          <select
            id="archive-filter-city"
            name="city"
            data-testid="archive-filter-city"
            value={selectedCity}
            onChange={e => updateParam('city', e.target.value || null)}
            className="cursor-pointer w-full py-1.5 px-2.5 bg-paper border border-rule rounded-xs font-mono text-xs text-ink"
          >
            <option value="">All Locations</option>
            {CITIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Summary Bar */}
      {hasActiveFilters && (
        <div className="pt-2 flex items-center justify-between text-xs font-mono text-ink-soft border-t border-dashed border-rule">
          <span>Filters applied</span>
          <button
            onClick={clearAllFilters}
            data-testid="archive-clear-all-filters"
            className="cursor-pointer text-stamp-red font-bold hover:underline flex items-center gap-1"
          >
            <X size={12} aria-hidden="true" />
            <span>Clear all filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
