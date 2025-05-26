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

test('should remove a user from a project', async ({ projectId }) => {
  const username = 'jakis_username';
  
  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(200);

  const responseData = await response.json();

  expect(responseData.data.id).toBe(projectId);
  expect(Array.isArray(responseData.data.members)).toBe(true);
  const memberUsernames = responseData.data.members.map(member => member.username);
  expect(memberUsernames).not.toContain(username);
});

test('should not remove user who is not a project member', async ({ projectId }) => {
  const username = 'jakis_username';
  
  const userData = {
    username: username,
  };

  const addResponse = await apiContext.patch(`/api/v1/projects/${projectId}/user/add`, {
    data: userData,
  });

  expect(addResponse.status()).toBe(200);

  const removeResponse = await apiContext.patch(`/api/v1/projects/${projectId}/user/remove`, {
    data: userData,
  });

  expect(removeResponse.status()).toBe(200);

  const removeAgainResponse = await apiContext.patch(`/api/v1/projects/${projectId}/user/remove`, {
    data: userData,
  });

  expect(removeAgainResponse.status()).toBe(403);
  const responseData = await removeAgainResponse.json();
  expect(responseData.message).toBe('User is not a member of the project');
});

test('should not remove non-existing user to a project', async ({ projectId }) => {
  const nonExistingUsername = 'non_existing';

  const userData = {
    username: nonExistingUsername,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(404);
  const responseData = await response.json();
  expect(responseData.message).toBe(`No user found with username: ${nonExistingUsername}`);
});

test('should not remove user from non-existing project', async () => {
  const nonExistentId = '00000000-0000-0000-0000-000000000000';
  const username = 'jakis_username';

  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${nonExistentId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`No project found with id: ${nonExistentId}`);
});

test('should return error while removing user from a project with invalid id', async () => {
  const invalidId = 'invalid-id';
  const username = 'jakis_username';

  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${invalidId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(400);
});
