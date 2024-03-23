import { test, expect } from '@playwright/test';

test('smoke - constraints', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('dependency-graph')).toBeVisible();
});
