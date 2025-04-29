import { test, expect } from '@playwright/test';

test('change language and theme', async ({ page }) => {
    // zmiana języka na stronie
    await page.goto('/');
    await expect(page.getByRole('heading')).toContainText('Transform the Way You Work with Intuitive Project Management.');
    await page.getByRole('button').filter({ hasText: 'language' }).click();
    await page.getByRole('menuitem', { name: 'Polish' }).click();
    await expect(page.getByRole('heading')).toContainText('Zmień sposób pracy dzięki intuicyjnemu zarządzaniu projektami.');
    await page.getByRole('button').filter({ hasText: 'language' }).click();
    await page.getByRole('menuitem', { name: 'Angielski' }).click();

    //zmiana motywu strony
    // await page.getByRole('button').filter({ hasText: 'dark_mode' }).click();
});