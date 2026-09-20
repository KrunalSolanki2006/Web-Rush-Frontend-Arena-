import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getDataset } from '../../lib/dataset';
import {
  computeIntentActionLags,
  computeSpendingBreakdown,
  computeMorningShift,
  computeInnerVoice,
} from '../../lib/insights';
import { matchThemes } from '../../lib/dataset/chapters';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { useReceipt } from '../../hooks/useReceipt';
import {
  Clock,
  Compass,
  DollarSign,
  SunMedium,
  MessageSquareQuote,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const THEMES = [
  'water',
  'light',
  'movement',
  'stillness',
  'seeing',
  'writing',
  'company',
];

export const PatternsPage: React.FC = () => {
  const dataset = useMemo(() => getDataset(), []);
  const { openReceipt } = useReceipt();

  const lags = useMemo(() => computeIntentActionLags(dataset), [dataset]);
  const spending = useMemo(() => computeSpendingBreakdown(dataset), [dataset]);
  const morningShift = useMemo(() => computeMorningShift(dataset), [dataset]);
  const innerVoice = useMemo(() => computeInnerVoice(dataset), [dataset]);

  // Compute theme recurrence matrix (themes x 9 months)
  const themeMatrix = useMemo(() => {
    const matrix: Record<string, number[]> = {};
    for (const t of THEMES) {
      matrix[t] = Array(9).fill(0);
    }

    for (const r of dataset.receipts) {
      const themes = matchThemes(r);
      for (const t of themes) {
        if (matrix[t]) {
          matrix[t][r.month - 1]++;
        }
      }
    }
    return matrix;
  }, [dataset]);

  return (
    <div className="space-y-10">
      <SectionHeading
        title="Patterns & Discoveries"
        subtitle="Computed insights across 55 receipts. Behavioral shifts, intent-to-action lags, spending distribution, and the quiet rhythm of inner voice reflections."
        badge="COMPUTED INSIGHTS"
      />

      {/* Block 1: Theme Recurrence Grid */}
      <section className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-ink-soft mb-1">
              <Compass size={14} aria-hidden="true" />
              <span>Pattern 01 · Recurrence</span>
            </div>
            <h2 className="font-display text-xl font-bold text-ink">
              Thematic Echoes Across Nine Months
            </h2>
            <p className="font-sans text-xs text-ink-soft mt-1">
              <strong>Finding:</strong> Water and Seeing persist across almost every chapter, while Movement concentrated in early spring and mid-summer.
            </p>
          </div>

          <Link
            to="/archive"
            className="font-mono text-xs text-stamp-red font-bold hover:underline shrink-0 hidden sm:inline-flex items-center gap-1"
          >
            <span>Filter Archive</span>
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-rule font-bold text-ink-soft">
                <th className="py-2 pr-4">Theme</th>
                {dataset.chapters.map(ch => (
                  <th key={ch.month} className="py-2 px-3 text-center">
                    {ch.monthName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/40">
              {THEMES.map(theme => (
                <tr key={theme} className="hover:bg-paper/60 transition-colors">
                  <td className="py-2.5 pr-4 font-bold capitalize text-ink">
                    {theme}
                  </td>
                  {dataset.chapters.map(ch => {
                    const count = themeMatrix[theme][ch.month - 1];
                    const intensity = Math.min(count * 25, 100);

                    return (
                      <td key={ch.month} className="py-2.5 px-3 text-center">
                        <Link
                          to={`/archive?theme=${theme}&month=${ch.month}`}
                          className={`inline-block w-8 h-8 rounded-xs font-bold leading-8 transition-all hover:scale-110 ${
                            count > 0
                              ? 'text-ink border border-ink/20 shadow-xs'
                              : 'text-ink-soft/30 hover:text-ink-soft'
                          }`}
                          style={{
                            backgroundColor:
                              count > 0
                                ? `rgba(243, 211, 74, ${0.2 + intensity / 150})`
                                : 'transparent',
                          }}
                          title={`${theme} in ${ch.monthName}: ${count} receipts. Click to view in Archive.`}
                        >
                          {count || '·'}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Block 2: The Morning Shift */}
      <section className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-ink-soft mb-1">
            <SunMedium size={14} aria-hidden="true" />
            <span>Pattern 02 · Circadian Rhythm</span>
          </div>
          <h2 className="font-display text-xl font-bold text-ink">
            The Morning Shift
          </h2>
          <p className="font-sans text-xs text-ink-soft mt-1">
            <strong>Finding:</strong> In Jan–Feb, only <strong>{morningShift.janFebMorningRatio}</strong> occurred in morning hours. By May–Jul, morning activity surged to <strong>{morningShift.mayJulMorningRatio}</strong> as photography took over.
          </p>
        </div>

        {/* Stacked Percentage Bars per Month */}
        <div className="space-y-3 pt-2">
          {morningShift.chapters.map(ch => (
            <div key={ch.month} className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="font-bold text-ink">
                  {ch.monthName} ({ch.total} receipts)
                </span>
                <span className="text-ink-soft">
                  Morning: {Math.round(ch.morningPercentage)}% · Night: {Math.round(ch.nightPercentage)}%
                </span>
              </div>

              <div className="h-4 w-full bg-paper-deep rounded-xs flex overflow-hidden border border-rule">
                {/* Morning (Amber) */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="bg-[#E76F51] h-full"
                  style={{ transformOrigin: 'left', width: `${ch.morningPercentage}%` }}
                  title={`Morning: ${ch.bands.morning || 0}`}
                />
                {/* Afternoon (Yellow) */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-[#E9C46A] h-full"
                  style={{
                    transformOrigin: 'left',
                    width: `${ch.total > 0 ? ((ch.bands.afternoon || 0) / ch.total) * 100 : 0}%`,
                  }}
                  title={`Afternoon: ${ch.bands.afternoon || 0}`}
                />
                {/* Evening (Slate) */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="bg-[#2A9D8F] h-full"
                  style={{
                    transformOrigin: 'left',
                    width: `${ch.total > 0 ? ((ch.bands.evening || 0) / ch.total) * 100 : 0}%`,
                  }}
                  title={`Evening: ${ch.bands.evening || 0}`}
                />
                {/* Night (Ink) */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-[#1C1B18] h-full"
                  style={{ transformOrigin: 'left', width: `${ch.nightPercentage}%` }}
                  title={`Night: ${ch.bands.night || 0}`}
                />
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-[11px] text-ink-soft">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#E76F51] rounded-xs" />
              <span>Morning (05:00–11:59)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#E9C46A] rounded-xs" />
              <span>Afternoon (12:00–17:59)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#2A9D8F] rounded-xs" />
              <span>Evening (18:00–20:59)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#1C1B18] rounded-xs" />
              <span>Night (21:00–04:59)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Block 3: Intent-to-Action Lag */}
      <section className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-ink-soft mb-1">
            <Clock size={14} aria-hidden="true" />
            <span>Pattern 03 · Causal Lag</span>
          </div>
          <h2 className="font-display text-xl font-bold text-ink">
            Intent to Action: Tools vs. Trips
          </h2>
          <p className="font-sans text-xs text-ink-soft mt-1">
            <strong>Hypothesis:</strong> You plan journeys for days, but commit to creative tools and rituals within hours.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {lags.map(item => (
            <div
              key={item.searchReceipt.receipt_id}
              className="bg-paper p-3 rounded-xs border border-rule space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-ink">
                  "{item.searchReceipt.query}" → {item.outcomeReceipt.title}
                </span>
                <span className="font-mono text-xs font-bold text-stamp-red bg-slip px-2 py-0.5 rounded-xs border border-rule">
                  Lag: {item.lagFormatted}
                </span>
              </div>

              <p className="font-sans text-xs text-ink-soft">
                {item.hypothesis}
              </p>

              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
                <button
                  onClick={() => openReceipt(item.searchReceipt.receipt_id)}
                  className="cursor-pointer text-ink hover:underline flex items-center gap-1"
                >
                  <span>Search #{item.searchReceipt.receipt_id}</span>
                  <ExternalLink size={10} aria-hidden="true" />
                </button>
                <span className="text-ink-soft">→</span>
                <button
                  onClick={() => openReceipt(item.outcomeReceipt.receipt_id)}
                  className="cursor-pointer text-ink hover:underline flex items-center gap-1"
                >
                  <span>Outcome #{item.outcomeReceipt.receipt_id}</span>
                  <ExternalLink size={10} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Block 4: Spending Ledger Tape */}
      <section className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-ink-soft mb-1">
            <DollarSign size={14} aria-hidden="true" />
            <span>Pattern 04 · Spending Concentration</span>
          </div>
          <h2 className="font-display text-xl font-bold text-ink">
            Where the Money Went
          </h2>
          <p className="font-sans text-xs text-ink-soft mt-1">
            <strong>Finding:</strong> Out of <strong>₹{spending.total.toLocaleString('en-IN')}</strong> total spend, two camera bodies accounted for <strong>₹{spending.cameraTotal.toLocaleString('en-IN')} (~{Math.round(spending.cameraPercentage)}%)</strong>.
          </p>
        </div>

        <div className="bg-paper p-4 rounded-xs border border-rule font-mono text-xs space-y-2 max-w-lg">
          <div className="border-b border-dashed border-rule pb-2 text-[11px] uppercase tracking-wider text-ink-soft flex justify-between">
            <span>Item & Merchant</span>
            <span>Amount (INR)</span>
          </div>

          {spending.purchases.map(p => (
            <div
              key={p.receipt_id}
              onClick={() => openReceipt(p.receipt_id)}
              className="flex justify-between items-center py-1 hover:bg-slip px-1 rounded-xs cursor-pointer transition-colors"
            >
              <div>
                <span className="font-bold text-ink">{p.item}</span>
                <span className="text-ink-soft block text-[11px]">{p.merchant} ({p.city})</span>
              </div>
              <span className="font-bold text-stamp-red">
                ₹{p.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}

          <div className="pt-2 border-t-2 border-ink flex justify-between font-bold text-sm text-ink">
            <span>TOTAL INVESTED</span>
            <span>₹{spending.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </section>

      {/* Block 5: The Inner Voice */}
      <section className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-ink-soft mb-1">
            <MessageSquareQuote size={14} aria-hidden="true" />
            <span>Pattern 05 · The Inner Voice</span>
          </div>
          <h2 className="font-display text-xl font-bold text-ink">
            Six Notes, One Arc
          </h2>
          <p className="font-sans text-xs text-ink-soft mt-1">
            <strong>Finding:</strong> The first five notes were written in solitude after 22:00. The sixth and final note broke the pattern—written at <strong>08:15</strong> as a morning promise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {innerVoice.map(item => (
            <div
              key={item.receipt.receipt_id}
              onClick={() => openReceipt(item.receipt.receipt_id)}
              className="bg-paper p-4 rounded-xs border-l-4 border-stamp-red border-t border-r border-b border-rule cursor-pointer hover:shadow-xs transition-all space-y-2"
            >
              <div className="flex justify-between font-mono text-[11px] text-ink-soft">
                <span>Note 0{item.order}</span>
                <span>{item.dateLabel} · {item.timeLabel}</span>
              </div>
              <p className="font-display text-sm font-bold italic text-ink">
                "{item.receipt.personal_note}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
