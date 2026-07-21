interface SkeletonProps {
  className?: string;
}

/** A single shimmer placeholder block. Compose several to mirror real layout. */
export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded bg-surface-2 ${className}`}
    />
  );
}
