import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDataset } from '../../lib/dataset';
import { matchThemes } from '../../lib/dataset/chapters';
import { ArchiveFilters } from './ArchiveFilters';
import { ArchiveResults } from './ArchiveResults';
import { useReceipt } from '../../hooks/useReceipt';
import { SectionHeading } from '../../components/ui/SectionHeading';

export const ArchivePage: React.FC = () => {
  const dataset = useMemo(() => getDataset(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openReceipt } = useReceipt();

  const query = searchParams.get('q')?.toLowerCase().trim() || '';
  const selectedType = searchParams.get('type') || '';
  const selectedMonth = searchParams.get('month') || '';
  const selectedTheme = searchParams.get('theme') || '';
  const selectedCity = searchParams.get('city')?.toLowerCase() || '';
  const selectedSort = searchParams.get('sort') || 'oldest';

  // Filter receipts
  const filteredReceipts = useMemo(() => {
    let list = [...dataset.receipts];

    // 1. Text Search
    if (query) {
      list = list.filter(r => {
        const fullText = `${r.receipt_id} ${r.title} ${r.context} ${r.location} ${r.tags.join(' ')} ${
          r.type === 'message' ? (r as unknown as { text: string }).text : ''
        } ${r.type === 'search' ? (r as unknown as { query: string }).query : ''}`.toLowerCase();
        return fullText.includes(query);
      });
    }

    // 2. Type Filter
    if (selectedType) {
      list = list.filter(r => r.type === selectedType);
    }

    // 3. Month Filter
    if (selectedMonth) {
      const m = parseInt(selectedMonth, 10);
      list = list.filter(r => r.month === m);
    }

    // 4. Theme Filter
    if (selectedTheme) {
      list = list.filter(r => {
        const themes = matchThemes(r);
        return themes.includes(selectedTheme);
      });
    }

    // 5. City Filter
    if (selectedCity) {
      list = list.filter(r => r.normalizedCity.toLowerCase() === selectedCity);
    }

    // 6. Sort
    list.sort((a, b) => {
      if (selectedSort === 'newest') {
        return b.date.getTime() - a.date.getTime();
      }
      if (selectedSort === 'connected') {
        const aConn = (dataset.graph.neighbors.get(a.receipt_id) || []).length;
        const bConn = (dataset.graph.neighbors.get(b.receipt_id) || []).length;
        return bConn - aConn;
      }
      if (selectedSort === 'amount') {
        return (b.amount || 0) - (a.amount || 0);
      }
      // default: oldest
      return a.date.getTime() - b.date.getTime();
    });

    return list;
  }, [dataset, query, selectedType, selectedMonth, selectedTheme, selectedCity, selectedSort]);

  const handlePullThread = (receiptId: string) => {
    navigate(`/threads?focus=${receiptId}`);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title="The Archive"
        subtitle="Explore, filter, and inspect all 55 receipts from January to September 2025. Every purchase, search, track, place, and photo itemized in one ledger."
        badge="55 RECEIPTS"
      />

      <ArchiveFilters />

      <ArchiveResults
        receipts={filteredReceipts}
        onSelectReceipt={openReceipt}
        onPullThread={handlePullThread}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};
