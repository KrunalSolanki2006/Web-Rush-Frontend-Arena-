export interface ChapterEditorial {
  month: number;
  monthName: string;
  title: string;
  persona: string;
  blurb: string;
  signal: string;
}

export const CHAPTER_EDITORIALS: Record<number, ChapterEditorial> = {
  1: {
    month: 1,
    monthName: 'Jan',
    title: 'The Restart',
    persona: 'The Restarter',
    blurb: 'You began in the rain on Carter Road with late-night coffee and music. The very next morning you bought running shoes and made a quiet resolve: start running again. By mid-month you were running the Marine Drive 5K at sunset.',
    signal: 'Night-city listening, cafe, rain photo; running shoes and "Start running again"; sunset-run search; Marine Drive 5K',
  },
  2: {
    month: 2,
    monthName: 'Feb',
    title: 'Golden Hour',
    persona: 'The Dreamer',
    blurb: 'Evenings softened into sunsets along Marine Drive with Petit Biscuit playing. On Valentine’s evening you watched Before Sunrise at an indie film night, then wandered to a bookstore to buy a paperback travel journal. The idea of going somewhere took root.',
    signal: 'Sunset Lover at Marine Drive; Before Sunrise at Indie Film Night; a paperback travel journal bought that night',
  },
  3: {
    month: 3,
    monthName: 'Mar',
    title: 'The Escape',
    persona: 'The Wanderer',
    blurb: 'Late at night you searched Udaipur itineraries; twenty-two minutes later you wrote: "I need a change of scenery." You took the train, found Lake Pichola at dusk, scribbled in a handmade notebook at Jheel’s, and sent Aarav the sunset shot.',
    signal: 'Busiest month (11 receipts); itinerary search then "I need a change of scenery"; Lake Pichola; notebook; Aarav asks for the photo',
  },
  4: {
    month: 4,
    monthName: 'Apr',
    title: 'The Exhale',
    persona: 'The Reflector',
    blurb: 'The quietest month of the year. Late one night Holocene played and you noted: "Things are finally slowing down." Two weeks later you gathered at a cousin’s engagement, capturing a crowded family table on your phone camera.',
    signal: 'Quietest month (4 receipts); Holocene at 23:05; "Things are finally slowing down."; family celebration',
  },
  5: {
    month: 5,
    monthName: 'May',
    title: 'The Lens',
    persona: 'The Photographer',
    blurb: 'Thirty-five minutes after researching mirrorless cameras, you committed to one for ₹58,900. The next dawn at 06:15 you were deep in Sanjay Gandhi National Park, photographing forest trails with Bloom playing in your ears.',
    signal: 'Camera search 12:30 → purchase 13:05 (₹58,900); next morning 06:15 national park trail; first mirrorless photo',
  },
  6: {
    month: 6,
    monthName: 'Jun',
    title: 'Solo',
    persona: 'The Explorer',
    blurb: 'Walter Mitty stirred something on a Sunday night. You searched solo road trips, packed for Lonavala by dawn, sat by Pawna Lake with a fresh camping brew, and admitted to yourself: "Maybe I should travel more often."',
    signal: 'Walter Mitty → road-trip search → Lonavala → Pawna Lake → camping kit → "Maybe I should travel more often."',
  },
  7: {
    month: 7,
    monthName: 'Jul',
    title: 'Company',
    persona: 'The Joiner',
    blurb: 'Aarav asked if you wanted a road trip. The following morning you were walking through the Mumbai monsoon with a photography club at Sion Fort, capturing ancient stone walls slick with rain.',
    signal: 'Aarav\'s message; next morning a monsoon photo walk with the club at Sion Fort',
  },
  8: {
    month: 8,
    monthName: 'Aug',
    title: 'Analog',
    persona: 'The Craftsperson',
    blurb: 'Curiosity shifted from digital precision to analog grit. An evening query on film led to buying a vintage 35mm camera. Days later you joined a photography meetup, learning to read Kala Ghoda’s shadows frame by frame.',
    signal: 'Film-photography search; 35mm camera next day (₹8,200); meetup; Kala Ghoda shadows',
  },
  9: {
    month: 9,
    monthName: 'Sep',
    title: 'One a Day',
    persona: 'The Noticer',
    blurb: 'Space Song played past midnight, followed by a reminder: "Keep the quiet moments." Wim Wenders’ Perfect Days inspired a daily journal search, leading to a 30-day challenge and your morning promise: "One photo a day."',
    signal: 'Space Song and quiet note; Perfect Days; photo-journal search; 30-day challenge; "One photo a day."',
  },
};
