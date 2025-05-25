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

test('should get user by username', async () => {
  const username = 'jan_kowalski';
  const response = await apiContext.get(`/api/v1/users/${username}`);

  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  expect(responseBody.username).toBe(username);
  expect(responseBody.firstName).toBeDefined();
  expect(responseBody.lastName).toBeDefined();
  expect(responseBody.email).toBeDefined();
});

test('should get user by username for not authenticated user', async () => {
  const username = 'jakis_username';
  const response = await apiContext.get(`/api/v1/users/${username}`);

  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  expect(responseBody.username).toBe(username);
  expect(responseBody.firstName).toBeDefined();
  expect(responseBody.lastName).toBeDefined();
  expect(responseBody.email).not.toBeDefined();
});

test('should return 404 if user not found', async () => {
  const username = 'non_existent';
  const response = await apiContext.get(`/api/v1/users/${username}`);

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("NOT_FOUND");
  expect(responseBody.message).toBe(`No user found with username: ${username}`);
});