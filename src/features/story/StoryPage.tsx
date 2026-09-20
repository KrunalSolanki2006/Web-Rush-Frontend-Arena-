import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataset } from '../../hooks/useDataset';
import { ChapterSection } from './ChapterSection';
import { useReceipt } from '../../hooks/useReceipt';
import { usePersistentState } from '../../hooks/usePersistentState';
import { STORY_THESIS } from '../../data/editorial/thesis';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { ReceiptSlip } from '../../components/ui/ReceiptSlip';
import { BookOpen, ArrowDown } from 'lucide-react';

export const StoryPage: React.FC = () => {
  const { chapters, getReceipt } = useDataset();
  const navigate = useNavigate();
  const { openReceipt } = useReceipt();
  const [lastReadChapter, setLastReadChapter] = usePersistentState<number>('last_read_chapter', 1);
  const [activeChapter, setActiveChapter] = useState<number>(lastReadChapter || 1);

  // Setup IntersectionObserver for sticky month rail
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const match = id.match(/chapter-(\d+)/);
            if (match) {
              const month = parseInt(match[1], 10);
              setActiveChapter(month);
              setLastReadChapter(month);
            }
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    for (let m = 1; m <= 9; m++) {
      const el = document.getElementById(`chapter-${m}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [setLastReadChapter]);

  const handlePullThread = (receiptId: string) => {
    navigate(`/threads?focus=${receiptId}`);
  };

  const scrollToChapter = (month: number) => {
    setActiveChapter(month);
    setLastReadChapter(month);
    const el = document.getElementById(`chapter-${month}`);
    if (el) {
      el.scrollIntoView({ behavior: 'auto' });
      window.history.replaceState(null, '', `#chapter-${month}`);
    }
  };

  const startReceipt = getReceipt(STORY_THESIS.bookends.startReceiptId);
  const endReceipt = getReceipt(STORY_THESIS.bookends.endReceiptId);

  return (
    <div className="space-y-8">
      <SectionHeading
        title="The Story"
        subtitle="Nine months, nine chapters. Follow how an accidental phone photo on a rainy night transformed into a daily commitment to stillness."
        badge="NARRATIVE MODE"
      />

      {/* Sticky Month Navigation Rail */}
      <div className="sticky top-16 z-30 bg-paper/95 backdrop-blur-xs py-2 border-b border-rule flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          {chapters.map(ch => (
            <button
              key={ch.month}
              data-testid={`chapter-nav-${ch.month}`}
              onClick={() => scrollToChapter(ch.month)}
              className={`cursor-pointer px-3 py-1 font-mono text-xs uppercase tracking-wider font-semibold rounded-xs transition-all whitespace-nowrap ${
                activeChapter === ch.month
                  ? 'bg-ink text-paper shadow-xs font-bold'
                  : 'bg-slip text-ink-soft border border-rule hover:border-ink hover:text-ink'
              }`}
            >
              Ch {ch.month}: {ch.monthName}
            </button>
          ))}
        </div>

        <span className="hidden md:inline font-mono text-xs text-ink-soft whitespace-nowrap pl-4">
          Persona: <strong>{chapters[activeChapter - 1]?.persona}</strong>
        </span>
      </div>

      {/* 9 Monthly Chapters */}
      <div className="space-y-8">
        {chapters.map(chapter => (
          <ChapterSection
            key={chapter.month}
            chapter={chapter}
            onSelectReceipt={openReceipt}
            onPullThread={handlePullThread}
          />
        ))}
      </div>

      {/* Closing "What It All Means" Thesis Section */}
      <section className="bg-slip border-2 border-ink rounded-sm p-6 md:p-10 shadow-md space-y-6">
        <div className="border-b border-dashed border-rule pb-4 text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-stamp-red">
            EPILOGUE & SYNTHESIS
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-ink mt-2">
            What It All Means
          </h2>
          <p className="font-display text-base md:text-lg italic text-ink-soft mt-2">
            {STORY_THESIS.subheadline}
          </p>
        </div>

        <div className="max-w-3xl mx-auto font-sans text-sm md:text-base text-ink leading-relaxed space-y-4">
          <p>
            {STORY_THESIS.narrative}
          </p>
        </div>

        {/* Bookend Receipts */}
        <div className="pt-4 border-t border-dashed border-rule">
          <div className="text-center font-mono text-xs uppercase tracking-widest text-ink-soft mb-4 flex items-center justify-center gap-2">
            <BookOpen size={14} aria-hidden="true" />
            <span>The Year's Bookends: From Escape to Attention</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {startReceipt && (
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold text-ink-soft">
                  Bookend 1: The First Spark (Jan 4)
                </div>
                <ReceiptSlip
                  receipt={startReceipt}
                  variant="compact"
                  onClick={() => openReceipt(startReceipt.receipt_id)}
                  onPullThread={handlePullThread}
                />
              </div>
            )}

            <div className="hidden md:flex justify-center text-ink-soft">
              <div className="text-center">
                <span className="font-mono text-xs block mb-1">Nine Months</span>
                <span className="font-mono text-lg text-ink font-bold">55 Receipts</span>
                <ArrowDown size={20} className="mx-auto mt-1 text-stamp-red" />
              </div>
            </div>

            {endReceipt && (
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold text-ink-soft">
                  Bookend 2: The Final Promise (Sep 19)
                </div>
                <ReceiptSlip
                  receipt={endReceipt}
                  variant="compact"
                  onClick={() => openReceipt(endReceipt.receipt_id)}
                  onPullThread={handlePullThread}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
