import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import { delete_notifications } from '../helpers/delete_notifications';

test('change user last name and password', async ({ page }) => {
  await login(page, 'johndoe@mail.com', '1qazXSW@');
  await expect(page).toHaveURL('/dashboard');

  // przejdź do formularza edycji danych użytkownika 
  await page.getByText('JD Profile').click();
  await expect(page.locator('h2')).toContainText('John Doe');
  await expect(page.locator('app-user-header')).toContainText('@john_doe');
  await page.getByRole('button', { name: 'Edit profile' }).click();

  // sprawdź poprawność wczytywania danych początkowych do formularza
  await expect(page.locator('form')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Enter first name' })).toHaveValue('John');
  await expect(page.getByRole('textbox', { name: 'Enter last name' })).toHaveValue('Doe');
  await expect(page.getByRole('textbox', { name: 'Enter new email' })).toHaveValue('johndoe@mail.com');

  // zmiana nazwiska i hasła dla zalogowanego użytkownika 
  await page.getByRole('textbox', { name: 'Enter last name' }).click();
  await page.getByRole('textbox', { name: 'Enter last name' }).fill('Does');
  await page.getByRole('checkbox', { name: 'Edit password' }).check();
  await page.getByRole('textbox', { name: 'Enter new password' }).click();
  await page.getByRole('textbox', { name: 'Enter new password' }).fill('1qazXSW@');
  await page.getByRole('textbox', { name: 'Confirm password' }).click();
  await page.getByRole('textbox', { name: 'Confirm password' }).fill('1qazXSW@');
  await page.getByRole('button', { name: 'Save' }).click();

  // sprawdzenie wyświetlania na stronie
  await expect(page.locator('h2')).toContainText('John Does');
  await expect(page.locator('app-user-header')).toContainText('@john_doe');

  // przywrócenie poprzednich danych
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByRole('textbox', { name: 'Enter last name' }).click();
  await page.getByRole('textbox', { name: 'Enter last name' }).fill('Doe');
  await page.getByRole('button', { name: 'Save' }).click();
});

test('check reset button in change user credentials form', async ({ page }) => {
  await login(page, 'johndoe@mail.com', '1qazXSW@');

  await page.getByText('JD Profile').click();
  await page.getByRole('button', { name: 'Edit profile' }).click();

  await expect(page.locator('form')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Enter first name' })).toHaveValue('John');
  await expect(page.getByRole('textbox', { name: 'Enter last name' })).toHaveValue('Doe');
  await expect(page.getByRole('textbox', { name: 'Enter new email' })).toHaveValue('johndoe@mail.com');

  // uzupełnienie formularza testowymi danymi 
  await page.getByRole('textbox', { name: 'Enter first name' }).click();
  await page.getByRole('textbox', { name: 'Enter first name' }).fill('Johnik');
  await page.getByRole('textbox', { name: 'Enter last name' }).click();
  await page.getByRole('textbox', { name: 'Enter last name' }).fill('Doesik');
  await page.getByRole('textbox', { name: 'Enter new email' }).click();
  await page.getByRole('textbox', { name: 'Enter new email' }).fill('john.doe@mail.com');

  // sprawdzenie wartości w polach formularza do edycji danych użytkownika przed zresetowaniem
  await expect(page.getByRole('textbox', { name: 'Enter first name' })).toHaveValue('Johnik');
  await expect(page.getByRole('textbox', { name: 'Enter last name' })).toHaveValue('Doesik');
  await expect(page.getByRole('textbox', { name: 'Enter new email' })).toHaveValue('john.doe@mail.com');

  await page.getByRole('button', { name: 'Reset' }).click();

  // sprawdzenie wartości w polach formularza do edycji danych użytkownika po zresetowaniu
  await expect(page.getByRole('textbox', { name: 'Enter first name' })).toHaveValue('John');
  await expect(page.getByRole('textbox', { name: 'Enter last name' })).toHaveValue('Doe');
  await expect(page.getByRole('textbox', { name: 'Enter new email' })).toHaveValue('johndoe@mail.com');
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
  await page.getByRole('button').filter({ hasText: 'close' }).click();
});

test('check password and email change', async ({ page }) => {
  await login(page, 'johndoe@mail.com', '1qazXSW@');
  
  await page.getByText('JD Profile').click();
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await expect(page.getByRole('textbox', { name: 'Enter first name' })).toHaveValue('John');
  await expect(page.getByRole('textbox', { name: 'Enter last name' })).toHaveValue('Doe');
  await expect(page.getByRole('textbox', { name: 'Enter new email' })).toHaveValue('johndoe@mail.com');
  
  // zmiana maila i hasła użytkownika
  await page.getByRole('textbox', { name: 'Enter new email' }).click();
  await page.getByRole('textbox', { name: 'Enter new email' }).fill('zmienionymail@mail.com');
  await page.getByRole('checkbox', { name: 'Edit password' }).check();
  await page.getByRole('textbox', { name: 'Enter new password' }).click();
  await page.getByRole('textbox', { name: 'Enter new password' }).fill('Zm!enione9');
  await page.getByRole('textbox', { name: 'Confirm password' }).click();
  await page.getByRole('textbox', { name: 'Confirm password' }).fill('Zm!enione9');
  await page.getByRole('button', { name: 'Save' }).click();

  // wylogowanie się
  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL('/');

  // nieudana próba zalogowania do systemu korzystając ze starego maila i hasła 
  await page.getByRole('button', { name: 'Sign up - it\'s free!' }).click();
  await page.getByRole('link', { name: 'Already have an account? Log' }).click();
  await expect(page).toHaveURL('/auth/login');
  await page.fill('input#email', 'johndoe@mail.com');
  await page.fill('input#password', '1qazXSW@');
  await page.click('app-form-button[buttonType="submit"]');
  await expect(page.getByRole('alert', { name: 'Email and password do not' })).toBeVisible();

  // udane logowanie korzystając ze zmienionych danych
  await login(page, 'zmienionymail@mail.com', 'Zm!enione9');
  await expect(page.getByRole('alert', { name: 'Logged in successfully' })).toBeVisible();

  // ponowna zmiana maila i hasła na te co były na początku
  await page.getByText('JD Profile').click();
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByRole('textbox', { name: 'Enter new email' }).click();
  await page.getByRole('textbox', { name: 'Enter new email' }).fill('johndoe@mail.com');
  await page.getByRole('checkbox', { name: 'Edit password' }).check();
  await page.getByRole('textbox', { name: 'Enter new password' }).click();
  await page.getByRole('textbox', { name: 'Enter new password' }).fill('1qazXSW@');
  await page.getByRole('textbox', { name: 'Confirm password' }).click();
  await page.getByRole('textbox', { name: 'Confirm password' }).fill('1qazXSW@');
  await page.getByRole('button', { name: 'Save' }).click();

  // usunięcie powiadomień (jeśli są)
  await delete_notifications(page);
});