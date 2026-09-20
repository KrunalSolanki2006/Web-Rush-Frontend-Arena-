import React, { useEffect, useRef } from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['?'], description: 'Open this keyboard shortcuts cheat sheet' },
  { keys: ['Esc'], description: 'Close modal or active receipt slip drawer' },
  { keys: ['g', 'h'], description: 'Go to Home overview' },
  { keys: ['g', 's'], description: 'Go to Story chapters' },
  { keys: ['g', 't'], description: 'Go to Narrative Threads' },
  { keys: ['g', 'm'], description: 'Go to Life Map' },
  { keys: ['g', 'p'], description: 'Go to Patterns & Discoveries' },
  { keys: ['g', 'a'], description: 'Go to Receipt Archive' },
  { keys: ['g', 'x'], description: 'Go to Method & Architecture' },
  { keys: ['Ctrl', 'P'], description: 'Print / Export physical life slip' },
];

export const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs animate-fade-in"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-slip border border-rule rounded-sm shadow-2xl p-6 z-10 space-y-5 perforated-edge animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dashed border-rule pb-3">
          <div className="flex items-center gap-2">
            <Keyboard size={18} className="text-stamp-red" aria-hidden="true" />
            <h2 id="keyboard-shortcuts-title" className="font-display text-lg font-bold text-ink">
              Keyboard Shortcuts
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-xs text-ink-soft hover:text-ink hover:bg-paper transition-colors"
            aria-label="Close shortcuts modal"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2.5 font-mono text-xs max-h-80 overflow-y-auto pr-1">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1 border-b border-rule/30 last:border-0"
            >
              <span className="font-sans text-xs text-ink">{s.description}</span>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                {s.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-0.5 bg-paper border border-rule rounded-xs font-bold text-ink text-[11px] shadow-2xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="pt-3 border-t border-dashed border-rule flex items-center justify-between font-mono text-[11px] text-ink-soft">
          <span className="flex items-center gap-1">
            <Command size={11} aria-hidden="true" />
            <span>Press <kbd className="px-1 bg-paper border border-rule rounded-xs">?</kbd> anywhere</span>
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer font-bold text-stamp-red hover:underline"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
