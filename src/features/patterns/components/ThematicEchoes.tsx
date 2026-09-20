import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import type { Chapter } from '../../../types';

interface ThematicEchoesProps {
  chapters: Chapter[];
  themes: readonly string[];
  themeMatrix: Record<string, number[]>;
}

export const ThematicEchoes: React.FC<ThematicEchoesProps> = ({
  chapters,
  themes,
  themeMatrix,
}) => {
  return (
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
              {chapters.map(ch => (
                <th key={ch.month} className="py-2 px-3 text-center">
                  {ch.monthName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-rule/40">
            {themes.map(theme => (
              <tr key={theme} className="hover:bg-paper/60 transition-colors">
                <td className="py-2.5 pr-4 font-bold capitalize text-ink">
                  {theme}
                </td>
                {chapters.map(ch => {
                  const count = themeMatrix[theme]?.[ch.month - 1] || 0;
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
  );
};
