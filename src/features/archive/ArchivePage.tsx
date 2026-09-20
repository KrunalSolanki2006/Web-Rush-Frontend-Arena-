import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDataset } from '../../hooks/useDataset';
import { useReceipt } from '../../hooks/useReceipt';
import { ArchiveFilterService } from '../../services';
import type { ReceiptType } from '../../types';
import { ArchiveFilters } from './ArchiveFilters';
import { ArchiveResults } from './ArchiveResults';
import { SectionHeading } from '../../components/ui/SectionHeading';

export const ArchivePage: React.FC = () => {
  const { receipts, graph } = useDataset();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openReceipt } = useReceipt();

  const query = searchParams.get('q') || '';
  const selectedType = (searchParams.get('type') || '') as ReceiptType | '';
  const selectedMonthStr = searchParams.get('month');
  const selectedMonth = selectedMonthStr ? parseInt(selectedMonthStr, 10) : null;
  const selectedTheme = searchParams.get('theme') || '';
  const selectedCity = searchParams.get('city') || '';
  const selectedSort = (searchParams.get('sort') || 'oldest') as 'oldest' | 'newest' | 'connected' | 'amount';
  const connectedOnly = searchParams.get('connected') === 'true';

  // Filter receipts using centralized ArchiveFilterService
  const filteredReceipts = useMemo(() => {
    return ArchiveFilterService.filterReceipts(
      receipts,
      {
        query,
        type: selectedType,
        month: selectedMonth,
        theme: selectedTheme,
        city: selectedCity,
        connectedOnly,
        sort: selectedSort,
      },
      graph
    );
  }, [receipts, graph, query, selectedType, selectedMonth, selectedTheme, selectedCity, connectedOnly, selectedSort]);

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
