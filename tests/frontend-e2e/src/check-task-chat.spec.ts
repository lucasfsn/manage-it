import { test, expect } from '@playwright/test';
import { login } from './helpers/login';
import { delete_notifications } from './helpers/delete_notifications';

test('should handle task chat and allow assigned member to rename or delete the task', async ({ page }) => {
  // Dynamiczne daty
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 4);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 10);
  const taskDueDate = new Date(today);
  taskDueDate.setDate(today.getDate() + 8);

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);
  const taskDueDateStr = formatDate(taskDueDate);

  await login(page, 'johndoe@mail.com', '1qazXSW@');

  // utworzenie projektu
  await page.getByText('Projects', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await page.getByRole('textbox', { name: 'Project name' }).click();
  await page.getByRole('textbox', { name: 'Project name' }).fill('Projekt z chatem dla taska');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Projekt do testowania czatu');
  await page.getByRole('textbox', { name: 'Start Date' }).fill(startDateStr);
  await page.getByRole('textbox', { name: 'End Date' }).fill(endDateStr);
  await page.getByRole('button', { name: 'Create Project' }).click();

  // sprawdzenie danych projektu
  await expect(page.locator('h2')).toContainText('Projekt z chatem dla taska');
  await expect(page.locator('app-project-details')).toContainText('Projekt do testowania czatu');

  // utworzenie taska
  await page.locator('app-drag-drop-list div').filter({ hasText: 'In Progress add Add another' }).getByRole('button').click();
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Task z chatem');
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await page.getByRole('textbox', { name: 'Due Date' }).fill(taskDueDateStr);
  await page.getByLabel('Priority').selectOption('MEDIUM');
  await page.getByLabel('Priority').press('Tab');
  await page.getByRole('button', { name: 'Create task' }).click();

  await expect(page.getByRole('alert', { name: 'Task has been created' })).toBeVisible();
  await expect(page.locator('#inProgress')).toContainText(`Task z chatem Medium schedule ${taskDueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);

  // dodanie członka do projektu
  await page.getByRole('button').filter({ hasText: /^add$/ }).click();
  await page.getByPlaceholder('Type to search...').fill('mi');
  await page.getByRole('button', { name: 'Michael Johnson' }).click();
  await expect(page.getByText('MJ Michael Johnson @')).toBeVisible();
  await page.getByRole('button', { name: 'Add to project' }).click();

  // przydzielenie członka do taska
  await page.getByRole('button', { name: `Task z chatem Medium ${taskDueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` }).click();
  await page.getByRole('textbox', { name: 'Search users' }).click();
  await page.getByRole('textbox', { name: 'Search users' }).fill('mic');
  await expect(page.getByRole('listitem')).toContainText('MJ Michael Johnson (michael_johnson) person_add');
  await page.getByRole('button').filter({ hasText: 'person_add' }).click();
  await expect(page.getByRole('alert', { name: 'Michael Johnson has been' })).toBeVisible();

  // sprawdzenie chatu jako zalogowany użytkownik (John Doe)
  await page.getByRole('button').filter({ hasText: 'chat' }).click();
  await page.getByRole('textbox', { name: 'Message...' }).click();
  await page.getByRole('textbox', { name: 'Message...' }).fill('witam w tasku');
  await page.getByRole('button').filter({ hasText: 'north' }).click();
  await expect(page.locator('app-chat')).toContainText('witam w tasku');
  await page.getByRole('textbox', { name: 'Message...' }).click();
  await page.getByRole('textbox', { name: 'Message...' }).fill('wysyłam wiadomość enterem');
  await page.getByRole('textbox', { name: 'Message...' }).press('Enter');
  await expect(page.locator('app-chat')).toContainText('wysyłam wiadomość enterem');
  await page.getByRole('button').filter({ hasText: 'keyboard_arrow_up' }).click();

  // wylogowanie się i zalogowanie jako Michael Johnson
  await page.getByRole('button', { name: 'Log out' }).click();
  await login(page, 'michael.johnson@example.com', '1qazXSW@');

  await expect(page.getByRole('alert', { name: 'Logged in successfully' })).toBeVisible();
  
  // wejście do projektu i taska
  await expect(page.locator('app-upcoming-deadlines')).toContainText(`Upcoming deadlines Projekt z chatem dla taska Deadline: ${endDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
  await page.getByRole('button', { name: `Projekt z chatem dla taska Deadline: ${endDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` }).click();
  await expect(page.locator('#inProgress')).toContainText(`Task z chatem Medium schedule ${taskDueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} MJ`);
  await page.getByRole('button', { name: `Task z chatem Medium ${taskDueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` }).click();
  await expect(page.getByRole('heading')).toContainText('Task z chatem');

  // sprawdzenie czatu jako członek przydzielony do taska (Michael Johnson)
  await page.getByRole('button').filter({ hasText: 'chat' }).click();
  await expect(page.locator('app-chat')).toContainText('witam w tasku');
  await expect(page.locator('app-chat')).toContainText('wysyłam wiadomość enterem');
  await page.getByRole('textbox', { name: 'Message...' }).click();
  await page.getByRole('textbox', { name: 'Message...' }).fill('witam john doe');
  await page.getByRole('button').filter({ hasText: 'north' }).click();
  await expect(page.locator('app-chat')).toContainText('witam john doe');
  await page.getByRole('button').filter({ hasText: 'keyboard_arrow_up' }).click();

  // edycja i usunięcie taska jako członek przydzielony do zadania
  await page.getByRole('button').filter({ hasText: 'edit' }).click();
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Task z chatem by Michael');
  await page.getByRole('textbox', { name: 'Description' }).press('Tab');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading')).toContainText('Task z chatem by Michael');
  await page.getByRole('button').filter({ hasText: 'delete' }).click();
  await expect(page.locator('app-confirm-modal')).toContainText('Are you sure you want to delete this task?');
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('alert', { name: 'Task has been deleted' })).toBeVisible();
  await page.getByRole('button').filter({ hasText: 'arrow_back' }).click();

  await page.getByRole('button', { name: 'Log out' }).click();
  await login(page, 'johndoe@mail.com', '1qazXSW@');

  await page.getByRole('button', { name: 'Projects' }).click();
  await page.getByRole('button', { name: 'Projekt z chatem dla taska' }).click();
  await expect(page.locator('h2')).toContainText('Projekt z chatem dla taska');
  await expect(page.locator('app-drag-drop-list')).toContainText('In Progress add Add another task');

  // usunięcie projektu
  await page.getByRole('button').filter({ hasText: 'delete' }).click();
  await expect(page.locator('div').filter({ hasText: 'Are you sure you want to' }).nth(2)).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('alert', { name: 'Project has been deleted' })).toBeVisible();
  await expect(page).toHaveURL(/\/projects(\?.*)?/);

  // usunięcie powiadomień (jeśli są)
  await delete_notifications(page);
});