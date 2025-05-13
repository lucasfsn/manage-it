import { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

let token: string;
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
  token = authenticationResponse.token;

  apiContext = await playwright.request.newContext({
    baseURL: baseUrl,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test('should delete a notification by id', async ({ notificationId }) => {
  const response = await apiContext.delete(`/api/v1/notifications/${notificationId}`);

  expect(response.status()).toBe(204);

  const getResponse = await apiContext.get('/api/v1/notifications');
  
    expect(getResponse.status()).toBe(200);
    const responseBody = await getResponse.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBe(1);
});

test('should not delete a notification with non-existent id', async () => {
  const nonExistentNotificationId = '00000000-0000-0000-0000-000000000000';

  const response = await apiContext.delete(`/api/v1/notifications/${nonExistentNotificationId}`);

  expect(response.status()).toBe(404);

  // zwraca 204, co oznacza, że można usunąć notification z nieistniejącym id
});

test('should return error while deleting notification with invalid id', async () => {
  const invalidNotificationId = 'invalid-id';

  const response = await apiContext.delete(`/api/v1/notifications/${invalidNotificationId}`);

  expect(response.status()).toBe(400);
});