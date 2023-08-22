import React from 'react';
import {
  CodeownersData,
  DocumentsData,
  Package,
  TagsData,
} from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { PackageSheet } from './package-sheet.js';

const package_ = {
  name: '@scope/test',
  version: '1.0.0',
  description: 'This is a loooooooonnnnnnnnggggggg description.',
  path: './scope/test',
  type: PackageType.NODE,
} satisfies Package;

const documentsData = [
  {
    packageName: package_.name,
    documents: [
      {
        filename: 'README',
        isReadme: true,
        isRoot: false,
        content: '# This is a title',
      },
    ],
  },
] satisfies DocumentsData[];

const codeownersData = [
  {
    packageName: package_.name,
    codeowners: [
      '@team-one',
      '@team-two',
      '@team-three',
      '@team-four',
      '@team-five',
      '@team-six',
      '@team-seven',
      '@team-eight',
      '@team-nine',
    ],
  },
] satisfies CodeownersData[];

const tagsData = [
  {
    packageName: package_.name,
    tags: [
      'tag-one',
      'tag-two',
      'tag-three',
      'tag-four',
      'tag-five',
      'tag-six',
      'tag-seven',
      'tag-eight',
      'tag-nine',
    ],
  },
] satisfies TagsData[];

describe('<PackageSheet/>', () => {
  describe('when there are tags', () => {
    test('shows all tags', () => {
      render(
        <PackageSheet
          pkg={package_}
          tagsData={tagsData}
          codeownersData={codeownersData}
          documentsData={documentsData}
        />,
      );

      expect(screen.getByText('#tag-one')).toBeTruthy();
      expect(screen.getByText('#tag-two')).toBeTruthy();
      expect(screen.getByText('#tag-three')).toBeTruthy();
      expect(screen.getByText('#tag-four')).toBeTruthy();
      expect(screen.getByText('#tag-five')).toBeTruthy();
      expect(screen.getByText('#tag-six')).toBeTruthy();
      expect(screen.getByText('#tag-seven')).toBeTruthy();
      expect(screen.getByText('#tag-eight')).toBeTruthy();
      expect(screen.getByText('#tag-nine')).toBeTruthy();
    });
  });

  describe('when there are no tags', () => {
    test('shows the empty state', () => {
      render(
        <PackageSheet
          pkg={package_}
          tagsData={[]}
          codeownersData={codeownersData}
          documentsData={documentsData}
        />,
      );

      expect(screen.getByText('Get started with tags')).toBeTruthy();
    });
  });
});
