import { test, expect } from '@playwright/test';

test('smoke - constraints', async ({ page }) => {
  await page.goto('/graph');

  await expect(page.getByTestId('dependency-graph')).toBeVisible();
});

test('smoke - checks', async ({ page }) => {
  await page.goto('/packages');

  await expect(page.getByRole('heading', { name: 'Packages' })).toBeVisible();
});
