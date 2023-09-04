import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButton, StudioTagsCell } from './studio-packages-table';
import { Package } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';
import { expect, it, vi } from 'vitest';
import { Row } from '@tanstack/react-table';
import { ColumnData } from '@commonalityco/ui-package';

const mocks = vi.hoisted(() => {
  return {
    mockOpenEditorAction: vi.fn(),
  };
});

vi.mock('../../../actions/editor.ts', () => {
  return {
    openEditorAction: mocks.mockOpenEditorAction,
  };
});

describe('<ActionButton />', () => {
  it('renders correctly and responds to click events', async () => {
    const mockData: Package & { tags: string[] } = {
      name: 'test-package',
      path: '/path/to/test-package',
      type: PackageType.NODE,
      version: '1.0.0',
      tags: ['tag1', 'tag2'],
    };

    render(
      <ActionButton
        existingTags={mockData.tags}
        packageName={mockData.name}
        tags={mockData.tags}
        packageJsonPath="/path/to/test-package/package.json"
      />,
    );

    const button = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(button);

    const editTagsOption = screen.getByText(/edit tags/i);
    expect(editTagsOption).toBeInTheDocument();
  });

  it('calls openEditorAction with correct path for package.json', async () => {
    const mockData: Package & { tags: string[] } = {
      name: 'test-package',
      path: '/path/to/test-package',
      type: PackageType.NODE,
      version: '1.0.0',
      tags: ['tag1', 'tag2'],
    };

    render(
      <ActionButton
        existingTags={mockData.tags}
        packageName={mockData.name}
        tags={mockData.tags}
        packageJsonPath="/path/to/test-package/package.json"
      />,
    );

    const button = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(button);

    const packageJsonOption = screen.getByText(/Open package.json/i);
    await userEvent.click(packageJsonOption);

    expect(mocks.mockOpenEditorAction).toHaveBeenCalledWith(
      '/path/to/test-package/package.json',
    );
  });

  it('calls openEditorAction with correct path for commonality.json', async () => {
    const mockData: Package & { tags: string[] } = {
      name: 'test-package',
      path: '/path/to/test-package',
      type: PackageType.NODE,
      version: '1.0.0',
      tags: ['tag1', 'tag2'],
    };

    render(
      <ActionButton
        existingTags={mockData.tags}
        packageName={mockData.name}
        tags={mockData.tags}
        packageJsonPath="/path/to/test-package/package.json"
        projectConfigPath="/path/to/test-package/commonality.json"
      />,
    );

    const button = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(button);

    const commonalityJsonOption = screen.getByText(/Open commonality.json/i);
    await userEvent.click(commonalityJsonOption);

    expect(mocks.mockOpenEditorAction).toHaveBeenCalledWith(
      '/path/to/test-package/commonality.json',
    );
  });

  it('disables open buttons when corresponding file paths are not passed', async () => {
    const mockData: Package & { tags: string[] } = {
      name: 'test-package',
      path: '/path/to/test-package',
      type: PackageType.NODE,
      version: '1.0.0',
      tags: ['tag1', 'tag2'],
    };

    render(
      <ActionButton
        existingTags={mockData.tags}
        packageName={mockData.name}
        tags={mockData.tags}
        packageJsonPath="/mock/path/to/package.json"
      />,
    );

    const button = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(button);

    const commonalityJsonOption = screen.getByRole('menuitem', {
      name: /Open commonality.json/i,
    });

    expect(commonalityJsonOption).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('<StudioTagsCell />', () => {
  it('renders correctly with tags', async () => {
    const mockTags = ['tag1', 'tag2'];
    const mockData = {
      row: {
        original: {
          name: 'test-package',
          tags: mockTags,
        },
      } as unknown as Row<ColumnData>,
    };

    render(<StudioTagsCell tags={mockTags} {...mockData} />);

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
