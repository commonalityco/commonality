import { Package } from '@commonalityco/types';
import { Separator, Heading, Text } from '@commonalityco/ui-design-system';
import { getIconForPackage } from '@commonalityco/utils-package';

export function DocumentationHeader({
  pkg,
  children,
}: {
  pkg: Package;
  children?: React.ReactNode;
}) {
  const IconForType = getIconForPackage(pkg);

  return (
    <div className="px-3 pt-3">
      <div className="flex flex-nowrap justify-between">
        <div className="flex h-9 items-center gap-2 px-3">
          <IconForType className="h-6 w-6" />
          <Heading size="sm" className="leading-none">
            {pkg?.name}
          </Heading>
          <Text className="font-mono leading-none">{pkg?.version}</Text>
        </div>
        <div>{children}</div>
      </div>

      <Separator className="mt-3" />
    </div>
  );
}
