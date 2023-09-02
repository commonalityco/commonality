import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import { CodeownersFilterButton } from '../src/codeowners-filter-button.js';

test('renders CodeownersFilterButton and handles check change', async () => {
  const codeowners = ['user1', 'user2', 'user3'];
  const mockOnChange = vi.fn();

  render(
    <CodeownersFilterButton codeowners={codeowners} onChange={mockOnChange} />,
  );

  const button = screen.getByRole('button', { name: /codeowners/i });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  for (const codeowner of codeowners) {
    expect(screen.getByText(codeowner)).toBeInTheDocument();
  }

  const checkboxItem = screen.getByRole('menuitemcheckbox', { name: /user1/i });
  await userEvent.click(checkboxItem);

  expect(mockOnChange).toHaveBeenCalledWith(['user2', 'user3']);
});

test('displays the no codeowners message', async () => {
  const mockOnChange = vi.fn();

  render(<CodeownersFilterButton codeowners={[]} onChange={mockOnChange} />);

  const button = screen.getByRole('button', { name: /codeowners/i });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  const noCodeownersMessage = screen.getByText('No codeowners found');
  expect(noCodeownersMessage).toBeInTheDocument();
});
