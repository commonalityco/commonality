import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  ConformanceResults,
  CheckTitle,
  CheckContent,
  StatusCount,
} from './conformance-results-list';
import type { ConformanceResult } from '@commonalityco/utils-conformance';
import { PackageType, Status } from '@commonalityco/utils-core';

describe('CheckTitle', () => {
  it('should render pass status correctly', async () => {
    const result = {
      package: {
        name: 'test-package',
        path: '/',
        type: PackageType.NODE,
        version: '1.0.0',
      },
      name: 'test-name',
      filter: 'tag-one',
      status: Status.Pass,
      message: { title: 'This package is cool' },
    };

    render(<CheckTitle result={result} />);

    const statusElement = screen.getByText('pass');

    expect(statusElement).toBeInTheDocument();
  });

  it('should render warn status correctly', async () => {
    const result = {
      package: {
        name: 'test-package',
        path: '/',
        type: PackageType.NODE,
        version: '1.0.0',
      },
      name: 'test-name',
      filter: 'tag-one',
      status: Status.Warn,
      message: { title: 'This package is cool' },
    };

    render(<CheckTitle result={result} />);

    const statusElement = screen.getByText('warn');

    expect(statusElement).toBeInTheDocument();
  });

  it('should render fail status correctly', async () => {
    const result = {
      package: {
        name: 'test-package',
        path: '/',
        type: PackageType.NODE,
        version: '1.0.0',
      },
      name: 'test-name',
      filter: 'tag-one',
      status: Status.Fail,
      message: { title: 'This package is cool' },
    };

    render(<CheckTitle result={result} />);

    const statusElement = screen.getByText('fail');

    expect(statusElement).toBeInTheDocument();
  });
});

describe('CheckContent', () => {
  it('should render filePath and suggestion when provided', async () => {
    const result = {
      package: {
        name: 'test-package',
        path: '/',
        type: PackageType.NODE,
        version: '1.0.0',
      },
      name: 'test-name',
      filter: 'tag-one',
      status: Status.Pass,
      message: {
        title: 'This package is cool',
        filePath: 'path/to/file',
        suggestion: 'Try this instead',
      },
    };

    render(<CheckContent result={result} />);

    const filePathElement = screen.getByText('path/to/file');
    const suggestionElement = screen.getByText('Try this instead');

    expect(filePathElement).toBeInTheDocument();
    expect(suggestionElement).toBeInTheDocument();
  });
});

describe('StatusCount', () => {
  it('should render correct counts when failCount, warnCount, and passCount are provided', async () => {
    render(<StatusCount failCount={2} warnCount={1} passCount={3} />);

    const failCountContainer = screen.getByLabelText('Fail count');
    const warnCountContainer = screen.getByLabelText('Warning count');
    const passCountContainer = screen.getByLabelText('Pass count');

    expect(failCountContainer).toHaveClass('text-destructive');
    expect(warnCountContainer).toHaveClass('text-warning');
    expect(passCountContainer).toHaveClass('text-success');

    const failCountElement = within(failCountContainer).getByText('2');
    const warnCountElement = within(warnCountContainer).getByText('1');
    const passCountElement = within(passCountContainer).getByText('3');

    expect(failCountElement).toBeInTheDocument();
    expect(warnCountElement).toBeInTheDocument();
    expect(passCountElement).toBeInTheDocument();
  });

  it('should not render counts when failCount, warnCount, and passCount are zero', async () => {
    render(<StatusCount failCount={0} warnCount={0} passCount={0} />);

    const failCountElement = screen.queryByText('0');
    const warnCountElement = screen.queryByText('0');
    const passCountElement = screen.queryByText('0');

    expect(failCountElement).not.toBeInTheDocument();
    expect(warnCountElement).not.toBeInTheDocument();
    expect(passCountElement).not.toBeInTheDocument();
  });
});

describe('ConformanceResults', () => {
  it('should show onboarding when results array is empty', async () => {
    render(<ConformanceResults results={[]} />);

    const noResultsElement = screen.getByText('Codify your best practices');

    expect(noResultsElement).toBeInTheDocument();
  });

  it('should render results when results array is not empty', async () => {
    const results = [
      {
        package: {
          name: 'test-package',
          path: '/',
          type: PackageType.NODE,
          version: '1.0.0',
        },
        name: 'test-name',
        filter: 'tag-one',
        status: Status.Pass,
        message: { title: 'This package is cool' },
      },
    ] satisfies ConformanceResult[];

    render(<ConformanceResults results={results} />);

    const packageNameElement = screen.getByText('test-package');

    expect(packageNameElement).toBeInTheDocument();
  });

  it('should render multiple results for the same tag', async () => {
    const results = [
      {
        package: {
          name: 'test-package',
          path: '/',
          type: PackageType.NODE,
          version: '1.0.0',
        },
        filter: 'tag-one',
        status: Status.Pass,
        message: { title: 'This package is cool' },
        name: 'test-name',
      },
      {
        package: {
          name: 'test-package',
          path: '/',
          type: PackageType.NODE,
          version: '1.0.0',
        },
        filter: 'tag-one',
        status: Status.Pass,
        message: { title: 'This package is also cool' },
        name: 'test-name-2',
      },
    ] satisfies ConformanceResult[];

    render(<ConformanceResults results={results} />);

    const packageOneNameElement = screen.getByText('This package is cool');
    const packageTwoNameElement = screen.getByText('This package is also cool');

    const statusText = screen.getAllByText('pass');

    expect(packageOneNameElement).toBeInTheDocument();
    expect(packageTwoNameElement).toBeInTheDocument();
    expect(statusText).toHaveLength(2);
  });

  it('should expand only one item when two results have the same name', async () => {
    const results = [
      {
        package: {
          name: 'test-package',
          path: '/',
          type: PackageType.NODE,
          version: '1.0.0',
        },
        filter: 'tag-one',
        status: Status.Pass,
        message: { title: 'This package is cool' },
        name: 'test-name',
      },
      {
        package: {
          name: 'test-package',
          path: '/',
          type: PackageType.NODE,
          version: '1.0.0',
        },
        filter: 'tag-one',
        status: Status.Pass,
        message: { title: 'This package is also cool' },
        name: 'test-name',
      },
    ] satisfies ConformanceResult[];

    render(<ConformanceResults results={results} />);

    const accordionElement = screen.getByText('This package is cool');

    await userEvent.click(accordionElement);

    const expandedElements = screen.getAllByRole('button', { expanded: true });

    expect(expandedElements).toHaveLength(1);
  });
});
