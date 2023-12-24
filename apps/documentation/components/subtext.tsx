export function Subtext({
  children,
  requirementLevel = 'optional',
}: {
  children?: React.ReactNode;
  requirementLevel?: 'optional' | 'required';
}) {
  return (
    <div className="flex flex-col gap-2 pt-2">
      {requirementLevel === 'required' ? (
        <span className="uppercase nx-text-primary-600 text-xs font-medium">
          {requirementLevel}
        </span>
      ) : undefined}
      <span className="font-medium">{children}</span>
    </div>
  );
}
