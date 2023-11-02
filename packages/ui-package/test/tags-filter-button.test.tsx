import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import TagsFilterButton from '../src/tags-filter-button.js';

test('renders TagsFilterButton and handles check change', async () => {
  const tags = ['tag1', 'tag2', 'tag3'];
  const mockOnChange = vi.fn();

  render(<TagsFilterButton tags={tags} onChange={mockOnChange} />);

  const button = screen.getByRole('button', { name: /tags/i });
  expect(button).toBeTruthy();

  await userEvent.click(button);

  for (const tag of tags) {
    expect(screen.getByText(`#${tag}`)).toBeTruthy();
  }

  const checkboxItem = screen.getByRole('menuitemcheckbox', { name: /#tag1/i });
  await userEvent.click(checkboxItem);

  expect(mockOnChange).toHaveBeenCalledWith(['tag2', 'tag3']);
});

test('displays the no tags message', async () => {
  const mockOnChange = vi.fn();

  render(<TagsFilterButton tags={[]} onChange={mockOnChange} />);

  const button = screen.getByRole('button', { name: /tags/i });
  expect(button).toBeTruthy();

  await userEvent.click(button);

  const noTagsMessage = screen.getByText('Get started with tags');
  expect(noTagsMessage).toBeTruthy();
});
