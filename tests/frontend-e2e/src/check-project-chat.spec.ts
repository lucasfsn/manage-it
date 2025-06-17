import { test, expect } from '@playwright/test';
import { login } from './helpers/login';
import { delete_notifications } from './helpers/delete_notifications';

test('should create project and check if project chat is working for different users', async ({ page }) => {
  // Dynamiczne daty
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 31);

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];
  const endDateStr = formatDate(endDate);

  await login(page, 'johndoe@mail.com', '1qazXSW@');

  // utworzenie projektu
  await page.getByText('Projects', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await page.getByRole('textbox', { name: 'Project name' }).click();
  await page.getByRole('textbox', { name: 'Project name' }).fill('Chatowy projekt');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Projekt do testowania czatu');
  await page.getByRole('textbox', { name: 'Deadline' }).fill(endDateStr);
  await page.getByRole('textbox', { name: 'Project name' }).click();
  await page.getByRole('button', { name: 'Create Project' }).click();

  // wysłanie wiadomości na czacie
  await page.getByRole('button').filter({ hasText: 'chat' }).click();
  await page.getByRole('textbox', { name: 'Send message' }).click();
  await page.getByRole('textbox', { name: 'Send message' }).fill('dzień dobry');
  await page.getByRole('textbox', { name: 'Send message' }).press('Enter');
  await expect(page.locator('app-chat')).toContainText('dzień dobry');
  await page.getByRole('button').filter({ hasText: 'keyboard_arrow_up' }).click();

  // dodanie nowego użytkownika do projektu
  await page.getByRole('button').filter({ hasText: /^add$/ }).click();
  await page.getByPlaceholder('Type to search...').fill('so');
  await page.getByText('Michael Johnson').click();
  await expect(page.getByText('MJ Michael Johnson @')).toBeVisible();
  await page.getByRole('button', { name: 'Add to Project' }).click();

  // wysłanie kolejnej wiadomości jako John Doe
  await page.getByRole('button').filter({ hasText: 'chat' }).click();
  await page.getByRole('textbox', { name: 'Send message' }).fill('witam panie michael');
  await page.getByRole('textbox', { name: 'Send message' }).press('Enter');
  await expect(page.locator('app-chat')).toContainText('witam panie michael');
  await page.getByRole('button').filter({ hasText: 'keyboard_arrow_up' }).click();

  // wylogowanie się i zalogowanie jako Michael Johnson
  await page.getByRole('button', { name: 'Log out' }).click();
  await login(page, 'michael.johnson@example.com', '1qazXSW@');

  // wejście do projektu i sprawdzenie czatu projektu 
  await page.getByText('folder_open Projects').click();
  await expect(page.locator('div').filter({ hasText: 'Chatowy projekt Projekt do' }).nth(2)).toBeVisible();
  await page.getByRole('button', { name: 'Chatowy projekt Projekt do' }).click();
  await expect(page.locator('h2')).toContainText('Chatowy projekt');
  await expect(page.locator('app-project-details')).toContainText('Projekt do testowania czatu');
  await page.getByRole('button').filter({ hasText: 'chat' }).click();
  await expect(page.locator('app-chat')).toContainText('dzień dobry');
  await expect(page.locator('app-chat')).toContainText('witam panie michael');
  
  // wysłanie wiadomości w czacie projektu jako Michael Johnson
  await page.getByRole('textbox', { name: 'Send message' }).click();
  await page.getByRole('textbox', { name: 'Send message' }).fill('witam johndoe');
  await page.getByRole('textbox', { name: 'Send message' }).press('Enter');
  await expect(page.locator('app-chat')).toContainText('witam johndoe');

  // wysłanie emotki w czacie projektu
  await page.getByRole('button').filter({ hasText: 'sentiment_satisfied_alt' }).click();
  await page.getByLabel('😎, sunglasses').locator('span').click();
  await page.getByRole('textbox', { name: 'Send message' }).press('Enter');
  await expect(page.locator('app-chat')).toContainText('😎');

  // zalogowanie jako John Doe
  await page.getByRole('button').filter({ hasText: 'keyboard_arrow_up' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  await login(page, 'johndoe@mail.com', '1qazXSW@'); 
  await page.getByText('folder_open Projects').click();
  await page.getByRole('button', { name: 'Chatowy projekt Projekt do' }).click();
  await page.getByRole('button').filter({ hasText: 'chat' }).click();

  // sprawdzenie wyświetlania wiadomości w czacie jako John Doe
  await expect(page.locator('app-chat')).toContainText('dzień dobry');
  await expect(page.locator('app-chat')).toContainText('witam panie michael');
  await expect(page.locator('app-chat')).toContainText('witam johndoe');
  await expect(page.locator('app-chat')).toContainText('😎');
  await page.getByRole('button').filter({ hasText: 'keyboard_arrow_up' }).click();

  // usunięcie projektu
  await page.getByRole('button').filter({ hasText: 'delete' }).click();
  await expect(page.locator('div').filter({ hasText: 'Are you sure you want to' }).nth(2)).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('alert', { name: 'Project has been deleted' })).toBeVisible();

  // usunięcie powiadomień (jeśli są)
  await delete_notifications(page);
});