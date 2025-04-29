import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('successful user login', async ({ page }) => {
  await login(page);
});

test('incorrect login - invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
  
    await page.fill('input#email', 'wrong@email.com');
    await page.fill('input#password', 'wrongpassword');
    await page.click('app-form-button[buttonType="submit"]');
  
    await expect(page).toHaveURL('/auth/login');
    await expect(page.locator('input#email')).toHaveValue('wrong@email.com');
});
