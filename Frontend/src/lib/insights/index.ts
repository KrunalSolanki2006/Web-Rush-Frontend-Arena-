import type {
  InnerVoiceItem,
  IntentActionLag,
  MorningShiftData,
  NoteReceipt,
  PurchaseReceipt,
  SearchReceipt,
  SpendingBreakdown,
} from '../../types';
import { humanizeDuration } from '../time';
import type { Dataset } from '../dataset';

export function computeIntentActionLags(dataset: Dataset): IntentActionLag[] {
  const searchConnections = dataset.graph.confirmedEdges.filter(e =>
    e.connectionType.startsWith('search_')
  );

  const lags: IntentActionLag[] = [];

  for (const edge of searchConnections) {
    const searchR = dataset.receiptsMap.get(edge.fromReceiptId);
    const outcomeR = dataset.receiptsMap.get(edge.toReceiptId);

    if (searchR && outcomeR && searchR.type === 'search') {
      const lagMs = outcomeR.date.getTime() - searchR.date.getTime();
      let hypothesis = 'Routine action follow-up';

      if (searchR.receipt_id === 'R029' && outcomeR.receipt_id === 'R030') {
        hypothesis = 'Committed to mirrorless camera purchase within 35 minutes of research';
      } else if (searchR.receipt_id === 'R022' && outcomeR.receipt_id === 'R023') {
        hypothesis = 'Found quiet cafe in Udaipur and arrived 50 minutes later';
      } else if (searchR.receipt_id === 'R045' && outcomeR.receipt_id === 'R046') {
        hypothesis = 'Researched film photography and purchased 35mm camera the next morning';
      } else if (searchR.receipt_id === 'R053' && outcomeR.receipt_id === 'R054') {
        hypothesis = 'Researched daily photo journal and committed to 30-day challenge the next morning';
      } else if (searchR.receipt_id === 'R035' && outcomeR.receipt_id === 'R036') {
        hypothesis = 'Solo road trip researched 5 days ahead of weekend departure';
      } else if (searchR.receipt_id === 'R006' && outcomeR.receipt_id === 'R007') {
        hypothesis = 'Sunset running routes search planned nearly 6 days before Marine Drive 5K';
      } else if (searchR.receipt_id === 'R014' && outcomeR.receipt_id === 'R016') {
        hypothesis = 'Udaipur itinerary researched 11 days before taking the train';
      }

      lags.push({
        searchReceipt: searchR as SearchReceipt,
        outcomeReceipt: outcomeR,
        lagMs,
        lagFormatted: humanizeDuration(lagMs),
        hypothesis,
      });
    }
  }

  // Sort shortest to longest lag
  return lags.sort((a, b) => a.lagMs - b.lagMs);
}

export function computeSpendingBreakdown(dataset: Dataset): SpendingBreakdown {
  const purchases = dataset.receipts.filter(r => r.type === 'purchase') as PurchaseReceipt[];
  const total = dataset.purchasesTotal;

  const mirrorless = purchases.find(p => p.receipt_id === 'R030');
  const film = purchases.find(p => p.receipt_id === 'R046');

  const cameraTotal = (mirrorless?.amount || 0) + (film?.amount || 0);
  const cameraPercentage = total > 0 ? (cameraTotal / total) * 100 : 0;
  const mirrorlessPercentage = total > 0 ? ((mirrorless?.amount || 0) / total) * 100 : 0;

  return {
    total,
    currency: 'INR',
    purchases: purchases.sort((a, b) => b.amount - a.amount),
    cameraTotal,
    cameraPercentage,
    mirrorlessPercentage,
  };
}

export function computeMorningShift(dataset: Dataset): MorningShiftData {
  const chaptersData = dataset.chapters.map(ch => {
    const total = ch.receipts.length;
    const morningCount = ch.stats.timeOfDayCounts.morning || 0;
    const nightCount = ch.stats.timeOfDayCounts.night || 0;

    return {
      month: ch.month,
      monthName: ch.monthName,
      morningPercentage: total > 0 ? (morningCount / total) * 100 : 0,
      nightPercentage: total > 0 ? (nightCount / total) * 100 : 0,
      bands: ch.stats.timeOfDayCounts,
      total,
    };
  });

  // Jan-Feb counts
  const janFebReceipts = dataset.receipts.filter(r => r.month === 1 || r.month === 2);
  const janFebMorning = janFebReceipts.filter(r => r.timeOfDay === 'morning').length;

  // May-Jul counts
  const mayJulReceipts = dataset.receipts.filter(r => r.month >= 5 && r.month <= 7);
  const mayJulMorning = mayJulReceipts.filter(r => r.timeOfDay === 'morning').length;

  return {
    chapters: chaptersData,
    janFebMorningRatio: `${janFebMorning} of ${janFebReceipts.length} receipts`,
    mayJulMorningRatio: `${mayJulMorning} of ${mayJulReceipts.length} receipts`,
  };
}

export function computeInnerVoice(dataset: Dataset): InnerVoiceItem[] {
  const notes = dataset.receipts.filter(r => r.type === 'note') as NoteReceipt[];
  const sorted = [...notes].sort((a, b) => a.date.getTime() - b.date.getTime());

  return sorted.map((r, idx) => ({
    receipt: r,
    order: idx + 1,
    timeLabel: r.timeLabel,
    dateLabel: r.dateLabel,
    isNight: r.timeOfDay === 'night',
  }));
}
