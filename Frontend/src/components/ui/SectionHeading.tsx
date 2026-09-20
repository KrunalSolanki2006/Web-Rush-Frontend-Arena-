import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badge,
  action,
  className = '',
}) => {
  return (
    <div className={`mb-6 pb-3 border-b border-dashed border-rule ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
            {title}
          </h2>
          {badge && (
            <span className="font-mono text-xs uppercase px-2 py-0.5 bg-paper-deep text-ink-soft border border-rule rounded-xs">
              {badge}
            </span>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {subtitle && (
        <p className="font-sans text-sm text-ink-soft mt-1 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};
