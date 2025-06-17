import { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

let token: string;
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
  token = authenticationResponse.accessToken;

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

test('should get notifications for the authenticated user', async ({ storeTestData }) => {
  const response = await apiContext.get('/api/v1/notifications');

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(Array.isArray(responseBody.data)).toBe(true);  
  const notificationId = responseBody.data[0].id;
  storeTestData({ notificationId: notificationId });
});