import { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

let token: string;
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
  token = authenticationResponse.accessToken;

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

test('should add a task to a project', async ({ projectId, storeTestData }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test task description',
    status: 'IN_PROGRESS', // 'IN_PROGRESS', 'COMPLETED' or 'NOT_STARTED'
    priority: 'MEDIUM', // 'MEDIUM', 'HIGH' or 'LOW'
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(201);
  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('code');
  expect(responseBody).toHaveProperty('message');
  expect(responseBody).toHaveProperty('data');
  expect(responseBody.message).toBe('Task created and added to project successfully');

  expect(responseBody.data.projectId).toBe(projectId);
  expect(responseBody.data.description).toBe(taskData.description);
  expect(responseBody.data.status).toBe(taskData.status);
  expect(responseBody.data.priority).toBe(taskData.priority);
  expect(responseBody.data.dueDate).toBe(taskData.dueDate);

  storeTestData({taskId: responseBody.data.id});
});

test('should return an error when description is empty', async ({ projectId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: '',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);

  const responseBody = await response.json();
  expect(responseBody.code).toBe(400);
  expect(responseBody.message).toBe("Validation failed");
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody.errors).toBeInstanceOf(Array);
  
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "description",
        message: "Task description cannot be empty."
      })
    ])
  );
});

test('should return an error when task status is incorrect', async ({ projectId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test Task Description',
    status: 'BAD_STATUS',
    priority: 'MEDIUM',
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);

  const responseBody = await response.json();
  expect(responseBody.code).toBe(400);  
});

test('should return an error when task priority is incorrect', async ({ projectId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test Task Description',
    status: 'NOT_STARTED',
    priority: 'BAD_PRIORITY',
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);

  const responseBody = await response.json();
  expect(responseBody.code).toBe(400);
});

test('should return an error when dueDate is after project end date', async ({ projectId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 50)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Task with due date after project end',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);
  
  const responseBody = await response.json();
  expect(responseBody.code).toBe(400);
  expect(responseBody.message).toBe("Validation failed");
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody.errors).toBeInstanceOf(Array);
  
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "dueDate",
        message: "Task due date cannot be after project end date."
      })
    ])
  );
});

test('should not add task to project with COMPLETED status', async ({ projectId2 }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test task in completed project',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId2}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(403);

  const responseBody = await response.json();
  expect(responseBody.message).toBe("Cannot modify project.");
});