import { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

let token: string;
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
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

test('should remove a task from a project', async ({ projectId, taskId }) => {
  const response = await apiContext.delete(`/api/v1/projects/${projectId}/tasks/${taskId}`);

  expect(response.status()).toBe(204);

  const getTaskResponse = await apiContext.get(`/api/v1/projects/${projectId}/tasks/${taskId}`);
  expect(getTaskResponse.status()).toBe(404);
  const responseBody = await getTaskResponse.json();
  expect(responseBody.httpStatus).toBe("NOT_FOUND");
  expect(responseBody.message).toBe(`No task found with id: ${taskId}`);
});

test('should return 404 if task is not found', async ({ projectId }) => {
  const nonExistentTaskId = '00000000-0000-0000-0000-000000000000';
  const response = await apiContext.delete(`/api/v1/projects/${projectId}/tasks/${nonExistentTaskId}`);

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("NOT_FOUND");
  expect(responseBody.message).toBe(`No task found with id: ${nonExistentTaskId}`);
});

test('should return 400 if task id is invalid', async ({ projectId }) => {
  const invalidTaskId = 'invalid-id';
  const response = await apiContext.delete(`/api/v1/projects/${projectId}/tasks/${invalidTaskId}`);

  expect(response.status()).toBe(400);
});