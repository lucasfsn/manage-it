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

test('should add a task to a project', async ({ projectId, storeTestData }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test task',
    status: 'IN_PROGRESS', // 'IN_PROGRESS', 'COMPLETED' or 'NOT_STARTED'
    priority: 'MEDIUM', // 'MEDIUM', 'HIGH' or 'LOW'
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(201);
  const responseBody = await response.json();

  expect(responseBody.projectId).toBe(projectId);
  expect(responseBody.description).toBe(taskData.description);
  expect(responseBody.status).toBe(taskData.status);
  expect(responseBody.priority).toBe(taskData.priority);
  expect(responseBody.dueDate).toBe(taskData.dueDate);

  storeTestData({taskId: responseBody.id});
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

  // 500, a powinno 400. message: "Could not commit JPA transaction"
});

test('should return an error when task status is incorrect', async ({ projectId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test Task',
    status: 'BAD_STATUS',
    priority: 'MEDIUM',
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);

  // 500, a powinno być 400
});

test('should return an error when task priority is incorrect', async ({ projectId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test Task',
    status: 'NOT_STARTED',
    priority: 'BAD_PRIORITY',
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);

  // 500, a powinno być 400
});

test('should return an error when dueDate is in the past', async ({ projectId }) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().slice(0, 10);
  const taskData = {
    description: 'Test Task',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    dueDate: dueDate,
  };

  const response = await apiContext.post(`/api/v1/projects/${projectId}/tasks`, {
    data: taskData,
  });

  expect(response.status()).toBe(400);

  // można utworzyć taska, gdy dueDate jest w przeszłości. BŁĄD
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

  expect(response.status()).toBe(400);

  // dodaje taska do projektu o statusie COMPLETED. prawdopodobnie błąd.
});