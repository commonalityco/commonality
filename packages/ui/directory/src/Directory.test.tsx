import React from 'react';
import { Directory } from './Directory';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TreeItem } from './core/types';
import polyfill from 'resize-observer-polyfill';

global.ResizeObserver = polyfill;

const items = [
  {
    id: '1',
    name: '@scope/foo-baz-qux',
    path: 'foo/bar/qux',
    data: { type: 'NODE' },
  },
  {
    id: '2',
    name: '@scope/foo-bar-baz',
    path: 'foo/bar-baz',
    data: { type: 'REACT' },
  },
];

describe('<Directory/>', () => {
  describe('when passed selectedPaths', () => {
    describe('and the array is empty', () => {
      it('renders all nodes unchecked', async () => {
        render(
          <form>
            <Directory
              items={items}
              formatLabel={(node) => {
                return `${node.data?.type} ${node.label}`;
              }}
            />
          </form>
        );

        const fooButton = screen.getByRole('button', { name: 'foo' });
        const fooCheckbox = screen.getByRole('checkbox', {
          name: 'Toggle visibility of foo',
        });
        expect(fooButton).toBeVisible();
        expect(fooCheckbox).toBeVisible();
        expect(fooCheckbox).not.toBeChecked();
        expect(fooCheckbox.getAttribute('data-state')).toBe('unchecked');

        await userEvent.click(fooButton);

        const barButton = screen.getByRole('button', { name: 'bar' });
        const barCheckbox = screen.getByRole('checkbox', {
          name: 'Toggle visibility of foo/bar-baz',
        });
        expect(barButton).toBeVisible();
        expect(barCheckbox).toBeVisible();
        expect(barCheckbox).not.toBeChecked();
        expect(barCheckbox.getAttribute('data-state')).toBe('unchecked');

        await userEvent.click(barButton);

        const quxButton = screen.getByRole('button', { name: 'qux' });
        const quxCheckbox = screen.getByRole('checkbox', {
          name: 'Toggle visibility of foo/bar/qux',
        });
        expect(quxButton).toBeVisible();
        expect(quxCheckbox).toBeVisible();
        expect(quxCheckbox).not.toBeChecked();
        expect(quxCheckbox.getAttribute('data-state')).toBe('unchecked');

        await userEvent.click(quxButton);

        const pkgButton = screen.getByRole('button', {
          name: 'NODE @scope/foo-baz-qux',
        });

        expect(pkgButton).toBeVisible();
      });
    });

    describe('and the array has indeterminate values', () => {
      it('renders selected path as checked and parent directory as indeterminate', async () => {
        render(
          <form>
            <Directory items={items} selectedPaths={['foo/bar/qux']} />
          </form>
        );

        const fooButton = screen.getByRole('button', { name: 'foo' });
        await userEvent.click(fooButton);
        const barButton = screen.getByRole('button', { name: 'bar' });
        await userEvent.click(barButton);

        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo',
            })
            .getAttribute('data-state')
        ).toBe('indeterminate');
        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo/bar-baz',
            })
            .getAttribute('data-state')
        ).toBe('unchecked');
        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo/bar/qux',
            })
            .getAttribute('data-state')
        ).toBe('checked');
      });
    });
  });

  describe('when checking a directory', () => {
    describe('that has child directories', () => {
      it('checks all child directories', async () => {
        render(
          <form>
            <Directory items={items} selectedPaths={[]} />
          </form>
        );

        // Unfurl all directories
        const fooButton = screen.getByRole('button', { name: 'foo' });
        await userEvent.click(fooButton);
        const barButton = screen.getByRole('button', { name: 'bar' });
        await userEvent.click(barButton);
        const quxButton = screen.getByRole('button', { name: 'qux' });
        await userEvent.click(quxButton);

        // Check parent directory
        const fooCheckbox = screen.getByRole('checkbox', {
          name: 'Toggle visibility of foo',
        });

        await userEvent.click(fooCheckbox);

        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo',
            })
            .getAttribute('data-state')
        ).toBe('checked');
        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo/bar-baz',
            })
            .getAttribute('data-state')
        ).toBe('checked');
        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo/bar/qux',
            })
            .getAttribute('data-state')
        ).toBe('checked');
      });
    });

    describe('that has a parent directory with unchecked children', () => {
      it('sets the parent directory to indeterminate and the selected folder as checked', async () => {
        render(
          <form>
            <Directory items={items} selectedPaths={[]} />
          </form>
        );

        // Unfurl all directories
        const fooButton = screen.getByRole('button', { name: 'foo' });
        await userEvent.click(fooButton);
        const barButton = screen.getByRole('button', { name: 'bar' });
        await userEvent.click(barButton);

        // Check child directory
        const fooCheckbox = screen.getByRole('checkbox', {
          name: 'Toggle visibility of foo/bar-baz',
        });

        await userEvent.click(fooCheckbox);

        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo',
            })
            .getAttribute('data-state')
        ).toBe('indeterminate');
        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo/bar-baz',
            })
            .getAttribute('data-state')
        ).toBe('checked');
        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo/bar',
            })
            .getAttribute('data-state')
        ).toBe('unchecked');
        expect(
          screen
            .getByRole('checkbox', {
              name: 'Toggle visibility of foo/bar/qux',
            })
            .getAttribute('data-state')
        ).toBe('unchecked');
      });
    });
  });

  describe('when checking a directory', () => {
    it('returns the correct paths when checking a directory', async () => {
      const handleChange = jest.fn();

      render(
        <form>
          <Directory
            items={items}
            selectedPaths={[]}
            onPathsSelect={handleChange}
          />
        </form>
      );

      // Unfurl all directories
      const fooButton = screen.getByRole('button', { name: 'foo' });
      await userEvent.click(fooButton);
      const barButton = screen.getByRole('button', { name: 'bar' });
      await userEvent.click(barButton);

      await userEvent.click(
        screen.getByRole('checkbox', {
          name: 'Toggle visibility of foo/bar',
        })
      );

      expect(handleChange).toHaveBeenCalledWith(['foo/bar/qux']);
    });

    it('returns the correct path when unchecking a directory', async () => {
      const handleChange = jest.fn();

      render(
        <form>
          <Directory
            items={items}
            selectedPaths={['foo/bar/qux']}
            onPathsSelect={handleChange}
          />
        </form>
      );

      // Unfurl all directories
      const fooButton = screen.getByRole('button', { name: 'foo' });
      await userEvent.click(fooButton);
      const barButton = screen.getByRole('button', { name: 'bar' });
      await userEvent.click(barButton);

      await userEvent.click(
        screen.getByRole('checkbox', {
          name: 'Toggle visibility of foo/bar',
        })
      );

      expect(handleChange).toHaveBeenCalledWith([]);
    });
  });
});
