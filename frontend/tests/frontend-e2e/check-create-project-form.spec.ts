import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';

const global_today = new Date().toISOString().split('T')[0];

test('create project form with invalid data', async ({ page }) => {
  await login(page, 'johndoe@mail.com', '1qazXSW@');
    
  const navElement = page.locator('div[routerlink="projects"]');
  await navElement.waitFor();
  await expect(navElement).toBeVisible();
  await navElement.click();
    
  // tworzenie projektu z nieprawidłowymi danymi
  await expect(page).toHaveURL(/\/projects(\?.*)?/);
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await expect(page).toHaveURL('/projects/create');
    
  await page.getByRole('textbox', { name: 'Title' }).press('Tab');
  await page.getByRole('textbox', { name: 'Title' }).fill('x'.repeat(51));
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await expect(page.locator('form')).toContainText('Project title must be between 2 and 50 characters.');
  await page.getByRole('textbox', { name: 'Description' }).fill('ą');
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await expect(page.locator('form')).toContainText('Project description must be between 2 and 120 characters.');
  await page.getByRole('textbox', { name: 'Start Date' }).fill('2025-03-01');
  await expect(page.locator('form')).toContainText('Start date must be at least today.');
  await page.getByRole('textbox', { name: 'End Date' }).fill('2025-03-26');
  await page.getByRole('textbox', { name: 'Start Date' }).fill(global_today);
  await expect(page.locator('form')).toContainText('End date cannot be earlier than the start date.');

  await page.getByRole('button', { name: 'Create Project' }).waitFor();
  await expect(page.getByRole('button', { name: 'Create Project' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create Project' })).toBeDisabled();
});

test('check if reset form button is working', async ({ page }) => {
  await login(page, 'johndoe@mail.com', '1qazXSW@');
    
  const navElement = page.locator('div[routerlink="projects"]');
  await navElement.waitFor();
  await expect(navElement).toBeVisible();
  await navElement.click();
    
  // tworzenie projektu z nieprawidłowymi danymi
  await expect(page).toHaveURL(/\/projects(\?.*)?/);
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await expect(page).toHaveURL('/projects/create');
    
  await page.getByRole('textbox', { name: 'Title' }).press('Tab');
  await page.getByRole('textbox', { name: 'Title' }).fill('x'.repeat(51));
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await expect(page.locator('form')).toContainText('Project title must be between 2 and 50 characters.');
  await page.getByRole('textbox', { name: 'Description' }).fill('ą');
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await expect(page.locator('form')).toContainText('Project description must be between 2 and 120 characters.');
  await page.getByRole('textbox', { name: 'Start Date' }).fill('2025-03-01');
  await expect(page.locator('form')).toContainText('Start date must be at least today.');
  await page.getByRole('textbox', { name: 'End Date' }).fill('2025-03-26');
  await page.getByRole('textbox', { name: 'Start Date' }).fill(global_today);
  await expect(page.locator('form')).toContainText('End date cannot be earlier than the start date.');

  // sprawdź działanie przycisku do resetowania danych
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('textbox', { name: 'Title' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Description' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Start Date' })).toHaveValue(global_today);
  await expect(page.getByRole('textbox', { name: 'End Date' })).toHaveValue(global_today);
});
