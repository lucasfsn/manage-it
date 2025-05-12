import { test, expect } from '@playwright/test';
import { login } from './helpers/login';
import { delete_notifications } from './helpers/delete_notifications';

test('create project, add new tasks and edit task', async ({ page }) => {
  // Dynamiczne daty
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 1); // Jutro
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 31); // Za 31 dni

  const task1DueDate = new Date(today);
  task1DueDate.setDate(today.getDate() + 8);
  const task2DueDate = new Date(today);
  task2DueDate.setDate(today.getDate() + 12);

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);
  const task1DueDateStr = formatDate(task1DueDate);
  const task2DueDateStr = formatDate(task2DueDate);

  // zalogowanie i przejście do projektów
  await login(page, 'johndoe@mail.com', '1qazXSW@');
  await expect(page).toHaveURL('/dashboard');

  const navElement = page.locator('div[routerlink="projects"]');
  await navElement.waitFor();
  await expect(navElement).toBeVisible();
  await navElement.click();

  // tworzenie projektu
  await expect(page).toHaveURL(/\/projects(\?.*)?/);
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Testowy projekt');
  await page.getByRole('textbox', { name: 'Description' }).fill('Projekt do testowania tasków');
  await page.getByRole('textbox', { name: 'Start Date' }).fill(startDateStr);
  await page.getByRole('textbox', { name: 'End Date' }).fill(endDateStr);
  await page.getByRole('button', { name: 'Create Project' }).click();

  await expect(page).toHaveURL(/\/projects\/[a-f0-9-]{36}/);

  // dodanie taska o statusie ukończony
  await page.locator('app-drag-drop-list div').filter({ hasText: 'Completed add Add another task' }).getByRole('button').click();
  await expect(page.getByText('add_taskAdd TaskcloseDescriptionDue DatePriority Low Medium High Reset Add Task')).toBeVisible();
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('New completed task');
  await page.getByRole('textbox', { name: 'Due Date' }).fill(task1DueDateStr);
  await page.getByLabel('Priority').selectOption('LOW');
  // await page.getByRole('button', { name: 'Add Task' }).click();
  
  await expect(page.getByRole('textbox', { name: 'Description' })).toHaveValue('New completed task');
  await expect(page.getByRole('textbox', { name: 'Due Date' })).toHaveValue(task1DueDateStr);
  await expect(page.getByLabel('Priority')).toHaveValue('LOW');
  await page.getByRole('button', { name: 'Add Task' }).click();

  // sprawdzanie czy task został poprawnie dodany
  await expect(page.locator('#completed')).toContainText(`New completed task Low schedule ${task1DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);

  // sprawdzanie stanu projektu (ile procent tasków w projekcie jest ukończonych)
  await page.getByText('folder_open Projects').click();
  await expect(page.locator('app-projects-list')).toContainText(`Testowy projekt Projekt do testowania tasków Start date: ${startDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} Deadline: ${endDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 100% Completed`);
  await page.locator('div').filter({ hasText: 'Testowy projekt Projekt do' }).nth(2).click();

  // dodanie nowego taska - tym razem jako nadchodzący
  await page.locator('app-drag-drop-list div').filter({ hasText: 'Upcoming add Add another task' }).getByRole('button').click();
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Task for future');
  await page.getByRole('textbox', { name: 'Due Date' }).fill(task2DueDateStr);
  await page.getByRole('button', { name: 'Add Task' }).click();

  // await expect(page.getByLabel('Task has been created')).toContainText('Task has been created');
  await expect(page.getByRole('alert', { name: 'Task has been created' })).toBeVisible();
  await expect(page.locator('#notStarted')).toContainText(`Task for future Low schedule ${task2DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);

  // sprawdzanie stanu projektu (ile procent tasków w projekcie jest ukończonych)
  await page.getByText('folder_open Projects').click();
  await expect(page.locator('app-projects-list')).toContainText(`Testowy projekt Projekt do testowania tasków Start date: ${startDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} Deadline: ${endDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 50% Completed`);
  await page.locator('div').filter({ hasText: 'Testowy projekt Projekt do' }).nth(2).click();

  // edycja taska 
  await page.getByText(`Task for future Low schedule ${task2DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`).click();
  await expect(page.getByRole('heading')).toContainText('Task for future');
  await page.getByRole('button').filter({ hasText: 'edit' }).click();
  await expect(page.locator('app-task-edit-form')).toContainText('Edit Task');
  await expect(page.getByRole('textbox', { name: 'Description' })).toHaveValue('Task for future');
  await expect(page.getByRole('textbox', { name: 'Due Date' })).toHaveValue(task2DueDateStr);
  await expect(page.getByLabel('Status')).toHaveValue('NOT_STARTED');
  await expect(page.getByLabel('Priority')).toHaveValue('LOW');
  await page.getByLabel('Status').selectOption('IN_PROGRESS');
  await page.getByLabel('Priority').selectOption('MEDIUM');


  // tu coś nie działa, nie mam pojęcia czemu przycisk jest disabled w Playwright (w przeglądarce wszystko ok)
  await page.getByRole('button', { name: 'Save changes' }).click();

  // sprawdzanie zedytowanych danych taska
  await expect(page.getByRole('alert', { name: 'Task has been updated' })).toBeVisible();
  await page.getByRole('button').filter({ hasText: 'arrow_back' }).click();
  await expect(page.locator('#inProgress')).toContainText(`Task for future Medium schedule ${task2DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);

  // usunięcie projektu
  await page.getByRole('button').filter({ hasText: 'delete' }).click();
  await expect(page.locator('div').filter({ hasText: 'Are you sure you want to' }).nth(2)).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('alert', { name: 'Project has been deleted' })).toBeVisible();
  await expect(page).toHaveURL(/\/projects(\?.*)?/);

  // usunięcie powiadomień (jeśli są)
  await delete_notifications(page);
});

test('create project with tasks and add new members to task', async ({ page }) => {
  // Dynamiczne daty
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 1); // Jutro
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 31); // Za 31 dni

  const task1DueDate = new Date(today);
  task1DueDate.setDate(today.getDate() + 8);

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);
  const task1DueDateStr = formatDate(task1DueDate);

  // zalogowanie i przejście do projektów
  await login(page, 'johndoe@mail.com', '1qazXSW@');
  await expect(page).toHaveURL('/dashboard');

  const navElement = page.locator('div[routerlink="projects"]');
  await navElement.waitFor();
  await expect(navElement).toBeVisible();
  await navElement.click();

  // tworzenie projektu
  await expect(page).toHaveURL(/\/projects(\?.*)?/);
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Taskowy projekt');
  await page.getByRole('textbox', { name: 'Description' }).fill('Projekt do tasków');
  await page.getByRole('textbox', { name: 'Start Date' }).fill(startDateStr);
  await page.getByRole('textbox', { name: 'End Date' }).fill(endDateStr);
  await page.getByRole('button', { name: 'Create Project' }).click();

  await expect(page).toHaveURL(/\/projects\/[a-f0-9-]{36}/);

  // utworzenie nowego taska
  await page.locator('app-drag-drop-list div').filter({ hasText: 'In Progress add Add another' }).getByRole('button').click();
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Add member to task');
  await page.getByRole('textbox', { name: 'Due Date' }).fill(task1DueDateStr);
  await page.getByRole('button', { name: 'Add Task' }).click();
  
  await expect(page.getByRole('alert', { name: 'Task has been created' })).toBeVisible();
  await expect(page.locator('#inProgress')).toContainText(`Add member to task Low schedule ${task1DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
  
  // dodanie nowego członka do projektu
  await page.getByRole('button').filter({ hasText: /^add$/ }).click();
  await page.getByPlaceholder('Type to search...').click();
  await page.getByPlaceholder('Type to search...').fill('so');
  await page.getByText('Sophia Jones').click();
  await expect(page.getByText('SJ Sophia Jones @sophia_jones')).toBeVisible();
  await page.getByRole('button', { name: 'Add to Project' }).click();

  await page.getByText(`Add member to task Low schedule ${task1DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`).click();
  await expect(page).toHaveURL(/\/projects\/[a-f0-9-]{36}\/tasks\/[a-f0-9-]{36}/);    
  
  // przypisanie członka do taska
  await page.getByText('person_add').click();
  await page.getByRole('textbox', { name: 'Search users' }).click();
  await page.getByRole('textbox', { name: 'Search users' }).fill('so');
  await expect(page.getByText('SJ Sophia Jones (sophia_jones) person_add')).toBeVisible();
  await expect(page.getByRole('listitem')).toContainText('SJ Sophia Jones (sophia_jones) person_add');
  await page.getByText('SJ Sophia Jones (sophia_jones) person_add').click();
  await page.getByRole('button').filter({ hasText: 'person_add' }).click();
  await expect(page.getByRole('alert', { name: 'Sophia Jones has been added' })).toBeVisible();

  await page.getByRole('button').filter({ hasText: 'arrow_back' }).click();
  await expect(page.locator('h2')).toContainText('Taskowy projekt');

  // dodanie nowego członka do projektu
  await page.getByRole('button').filter({ hasText: /^add$/ }).click();
  await page.getByPlaceholder('Type to search...').fill('mi');
  await page.getByText('Emily Davis').click();
  await expect(page.getByText('ED Emily Davis @emily_davis')).toBeVisible();
  await page.getByRole('button', { name: 'Add to Project' }).click();
  await expect(page.getByRole('alert', { name: 'Emily Davis has been added to' })).toBeVisible();

  // przydzielenie nowego członka do taska i sprawdzanie wyświetlania danych
  await expect(page.locator('#inProgress')).toContainText(`Add member to task Low schedule ${task1DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} SJ`);
  await page.getByText(`Add member to task Low schedule ${task1DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} SJ`).click();

  await page.getByText('person_add').click();
  await page.getByText('manage_accounts').click();
  await page.getByRole('textbox', { name: 'Search users' }).click();
  await page.getByRole('textbox', { name: 'Search users' }).fill('');
  await expect(page.getByRole('listitem')).toContainText('SJ Sophia Jones (sophia_jones) person_remove');
  await page.getByText('person_add').click();
  await expect(page.locator('app-users-list')).toContainText('Assign new users to the task or start typing to search for users');
  await page.getByRole('textbox', { name: 'Search users' }).click();
  await page.getByRole('textbox', { name: 'Search users' }).fill('emi');
  await expect(page.getByRole('listitem')).toContainText('ED Emily Davis (emily_davis) person_add');
  await page.getByRole('button').filter({ hasText: 'person_add' }).click();
  await expect(page.getByRole('alert', { name: 'Emily Davis has been added to' })).toBeVisible();
  await expect(page.locator('app-users-list')).toContainText('SJ Sophia Jones (sophia_jones) person_remove');
  await expect(page.locator('app-users-list')).toContainText('ED Emily Davis (emily_davis) person_remove');

  await page.getByRole('button').filter({ hasText: 'arrow_back' }).click();
  await expect(page.locator('h2')).toContainText('Taskowy projekt');
  await expect(page.locator('#inProgress')).toContainText(`Add member to task Low schedule ${task1DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} SJ ED`);
  
  // usunięcie Emily Davis
  await page.getByText(`Add member to task Low schedule ${task1DueDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} SJ ED`).click();
  await page.getByRole('listitem').filter({ hasText: 'ED Emily Davis (emily_davis)' }).getByRole('button').click();
  await expect(page.getByRole('alert', { name: 'Emily Davis has been removed' })).toBeVisible();
  await expect(page.locator('app-task-details')).toContainText('personAssignees SJ priority_highPriority Low');

  // usunięcie taska
  await page.getByRole('button').filter({ hasText: 'delete' }).click();
  await expect(page.locator('div').filter({ hasText: 'Are you sure you want to' }).nth(2)).toBeVisible();
  await page.locator('div').filter({ hasText: 'Are you sure you want to' }).nth(2).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('alert', { name: 'Task has been deleted' })).toBeVisible();

  // usunięcie projektu
  await page.getByRole('button').filter({ hasText: 'delete' }).click();
  await expect(page.locator('div').filter({ hasText: 'Are you sure you want to' }).nth(2)).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('alert', { name: 'Project has been deleted' })).toBeVisible();
  await expect(page).toHaveURL(/\/projects(\?.*)?/);

  // usunięcie powiadomień (jeśli są)
  await delete_notifications(page);
});

