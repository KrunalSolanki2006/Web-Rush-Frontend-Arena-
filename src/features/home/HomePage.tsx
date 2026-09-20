import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useDataset } from '../../hooks/useDataset';
import { CountUp } from '../../components/reactbits/CountUp';
import { DecryptedText } from '../../components/reactbits/DecryptedText';
import { useReceipt } from '../../hooks/useReceipt';
import { usePersistentState } from '../../hooks/usePersistentState';
import { Barcode } from '../../components/ui/Barcode';
import {
  BookOpen, GitFork, Archive, ArrowRight, Clock, Printer,
  Map, BarChart3, CheckCircle2, HelpCircle, Info,
} from 'lucide-react';

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

      {/* Feature Navigation Grid */}
      <section aria-labelledby="features-heading" className="space-y-4">
        <div className="text-center">
          <span className="font-mono text-xs uppercase font-bold tracking-widest text-stamp-red">
            EXPLORE ALL VIEWS
          </span>
          <h2 id="features-heading" className="font-display text-2xl md:text-3xl font-bold text-ink mt-1">
            Six Ways to Read Your Life
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="feature-grid">
          {[
            {
              path: '/story',
              icon: BookOpen,
              label: 'Story Mode',
              badge: '9 CHAPTERS',
              desc: 'Nine monthly chapters with persona stamps, moment chains, and a final thesis epilogue.',
              testId: 'feature-story',
            },
            {
              path: '/threads',
              icon: GitFork,
              label: 'Threads & Connections',
              badge: '43 EDGES',
              desc: 'SVG relationship graph across 9 type lanes — trace confirmed and inferred causal links.',
              testId: 'feature-threads',
            },
            {
              path: '/map',
              icon: Map,
              label: 'Life Map',
              badge: '8 PLACES',
              desc: 'SVG equirectangular projection of 8 geolocated places across Mumbai, Lonavala, and Udaipur.',
              testId: 'feature-map',
            },
            {
              path: '/patterns',
              icon: BarChart3,
              label: 'Patterns & Discoveries',
              badge: '5 INSIGHTS',
              desc: 'Computed behavioral insights: theme matrix, morning shift, intent lags, spending tape, inner voice.',
              testId: 'feature-patterns',
            },
            {
              path: '/archive',
              icon: Archive,
              label: 'The Archive',
              badge: '55 RECEIPTS',
              desc: 'Real-time multi-facet search and filter across all 55 receipts with slips and table views.',
              testId: 'feature-archive',
            },
            {
              path: '/method',
              icon: Info,
              label: 'Method & Provenance',
              badge: 'TRANSPARENCY',
              desc: 'How confirmed and inferred connections are distinguished, with data traps handled explicitly.',
              testId: 'feature-method',
            },
          ].map(({ path, icon: Icon, label, badge, desc, testId }) => (
            <Link
              key={path}
              to={path}
              data-testid={testId}
              className="group bg-slip border border-rule p-5 rounded-sm shadow-xs hover:shadow-md hover:border-ink-soft transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xs bg-paper-deep flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <span className="font-display font-bold text-base text-ink">{label}</span>
                </div>
                <ArrowRight size={15} className="text-ink-soft group-hover:text-ink group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-stamp-red font-bold">
                {badge}
              </div>
              <p className="font-sans text-xs text-ink-soft leading-relaxed">
                {desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Dataset Provenance Strip */}
      <section
        aria-labelledby="dataset-heading"
        className="bg-slip border-2 border-dashed border-rule rounded-sm p-6 md:p-8 space-y-4"
        data-testid="dataset-provenance"
      >
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            DATASET GROUND TRUTH · §2.3 VERIFIED
          </span>
          <h2 id="dataset-heading" className="font-display text-lg font-bold text-ink mt-1">
            By the Numbers
          </h2>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          {[
            { label: 'Life Receipts', value: `${receipts.length}`, unit: 'total' },
            { label: 'Confirmed Links', value: `${confirmedCount}`, unit: 'causal edges' },
            { label: 'Inferred Links', value: `${inferredCount}`, unit: 'thematic edges' },
            { label: 'Geolocated Places', value: `${places.length}`, unit: 'with lat/lon' },
            { label: 'Monthly Chapters', value: `${chapters.length}`, unit: 'Jan–Sep 2025' },
            { label: 'Total Purchases', value: `₹${purchasesTotal.toLocaleString('en-IN')}`, unit: 'documented spend' },
            { label: 'Receipt Types', value: '9', unit: 'categories' },
            { label: 'Backend Servers', value: '0', unit: 'frontend only' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="text-center space-y-0.5">
              <dt className="text-[10px] uppercase tracking-wider text-ink-soft">{label}</dt>
              <dd className="text-xl font-bold text-ink">{value}</dd>
              <div className="text-[10px] text-ink-soft/70">{unit}</div>
            </div>
          ))}
        </dl>

        <div className="pt-2 border-t border-dashed border-rule flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-green-700" aria-hidden="true" />
            <span>29 confirmed causal connections (hard-coded in CSV)</span>
          </span>
          <span className="hidden sm:block text-rule">·</span>
          <span className="flex items-center gap-1.5">
            <HelpCircle size={13} className="text-ink-soft" aria-hidden="true" />
            <span>14 inferred thematic connections (curated to connect orphans)</span>
          </span>
        </div>
      </section>
    </div>
  );
};
