import { Page, expect } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  await page.locator('input#email').click();
  await page.getByRole('button', { name: 'Log in' }).click();
}