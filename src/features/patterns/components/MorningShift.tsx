import React from 'react';
import { motion } from 'motion/react';
import { SunMedium } from 'lucide-react';
import type { MorningShiftData } from '../../../types';

interface MorningShiftProps {
  morningShift: MorningShiftData;
}

export const MorningShift: React.FC<MorningShiftProps> = ({ morningShift }) => {
  return (
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
  );
};
