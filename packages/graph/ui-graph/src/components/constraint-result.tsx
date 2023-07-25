import { Constraint, Violation } from '@commonalityco/types';
import {
  Label,
  Badge,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@commonalityco/ui-design-system';
import { Info } from 'lucide-react';

export function TagDetails({
  label,
  helpText,
  appliedTo,
}: {
  label: string;
  helpText: string;
  appliedTo?: string[] | '*';
}) {
  const getFoundContent = () => {
    if (appliedTo === '*') {
      return <p className="text-xs">All packages</p>;
    }
    if (!appliedTo?.length) {
      return <p className="text-xs">No tags found</p>;
    }

    return appliedTo?.map((tag) => (
      <Badge
        key={tag}
        variant="secondary"
        className="block min-w-0"
      >{`#${tag}`}</Badge>
    ));
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Label className="text-xs">{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger aria-label="Learn more">
              <Info className="text-muted-foreground h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent>{helpText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex w-full flex-wrap gap-1">{getFoundContent()}</div>
    </div>
  );
}

export function ConstraintResult({
  constraint,
  violation,
}: {
  constraint: Constraint;
  violation?: Violation;
}) {
  return (
    <div className="space-y-3">
      {'allow' in constraint && (
        <TagDetails
          label="Allowed"
          appliedTo={constraint.allow}
          helpText="Direct dependencies must have these tags"
        />
      )}
      {'disallow' in constraint && (
        <TagDetails
          label="Disallowed"
          appliedTo={constraint.disallow}
          helpText="Direct or indirect dependencies cannot have these tags"
        />
      )}
      {violation ? (
        <TagDetails
          label="Found"
          appliedTo={violation.found}
          helpText="These tags were found in the package's configuration"
        />
      ) : null}
    </div>
  );
}
