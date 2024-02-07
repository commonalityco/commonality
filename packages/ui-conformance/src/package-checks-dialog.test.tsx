import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PackageChecksDialog } from './package-checks-dialog';
import { Package } from '@commonalityco/types';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { PackageType, Status } from '@commonalityco/utils-core';
import ObserverPolyfill from 'resize-observer-polyfill';

global.ResizeObserver = ObserverPolyfill;

describe('PackageChecksDialog', () => {
  it('should render without crashing', async () => {
    const pkg: Package = {
      name: 'pkg-a',
      version: '1.0.0',
      path: '/packages/pkg-a',
      type: PackageType.NODE,
    };
    const results: ConformanceResult[] = [];

    render(<PackageChecksDialog pkg={pkg} results={results} open />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should display package name', async () => {
    const pkg: Package = {
      name: 'pkg-a',
      version: '1.0.0',
      path: '/packages/pkg-a',
      type: PackageType.NODE,
    };
    const results: ConformanceResult[] = [];

    render(<PackageChecksDialog pkg={pkg} results={results} open />);

    expect(screen.getByText('pkg-a')).toBeInTheDocument();
  });

  it('should display results when provided', async () => {
    const pkg: Package = {
      name: 'pkg-a',
      version: '1.0.0',
      path: '/packages/pkg-a',
      type: PackageType.NODE,
    };
    const results: ConformanceResult[] = [
      {
        id: 'check-a',
        status: Status.Pass,
        filter: 'tag-one',
        package: {
          name: 'pkg-a',
          version: '1.0.0',
          path: '/packages/pkg-a',
          type: PackageType.NODE,
        },
        message: { message: 'This is cool', path: '/path/to/file' },
      },
    ];

    render(<PackageChecksDialog pkg={pkg} results={results} open />);

    const checkButton = screen.getByRole('button', {
      name: /pass this is cool/i,
    });

    expect(checkButton).toBeInTheDocument();

    await userEvent.click(checkButton);

    const appliedToTag = screen.getByLabelText(/filepath/i);

    expect(appliedToTag.textContent).toEqual('/path/to/file');
  });

  it('should display onboarding card when results are empty', async () => {
    const pkg: Package = {
      name: 'pkg-a',
      version: '1.0.0',
      path: '/packages/pkg-a',
      type: PackageType.NODE,
    };
    const results: ConformanceResult[] = [];

    render(<PackageChecksDialog pkg={pkg} results={results} open />);

    expect(screen.getByText('Codify your best practices')).toBeInTheDocument();
  });
});
