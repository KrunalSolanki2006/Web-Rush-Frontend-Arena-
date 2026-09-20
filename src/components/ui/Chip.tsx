import React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
  className?: string;
  size?: 'sm' | 'md';
  dataTestId?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onClick,
  count,
  className = '',
  size = 'md',
  dataTestId,
}) => {
  // Humanize underscore tokens: "new_start" -> "New Start"
  const humanized = label
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const isButton = Boolean(onClick);
  const Component = isButton ? 'button' : 'span';

  const isSmall = size === 'sm';

  return (
    <Component
      onClick={onClick}
      data-testid={dataTestId}
      className={`inline-flex items-center gap-1.5 font-mono tracking-wide rounded-sm transition-all border ${
        isSmall ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${
        active
          ? 'bg-ink text-paper border-ink font-semibold shadow-xs'
          : 'bg-paper border-rule text-ink-soft hover:border-ink hover:text-ink'
      } ${isButton ? 'cursor-pointer' : ''} ${className}`}
      type={isButton ? 'button' : undefined}
    >
      <span>{humanized}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1 rounded-xs ${
            active ? 'bg-paper text-ink font-bold' : 'bg-paper-deep text-ink-soft'
          }`}
        >
          {count}
        </span>
      )}
    </Component>
  );
};
