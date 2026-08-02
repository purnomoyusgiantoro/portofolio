import React from 'react';

interface SkeletonCardProps {
  /** Height of the card. Defaults to 300px */
  height?: string;
  /** Whether it's a wide (col-span-2) card */
  wide?: boolean;
}

/**
 * Premium loading skeleton card with pulse animation.
 * Used while data is being fetched from Supabase.
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = '300px', wide = false }) => {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-white/50 border border-outline-variant/30 ${wide ? 'md:col-span-2' : ''}`}
      style={{ height }}
    >
      {/* Image skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-variant/40 via-surface-variant/20 to-surface-variant/40 animate-pulse" />

      {/* Shimmer effect */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }}
      />

      {/* Bottom content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div className="h-3 w-24 bg-black/5 rounded-full animate-pulse" />
        <div className="h-5 w-48 bg-black/8 rounded-full animate-pulse" />
        <div className="h-3 w-36 bg-black/5 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

/**
 * Grid of skeleton cards for loading states.
 */
export const SkeletonGrid: React.FC<{ count?: number; type?: 'gallery' | 'card' }> = ({
  count = 6,
  type = 'card',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${type === 'gallery' ? 'auto-rows-[300px]' : ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard
          key={i}
          wide={type === 'gallery' && i % 5 === 0}
          height={type === 'card' ? 'auto' : '300px'}
        />
      ))}
    </div>
  );
};
