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

test('should return a project by id', async ({ projectId }) => {
  const response = await apiContext.get(`/api/v1/projects/${projectId}`);

  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  expect(responseBody.data.id).toBe(projectId);
});

test('should return 404 if project is not found', async () => {
  const nonExistentId = '00000000-0000-0000-0000-000000000000';

  const response = await apiContext.get(`/api/v1/projects/${nonExistentId}`);

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`No project found with id: ${nonExistentId}`);
});

test('should return 400 if invalid ID format', async () => {
  const invalidId = 'invalid-id'

  const response = await apiContext.get(`/api/v1/projects/${invalidId}`);
  expect(response.status()).toBe(400);
  
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`Unexpected type specified`);
});