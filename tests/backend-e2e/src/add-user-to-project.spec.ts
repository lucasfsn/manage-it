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
  const username = 'jakis_username';

  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(204);

  const getResponse = await apiContext.get(`/api/v1/projects/${projectId}`);

  expect(getResponse.status()).toBe(200);  
  const projectData = await getResponse.json();

  expect(projectData.id).toBe(projectId);
  expect(Array.isArray(projectData.members)).toBe(true);
  const memberUsernames = projectData.members.map(member => member.username);
  expect(memberUsernames).toContain(username);
});

test('should not add non-existing user to a project', async ({ projectId }) => {
  const nonExistingUsername = 'non_existing';

  const userData = {
    username: nonExistingUsername,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(404);
  const responseData = await response.json();
  expect(responseData.httpStatus).toBe("NOT_FOUND");
  expect(responseData.message).toBe(`No user found with username: ${nonExistingUsername}`);
});

test('should not add user to a non-existing project', async () => {
  const nonExistentId = '00000000-0000-0000-0000-000000000000';
  const username = 'jakis_username';

  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${nonExistentId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("NOT_FOUND");
  expect(responseBody.message).toBe(`No project found with id: ${nonExistentId}`);
});

test('should return error while adding user to a project with invalid id', async () => {
  const invalidId = 'invalid-id';
  const username = 'jakis_username';

  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${invalidId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(400);
  
  // znowu 500 zamiast 400
});
