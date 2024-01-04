import { test, expect } from '@playwright/test';

test('smoke - constraints', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Constraints' }),
  ).toBeVisible();
});

test('smoke - checks', async ({ page }) => {
  await page.goto('/checks');

  await expect(page.getByRole('heading', { name: 'Checks' })).toBeVisible();
});
