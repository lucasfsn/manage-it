import { test, expect } from '@playwright/test';

test('check theme change, polish language, filters and search options', async ({ page }) => {
  // Dynamiczne daty
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 4);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 11);

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);

  await page.goto('/');

  // sprawdź zmianę motywu
  expect(await page.locator('html').getAttribute('class')).toBe('dark');
  await page.getByRole('button', { name: 'Change theme' }).click();
  expect(await page.locator('html').getAttribute('class')).toBe('');
  await page.getByRole('button', { name: 'Change theme' }).click();

  // sprawdzanie strony głównej po zmianie języka 
  await expect(page.getByRole('heading')).toContainText('Transform the Way You Work with Intuitive Project Management.');
  await expect(page.getByRole('paragraph')).toContainText('Discover a new level of productivity with our project management tool. Organize tasks, collaborate with your team, and track progress in real-time. Whether it\'s a small project or a large team, our intuitive interface and robust features will help you achieve your goals faster.');
  await page.getByRole('button', { name: 'Language menu' }).click();
  await page.locator('button').filter({ hasText: 'Polish' }).click();
  await expect(page.getByRole('heading')).toContainText('Zmień sposób pracy dzięki intuicyjnemu zarządzaniu projektami.');
  await expect(page.getByRole('paragraph')).toContainText('Odkryj nowy poziom produktywności dzięki naszemu narzędziu do zarządzania projektami. Organizuj zadania, współpracuj z zespołem i śledź postępy w czasie rzeczywistym. Niezależnie od tego, czy to mały projekt, czy duży zespół, nasz intuicyjny interfejs i solidne funkcje pomogą Ci szybciej osiągnąć cele.');

  // logowanie do systemu jako Sophia Jones
  await page.getByRole('link', { name: 'Zaloguj' }).click();
  await expect(page.locator('form')).toContainText('Utwórz konto');
  await page.getByRole('textbox', { name: 'Wprowadź swój email' }).click();
  await page.getByRole('textbox', { name: 'Wprowadź swój email' }).fill('sophia.jones@example.com');
  await page.getByRole('textbox', { name: 'Wprowadź swoje hasło' }).click();
  await page.getByRole('textbox', { name: 'Wprowadź swoje hasło' }).fill('1qazXSW@');
  await page.getByRole('textbox', { name: 'Wprowadź swoje hasło' }).press('Tab');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();

  // sprawdzenie widoku pulpitu
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('app-ongoing-projects')).toContainText('Trwające projekty');
  await expect(page.locator('app-upcoming-deadlines')).toContainText('Nadchodzące terminy');

  // utworzenie nowego projektu
  await page.getByRole('button', { name: 'Projekty' }).click();
  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await expect(page.locator('form')).toContainText('Nazwa projektuOpis0/1000Data rozpoczęciaData zakończeniaResetuj Utwórz projekt');
  await page.getByRole('textbox', { name: 'Nazwa projektu' }).click();
  await page.getByRole('textbox', { name: 'Nazwa projektu' }).fill('Polski projekt');
  await page.getByRole('textbox', { name: 'Nazwa projektu' }).press('Tab');
  await page.getByRole('textbox', { name: 'Opis' }).fill('Opis polskiego projektu');
  await page.getByRole('textbox', { name: 'Opis' }).press('Tab');
  await page.getByRole('textbox', { name: 'Data rozpoczęcia' }).fill(startDateStr);
  await page.getByRole('textbox', { name: 'Data zakończenia' }).fill(endDateStr);
  await page.getByRole('button', { name: 'Utwórz projekt' }).click();

  // sprawdzenie widoku projektu
  await expect(page.locator('h2')).toContainText('Polski projekt');
  await expect(page.locator('app-project-details')).toContainText('Opis polskiego projektu');
  await expect(page.locator('app-project-details')).toContainText('Lider projektu');
  await expect(page.locator('app-project-details')).toContainText('Członkowie');
  await expect(page.locator('app-project-details')).toContainText('Status');
  await expect(page.locator('app-project-details')).toContainText('W trakcie');
  await expect(page.locator('app-project-details')).toContainText('Data rozpoczęcia');
  await expect(page.locator('app-project-details')).toContainText('Data zakończenia');

  // sprawdzenie widoku pulpitu (czy projekt jest widoczny)
  await page.getByRole('button', { name: 'Pulpit' }).click();
  await expect(page.locator('app-ongoing-projects')).toContainText('Trwające projekty Polski projekt Brak zadań w tej chwili');
  
  // filtrowanie projektów
  await page.getByRole('button', { name: 'Projekty' }).click();
  await expect(page.getByRole('button', { name: 'Polski projekt Opis polskiego' })).toBeVisible();
  await page.getByPlaceholder('Filtruj po nazwie').click();
  await page.getByPlaceholder('Filtruj po nazwie').fill('nie');
  await expect(page.locator('app-projects-list')).toContainText('Brak projektów');
  await page.getByPlaceholder('Filtruj po nazwie').click();
  await page.getByPlaceholder('Filtruj po nazwie').fill('');
  await expect(page.getByRole('button', { name: 'Polski projekt Opis polskiego' })).toBeVisible();

  // sprawdzenie powiadomień
  await page.getByRole('button', { name: 'Powiadomienia' }).click();
  await expect(page.locator('app-notifications-list')).toContainText('Brak powiadomień');
  await expect(page.getByRole('heading')).toContainText('Powiadomienia');

  // sprawdzenie widoku profilu użytkownika
  await page.getByRole('button', { name: 'SJ Profil' }).click();
  await expect(page).toHaveURL('/users/sophia_jones');
  await expect(page.getByRole('button', { name: 'Edytuj profil' })).toBeVisible();
  await expect(page.locator('app-user-projects-list')).toContainText('Twoje Projekty');
  await expect(page.locator('app-user-projects-list')).toContainText('Polski projekt Opis polskiego projektu');

  // sprawdzenie wyszukiwarki
  await page.getByRole('button', { name: 'Szukaj...' }).click();
  await page.getByPlaceholder('Szukaj...').fill('jo');
  await expect(page.getByRole('list')).toContainText('Sophia Jones(Ty)');
  await expect(page.getByRole('list')).toContainText('John Doe');
  await page.getByRole('button', { name: 'John Doe' }).click();
  await expect(page).toHaveURL('/users/john_doe');
  await expect(page.getByText('JD John Doe @john_doe')).toBeVisible();

  // zakończenie, a następnie usunięcie projektu
  await page.getByRole('button', { name: 'Projekty' }).click();
  await page.getByRole('button', { name: 'Polski projekt Opis polskiego' }).click();
  await page.getByRole('button').filter({ hasText: 'done' }).click();
  await expect(page.locator('app-confirm-modal')).toContainText('Czy na pewno chcesz oznaczyć ten projekt jako zakończony?');
  await page.getByRole('button', { name: 'Tak' }).click();
  await expect(page.locator('app-project-details')).toContainText('Zakończony');
  await page.getByRole('button').filter({ hasText: 'delete' }).click();
  await expect(page.locator('app-confirm-modal')).toContainText('Czy na pewno chcesz usunąć ten projekt?');
  await page.getByRole('button', { name: 'Tak' }).click(); 
});