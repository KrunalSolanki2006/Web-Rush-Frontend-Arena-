import React from 'react';
import type { PhotoReceipt } from '../../types';

interface PhotoFrameProps {
  receipt: PhotoReceipt;
  className?: string;
}

/**
 * Derives deterministic color palette from tags.
 * Sunset -> warm amber
 * Rain -> grey-blue
 * Lake -> deep teal
 * Forest -> moss green
 * Monsoon -> slate
 * Family -> warm rose
 * Arts -> muted plum
 */
function getPaletteFromTags(tags: string[]): { bg: string; grad: string; accent: string } {
  const tagStr = tags.join(' ').toLowerCase();

  if (tagStr.includes('sunset') || tagStr.includes('dusk')) {
    return {
      bg: '#E88B52',
      grad: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
      accent: '#FFD166',
    };
  }
  if (tagStr.includes('rain') || tagStr.includes('night')) {
    return {
      bg: '#3D5A80',
      grad: 'linear-gradient(135deg, #293241 0%, #3D5A80 100%)',
      accent: '#98C1D9',
    };
  }
  if (tagStr.includes('lake')) {
    return {
      bg: '#2A9D8F',
      grad: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
      accent: '#E9C46A',
    };
  }
  if (tagStr.includes('forest') || tagStr.includes('nature')) {
    return {
      bg: '#4A7C59',
      grad: 'linear-gradient(135deg, #31572C 0%, #4F772D 100%)',
      accent: '#90A955',
    };
  }
  if (tagStr.includes('monsoon')) {
    return {
      bg: '#5C6B73',
      grad: 'linear-gradient(135deg, #3D5A80 0%, #5C6B73 100%)',
      accent: '#9DB4C0',
    };
  }
  if (tagStr.includes('family') || tagStr.includes('celebration')) {
    return {
      bg: '#B56576',
      grad: 'linear-gradient(135deg, #6D597A 0%, #B56576 100%)',
      accent: '#E56B6F',
    };
  }
  if (tagStr.includes('arts') || tagStr.includes('film')) {
    return {
      bg: '#6D597A',
      grad: 'linear-gradient(135deg, #355070 0%, #6D597A 100%)',
      accent: '#EAAC8B',
    };
  }

  return {
    bg: '#0F6E7A',
    grad: 'linear-gradient(135deg, #0A4E57 0%, #0F6E7A 100%)',
    accent: '#52B2BF',
  };
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({ receipt, className = '' }) => {
  const palette = getPaletteFromTags(receipt.tags);
  const is35mm = receipt.device_category === 'film';
  const isMirrorless = receipt.device_category === 'mirrorless';

  return (
    <div
      className={`relative overflow-hidden border border-ink/20 shadow-inner flex flex-col justify-between p-3 ${
        is35mm ? 'border-2 border-ink film-sprocket bg-ink text-paper' : 'rounded-sm text-white'
      } ${className}`}
      style={{
        background: is35mm ? '#1C1B18' : palette.grad,
        aspectRatio: is35mm ? '3/2' : isMirrorless ? '4/3' : '16/9',
      }}
      role="img"
      aria-label={`Visual frame for ${receipt.title} captured with ${receipt.device}`}
    >
      {/* Frame Header */}
      <div className="flex justify-between items-center text-[10px] font-mono tracking-wider opacity-85">
        <span className="uppercase">{receipt.device}</span>
        <span>FRAME #{receipt.photo_id.replace('PH', '')}</span>
      </div>

      {/* Frame Visual Motif */}
      <div className="my-auto text-center py-4">
        <div
          className="inline-block px-3 py-1 rounded-sm text-xs font-mono tracking-wide font-medium backdrop-blur-xs bg-black/30 border border-white/20"
          style={{ color: '#FFFFFF' }}
        >
          {receipt.title}
        </div>
        <div className="text-[10px] font-mono mt-1 opacity-80">
          {receipt.location}
        </div>
      </div>

      {/* Frame Footer */}
      <div className="flex justify-between items-center text-[9px] font-mono tracking-wider opacity-75">
        <span>{receipt.dateLabel}</span>
        <span>{receipt.timeLabel}</span>
      </div>
    </div>
  );
};
