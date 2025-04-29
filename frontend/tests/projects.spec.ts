import { test, expect } from '@playwright/test';
import { login } from './helpers';

const global_today = new Date().toISOString().split('T')[0];

test('creating project & tasks overview', async ({ page }) => {
    await login(page);

    // Dynamiczne daty
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1); // Jutro
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 31); // Za 31 dni
    const taskDueDate = new Date(startDate);
    taskDueDate.setDate(startDate.getDate() + 2); // Za 2 dni
    const editedDueDate = new Date(startDate);
    editedDueDate.setDate(startDate.getDate() + 4); // Za 4 dni

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    const taskDueDateStr = formatDate(taskDueDate);
    const editedDueDateStr = formatDate(editedDueDate);

    const navElement = page.locator('div[routerlink="projects"]');
    await navElement.waitFor();
    await expect(navElement).toBeVisible();
    await navElement.click();

    // tworzenie projektu
    await expect(page).toHaveURL(/\/projects(\?.*)?/);
    await page.getByRole('button').filter({ hasText: 'add' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('Testowy Projekt');
    await page.getByRole('textbox', { name: 'Description' }).fill('Jakiś śmieszny projekt sobie zrobiłem.');
    await page.getByRole('textbox', { name: 'Start Date' }).fill(startDateStr);
    await page.getByRole('textbox', { name: 'End Date' }).fill(endDateStr);
    await page.getByRole('button', { name: 'Create Project' }).click();

    // dodawanie taska do utworzonego projektu
    await expect(page).toHaveURL(/\/projects\/[a-f0-9\-]{36}/);
    await page.locator('app-drag-drop-list div').filter({ hasText: 'In Progress add Add another' }).getByRole('button').click();
    await page.getByRole('textbox', { name: 'Description' }).fill('Dodanie testów pomimo braku kodu :0');
    await page.locator('#dueDate').fill(taskDueDateStr);
    await page.locator('#priority').selectOption('MEDIUM');
    await page.getByRole('button', { name: 'Add Task' }).click();
    await expect(page.locator('#inProgress')).toContainText(`Dodanie testów pomimo braku kodu :0 Medium schedule ${taskDueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);

    // edycja taska
    await page.getByText(`Dodanie testów pomimo braku kodu :0 Medium schedule ${taskDueDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`).click();
    await expect(page).toHaveURL(/\/projects\/[\da-f-]+\/tasks\/[\da-f-]+/i);
    await page.getByRole('button').filter({ hasText: 'edit' }).click();
    await page.getByRole('textbox', { name: 'Description' }).fill('Dodanie testów pomimo braku kodu :0 Edycja!');
    await page.getByRole('textbox', { name: 'Due Date' }).fill(editedDueDateStr);
    await page.getByLabel('Status').selectOption('NOT_STARTED');
    await page.getByRole('button', { name: 'Save changes' }).click();
    page.getByRole('button').filter({ hasText: 'arrow_back' }).click();
    await expect(page.locator('#notStarted')).toContainText(`Dodanie testów pomimo braku kodu :0 Edycja! Medium schedule ${editedDueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);

    // usunięcie projektu
    await page.getByRole('button').filter({ hasText: 'delete' }).click();
    await expect(page.locator('div').filter({ hasText: 'Are you sure you want to' }).nth(2)).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.getByLabel('Project has been deleted')).toContainText('Project has been deleted');
    await expect(page).toHaveURL(/\/projects(\?.*)?/);
});


test('creating task failed', async ({ page }) => {
    await login(page);
    
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
    await login(page);
    
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
