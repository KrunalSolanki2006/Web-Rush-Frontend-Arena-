import React from 'react';

interface BarcodeProps {
  receiptId: string;
  className?: string;
  height?: number;
}

/**
 * Generates a deterministic barcode SVG from a receipt ID string.
 */
export const Barcode: React.FC<BarcodeProps> = ({
  receiptId,
  className = '',
  height = 20,
}) => {
  // Simple deterministic hash to bar widths
  const hash = receiptId.split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7);
  const bars: number[] = [];

  for (let i = 0; i < 28; i++) {
    const bit = ((hash >> (i % 24)) ^ (i * 13)) % 5;
    bars.push(Math.max(1, bit));
  }

  let currentX = 0;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg
        width="112"
        height={height}
        viewBox="0 0 112 20"
        className="opacity-80"
        aria-hidden="true"
      >
        {bars.map((width, idx) => {
          const x = currentX;
          currentX += width + 2;
          if (idx % 2 === 0) {
            return (
              <rect
                key={idx}
                x={x}
                y="0"
                width={width}
                height="20"
                fill="#1C1B18"
              />
            );
          }
          return null;
        })}
      </svg>
      <span className="font-mono text-[9px] tracking-widest text-ink-soft uppercase mt-0.5">
        *{receiptId}*
      </span>
    </div>
  );
};
