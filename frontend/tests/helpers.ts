import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input#email', 'johndoe@mail.com');
  await page.fill('input#password', '1qazXSW@');
  await page.click('app-form-button[buttonType="submit"]');
  await expect(page).toHaveURL('/dashboard');
}