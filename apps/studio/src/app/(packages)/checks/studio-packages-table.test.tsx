import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButton, StudioTagsCell } from './studio-packages-table';
import { Package } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';
import { expect, it, vi } from 'vitest';
import { Row } from '@tanstack/react-table';
import { ColumnData } from '@commonalityco/ui-conformance';

const mocks = vi.hoisted(() => {
  return {
    openPackageJson: vi.fn(),
  };
});

vi.mock('../../../actions/editor.ts', () => {
  return {
    openPackageJson: mocks.openPackageJson,
  };
});

describe('<ActionButton />', () => {
  it('renders correctly and responds to click events', async () => {
    const mockData: { tags: string[]; package: Package } = {
      tags: ['tag1', 'tag2'],
      package: {
        name: 'test-package',
        path: '/path/to/test-package',
        type: PackageType.NODE,
        version: '1.0.0',
      },
    };

    render(
      <ActionButton
        existingTags={mockData.tags}
        pkg={mockData.package}
        tags={mockData.tags}
        results={[]}
      />,
    );

    const button = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(button);

    const editTagsOption = screen.getByText(/edit tags/i);
    expect(editTagsOption).toBeInTheDocument();
  });

  it('calls openEditorAction with correct path for package.json', async () => {
    const mockData: { tags: string[]; package: Package } = {
      tags: ['tag1', 'tag2'],
      package: {
        name: 'test-package',
        path: '/path/to/test-package',
        type: PackageType.NODE,
        version: '1.0.0',
      },
    };

    render(
      <ActionButton
        existingTags={mockData.tags}
        pkg={mockData.package}
        tags={mockData.tags}
        results={[]}
      />,
    );

    const button = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(button);

    const packageJsonOption = screen.getByText(/Edit package.json/i);
    await userEvent.click(packageJsonOption);

    expect(mocks.openPackageJson).toHaveBeenCalledWith('/path/to/test-package');
  });
});

describe('<StudioTagsCell />', () => {
  it('renders correctly with tags', async () => {
    const mockTags = ['tag1', 'tag2'];
    const mockData = {
      row: {
        original: {
          name: 'test-package',
          package: {
            name: 'test-package',
            path: '/path/to/test-package',
            type: PackageType.NODE,
            version: '1.0.0',
          },
          tags: mockTags,
        },
      } as unknown as Row<ColumnData>,
    };

    render(<StudioTagsCell {...mockData} tags={[]} />);

    const tagOne = screen.getByText(/#tag1/i);
    expect(tagOne).toBeInTheDocument();

    const tagTwo = screen.getByText(/#tag2/i);
    expect(tagTwo).toBeInTheDocument();
  });

  it('renders correctly without tags and opens dialog on click', async () => {
    const mockData = {
      row: {
        original: {
          name: 'test-package',
          package: {
            name: 'test-package',
            path: '/path/to/test-package',
            type: PackageType.NODE,
            version: '1.0.0',
          },
          tags: [],
        },
      } as unknown as Row<ColumnData>,
    };

    render(<StudioTagsCell {...mockData} tags={[]} />);

    const addTagsButton = screen.getByRole('button', { name: /add tags/i });
    await userEvent.click(addTagsButton);

    const editTagsDialog = await screen.findByText('Edit tags');
    expect(editTagsDialog).toBeInTheDocument();
  });
});
