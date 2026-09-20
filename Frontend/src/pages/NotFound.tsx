import React from 'react';
import { Link } from 'react-router-dom';
import { Barcode } from '../components/ui/Barcode';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="bg-slip border border-rule p-8 max-w-md w-full rounded-sm shadow-md text-center perforated-edge space-y-4">
        <div className="border-b border-dashed border-rule pb-3">
          <span className="font-mono text-xs font-bold text-stamp-red uppercase tracking-widest">
            * 404 RECEIPT *
          </span>
          <h1 className="font-display text-3xl font-bold text-ink mt-1">
            ITEM NOT FOUND
          </h1>
        </div>

        <p className="font-sans text-sm text-ink-soft leading-relaxed">
          The requested receipt, thread, or ledger page does not exist in this nine-month digital archive.
        </p>

        <div className="py-2">
          <Barcode receiptId="R404_NOT_FOUND" height={18} />
        </div>

        <div className="pt-3 border-t border-dashed border-rule flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-ink-soft transition-colors"
          >
            <Home size={14} aria-hidden="true" />
            <span>Return to Cover</span>
          </Link>
          <Link
            to="/archive"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-paper border border-rule text-ink font-mono text-xs uppercase font-bold tracking-wider rounded-xs hover:bg-paper-deep transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Browse Archive</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
