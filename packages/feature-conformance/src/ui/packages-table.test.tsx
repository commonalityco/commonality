/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  NameCell,
  TagsCell,
  CodeownersCell,
  ColumnData,
  PackagesTable,
  PackageTableColumns,
  ConformanceCell,
} from './packages-table';
import { describe, it, expect, vi } from 'vitest';
import { Row } from '@tanstack/react-table';
import { PackageType } from '@commonalityco/utils-core';
import '@testing-library/jest-dom';

describe('NameCell', () => {
  it('renders correctly', () => {
    const pkg = {
      name: 'pkg-a',
      description: 'package-description',
      version: '1.0.0',
      type: PackageType.NODE,
    };
    render(
      <NameCell
        row={
          {
            getValue: () => pkg,
            original: {
              package: pkg,
            },
          } as unknown as Row<ColumnData>
        }
      />,
    );

    expect(screen.getByText('pkg-a')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('package-description')).toBeInTheDocument();
  });
});

describe('TagsCell', () => {
  it('renders correctly when there are tags', async () => {
    render(
      <TagsCell
        onAddTags={vi.fn()}
        row={
          { original: { tags: ['tag1', 'tag2'] } } as unknown as Row<ColumnData>
        }
      />,
    );
    await waitFor(() => {
      expect(screen.getByText('#tag1')).toBeInTheDocument();
      expect(screen.getByText('#tag2')).toBeInTheDocument();
    });
  });

  it('displays "Add tags" button when there are no tags', async () => {
    render(
      <TagsCell
        onAddTags={vi.fn()}
        row={{ original: { tags: [] } } as unknown as Row<ColumnData>}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /add tags/i }),
      ).toBeInTheDocument();
    });
  });
});

describe('CodeownersCell', () => {
  it('renders correctly when there are codeowners', () => {
    render(
      <CodeownersCell
        row={
          { getValue: () => ['owner1', 'owner2'] } as unknown as Row<ColumnData>
        }
      />,
    );
    expect(screen.getByText('owner1')).toBeInTheDocument();
    expect(screen.getByText('owner2')).toBeInTheDocument();
  });

  it('renders correctly when there are no codeowners', () => {
    render(
      <CodeownersCell
        row={{ getValue: () => [] } as unknown as Row<ColumnData>}
      />,
    );
    expect(screen.getByText('No codeowners')).toBeInTheDocument();
  });
});

describe('PackagesTable', () => {
  it('renders correctly when there are packages', () => {
    const columns = [
      { accessorKey: 'name', header: 'Name', cell: NameCell },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: (props) => <TagsCell {...props} onAddTags={vi.fn()} />,
      },
      { accessorKey: 'codeowners', header: 'Codeowners', cell: CodeownersCell },
    ] satisfies PackageTableColumns<ColumnData>;
    const data = [
      {
        package: {
          name: 'package-name',
          type: PackageType.NODE,
          description: 'package-description',
          version: '1.0.0',
          path: '/path',
        },
        codeowners: ['owner1', 'owner2'],
        tags: ['tag1', 'tag2'],
        results: [],
      },
    ] satisfies ColumnData[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<PackagesTable columns={columns as any} data={data} />);

    expect(screen.getByText('package-name')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('package-description')).toBeInTheDocument();
    expect(screen.getByText('owner1')).toBeInTheDocument();
    expect(screen.getByText('owner2')).toBeInTheDocument();
    expect(screen.getByText('#tag1')).toBeInTheDocument();
    expect(screen.getByText('#tag2')).toBeInTheDocument();
  });

  it('displays "No packages match your current filters" when there are no packages', () => {
    const columns = [
      { accessorKey: 'name', header: 'Name', cell: NameCell },
      { accessorKey: 'tags', header: 'Tags', cell: TagsCell },
      { accessorKey: 'codeowners', header: 'Codeowners', cell: CodeownersCell },
      { accessorKey: 'results', header: 'Conformance', cell: ConformanceCell },
    ];
    const data: ColumnData[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<PackagesTable columns={columns as any} data={data} />);

    expect(
      screen.getByText('No packages match your current filters'),
    ).toBeInTheDocument();
  });
});
