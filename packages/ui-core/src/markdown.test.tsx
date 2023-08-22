import React from 'react';
import { render, screen } from '@testing-library/react';
import { Markdown } from './markdown.js';
import { describe, it, expect } from 'vitest';

describe('<Markdown/>', () => {
  it('renders the correct content', () => {
    const content = '# Hello, world!';
    const { getByText } = render(<Markdown>{content}</Markdown>);
    const heading = getByText('Hello, world!');
    expect(heading).toBeTruthy();
  });

  it('renders markdown correctly', () => {
    const content = '# This is a title';

    render(<Markdown>{content}</Markdown>);

    expect(screen.getByText('This is a title')).toBeTruthy();
    expect(screen.queryByText('#')).toBeFalsy();
  });

  it('renders a code block correctly', () => {
    const content = '```\nconsole.log("Hello, world!");\n```';

    render(<Markdown>{content}</Markdown>);

    const codeBlock = screen.getByText('console.log("Hello, world!");');
    expect(codeBlock).toBeTruthy();
  });

  it('renders a link correctly', () => {
    const content = '[Google](https://www.google.com)';

    render(<Markdown>{content}</Markdown>);

    const link = screen.getByRole('link', { name: 'Google' });

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://www.google.com');
    expect(link.getAttribute('rel')).toEqual('noopener noreferrer');
    expect(link.getAttribute('target')).toEqual('_blank');
  });
});
