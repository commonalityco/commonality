import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  NameCell,
  DocumentsCell,
  TagsCell,
  CodeownersCell,
  ColumnData,
  PackagesTable,
  PackageTableColumns,
} from '../src/packages-table.js';
import { describe, it, expect, vi } from 'vitest';
import { Row } from '@tanstack/react-table';
import '@testing-library/jest-dom';
import { PackageType } from '@commonalityco/utils-core';

describe('NameCell', () => {
  it('renders correctly', () => {
    render(
      <NameCell
        row={
          {
            getValue: () => 'package-name',
            original: {
              type: 'test',
              description: 'package-description',
              version: '1.0.0',
            },
          } as unknown as Row<ColumnData>
        }
      />,
    );

    expect(screen.getByText('package-name')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('package-description')).toBeInTheDocument();
  });
});

describe('DocumentsCell', () => {
  it('fires callback when clicking on the open README button', async () => {
    const onDocumentOpen = vi.fn();
    render(
      <DocumentsCell
        row={
          {
            getValue: () => [{ filename: 'README', path: '/path/to/readme' }],
          } as unknown as Row<ColumnData>
        }
        onDocumentOpen={onDocumentOpen}
      />,
    );

    await userEvent.click(screen.getByLabelText('Open README in editor'));
    expect(onDocumentOpen).toHaveBeenCalledWith('/path/to/readme');
  });

  it('fires callback when clicking on the open CHANGELOG button', async () => {
    const onDocumentOpen = vi.fn();
    render(
      <DocumentsCell
        row={
          {
            getValue: () => [
              { filename: 'CHANGELOG', path: '/path/to/changelog' },
            ],
          } as unknown as Row<ColumnData>
        }
        onDocumentOpen={onDocumentOpen}
      />,
    );

    await userEvent.click(screen.getByLabelText('Open CHANGELOG in editor'));
    expect(onDocumentOpen).toHaveBeenCalledWith('/path/to/changelog');
  });

  it('fires callback when selecting a document from the extra docs dropdown', async () => {
    const onDocumentOpen = vi.fn();
    const extraDocs = [
      { filename: 'EXTRA_DOC_1', path: '/path/to/extra/doc1' },
      { filename: 'EXTRA_DOC_2', path: '/path/to/extra/doc2' },
    ];
    render(
      <DocumentsCell
        row={
          {
            getValue: () => [
              { filename: 'README', path: '/path/to/readme' },
              { filename: 'CHANGELOG', path: '/path/to/changelog' },
              ...extraDocs,
            ],
          } as unknown as Row<ColumnData>
        }
        onDocumentOpen={onDocumentOpen}
      />,
    );

    await userEvent.hover(
      screen.getByRole('button', { name: '+ 2 document(s)' }),
    );

    await waitFor(
      () => expect(screen.getByText('Open EXTRA_DOC_1')).toBeInTheDocument(),
      {
        timeout: 700,
      },
    );

    await userEvent.click(screen.getByText('Open EXTRA_DOC_1'));

    expect(onDocumentOpen).toHaveBeenCalledWith('/path/to/extra/doc1');
  });

  it('displays "No documents" when there are no documents', () => {
    render(
      <DocumentsCell
        row={
          {
            getValue: () => [],
          } as unknown as Row<ColumnData>
        }
        onDocumentOpen={vi.fn()}
      />,
    );

    expect(screen.getByText('No documents')).toBeInTheDocument();
  });
});

describe('TagsCell', () => {
  it('renders correctly when there are tags', () => {
    render(
      <TagsCell
        onAddTags={vi.fn()}
        row={{ getValue: () => ['tag1', 'tag2'] } as unknown as Row<ColumnData>}
      />,
    );
    expect(screen.getByText('#tag1')).toBeInTheDocument();
    expect(screen.getByText('#tag2')).toBeInTheDocument();
  });

  it('displays "No tags" when there are no tags', () => {
    render(
      <TagsCell
        onAddTags={vi.fn()}
        row={{ getValue: () => [] } as unknown as Row<ColumnData>}
      />,
    );
    expect(
      screen.getByRole('button', { name: /add tags/i }),
    ).toBeInTheDocument();
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
        accessorKey: 'documents',
        header: 'Documents',
        cell: (props) => (
          <DocumentsCell {...props} onDocumentOpen={async () => {}} />
        ),
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: (props) => <TagsCell {...props} onAddTags={vi.fn()} />,
      },
      { accessorKey: 'codeowners', header: 'Codeowners', cell: CodeownersCell },
    ] satisfies PackageTableColumns;
    const data = [
      {
        name: 'package-name',
        type: PackageType.NODE,
        description: 'package-description',
        version: '1.0.0',
        path: '/path',
        codeowners: ['owner1', 'owner2'],
        tags: ['tag1', 'tag2'],
        documents: [
          {
            filename: 'README',
            path: '/path/to/readme',
            isRoot: true,
            content: '',
          },
          {
            filename: 'CHANGELOG',
            path: '/path/to/changelog',
            isRoot: false,
            content: '',
          },
        ],
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
      { accessorKey: 'documents', header: 'Documents', cell: DocumentsCell },
      { accessorKey: 'tags', header: 'Tags', cell: TagsCell },
      { accessorKey: 'codeowners', header: 'Codeowners', cell: CodeownersCell },
    ];
    const data: ColumnData[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<PackagesTable columns={columns as any} data={data} />);

    expect(
      screen.getByText('No packages match your current filters'),
    ).toBeInTheDocument();
  });
});
