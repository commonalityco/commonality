/**
 * @vitest-environment jsdom
 */
import { GraphFilterSidebar } from './graph-filter-sidebar';
import { render, screen } from '@testing-library/react';
import { ComponentPropsWithoutRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Package } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';
import { GraphInteractionProvider } from '../context/interaction-context';
import * as queryHooks from '../query/query-hooks';

const renderSidebar = (properties: {
  initialSearch: ComponentPropsWithoutRef<
    typeof GraphFilterSidebar
  >['initialSearch'];
  packages: ComponentPropsWithoutRef<typeof GraphFilterSidebar>['packages'];
  tagsData: ComponentPropsWithoutRef<typeof GraphFilterSidebar>['tagsData'];
  codeownersData: ComponentPropsWithoutRef<
    typeof GraphFilterSidebar
  >['codeownersData'];
}) => {
  render(
    <GraphInteractionProvider allNodes={[]} allEdges={[]}>
      <GraphFilterSidebar {...properties} />
    </GraphInteractionProvider>,
  );
};

const packageOne = {
  path: `/path/to/package-one`,
  name: `@scope/one`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const packageTwo = {
  path: `/path/to/package-two`,
  name: `@scope/two`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const packageThree = {
  path: `/path/to/package-three`,
  name: `@scope/three`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const packageFour = {
  path: `/path/to/package-four`,
  name: `@scope/four`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const packageFive = {
  path: `/path/to/package-five-looooooooooooooonnnnnngggggggg`,
  name: `@scope/five-looooooooooooooonnnnnngggggggg`,
  version: '1.0.0',
  tags: ['tag-five'],
  owners: ['@team-five'],
  type: PackageType.NODE,
};

describe('<GraphFilterSidebar/>', () => {
  beforeEach(() => {
    vi.spyOn(queryHooks, 'usePackagesQuery').mockReturnValue([[], vi.fn()]);
  });

  describe('when there is no search', () => {
    const initialSearch = undefined;

    describe('when there are no packages', () => {
      it('displays the empty state', () => {
        renderSidebar({
          initialSearch,
          packages: [],
          tagsData: [],
          codeownersData: [],
        });

        expect(screen.getByText('Create your first package'));
      });
    });

    describe('when there are no tags', () => {
      it('displays the empty state', () => {
        renderSidebar({
          initialSearch,
          packages: [
            packageOne,
            packageTwo,
            packageThree,
            packageFour,
            packageFive,
          ],
          tagsData: [],
          codeownersData: [
            {
              packageName: '@scope/one',
              codeowners: ['@team-one'],
            },
            {
              packageName: '@scope/two',
              codeowners: ['@team-two'],
            },
            {
              packageName: '@scope/three',
              codeowners: ['@team-three'],
            },
            {
              packageName: '@scope/four',
              codeowners: ['@team-four'],
            },
            {
              packageName: '@scope/five',
              codeowners: ['@team-five'],
            },
          ],
        });

        expect(screen.getByText('Get started with tags')).toBeTruthy();

        const link = screen.getByRole('link', { name: 'Learn more' });

        expect(link).toBeTruthy();
        expect(link.getAttribute('href')).toEqual(
          'https://docs.commonality.co/tags',
        );
      });
    });

    describe('when there are no codeowners', () => {
      it('displays the empty state', () => {
        renderSidebar({
          initialSearch,
          packages: [
            packageOne,
            packageTwo,
            packageThree,
            packageFour,
            packageFive,
          ],
          tagsData: [
            { packageName: '@scope/one', tags: ['tag-one', 'tag-two'] },
            { packageName: '@scope/two', tags: ['tag-three'] },
            { packageName: '@scope/three', tags: ['tag-four'] },
            { packageName: '@scope/four', tags: ['tag-five'] },
            { packageName: '@scope/five', tags: ['tag-six'] },
          ],
          codeownersData: [
            {
              packageName: '@owner/one',
              codeowners: [],
            },
            {
              packageName: '@owner/two',
              codeowners: [],
            },
            {
              packageName: '@owner/three',
              codeowners: [],
            },
            {
              packageName: '@owner/four',
              codeowners: [],
            },
            {
              packageName: '@owner/five',
              codeowners: [],
            },
          ],
        });

        expect(screen.getByText('Assign ownership'));
      });
    });
  });

  describe('when there is a search', () => {
    describe('when there are no packages', () => {
      it('displays the zero state', async () => {
        renderSidebar({
          initialSearch: 'zzzzzzzz',
          packages: [],
          tagsData: [],
          codeownersData: [],
        });

        expect(screen.getAllByText('No matches found')).toHaveLength(1);
      });
    });

    describe('when there are no tags', () => {
      it('displays the zero state', () => {
        renderSidebar({
          initialSearch: '@scope',
          packages: [
            packageOne,
            packageTwo,
            packageThree,
            packageFour,
            packageFive,
          ],
          tagsData: [],
          codeownersData: [
            {
              packageName: '@scope/one',
              codeowners: ['@team-one'],
            },
            {
              packageName: '@scope/two',
              codeowners: ['@team-two'],
            },
            {
              packageName: '@scope/three',
              codeowners: ['@team-three'],
            },
            {
              packageName: '@scope/four',
              codeowners: ['@team-four'],
            },
            {
              packageName: '@scope/five',
              codeowners: ['@team-five'],
            },
          ],
        });

        expect(screen.getByText('No matching tags')).toBeTruthy();
      });
    });

    describe('when there are no codeowners', () => {
      it('displays the zero state', () => {
        renderSidebar({
          initialSearch: 'tag',
          packages: [
            packageOne,
            packageTwo,
            packageThree,
            packageFour,
            packageFive,
          ],
          tagsData: [
            { packageName: '@scope/one', tags: ['tag-one', 'tag-two'] },
            { packageName: '@scope/two', tags: ['tag-three'] },
            { packageName: '@scope/three', tags: ['tag-four'] },
            { packageName: '@scope/four', tags: ['tag-five'] },
            { packageName: '@scope/five', tags: ['tag-six'] },
          ],
          codeownersData: [
            {
              packageName: '@owner/one',
              codeowners: [],
            },
            {
              packageName: '@owner/two',
              codeowners: [],
            },
            {
              packageName: '@owner/three',
              codeowners: [],
            },
            {
              packageName: '@owner/four',
              codeowners: [],
            },
            {
              packageName: '@owner/five',
              codeowners: [],
            },
          ],
        });

        expect(screen.getByText('No matching codeowners')).toBeTruthy();
      });
    });
  });
});
