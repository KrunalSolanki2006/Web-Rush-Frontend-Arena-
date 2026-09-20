import type { Chapter, ChapterStats, Moment, NoteReceipt, Receipt, ReceiptType, TimeOfDayBand } from '../../types';
import { CHAPTER_EDITORIALS } from '../../data/editorial/chapters';
import { formatMonthName } from '../time';

const THEME_KEYWORDS: Record<string, string[]> = {
  water: ['rain', 'sea', 'lake', 'monsoon'],
  light: ['sunset', 'dusk', 'morning'],
  movement: ['running', 'roadtrip', 'trip', 'adventure'],
  stillness: ['reflection', 'calm', 'quiet', 'slow_life', 'late_night'],
  seeing: ['photography', 'photo', 'camera', 'film'],
  writing: ['journal', 'writing', 'notebook'],
  company: ['community', 'friend', 'family', 'celebration'],
};

export function matchThemes(receipt: Receipt): string[] {
  const matched = new Set<string>();
  const text = `${receipt.tags.join(' ')} ${receipt.title} ${receipt.location} ${receipt.context}`.toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      matched.add(theme);
    }
  }

  return Array.from(matched);
}

export function buildChapters(receipts: Receipt[], moments: Moment[]): Chapter[] {
  const chapters: Chapter[] = [];

  for (let month = 1; month <= 9; month++) {
    const chapterReceipts = receipts.filter(r => r.month === month);
    const chapterMoments = moments.filter(m => m.chapterMonth === month);
    const editorial = CHAPTER_EDITORIALS[month];

    const typeCounts: Record<ReceiptType, number> = {
      music: 0,
      movie: 0,
      place: 0,
      purchase: 0,
      photo: 0,
      message: 0,
      search: 0,
      event: 0,
      note: 0,
    };

    const timeOfDayCounts: Record<TimeOfDayBand, number> = {
      night: 0,
      morning: 0,
      afternoon: 0,
      evening: 0,
    };

    let totalSpend = 0;
    let photoCount = 0;
    const photoDevices: Record<string, number> = {};
    const themeCounts: Record<string, number> = {};
    const citySet = new Set<string>();

    let innerVoice: NoteReceipt | undefined;

    for (const r of chapterReceipts) {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
      timeOfDayCounts[r.timeOfDay] = (timeOfDayCounts[r.timeOfDay] || 0) + 1;

      if (r.type === 'purchase' && r.amount) {
        totalSpend += r.amount;
      }
      if (r.type === 'photo') {
        photoCount++;
        const device = r.device || 'Unknown';
        photoDevices[device] = (photoDevices[device] || 0) + 1;
      }
      if (r.type === 'note') {
        innerVoice = r as NoteReceipt;
      }

      if (r.normalizedCity && r.normalizedCity !== 'Unknown') {
        citySet.add(r.normalizedCity);
      }

      const themes = matchThemes(r);
      for (const t of themes) {
        themeCounts[t] = (themeCounts[t] || 0) + 1;
      }
    }

    const topThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const stats: ChapterStats = {
      receiptCount: chapterReceipts.length,
      typeCounts,
      timeOfDayCounts,
      totalSpend,
      photoCount,
      photoDevices,
      topThemes,
      cities: Array.from(citySet),
    };

    let previousChapterDiff: string | undefined;
    if (month === 2) previousChapterDiff = 'Shifted from midnight runs to sunset walks along Marine Drive.';
    else if (month === 3) previousChapterDiff = 'Escaped Mumbai for Udaipur; highest activity month with 11 receipts.';
    else if (month === 4) previousChapterDiff = 'Pace dramatically slowed; lowest activity month with 4 reflective moments.';
    else if (month === 5) previousChapterDiff = 'Invested ₹58,900 in mirrorless camera; morning hours jumped to 60%.';
    else if (month === 6) previousChapterDiff = 'First solo road trip into Lonavala and Pawna Lake.';
    else if (month === 7) previousChapterDiff = 'Reconnected with photography club for monsoon heritage walk.';
    else if (month === 8) previousChapterDiff = 'Turned to analog 35mm film photography and street shadows in Kala Ghoda.';
    else if (month === 9) previousChapterDiff = 'Committed to 30-day challenge: "One photo a day."';

    chapters.push({
      month,
      monthName: formatMonthName(month),
      year: 2025,
      title: editorial?.title || `Chapter ${month}`,
      persona: editorial?.persona || 'The Traveler',
      blurb: editorial?.blurb || '',
      signal: editorial?.signal || '',
      receipts: chapterReceipts,
      moments: chapterMoments,
      innerVoice,
      stats,
      previousChapterDiff,
    });
  }

  return chapters;
}
