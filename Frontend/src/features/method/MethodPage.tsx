import React from 'react';
import { METHOD_CONTENT } from '../../data/editorial/method';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Info, CheckCircle2, HelpCircle, ShieldAlert } from 'lucide-react';

export const MethodPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <SectionHeading
        title={METHOD_CONTENT.title}
        subtitle={METHOD_CONTENT.subtitle}
        badge="TRANSPARENCY & PROVENANCE"
      />

      {/* Dataset Provenance */}
      <section className="bg-slip border border-rule rounded-sm p-6 md:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-ink-soft font-mono text-xs uppercase tracking-wider">
          <Info size={15} aria-hidden="true" />
          <span>{METHOD_CONTENT.datasetProvenance.heading}</span>
        </div>
        <p className="font-sans text-sm md:text-base text-ink leading-relaxed">
          {METHOD_CONTENT.datasetProvenance.body}
        </p>
      </section>

      {/* Confirmed vs. Inferred Links */}
      <section className="bg-slip border border-rule rounded-sm p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            {METHOD_CONTENT.confirmedVsInferred.heading}
          </h2>
          <p className="font-sans text-xs text-ink-soft mt-1">
            How connections are distinguished visually, semantically, and computationally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confirmed */}
          <div className="bg-paper p-5 rounded-xs border border-rule space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ink">
              <CheckCircle2 size={16} className="text-ink" aria-hidden="true" />
              <span>Confirmed Links (29)</span>
            </div>
            <p className="font-sans text-xs text-ink leading-relaxed">
              {METHOD_CONTENT.confirmedVsInferred.confirmedBody}
            </p>
            <div className="pt-2 font-mono text-[11px] text-ink-soft">
              Visual: <strong>Solid Ink Line (#1C1B18)</strong>
            </div>
          </div>

          {/* Inferred */}
          <div className="bg-paper p-5 rounded-xs border border-dashed border-rule space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ink-soft">
              <HelpCircle size={16} className="text-ink-soft" aria-hidden="true" />
              <span>Inferred Links (14)</span>
            </div>
            <p className="font-sans text-xs text-ink-soft leading-relaxed">
              {METHOD_CONTENT.confirmedVsInferred.inferredBody}
            </p>
            <div className="pt-2 font-mono text-[11px] text-ink-soft">
              Visual: <strong>Dashed Line (#55514A)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Data Traps Handled */}
      <section className="bg-slip border border-rule rounded-sm p-6 md:p-8 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-bold text-ink">
          Data Traps Handled Explicitly (§2.4)
        </h2>

        <div className="space-y-4 pt-2">
          {METHOD_CONTENT.dataTraps.map((trap, idx) => (
            <div
              key={idx}
              className="bg-paper p-4 rounded-xs border border-rule space-y-1.5"
            >
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stamp-red">
                {trap.name}
              </h3>
              <p className="font-sans text-xs text-ink">
                <strong className="text-ink-soft">The Trap:</strong> {trap.trap}
              </p>
              <p className="font-sans text-xs text-ink">
                <strong className="text-ink-soft">The Solution:</strong> {trap.solution}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Known Limitations */}
      <section className="bg-paper-deep/50 border border-rule rounded-sm p-6 space-y-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-ink-soft">
          <ShieldAlert size={15} aria-hidden="true" />
          <span>Known Limitations</span>
        </div>
        <ul className="list-disc list-inside font-sans text-xs text-ink space-y-1 leading-relaxed">
          {METHOD_CONTENT.limitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};
