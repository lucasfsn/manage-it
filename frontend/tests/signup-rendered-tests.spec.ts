import { test, expect } from '@playwright/test';

test('valid data in registration form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: "Sign up - it's free!" }).click();
    await expect(page).toHaveURL('/auth/signup');
    const signUpButton = page.getByRole('button', { name: 'Sign up' });
    await expect(signUpButton).toBeDisabled();
    await page.getByRole('textbox', { name: 'Enter your first name' }).click();
    await page.getByRole('textbox', { name: 'Enter your first name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Enter your last name' }).click();
    await page.getByRole('textbox', { name: 'Enter your last name' }).fill('User');
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('tester_kh');
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('test.user@assecods.pl');
    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Haslo123!');
    await page.getByRole('textbox', { name: 'Confirm password' }).click();
    await page.getByRole('textbox', { name: 'Confirm password' }).fill('Haslo123!');
    await page.getByRole('button', { name: 'Sign up' }).waitFor();
    await expect(signUpButton).toBeVisible();
    await expect(signUpButton).toBeEnabled();

    // ----- jeżeli chcę zarejestrować nowego użytkownika (zadziała jednorazowo na tych danych) -----
    // await signUpButton.click();
    // await expect(page).toHaveURL('/dashboard', { timeout: 5000 }); 
});

test('check invalid data errors', async ({ page }) => {
    await page.goto('/auth/signup');

    // ✨ Test - Imię nie może zawierać znaków specjalnych
    const firstNameInput = page.getByRole('textbox', { name: 'Enter your first name' });
    await firstNameInput.fill('Rich!');
    await firstNameInput.press('Tab');
    const firstNameError = page.locator('p.text-red-500', { hasText: 'First name cannot contain numbers and special characters.' });
    await expect(firstNameError).toBeVisible();

    // ✨ Test - Nazwisko za długie
    const lastNameInput = page.getByRole('textbox', { name: 'Enter your last name' });
    await lastNameInput.fill('x'.repeat(51));
    await lastNameInput.press('Tab');
    const lastNameError = page.locator('p.text-red-500', { hasText: 'Last name cannot be more than 50 characters long.' });
    await expect(lastNameError).toBeVisible();

    // ✨ Test - Niepoprawna nazwa użytkownika
    const usernameInput = page.getByRole('textbox', { name: 'Enter your username' });
    await usernameInput.fill('invalid@m');
    await usernameInput.press('Tab');
    const usernameError = page.locator('p.text-red-500', { hasText: 'Username cannot contain numbers and special characters.' });
    await expect(usernameError).toBeVisible();

    // ✨ Test - Niepoprawny email
    const emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    await emailInput.fill('king.martin');
    await emailInput.press('Tab');
    const emailError = page.locator('p.text-red-500', { hasText: 'Please enter a valid email address.' });
    await expect(emailError).toBeVisible();

    // ✨ Test - Niepasujące hasła
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password' });
    await passwordInput.fill('Haslo123!');
    await confirmPasswordInput.fill('Haslo1234!');
    await confirmPasswordInput.press('Tab');
    const passwordError = page.locator('p.text-red-500', { hasText: 'Passwords do not match.' });
    await expect(passwordError).toBeVisible();
});

test('check reset form button', async ({ page }) => {
    await page.goto('/auth/signup');
    await page.getByRole('textbox', { name: 'Enter your first name' }).fill('Rich!');
    await page.getByRole('textbox', { name: 'Enter your last name' }).fill('x'.repeat(51));
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('invalid@m');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('king.martin');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Haslo123!');
    await page.getByRole('textbox', { name: 'Confirm password' }).fill('Haslo1234!');

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByRole('textbox', { name: 'Enter your first name' })).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'Enter your last name' })).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'Enter your username' })).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'Enter your email' })).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'Confirm password' })).toBeEmpty();
});
