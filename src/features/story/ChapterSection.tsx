import React from 'react';
import type { Chapter } from '../../types';
import { Stamp } from '../../components/ui/Stamp';
import { Chip } from '../../components/ui/Chip';
import { MomentChain } from './MomentChain';
import { Quote, Sparkles, TrendingUp, Compass } from 'lucide-react';

interface ChapterSectionProps {
  chapter: Chapter;
  onSelectReceipt: (receiptId: string) => void;
  onPullThread: (receiptId: string) => void;
}

export const ChapterSection: React.FC<ChapterSectionProps> = ({
  chapter,
  onSelectReceipt,
  onPullThread,
}) => {
  return (
    <section
      id={`chapter-${chapter.month}`}
      data-testid={`chapter-section-${chapter.month}`}
      className="scroll-mt-24 bg-slip border border-rule rounded-sm p-6 md:p-8 shadow-xs space-y-6"
    >
      {/* Chapter Header */}
      <div className="border-b border-dashed border-rule pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase font-bold tracking-widest text-ink-soft bg-paper px-2 py-0.5 border border-rule rounded-xs">
              Chapter {chapter.month} · {chapter.monthName} 2025
            </span>
            <Stamp label={chapter.persona} rotateDeg={chapter.month % 2 === 0 ? 2 : -2} />
          </div>

          <div className="font-mono text-xs text-ink-soft">
            {chapter.receipts.length} receipts · {chapter.moments.length} connected chains
          </div>
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
          {chapter.title}
        </h2>

        <p className="font-sans text-sm md:text-base text-ink mt-2 leading-relaxed max-w-3xl">
          {chapter.blurb}
        </p>

        {/* Evidence Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft mr-1 flex items-center gap-1">
            <Sparkles size={12} aria-hidden="true" />
            <span>Evidence:</span>
          </span>
          {chapter.receipts.map(r => (
            <Chip
              key={r.receipt_id}
              label={`#${r.receipt_id} ${r.title}`}
              size="sm"
              onClick={() => onSelectReceipt(r.receipt_id)}
              dataTestId={`evidence-chip-${r.receipt_id}`}
              className="hover:border-ink cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* Moment Chains in this Chapter */}
      <div className="space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
          <Compass size={14} aria-hidden="true" />
          <span>Moment Chains in this Chapter</span>
        </h3>

        {chapter.moments.length === 0 ? (
          <p className="font-sans text-xs text-ink-soft italic">
            Quiet standalone moments recorded in this period.
          </p>
        ) : (
          chapter.moments.map(m => (
            <MomentChain
              key={m.id}
              moment={m}
              onSelectReceipt={onSelectReceipt}
              onPullThread={onPullThread}
            />
          ))
        )}
      </div>

      {/* Inner Voice Note (Pull Quote) */}
      {chapter.innerVoice && (
        <div className="bg-paper border-l-4 border-stamp-red p-4 rounded-r-xs flex items-start gap-3">
          <Quote size={20} className="text-stamp-red shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-0.5">
              Inner Voice · {chapter.innerVoice.dateLabel} at {chapter.innerVoice.timeLabel}
            </div>
            <p className="font-display text-base md:text-lg font-bold italic text-ink">
              "{chapter.innerVoice.personal_note}"
            </p>
          </div>
        </div>
      )}

      {/* What Changed Since Last Chapter */}
      {chapter.previousChapterDiff && (
        <div className="bg-paper-deep/60 p-3 rounded-xs border border-rule/50 flex items-center gap-2 font-mono text-xs text-ink-soft">
          <TrendingUp size={14} className="text-ink shrink-0" aria-hidden="true" />
          <span>
            <strong className="text-ink">What changed:</strong> {chapter.previousChapterDiff}
          </span>
        </div>
      )}
    </section>
  );
};
