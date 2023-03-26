'use client';

import * as DescriptionList from '@commonalityco/ui-description-list';
import { Dependency, Package } from '@commonalityco/types';
import { Tag } from '@commonalityco/ui-tag';
import { Divider } from '@commonalityco/ui-divider';

import { Text } from '@commonalityco/ui-text';

function DependencyName({ dependency }: { dependency: Dependency }) {
  return (
    <div className="mb-2 flex justify-between gap-3">
      <Text className="truncate font-mono text-xs">{dependency.name}</Text>
      <Text className="font-mono text-xs">{dependency.version}</Text>
    </div>
  );
}

function PackageDetailsPanel({ pkg }: { pkg?: Package }) {
  if (!pkg) {
    return <p>No package</p>;
  }

  return (
    <div className="w-96 shrink-0 grow-0 basis-96">
      <div className="h-full overflow-auto">
        <div className="sticky top-0 h-4 bg-gradient-to-b from-white dark:from-zinc-900" />
        <DescriptionList.Root className="ob-3 px-3">
          <DescriptionList.Term>Tags</DescriptionList.Term>
          <DescriptionList.Details>
            {pkg?.tags?.length
              ? pkg.tags.map((tag) => {
                  return <Tag key={tag}>{`#${tag}`}</Tag>;
                })
              : 'No tags'}
          </DescriptionList.Details>

          <DescriptionList.Term>Owners</DescriptionList.Term>
          <DescriptionList.Details>
            {pkg?.owners?.length
              ? pkg.owners.map((owner) => {
                  return owner;
                })
              : 'No owners'}
          </DescriptionList.Details>

          {pkg.dependencies.length ? (
            <>
              <Divider className="my-3" />
              <DescriptionList.Term className="font-mono">
                dependencies
              </DescriptionList.Term>
              {pkg.dependencies.map((dep) => {
                return <DependencyName key={dep.name} dependency={dep} />;
              })}
            </>
          ) : null}
          {pkg.devDependencies.length ? (
            <>
              <Divider className="my-3" />
              <DescriptionList.Term className="font-mono">
                devDependencies
              </DescriptionList.Term>
              {pkg.devDependencies.map((dep) => {
                return <DependencyName key={dep.name} dependency={dep} />;
              })}
            </>
          ) : null}
          {pkg.peerDependencies.length ? (
            <>
              <Divider className="my-3" />
              <DescriptionList.Term className="font-mono">
                peerDependencies
              </DescriptionList.Term>
              {pkg.peerDependencies.map((dep) => {
                return <DependencyName key={dep.name} dependency={dep} />;
              })}
            </>
          ) : null}
        </DescriptionList.Root>
      </div>
    </div>
  );
}

export default PackageDetailsPanel;
