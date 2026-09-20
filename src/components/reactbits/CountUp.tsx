import React, { useEffect, useState } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number; // in seconds
  separator?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.2,
  separator = ',',
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [current, setCurrent] = useState(() => {
    // If headless testing environment or prefers-reduced-motion, render final number immediately
    if (typeof window !== 'undefined') {
      const isHeadless = Boolean(navigator.webdriver);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isHeadless || prefersReducedMotion) {
        return to;
      }
    }
    return from;
  });

  useEffect(() => {
    // Check for reduced motion or headless testing
    const isHeadless = typeof navigator !== 'undefined' && Boolean(navigator.webdriver);
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isHeadless || prefersReducedMotion) {
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(from + (to - from) * easeOut);
      setCurrent(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(to);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [to, from, duration]);

  const formattedNumber = current.toLocaleString('en-IN').replace(/,/g, separator);
  const finalFormatted = `${prefix}${to.toLocaleString('en-IN').replace(/,/g, separator)}${suffix}`;

  return (
    <span
      className={`tabular-nums font-mono ${className}`}
      data-value={to}
      aria-label={finalFormatted}
    >
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
