import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Manages active receipt in URL query params (?r=RXXX).
 */
export function useReceipt() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeReceiptId = searchParams.get('r');

  const openReceipt = useCallback(
    (receiptId: string) => {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev);
          next.set('r', receiptId);
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const closeReceipt = useCallback(() => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);
        next.delete('r');
        return next;
      },
      { replace: false }
    );
  }, [setSearchParams]);

  return {
    activeReceiptId,
    isOpen: Boolean(activeReceiptId),
    openReceipt,
    closeReceipt,
  };
}
