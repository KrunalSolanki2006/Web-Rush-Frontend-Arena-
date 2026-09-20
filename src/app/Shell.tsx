import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Nav } from './Nav';
import { Barcode } from '../components/ui/Barcode';
import { Keyboard } from 'lucide-react';

// Lazy load non-critical overlay components to keep initial JS bundle ultra-light
const ReceiptDrawer = lazy(() =>
  import('../features/receipts/ReceiptDrawer').then(m => ({ default: m.ReceiptDrawer }))
);
const KeyboardHelpModal = lazy(() =>
  import('../components/ui/KeyboardHelpModal').then(m => ({ default: m.KeyboardHelpModal }))
);

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const pendingGKeyRef = useRef<boolean>(false);
  const gTimeoutRef = useRef<number | null>(null);

  const currentTitle =
    {
      '/': 'Itemized — Your Life, In Receipts',
      '/story': 'Story — Itemized',
      '/threads': 'Threads — Itemized',
      '/map': 'Life Map — Itemized',
      '/patterns': 'Patterns — Itemized',
      '/archive': 'Archive — Itemized',
      '/method': 'Method — Itemized',
    }[location.pathname] || 'Itemized — Your Life, In Receipts';

  // Manage document title and focus on route change
  useEffect(() => {
    document.title = currentTitle;

    // Move focus to main h1 if present for screen reader accessibility
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus();
    }
  }, [currentTitle]);

  // Global Keyboard Shortcuts (Modal on '?', Navigation sequences 'g' -> 'h'/'s'/'t'/'m'/'p'/'a'/'x')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when focusing input or editable element
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Help modal toggle
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsHelpOpen(prev => !prev);
        return;
      }

      // Escape closes modal
      if (e.key === 'Escape' && isHelpOpen) {
        setIsHelpOpen(false);
        return;
      }

      // Sequential 'g' navigation prefix
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        pendingGKeyRef.current = true;
        if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);
        gTimeoutRef.current = window.setTimeout(() => {
          pendingGKeyRef.current = false;
        }, 1200);
        return;
      }

      // If 'g' was pressed recently, check destination
      if (pendingGKeyRef.current) {
        pendingGKeyRef.current = false;
        if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);

        const key = e.key.toLowerCase();
        if (key === 'h') navigate('/');
        else if (key === 's') navigate('/story');
        else if (key === 't') navigate('/threads');
        else if (key === 'm') navigate('/map');
        else if (key === 'p') navigate('/patterns');
        else if (key === 'a') navigate('/archive');
        else if (key === 'x') navigate('/method');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);
    };
  }, [navigate, isHelpOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-highlighter selection:text-ink">
      {/* Skip to Main Content link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 px-4 py-2 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-wider rounded-xs shadow-lg"
      >
        Skip to main content
      </a>

      {/* Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Navigated to {currentTitle}
      </div>

      {/* Header & Nav */}
      <header className="sticky top-0 z-40">
        <Nav />
      </header>

      {/* Main Content Area with CSS Hardware-Accelerated Route Transition */}
      <main id="main" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 focus:outline-none" tabIndex={-1}>
        <div key={location.pathname} className="route-transition">
          {children}
        </div>
      </main>

      {/* Lazy Overlays wrapped in Suspense */}
      <Suspense fallback={null}>
        <ReceiptDrawer />
        {isHelpOpen && <KeyboardHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />}
      </Suspense>

      {/* Footer */}
      <footer className="bg-slip border-t border-rule mt-auto py-8 text-center text-xs font-mono text-ink-soft relative perforated-edge-paper no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center opacity-75 hover:opacity-100 transition-opacity">
            <Barcode receiptId="ITEMIZED_FOOTER_WR2025" height={16} />
          </div>

          <div className="space-y-1.5">
            <p>
              <strong>Itemized</strong> — Fictional demo dataset for WebRush 2025. 9 months, 55 receipts, 1 story.
            </p>
            <p className="text-[11px] text-ink-soft/70">
              Frontend-only architecture: React, TypeScript, Vite, Tailwind CSS v4, Lucide. Zero backend, zero tracking.
            </p>
          </div>

          <div className="pt-1 flex items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-paper border border-rule text-ink hover:border-ink hover:bg-paper-deep transition-colors"
              title="View keyboard shortcuts cheat sheet"
              aria-label="Open keyboard shortcuts cheat sheet"
            >
              <Keyboard size={13} aria-hidden="true" />
              <span>Keyboard Shortcuts (<kbd className="font-bold">?</kbd>)</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
