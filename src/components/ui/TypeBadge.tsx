import React from 'react';
import type { ReceiptType } from '../../types';
import { RECEIPT_TYPE_META } from '../../features/receipts/receiptTypeMeta';

interface TypeBadgeProps {
  type: ReceiptType;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  showLabel = true,
}) => {
  const meta = RECEIPT_TYPE_META[type];
  const Icon = meta.icon;

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors ${
        isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
      }`}
      style={{
        backgroundColor: meta.bgTint,
        color: meta.colorHex,
        border: `1px solid ${meta.borderColor}30`,
      }}
      title={meta.label}
    >
      <Icon size={isSmall ? 12 : 14} aria-hidden="true" />
      {showLabel && <span>{meta.label}</span>}
    </span>
  );
};
