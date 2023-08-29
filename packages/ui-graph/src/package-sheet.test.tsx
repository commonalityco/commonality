import React from 'react';
import {
  Codeowner,
  CodeownersData,
  Document,
  DocumentsData,
  Package,
  Tag,
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
    filename: 'README',
    path: '/packages/test/README.md',
    isRoot: false,
    content: '# This is a title',
  },
] satisfies Document[];

const codeownersData = [
  '@team-one',
  '@team-two',
  '@team-three',
  '@team-four',
  '@team-five',
  '@team-six',
  '@team-seven',
  '@team-eight',
  '@team-nine',
] satisfies Codeowner[];

const tagsData = [
  'tag-one',
  'tag-two',
  'tag-three',
  'tag-four',
  'tag-five',
  'tag-six',
  'tag-seven',
  'tag-eight',
  'tag-nine',
] satisfies Tag[];

describe('<PackageSheet/>', () => {
  describe('when there are tags', () => {
    test('shows all tags', () => {
      render(
        <PackageSheet
          pkg={package_}
          tags={tagsData}
          codeowners={codeownersData}
          documents={documentsData}
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
          tags={[]}
          codeowners={codeownersData}
          documents={documentsData}
        />,
      );

      expect(screen.getByText('Get started with tags')).toBeTruthy();
    });
  });
});
