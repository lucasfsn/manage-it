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

test('should assign a user (project member) to a task', async ({ projectId, taskId }) => {
  const username = 'jan_kowalski';
  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.data.id).toBe(taskId);
  expect(responseBody.data.projectId).toBe(projectId);
  expect(responseBody.data.members.some(user => user.username === userData.username)).toBe(true);
});

test('should not assign user who is already assigned to a task', async ({ projectId, taskId }) => {
  const username = 'jan_kowalski';
  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(409);
  const responseBody = await response.json();
  expect(responseBody.message).toBe("User is already a member of the task");
});

test('should not assign user (not a member of the project) to a task', async ({ projectId, taskId }) => {
  const username = 'trzeci_user';
  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(403);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`User ${username} is not member of project`);
});

test('should not assign non-existing user to a task', async ({ projectId, taskId }) => {
  const username = 'non_existing';
  const userData = {
    username: username,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}/user/add`, {
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

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${nonExistentTaskId}/user/add`, {
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

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${invalidTaskId}/user/add`, {
    data: userData,
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`Unexpected type specified`);
});

