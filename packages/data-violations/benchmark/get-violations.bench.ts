import { bench } from 'vitest';
import { getViolations } from '../src/get-violations';
import { Dependency, TagsData, ProjectConfig } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';

bench('get-violations - large graph', async () => {
  const largeDependencies: Dependency[] = Array.from(
    { length: 100 },
    (_, i) => ({
      version: `1.0.${i}`,
      type:
        i % 2 === 0 ? DependencyType.PRODUCTION : DependencyType.DEVELOPMENT,
      source: `pkg-${i}`,
      target: `pkg-${(i + 1) % 100}`,
    }),
  );

  const largeTagsData: TagsData[] = Array.from({ length: 100 }, (_, i) => ({
    packageName: `pkg-${i}`,
    tags: [['tag1', 'tag2', 'tag3'][Math.floor(Math.random() * 3)]],
  }));
  const largeConstraints: ProjectConfig['constraints'] = {
    tag1: {
      allow: ['tag1', 'tag2'],
      disallow: ['tag3'],
    },
    tag2: {
      disallow: ['tag2'],
    },
  };

  await getViolations({
    constraints: largeConstraints,
    dependencies: largeDependencies,
    tagsData: largeTagsData,
  });
});
