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

test('should remove a user from a task', async ({ projectId, taskId }) => {
  const username = 'jan_kowalski';
  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.data.members.some(user => user.username === userData.username)).toBe(false);
});

test('should not remove user (not a project member) from a task', async ({ projectId, taskId }) => {
  const username = 'jakis_username';
  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(403);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`User is not a member of the task`);
});

test('should not remove non-existing user from a task', async ({ projectId, taskId }) => {
  const username = 'non_existing';
  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`No user found with username: ${username}`);
});

test('should return 404 if task is not found', async ({ projectId }) => {
  const nonExistentTaskId = '00000000-0000-0000-0000-000000000000';
  const userData = {
    username: 'jan_kowalski',
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${nonExistentTaskId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`No task found with id: ${nonExistentTaskId}`);
});

test('should return error if task has invalid id', async ({ projectId }) => {
  const invalidTaskId = 'invalid-id';
  const userData = {
    username: 'jan_kowalski',
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${invalidTaskId}/user/remove`, {
    data: userData,
  });

  expect(response.status()).toBe(400);
});
