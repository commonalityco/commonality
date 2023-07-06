import { Tag, Label } from '@commonalityco/ui-design-system';
import { Constraint } from '@commonalityco/types';

export function ConstraintDetails({ constraint }: { constraint: Constraint }) {
  return (
    <div className="flex w-full flex-col gap-4">
      {'allow' in constraint && (
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-1">
            <Label className="text-xs">Allow direct dependencies tagged:</Label>
          </div>
          <div className="flex w-full flex-wrap gap-1">
            {constraint.allow.map((tag) =>
              tag === '*' ? (
                <p className="text-xs" key={tag}>
                  Any tag or no tags
                </p>
              ) : (
                <Tag
                  use="secondary"
                  key={tag}
                  className="block min-w-0"
                >{`#${tag}`}</Tag>
              )
            )}
          </div>
        </div>
      )}
      {'disallow' in constraint && (
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-1">
            <Label className="text-xs">Disallow any dependency tagged:</Label>
          </div>
          <div className="flex w-full flex-wrap gap-1">
            {constraint.disallow.map((tag) => (
              <Tag
                use="secondary"
                key={tag}
                className="block min-w-0"
              >{`#${tag}`}</Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
