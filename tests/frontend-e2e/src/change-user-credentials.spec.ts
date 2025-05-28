import { test, expect } from '@playwright/test';
import { login } from './helpers/login';
import { delete_notifications } from './helpers/delete_notifications';

test('should change user last name and password', async ({ page }) => {
  await login(page, 'isabella.garcia@example.com', '1qazXSW@');
  await expect(page).toHaveURL('/dashboard');

  // przejdź do formularza edycji danych użytkownika 
  await page.getByText('IG Profile').click();
  await expect(page.locator('h2')).toContainText('Isabella Garcia');
  await expect(page.locator('app-user-header')).toContainText('@isabella_garcia');
  await page.getByRole('button', { name: 'Edit profile' }).click();

  // sprawdź poprawność wczytywania danych początkowych do formularza
  await expect(page.locator('form')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('Isabella');
  await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('Garcia');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('isabella.garcia@example.com');

  // zmiana nazwiska i hasła dla zalogowanego użytkownika 
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Gracias');
  await page.getByRole('checkbox', { name: 'Edit password' }).check();
  await page.getByRole('textbox', { name: 'Enter new password' }).click();
  await page.getByRole('textbox', { name: 'Enter new password' }).fill('1qazXSW@');
  await page.getByRole('textbox', { name: 'Repeat new password' }).click();
  await page.getByRole('textbox', { name: 'Repeat new password' }).fill('1qazXSW@');
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // sprawdzenie wyświetlania na stronie
  await expect(page.locator('h2')).toContainText('Isabella Gracias');
  await expect(page.locator('app-user-header')).toContainText('@isabella_garcia');

  // przywrócenie poprzednich danych
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Garcia');
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
});

test('should reset change user credentials form by clicking the button', async ({ page }) => {
  await login(page, 'isabella.garcia@example.com', '1qazXSW@');

  await page.getByText('IG Profile').click();
  await page.getByRole('button', { name: 'Edit profile' }).click();

  await expect(page.locator('form')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('Isabella');
  await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('Garcia');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('isabella.garcia@example.com');

  // uzupełnienie formularza testowymi danymi 
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('Izka');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Gracias');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('isabella.garcia@example.com');

  // sprawdzenie wartości w polach formularza do edycji danych użytkownika przed zresetowaniem
  await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('Izka');
  await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('Gracias');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('isabella.garcia@example.com');

  await page.getByRole('button', { name: 'Reset' }).click();

  // sprawdzenie wartości w polach formularza do edycji danych użytkownika po zresetowaniu
  await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('Isabella');
  await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('Garcia');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('isabella.garcia@example.com');
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
  await page.getByRole('button').filter({ hasText: 'close' }).click();
});

test('should change email and password', async ({ page }) => {
  await login(page, 'isabella.garcia@example.com', '1qazXSW@');
  
  await page.getByText('IG Profile').click();
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('Isabella');
  await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('Garcia');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('isabella.garcia@example.com');
  
  // zmiana maila i hasła użytkownika
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('zmienionymail@mail.com');
  await page.getByRole('checkbox', { name: 'Edit password' }).check();
  await page.getByRole('textbox', { name: 'Enter new password' }).click();
  await page.getByRole('textbox', { name: 'Enter new password' }).fill('Zm!enione9');
  await page.getByRole('textbox', { name: 'Repeat new password' }).click();
  await page.getByRole('textbox', { name: 'Repeat new password' }).fill('Zm!enione9');
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // wylogowanie się
  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL('/');

  // nieudana próba zalogowania do systemu korzystając ze starego maila i hasła 
  await page.getByRole('button', { name: 'Sign up - it\'s free!' }).click();
  await page.getByRole('link', { name: 'Already have an account? Log' }).click();
  await expect(page).toHaveURL('/auth/login');
  await page.fill('input#email', 'isabella.garcia@example.com');
  await page.fill('input#password', '1qazXSW@');
  await page.locator('input#email').click();
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('alert', { name: 'Login failed. Please check' })).toBeVisible();
                                                
  // udane logowanie korzystając ze zmienionych danych
  await login(page, 'zmienionymail@mail.com', 'Zm!enione9');
  await expect(page.getByRole('alert', { name: 'Logged in successfully' })).toBeVisible();

  // ponowna zmiana maila i hasła na te co były na początku
  await page.getByText('IG Profile').click();
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('isabella.garcia@example.com');
  await page.getByRole('checkbox', { name: 'Edit password' }).check();
  await page.getByRole('textbox', { name: 'Enter new password' }).click();
  await page.getByRole('textbox', { name: 'Enter new password' }).fill('1qazXSW@');
  await page.getByRole('textbox', { name: 'Repeat new password' }).click();
  await page.getByRole('textbox', { name: 'Repeat new password' }).fill('1qazXSW@');
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // usunięcie powiadomień (jeśli są)
  await delete_notifications(page);
});