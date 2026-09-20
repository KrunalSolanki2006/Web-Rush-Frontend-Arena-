import React from 'react';
import { Compass, ExternalLink } from 'lucide-react';
import type { PlaceReceipt } from '../../../types';

interface PlacesTableProps {
  places: PlaceReceipt[];
  onOpenReceipt: (receiptId: string) => void;
}

export const PlacesTable: React.FC<PlacesTableProps> = ({ places, onOpenReceipt }) => {
  return (
    <div className="bg-slip border border-rule rounded-sm p-6 shadow-xs space-y-3">
      <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
        <Compass size={18} aria-hidden="true" />
        <span>Places Visited (Accessible Ledger)</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-paper border-b border-rule text-ink-soft uppercase tracking-wider">
              <th className="p-2.5">Place Name</th>
              <th className="p-2.5">Type</th>
              <th className="p-2.5">City / Region</th>
              <th className="p-2.5">Coordinates</th>
              <th className="p-2.5">Date Visited</th>
              <th className="p-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule/50">
            {places.map(p => (
              <tr
                key={p.receipt_id}
                data-testid={`map-table-row-${p.receipt_id}`}
                className="hover:bg-paper/60 transition-colors"
              >
                <td className="p-2.5 font-bold text-ink">{p.name}</td>
                <td className="p-2.5 text-ink-soft">{p.place_type}</td>
                <td className="p-2.5 text-ink">{p.city}</td>
                <td className="p-2.5 text-ink-soft">
                  {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                </td>
                <td className="p-2.5 text-ink-soft">{p.dateLabel}</td>
                <td className="p-2.5 text-right">
                  <button
                    onClick={() => onOpenReceipt(p.receipt_id)}
                    data-testid={`map-table-receipt-${p.receipt_id}`}
                    className="cursor-pointer text-stamp-red font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Receipt</span>
                    <ExternalLink size={11} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
