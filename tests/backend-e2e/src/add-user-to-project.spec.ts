import { APIRequestContext } from '@playwright/test';
import { test, expect } from './fixtures/project-data';
import { authenticateUser } from './helpers/auth';
import { baseUrl } from '../playwright.config';

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

test('should add a user to a project', async ({ projectId }) => {
  const userData = {
    username: 'jakis_username',
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(204);
});