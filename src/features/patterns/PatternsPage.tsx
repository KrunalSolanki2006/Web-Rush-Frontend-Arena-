import React from 'react';
import { useDataset } from '../../hooks/useDataset';
import { useReceipt } from '../../hooks/useReceipt';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { ThematicEchoes } from './components/ThematicEchoes';
import { MorningShift } from './components/MorningShift';
import { IntentActionLags } from './components/IntentActionLags';
import { SpendingLedger } from './components/SpendingLedger';
import { InnerVoiceArc } from './components/InnerVoiceArc';

export const PatternsPage: React.FC = () => {
  const { insights, chapters } = useDataset();
  const { openReceipt } = useReceipt();

  const lags = insights.getIntentActionLags();
  const spending = insights.getSpendingBreakdown();
  const morningShift = insights.getMorningShift();
  const innerVoice = insights.getInnerVoice();
  const { matrix: themeMatrix, themes } = insights.getThemeMatrix();

  return (
    <div className="space-y-10">
      <SectionHeading
        title="Patterns & Discoveries"
        subtitle="Computed insights across 55 receipts. Behavioral shifts, intent-to-action lags, spending distribution, and the quiet rhythm of inner voice reflections."
        badge="COMPUTED INSIGHTS"
      />

      {/* Block 1: Theme Recurrence Grid */}
      <ThematicEchoes
        chapters={chapters}
        themes={themes}
        themeMatrix={themeMatrix}
      />

      {/* Block 2: The Morning Shift */}
      <MorningShift morningShift={morningShift} />

      {/* Block 3: Intent-to-Action Lag */}
      <IntentActionLags lags={lags} onOpenReceipt={openReceipt} />

      {/* Block 4: Spending Ledger Tape */}
      <SpendingLedger spending={spending} onOpenReceipt={openReceipt} />

      {/* Block 5: The Inner Voice */}
      <InnerVoiceArc innerVoice={innerVoice} onOpenReceipt={openReceipt} />
    </div>
  );
};
