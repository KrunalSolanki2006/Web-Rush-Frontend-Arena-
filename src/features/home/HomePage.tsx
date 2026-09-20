import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useDataset } from '../../hooks/useDataset';
import { CountUp } from '../../components/reactbits/CountUp';
import { DecryptedText } from '../../components/reactbits/DecryptedText';
import { useReceipt } from '../../hooks/useReceipt';
import { usePersistentState } from '../../hooks/usePersistentState';
import { Barcode } from '../../components/ui/Barcode';
import { BookOpen, GitFork, Archive, ArrowRight, Clock, Printer } from 'lucide-react';

// Lazy load below-the-fold interactive stack to avoid loading ReceiptSlip on initial critical path
const Stack = lazy(() =>
  import('../../components/reactbits/Stack').then(m => ({ default: m.Stack }))
);

export const HomePage: React.FC = () => {
  const {
    receipts,
    chapters,
    purchasesTotal,
    places,
    confirmedCount,
    inferredCount,
  } = useDataset();

  const { openReceipt } = useReceipt();
  const [lastReadChapter] = usePersistentState<number>('last_read_chapter', 1);

  return (
    <div className="space-y-12">
      {/* Hero Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 md:pt-6">
        {/* Left 7 Cols: Narrative Hook & Headline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="animate-hero-1 inline-flex items-center gap-2 px-2.5 py-1 bg-slip border border-rule rounded-xs font-mono text-xs uppercase tracking-widest text-ink-soft">
            <span>January 4 – September 19, 2025</span>
          </div>

          <h1 className="animate-hero-2 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.1]">
            <DecryptedText
              text="Nine months. Fifty-five receipts. One story."
              speed={35}
              maxIterations={12}
            />
          </h1>

          <p className="animate-hero-3 font-sans text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl">
            You began the year with a late-night song, a rainy snapshot on Carter Road, and a decision to start running again.
            You ended it with a promise to stay still and look: <em>one photo a day</em>. 
            Here is your digital life, itemized and connected.
          </p>

          {/* Primary Action Buttons */}
          <div className="animate-hero-4 flex flex-wrap gap-3 pt-2">
            <Link
              to="/story"
              data-testid="cta-start-story"
              className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-ink-soft transition-all shadow-sm"
            >
              <BookOpen size={16} aria-hidden="true" />
              <span>Start the Story</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>

            <Link
              to="/threads"
              data-testid="cta-pull-thread"
              className="inline-flex items-center gap-2 px-5 py-3 bg-slip border border-rule text-ink font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-paper-deep hover:border-ink transition-all shadow-xs"
            >
              <GitFork size={16} aria-hidden="true" />
              <span>Pull a Thread</span>
            </Link>

            <Link
              to="/archive"
              data-testid="cta-browse-archive"
              className="inline-flex items-center gap-2 px-5 py-3 bg-paper border border-rule text-ink-soft font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:text-ink hover:border-ink transition-all"
            >
              <Archive size={16} aria-hidden="true" />
              <span>Browse Archive</span>
            </Link>
          </div>

          {/* Continue where you left off */}
          {lastReadChapter > 1 && (
            <div className="pt-2 flex items-center gap-2 font-mono text-xs text-ink-soft animate-hero-4">
              <Clock size={14} aria-hidden="true" />
              <span>Continue reading: </span>
              <Link
                to={`/story#chapter-${lastReadChapter}`}
                className="font-bold text-stamp-red hover:underline"
              >
                Chapter {lastReadChapter} ({chapters[lastReadChapter - 1]?.title}) →
              </Link>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Thermal Cover Receipt Slip */}
        <div className="lg:col-span-5 flex justify-center animate-hero-card">
          <div className="w-full max-w-md bg-slip border border-rule rounded-sm p-6 md:p-8 shadow-lg perforated-edge space-y-6">
            <div className="text-center border-b border-dashed border-rule pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-soft font-semibold">
                * OFFICIAL STATEMENT OF LIFE *
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mt-1">
                ITEMIZED
              </h2>
              <div className="font-mono text-[11px] text-ink-soft mt-1">
                SERIAL: WR-2025-55R · REGISTER #01
              </div>
            </div>

            {/* Itemized Line Items with Dotted Leaders */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-ink">Chapters (Months)</span>
                <span className="flex-1 mx-2 border-b border-dotted border-rule" />
                <CountUp to={9} className="font-bold text-ink text-sm" />
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-ink">Total Life Receipts</span>
                <span className="flex-1 mx-2 border-b border-dotted border-rule" />
                <CountUp to={55} className="font-bold text-ink text-sm" />
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-ink">Confirmed Causal Links</span>
                <span className="flex-1 mx-2 border-b border-dotted border-rule" />
                <CountUp to={confirmedCount} className="font-bold text-ink text-sm" />
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-ink">Inferred Thematic Links</span>
                <span className="flex-1 mx-2 border-b border-dotted border-rule" />
                <CountUp to={inferredCount} className="font-bold text-ink text-sm" />
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-ink">Geolocated Places</span>
                <span className="flex-1 mx-2 border-b border-dotted border-rule" />
                <CountUp to={places.length} className="font-bold text-ink text-sm" />
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-ink">Total Invested (Gear & Travel)</span>
                <span className="flex-1 mx-2 border-b border-dotted border-rule" />
                <span className="font-bold text-ink text-sm">
                  ₹<CountUp to={purchasesTotal} />
                </span>
              </div>

              {/* Total Line */}
              <div className="pt-3 border-t-2 border-ink flex justify-between items-baseline font-bold text-sm text-stamp-red">
                <span>TOTAL SUMMARY:</span>
                <span className="tracking-widest">ONE STORY</span>
              </div>
            </div>

            {/* Footer barcode */}
            <div className="pt-4 border-t border-dashed border-rule flex flex-col items-center">
              <Barcode receiptId="ITEMIZED_MASTER_2025" height={22} />
              <p className="font-mono text-[9px] text-ink-soft/70 uppercase tracking-wider mt-2">
                RETAIN THIS SLIP FOR YOUR RECORDS
              </p>
              <button
                onClick={() => window.print()}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-rule rounded-xs font-mono text-[11px] uppercase tracking-wider text-ink-soft hover:text-ink hover:border-ink hover:bg-paper transition-all no-print cursor-pointer"
                title="Print this life statement receipt (Ctrl+P)"
                aria-label="Print this life statement receipt"
              >
                <Printer size={13} aria-hidden="true" />
                <span>Print Official Slip (Ctrl+P)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Stack Section: Shuffle Receipts (Deferred) */}
      <section className="bg-paper-deep/40 border border-dashed border-rule rounded-sm p-6 md:p-10 text-center space-y-6">
        <div>
          <span className="font-mono text-xs uppercase font-bold tracking-widest text-stamp-red">
            TACTILE EXPLORATION
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mt-1">
            Shuffle the Slips
          </h2>
          <p className="font-sans text-sm text-ink-soft max-w-lg mx-auto mt-1">
            Flip through a sample of thermal receipts. Click any card in the deck to inspect its full itemized details.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center font-mono text-xs text-ink-soft">
              Loading cards...
            </div>
          }
        >
          <Stack
            receipts={receipts}
            onSelectReceipt={openReceipt}
          />
        </Suspense>
      </section>
    </div>
  );
};
