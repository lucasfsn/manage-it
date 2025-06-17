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

test('should get chat messages for a project', async ({ projectId }) => {
  const response = await apiContext.get(`/api/v1/chat/projects/${projectId}`);
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(Array.isArray(responseBody.data)).toBe(true);
  expect(responseBody.data.length).toBe(1);
  expect(responseBody.data[0]).toHaveProperty('content');
});

test('should return an error if the project does not exist', async () => {
  const nonExistentId = '00000000-0000-0000-0000-000000000000';
  const response = await apiContext.get(`/api/v1/chat/projects/${nonExistentId}`);
  expect(response.status()).toBe(404);
});

test('should return an error if the project id is invalid', async () => {
  const invalidId = 'invalid-id';
  const response = await apiContext.get(`/api/v1/chat/projects/${invalidId}`);
  expect(response.status()).toBe(400);
});
