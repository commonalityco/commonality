/* eslint-disable unicorn/no-null */
'use client';
import { Dependency, Package } from '@commonalityco/types';
import { Separator, Text, Tag, Label } from '@commonalityco/ui-design-system';

function DependencyName({ dependency }: { dependency: Dependency }) {
  return (
    <div className="mb-2 flex justify-between gap-3">
      <Text className="truncate  text-xs">{dependency.name}</Text>
      <Text className=" text-xs">{dependency.version}</Text>
    </div>
  );
}

export function DocumentationDetails({ pkg }: { pkg?: Package }) {
  if (!pkg) {
    return <p>No package</p>;
  }

  return (
    <div className="w-96 shrink-0 grow-0 basis-96">
      <div className="h-full overflow-auto">
        <div className="sticky top-0 h-6 bg-gradient-to-b from-white dark:from-zinc-900" />
        <div className="px-3 pb-3">
          <div className="px-3">
            <Label>Tags</Label>
            <div>
              {pkg?.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {pkg.tags.map((tag) => {
                    return (
                      <Tag key={tag} className="shrink-0">{`#${tag}`}</Tag>
                    );
                  })}
                </div>
              ) : (
                <Text className="text-xs">No tags</Text>
              )}
            </div>

            <Label>Owners</Label>
            <div>
              {pkg?.owners?.length ? (
                pkg.owners.map((owner) => {
                  return (
                    <Text className="mb-2 text-xs" key={owner}>
                      {owner}
                    </Text>
                  );
                })
              ) : (
                <Text className="text-xs">No owners</Text>
              )}
            </div>
          </div>
          {pkg.dependencies.length > 0 ? (
            <>
              <Separator className="my-6" />
              <div className="px-3">
                <Label className="font-mono">dependencies</Label>
                <div>
                  {pkg.dependencies.map((dep) => {
                    return <DependencyName key={dep.name} dependency={dep} />;
                  })}
                </div>
              </div>
            </>
          ) : null}
          {pkg.devDependencies.length > 0 ? (
            <>
              <Separator className="my-6" />
              <div className="px-3">
                <Label className="font-mono">devDependencies</Label>
                <div>
                  {pkg.devDependencies.map((dep) => {
                    return <DependencyName key={dep.name} dependency={dep} />;
                  })}
                </div>
              </div>
            </>
          ) : null}
          {pkg.peerDependencies.length > 0 ? (
            <>
              <Separator className="my-6" />
              <div className="px-3">
                <Label className="font-mono">peerDependencies</Label>
                <div>
                  {pkg.peerDependencies.map((dep) => {
                    return <DependencyName key={dep.name} dependency={dep} />;
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
