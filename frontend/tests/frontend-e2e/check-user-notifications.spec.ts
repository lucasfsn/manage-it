import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import { delete_notifications } from '../helpers/delete_notifications';

test('create project, add new member to project and check notifications', async ({ page }) => {
    // Dynamiczne daty
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 4);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 31);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    await login(page, 'johndoe@mail.com', '1qazXSW@');
    
    const navElement = page.locator('div[routerlink="projects"]');
    await navElement.waitFor();
    await expect(navElement).toBeVisible();
    await navElement.click();
        
    // sprawdź poprawnośc adresów URL
    await expect(page).toHaveURL(/\/projects(\?.*)?/);
    await page.getByRole('button').filter({ hasText: 'add' }).click();
    await expect(page).toHaveURL('/projects/create');
        
    // dodaj nowy projekt
    await page.getByRole('textbox', { name: 'Title' }).fill('Testowy projekt');
    await page.getByRole('textbox', { name: 'Description' }).fill('Tajne description testowego projektu');
    await page.getByRole('textbox', { name: 'Start Date' }).fill(startDateStr);
    await page.getByRole('textbox', { name: 'End Date' }).fill(endDateStr);
    await page.getByRole('button', { name: 'Create Project' }).click();

    // sprawdź poprawność wyświetlania danych utworzonego projektu
    await expect(page.locator('h2')).toContainText('Testowy projekt');
    await expect(page.locator('app-project-details')).toContainText('In progress');

    // edycja projektu
    await page.locator('app-button').filter({ hasText: 'edit' }).getByRole('button').click();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('Testowy projekt zedytowany');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.locator('h2')).toContainText('Testowy projekt zedytowany');

    // dodanie nowej osoby do projektu
    await page.getByRole('button').filter({ hasText: /^add$/ }).click();
    await page.getByPlaceholder('Type to search...').click();
    await page.getByPlaceholder('Type to search...').fill('ma');
    await page.getByText('Mia Martinez').click();
    await expect(page.getByText('MM Mia Martinez @mia_martinez')).toBeVisible();
    await page.getByRole('button', { name: 'Add to Project' }).click();
    await expect(page.getByRole('alert', { name: 'Mia Martinez has been added' })).toBeVisible();
    // await expect(page.getByLabel('Mia Martinez has been added')).toContainText('Mia Martinez has been added to project');

    // sprawdzenie powiadomień
    await page.getByText('Notifications', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    await expect(page.getByRole('list')).toContainText('joined Testowy projekt zedytowany');
    await expect(page.getByRole('list')).toContainText('Mia Martinez');
    
    // przejście do widoku projektu z poziomu powiadomień
    await page.getByText('MM Mia Martinez joined').click();
    await expect(page).toHaveURL(/\/projects\/[a-f0-9\-]{36}/);
    await expect(page.locator('h2')).toContainText('Testowy projekt zedytowany');
    await page.getByText('Notifications', { exact: true }).click();
    await expect(page.locator('app-notifications-list')).toContainText('You are up to date');

    // usunięcie osoby z projektu
    await page.getByText('folder_open Projects').click();
    await page.locator('div').filter({ hasText: 'Testowy projekt zedytowany' }).nth(2).click();
    await page.getByRole('list').getByRole('button').filter({ hasText: 'edit' }).click();
    await page.getByRole('button', { name: 'MM Mia Martinez' }).getByRole('button').click();
    await expect(page.getByRole('alert', { name: 'Mia Martinez has been removed' })).toBeVisible();
    // await expect(page.getByLabel('Mia Martinez has been removed')).toContainText('Mia Martinez has been removed from project');
    await page.getByRole('button').filter({ hasText: 'close' }).click();

    // usunięcie projektu
    await page.getByRole('button').filter({ hasText: 'delete' }).click();
    await expect(page.locator('div').filter({ hasText: 'Are you sure you want to' }).nth(2)).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    // await expect(page.getByLabel('Project has been deleted')).toContainText('Project has been deleted');
    await expect(page.getByRole('alert', { name: 'Project has been deleted' })).toBeVisible();

    // usunięcie powiadomień (jeśli są)
    await delete_notifications(page);
});
