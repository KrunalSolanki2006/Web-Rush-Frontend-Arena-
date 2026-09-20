import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDataset } from '../../lib/dataset';
import { getMomentReceiptIds } from '../../lib/graph';
import type { Edge, Moment, Receipt } from '../../types';

export function useThreadState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dataset = useMemo(() => getDataset(), []);

  const focusReceiptId = searchParams.get('focus') || 'R034'; // Default to Lonavala chain start
  const [showInferred, setShowInferred] = useState(true);
  const [minStrength, setMinStrength] = useState(0.85);

  const selectedReceiptIds = useMemo(() => {
    if (!focusReceiptId) return new Set<string>();
    const ids = getMomentReceiptIds(focusReceiptId, dataset.graph, showInferred);
    return new Set(ids);
  }, [focusReceiptId, dataset, showInferred]);

  const selectedMoment = useMemo<Moment | null>(() => {
    if (!focusReceiptId) return null;
    return (
      dataset.moments.find(m => m.receiptIds.includes(focusReceiptId)) || null
    );
  }, [focusReceiptId, dataset]);

  // Selected receipts in chronological order
  const selectedReceipts = useMemo<Receipt[]>(() => {
    return dataset.receipts.filter(r => selectedReceiptIds.has(r.receipt_id));
  }, [dataset, selectedReceiptIds]);

  // Active edges between selected receipts
  const activeEdges = useMemo<Edge[]>(() => {
    return dataset.graph.edges.filter(
      e =>
        selectedReceiptIds.has(e.fromReceiptId) &&
        selectedReceiptIds.has(e.toReceiptId) &&
        (showInferred || e.origin === 'confirmed') &&
        e.strength >= minStrength
    );
  }, [dataset, selectedReceiptIds, showInferred, minStrength]);

  const setFocus = (receiptId: string | null) => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);
        if (receiptId) {
          next.set('focus', receiptId);
        } else {
          next.delete('focus');
        }
        return next;
      },
      { replace: true }
    );
  };

  // Keyboard shortcut Esc to clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Clear focus
        setFocus(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return {
    dataset,
    focusReceiptId,
    setFocus,
    showInferred,
    setShowInferred,
    minStrength,
    setMinStrength,
    selectedReceiptIds,
    selectedMoment,
    selectedReceipts,
    activeEdges,
  };
}
