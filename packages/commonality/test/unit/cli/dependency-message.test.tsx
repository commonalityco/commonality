import React from 'react';
import { DependencyType, PackageType } from '@commonalityco/utils-core';
import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import { DependencyMessage } from '../../../src/cli/commands/constrain/dependency-message.js';
import stripAnsi from 'strip-ansi';

describe('DependencyMessage', () => {
  it('should render correctly when isValid is true', () => {
    const { lastFrame } = render(
      <DependencyMessage
        isValid={true}
        type={DependencyType.DEVELOPMENT}
        targetPkg={{
          name: 'test-package',
          path: '/path/to/test-package',
          type: PackageType.NODE,
          version: '1.0.0',
        }}
        filter={'*'}
        constraint={{ allow: '*' }}
      />,
    );

    const result = stripAnsi(lastFrame() ?? '');

    expect(result).toMatchInlineSnapshot(`
      "↳ pass All packages → test-package development
      │      Allowed: All packages
      │"
    `);
  });

  it('should render correctly when isValid is false and violation is found', () => {
    const { lastFrame } = render(
      <DependencyMessage
        isValid={false}
        type={DependencyType.DEVELOPMENT}
        targetPkg={{
          name: 'test-package',
          path: '/path/to/test-package',
          type: PackageType.NODE,
          version: '1.0.0',
        }}
        filter={'tag-one'}
        constraint={{ disallow: '*' }}
        violation={{
          found: ['tag-one'],
          sourcePackageName: 'source-package',
          targetPackageName: 'target-package',
          appliedTo: 'tag-one',
          allowed: ['tag-two'],
          disallowed: ['tag-three'],
        }}
      />,
    );

    const result = stripAnsi(lastFrame() ?? '');

    expect(result).toMatchInlineSnapshot(
      `
        "↳ fail #tag-one → test-package development
        │      /path/to/test-package/commonality.json
        │      Disallowed: All packages
        │      Found:      #tag-one
        │"
      `,
    );
  });

  it('should render correctly when isValid is false and violation is not found', () => {
    const { lastFrame } = render(
      <DependencyMessage
        isValid={false}
        type={DependencyType.DEVELOPMENT}
        targetPkg={{
          name: 'test-package',
          path: '/path/to/test-package',
          type: PackageType.NODE,
          version: '1.0.0',
        }}
        filter={'*'}
        constraint={{ disallow: '*' }}
        violation={{
          found: undefined,
          sourcePackageName: 'source-package',
          targetPackageName: 'target-package',
          appliedTo: 'tag-one',
          allowed: ['tag-two'],
          disallowed: ['tag-three'],
        }}
      />,
    );

    const result = stripAnsi(lastFrame() ?? '');

    expect(result).toMatchInlineSnapshot(`
      "↳ fail All packages → test-package development
      │      Disallowed: All packages
      │"
    `);
  });
});
