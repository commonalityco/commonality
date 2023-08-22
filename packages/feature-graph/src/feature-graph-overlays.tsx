'use client';

export function FeatureGraphOverlays({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="relative z-20">{children}</div>;
}

export default FeatureGraphOverlays;
