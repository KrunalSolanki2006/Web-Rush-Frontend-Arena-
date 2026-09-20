import React from 'react';

interface StampProps {
  label: string;
  className?: string;
  rotateDeg?: number;
}

export const Stamp: React.FC<StampProps> = ({
  label,
  className = '',
  rotateDeg = -3,
}) => {
  return (
    <span
      className={`inline-block border-2 border-stamp-red text-stamp-red font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 text-xs rounded-xs shadow-xs select-none ${className}`}
      style={{
        transform: `rotate(${rotateDeg}deg)`,
      }}
    >
      {label}
    </span>
  );
};
