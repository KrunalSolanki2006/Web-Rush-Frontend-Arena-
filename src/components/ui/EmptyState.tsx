import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No receipts found',
  description = 'Try adjusting your search criteria or clearing applied filters.',
  actionLabel = 'Clear all filters',
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-8 md:p-12 text-center bg-slip border border-dashed border-rule rounded-sm perforated-edge ${className}`}
      role="status"
    >
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-paper-deep flex items-center justify-center text-ink-soft border border-rule">
        <SearchX size={24} aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-bold text-ink mb-1">{title}</h3>
      <p className="font-sans text-sm text-ink-soft max-w-md mx-auto mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider bg-ink text-paper rounded-xs hover:bg-ink-soft transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
