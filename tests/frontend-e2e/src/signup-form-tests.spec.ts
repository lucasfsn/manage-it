import { test, expect } from '@playwright/test';

test('should fill registration form with valid data', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: "Sign up - it's free!" }).click();
  await expect(page).toHaveURL('/auth/signup');
  const signUpButton = page.getByRole('button', { name: 'Sign up' });
  await expect(signUpButton).toBeDisabled();
  await page.getByRole('textbox', { name: 'Enter your first name' }).click();
  await page.getByRole('textbox', { name: 'Enter your first name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Enter your last name' }).click();
  await page.getByRole('textbox', { name: 'Enter your last name' }).fill('User');
  await page.getByRole('textbox', { name: 'Choose a username' }).click();
  await page.getByRole('textbox', { name: 'Choose a username' }).fill('tester_kh');
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('test.user@assecods.pl');
  await page.getByRole('textbox', { name: 'Create a password' }).click();
  await page.getByRole('textbox', { name: 'Create a password' }).fill('Haslo123!');
  await page.getByRole('textbox', { name: 'Repeat your password' }).click();
  await page.getByRole('textbox', { name: 'Repeat your password' }).fill('Haslo123!');
  await page.getByRole('textbox', { name: 'Enter your first name' }).click();
  await page.getByRole('button', { name: 'Sign up' }).waitFor();
  await expect(signUpButton).toBeVisible();
  await expect(signUpButton).toBeEnabled();

  // ----- jeżeli chcę zarejestrować nowego użytkownika (zadziała jednorazowo na tych danych) -----
  // await signUpButton.click();
  // await expect(page).toHaveURL('/dashboard', { timeout: 5000 }); 
});

test('should display validation errors for invalid inputs', async ({ page }) => {
  await page.goto('/auth/signup');

  // imię zawiera znaki specjalne
  const firstNameInput = page.getByRole('textbox', { name: 'Enter your first name' });
  await firstNameInput.fill('Rich!');
  await firstNameInput.press('Tab');
  const firstNameError = page.locator('p.text-red-500', { hasText: 'First name cannot contain numbers and special characters.' });
  await expect(firstNameError).toBeVisible();

  // nazwisko za długie
  const lastNameInput = page.getByRole('textbox', { name: 'Enter your last name' });
  await lastNameInput.fill('x'.repeat(51));
  await lastNameInput.press('Tab');
  const lastNameError = page.locator('p.text-red-500', { hasText: 'Last name cannot be more than 50 characters long.' });
  await expect(lastNameError).toBeVisible();

  // niepoprawna nazwa użytkownika
  const usernameInput = page.getByRole('textbox', { name: 'Choose a username' });
  await usernameInput.fill('invalid@m');
  await usernameInput.press('Tab');
  const usernameError = page.locator('p.text-red-500', { hasText: 'Username cannot contain numbers and special characters.' });
  await expect(usernameError).toBeVisible();

  // niepoprawny adres email
  const emailInput = page.getByRole('textbox', { name: 'Enter your email' });
  await emailInput.fill('king.martin');
  await emailInput.press('Tab');
  const emailError = page.locator('p.text-red-500', { hasText: 'Please enter a valid email address.' });
  await expect(emailError).toBeVisible();

  // niepasujące hasła
  const passwordInput = page.getByRole('textbox', { name: 'Create a password' });
  const confirmPasswordInput = page.getByRole('textbox', { name: 'Repeat your password' });
  await passwordInput.fill('Haslo123!');
  await confirmPasswordInput.fill('Haslo1234!');
  await confirmPasswordInput.press('Tab');
  const passwordError = page.locator('p.text-red-500', { hasText: 'Passwords do not match.' });
  await expect(passwordError).toBeVisible();
});

test('check reset form button', async ({ page }) => {
  await page.goto('/auth/signup');

  // uzupełnij formularz rejestracji danymi
  await page.getByRole('textbox', { name: 'Enter your first name' }).fill('Rich!');
  await page.getByRole('textbox', { name: 'Enter your last name' }).fill('x'.repeat(51));
  await page.getByRole('textbox', { name: 'Choose a username' }).fill('invalid@m');
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('king.martin');
  await page.getByRole('textbox', { name: 'Create a password' }).fill('Haslo123!');
  await page.getByRole('textbox', { name: 'Repeat your password' }).fill('Haslo1234!');

  // zresetuj formularz i sprawdź czy wszystkie pola są puste
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('textbox', { name: 'Enter your first name' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Enter your last name' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Choose a username' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Enter your email' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Create a password' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Repeat your password' })).toBeEmpty();
});
