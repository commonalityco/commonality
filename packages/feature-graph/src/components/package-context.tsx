import {
  Badge,
  Label,
  ScrollArea,
  Separator,
  cn,
} from '@commonalityco/ui-design-system';
import { Status } from '@commonalityco/utils-core';
import { GradientFade, getIconForPackage } from '@commonalityco/ui-core';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import { ConformanceResult } from '@commonalityco/utils-conformance';

function Row({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tems-center flex flex-nowrap justify-between gap-2">
      <dt className="text-muted-foreground">{title}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function PackageContext({
  pkg,
  checkResults,
  codeownersData,
  tagsData,
}: {
  pkg: Package;
  checkResults: ConformanceResult[];
  codeownersData: CodeownersData[];
  tagsData: TagsData[];
}) {
  const packageResults = checkResults.filter(
    (result) => result.package.name === pkg.name,
  );
  const tags = tagsData.find((tag) => tag.packageName === pkg.name)?.tags ?? [];
  const Icon = getIconForPackage(pkg.type);

  const codeowners =
    codeownersData.find((data) => data.packageName === pkg.name)?.codeowners ??
    [];

  return (
    <div className="flex h-full flex-col pt-4">
      <div className="mb-3 flex flex-nowrap items-center gap-3">
        <Icon className="h-8 w-8" />

        <p className="min-w-0 truncate text-base font-semibold">{pkg.name}</p>
      </div>
      <p className="text-muted-foreground">{pkg.description}</p>
      <ScrollArea className="h-full pr-4">
        <GradientFade placement="top" />
        <Label>Details</Label>
        <dl className="py-4">
          <Row title="Version">{pkg.version}</Row>

          <Separator className="my-3" />
          <Row title="Type">
            <div className="flex flex-nowrap items-center gap-2">
              <Icon className="h-4 w-4" />
              {pkg.type}
            </div>
          </Row>
          <Separator className="my-3" />
          <Row title="Codeowners">
            {codeowners.length > 0 ? (
              codeowners.map((codeowner) => (
                <Badge
                  variant="outline"
                  className="rounded-full"
                  key={codeowner}
                >
                  {codeowner}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">No codeowners</span>
            )}
          </Row>
          <Separator className="my-3" />
          <Row title="Tags">
            {tags.map((tag) => (
              <Badge variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </Row>
        </dl>
        <Label className="mb-2 inline-block">Conformance</Label>
        {packageResults.length > 0 ? (
          <div className="grid">
            {packageResults.map((result) => {
              return (
                <div
                  key={result.id}
                  className="mb-3 flex justify-between gap-3 border-b pb-3"
                >
                  <p>{result.message.message}</p>
                  <p
                    className={cn({
                      'text-destructive': result.status === Status.Fail,
                      'text-warning': result.status === Status.Warn,
                      'text-success': result.status === Status.Pass,
                    })}
                  >
                    {result.status}
                  </p>
                </div>
              );
            })}
          </div>
        ) : undefined}
        <GradientFade placement="bottom" />
      </ScrollArea>
    </div>
  );
}
