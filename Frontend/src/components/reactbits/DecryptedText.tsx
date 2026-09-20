import React, { useEffect, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
  revealDirection?: 'start' | 'end' | 'center';
  animateOn?: 'view' | 'hover';
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    if (hasAnimated) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / (maxIterations / text.length)) {
              return text[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join('')
      );

      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setHasAnimated(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, hasAnimated]);

  return <span className={className}>{displayText}</span>;
};
