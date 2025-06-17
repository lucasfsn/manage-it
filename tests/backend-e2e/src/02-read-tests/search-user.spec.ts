import { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

let token: string;
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
  token = authenticationResponse.accessToken;;

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

test('should search users by pattern', async () => {
  const pattern = 'jan';
  const response = await apiContext.get(`/api/v1/users/search?pattern=${pattern}`);

  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  expect(responseBody.data).toBeInstanceOf(Array);
  expect(responseBody.data.length).toBeGreaterThan(0);
  responseBody.data.forEach(user => {
    expect(user.username).toContain(pattern);
  });
});

test('should return empty list if no users match the pattern', async () => {
  const pattern = 'nonexistentuser';
  const response = await apiContext.get(`/api/v1/users/search?pattern=${pattern}`);

  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  expect(responseBody.data).toBeInstanceOf(Array);
  expect(responseBody.data.length).toBe(0);
});