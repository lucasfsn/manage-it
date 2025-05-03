import { test, expect } from '@playwright/test';

test('check title and go to login buttons', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/ManageIt/);

    const loginButton = page.locator('text=Log In');
    await expect(loginButton).toBeVisible();

    await loginButton.click();
    await expect(page).toHaveURL('/auth/login');
});

test('check go to signup buttons', async ({ page }) => {
    await page.goto('/');

    const signupButton1 = page.locator('text=Sign up for free');
    await expect(signupButton1).toBeVisible();

    await signupButton1.click();
    await expect(page).toHaveURL('/auth/signup');

    await page.goto('/');

    const signupButton2 = page.locator(`text=Sign up - it's free!`);
    await expect(signupButton2).toBeVisible();

    await signupButton2.click();
    await expect(page).toHaveURL('/auth/signup');
});
