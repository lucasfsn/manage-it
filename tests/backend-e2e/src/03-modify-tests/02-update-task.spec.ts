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

test('should update a task', async ({ projectId, taskId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().slice(0, 10);
  const updatedTaskData = {
    description: 'Updated test task',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    dueDate: dueDate,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
    data: updatedTaskData,
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  expect(responseBody.id).toBe(taskId);
  expect(responseBody.description).toBe(updatedTaskData.description);
  expect(responseBody.status).toBe(updatedTaskData.status);
  expect(responseBody.priority).toBe(updatedTaskData.priority);
  expect(responseBody.dueDate).toBe(updatedTaskData.dueDate);
});

test('should return an error when description is empty', async ({ projectId, taskId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: '',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: dueDate,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);
});

test('should return an error when task status is incorrect', async ({ projectId, taskId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test Task',
    status: 'BAD_STATUS',
    priority: 'MEDIUM',
    dueDate: dueDate,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);
});

test('should return an error when task priority is incorrect', async ({ projectId, taskId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test Task',
    status: 'NOT_STARTED',
    priority: 'BAD_PRIORITY',
    dueDate: dueDate,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);
});

test('should return an error when dueDate is in the past', async ({ projectId, taskId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test Task',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    dueDate: dueDate,
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);
});

test('should return 404 if task is not found', async ({ projectId }) => {
  const nonExistentTaskId = '00000000-0000-0000-0000-000000000000';
  const updatedTaskData = {
    description: 'Updated task for testing',
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${nonExistentTaskId}`, {
    data: updatedTaskData,
  });

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("NOT_FOUND");
  expect(responseBody.message).toBe(`No task found with id: ${nonExistentTaskId}`);
});

test('should return error if task id is invalid', async ({ projectId }) => {
  const invalidTaskId = 'invalid-id';
  const updatedTaskData = {
    description: 'Updated task for testing',
  };
  
  const response = await apiContext.patch(`/api/v1/projects/${projectId}/tasks/${invalidTaskId}`, {
    data: updatedTaskData,
  });

  expect(response.status()).toBe(400);
});
