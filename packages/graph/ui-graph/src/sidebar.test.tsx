import Sidebar from './sidebar';
import { render, screen } from '@testing-library/react';
import { ComponentPropsWithoutRef } from 'react';

const renderSidebar = (props: {
  initialSearch: ComponentPropsWithoutRef<typeof Sidebar>['initialSearch'];
  visiblePackages: ComponentPropsWithoutRef<typeof Sidebar>['visiblePackages'];
  packages: ComponentPropsWithoutRef<typeof Sidebar>['packages'];
  tagsData: ComponentPropsWithoutRef<typeof Sidebar>['tagsData'];
  codeownersData: ComponentPropsWithoutRef<typeof Sidebar>['codeownersData'];
}) => {
  render(
    <Sidebar
      {...props}
      onShowAll={() => {}}
      onHideAll={() => {}}
      onTagHide={() => {}}
      onTagShow={() => {}}
      onTagFocus={() => {}}
      onTeamHide={() => {}}
      onTeamShow={() => {}}
      onTeamFocus={() => {}}
      onPackageHide={() => {}}
      onPackageShow={() => {}}
      onPackageFocus={() => {}}
    />
  );
};

describe('<Sidebar/>', () => {
  describe('when there is no search', () => {
    const initialSearch = undefined;

    describe('when there are no packages', () => {
      it('displays the empty state', () => {
        renderSidebar({
          initialSearch,
          visiblePackages: [],
          packages: [],
          tagsData: [],
          codeownersData: [],
        });

        expect(screen.getByText('Create your first package'));
      });
    });

    describe('when there are no tags', () => {
      it('displays the empty state', () => {});
    });

    describe('when there are no codeowners', () => {
      it('displays the empty state', () => {});
    });
  });

  describe('when there is a search', () => {
    describe('when there are no packages', () => {
      it('displays the zero state', () => {});
    });

    describe('when there are no tags', () => {
      it('displays the zero state', () => {});
    });

    describe('when there are no codeowners', () => {
      it('displays the zero state', () => {});
    });
  });
});
