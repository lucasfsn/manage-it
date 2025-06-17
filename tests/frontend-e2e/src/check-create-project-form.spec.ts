import { test, expect } from '@playwright/test';
import { login } from './helpers/login';

const globalToday = new Date().toISOString().split('T')[0];

test('should display errors while creating project with invalid inputs', async ({ page }) => {
  await login(page, 'johndoe@mail.com', '1qazXSW@');
    
  await page.getByText('Projects', { exact: true }).click();
  await expect(page).toHaveURL(/\/projects(\?.*)?/);  

  // tworzenie projektu z nieprawidłowymi danymi
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await expect(page).toHaveURL('/projects/create');
    
  await page.getByRole('textbox', { name: 'Project name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Project name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await expect(page.locator('app-form-text-input-control')).toContainText('Project name must be at least 5 characters long.');
  await page.getByRole('textbox', { name: 'Description' }).fill('x');
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await expect(page.locator('app-form-textarea-input-control')).toContainText('Project description must be at least 5 characters long.');
  await page.getByRole('textbox', { name: 'Deadline' }).fill('2025-03-26');
  await page.getByRole('textbox', { name: 'Project name' }).click();
  await expect(page.locator('form')).toContainText('The project deadline must be in the future.');

  await page.getByRole('button', { name: 'Create Project' }).waitFor();
  await expect(page.getByRole('button', { name: 'Create Project' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create Project' })).toBeDisabled();
});

test('should reset form by clicking the button', async ({ page }) => {
  await login(page, 'johndoe@mail.com', '1qazXSW@');
    
  await page.getByText('Projects', { exact: true }).click();
  await expect(page).toHaveURL(/\/projects(\?.*)?/);
    
  // tworzenie projektu z nieprawidłowymi danymi
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await expect(page).toHaveURL('/projects/create');
    
  await page.getByRole('textbox', { name: 'Project name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Project name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await expect(page.locator('app-form-text-input-control')).toContainText('Project name must be at least 5 characters long.');
  await page.getByRole('textbox', { name: 'Description' }).fill('x');
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await expect(page.locator('app-form-textarea-input-control')).toContainText('Project description must be at least 5 characters long.');
  await page.getByRole('textbox', { name: 'Deadline' }).fill('2025-03-26');

  // sprawdź działanie przycisku do resetowania danych
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('textbox', { name: 'Project name' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Description' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Deadline' })).toBeEmpty();
});
