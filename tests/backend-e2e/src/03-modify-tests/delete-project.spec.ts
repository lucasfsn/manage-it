import { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

let token: string;
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('johndoe@mail.com', '1qazXSW@');
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

test('should delete a project by id', async ({ projectId }) => {
  const response = await apiContext.delete(`/api/v1/projects/${projectId}`);

  expect(response.status()).toBe(204);

  const getResponse = await apiContext.get(`/api/v1/projects/${projectId}`);
  expect(getResponse.status()).toBe(404);

  const responseBody = await getResponse.json();
  expect(responseBody.httpStatus).toBe("NOT_FOUND");
  expect(responseBody.message).toBe(`No project found with id: ${projectId}`);
});

test('should not delete project with non-existent id', async () => {
  const nonExistentId = '00000000-0000-0000-0000-000000000000';

  const response = await apiContext.delete(`/api/v1/projects/${nonExistentId}`);

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("NOT_FOUND");
  expect(responseBody.message).toBe(`No project found with id: ${nonExistentId}`);
});

test('should not delete project with invalid id', async () => {
  const invalidId = 'invalid-id';

  const response = await apiContext.delete(`/api/v1/projects/${invalidId}`);

  expect(response.status()).toBe(400);

  // wyrzuca 500, a powinno 400. 500 jest NIELEGALNA
});
