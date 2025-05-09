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

test('should successfuly update a project', async ({ projectId }) => {
  const updatedProjectData = {
    name: 'Updated test project',
    description: 'This is an updated test project',
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}`, {
    data: updatedProjectData,
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  expect(responseBody.id).toBe(projectId);
  expect(responseBody.name).toBe(updatedProjectData.name);
  expect(responseBody.description).toBe(updatedProjectData.description);
  expect(responseBody.status).toBe("IN_PROGRESS");
});

test('should not update and return an error when startDate is after endDate', async ({ projectId }) => {
  const startDate = new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().slice(0, 10);
  const endDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10);

  const updatedProjectData = {
    name: 'Updated test project',
    description: 'This is an updated test project',
    startDate: startDate,
    endDate: endDate
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}`, {
    data: updatedProjectData,
  });

  expect(response.status()).toBe(400);

  // updatuje projekt z startDate późniejszą niż endDate. błąd!
});

test('should not update project with non-existent id', async () => {
  const nonExistentId = '00000000-0000-0000-0000-000000000000';

  const updatedProjectData = {
    name: 'Updated test project',
    description: 'This is an updated test project',
  };

  const response = await apiContext.patch(`/api/v1/projects/${nonExistentId}`, {
    data: updatedProjectData,
  });

  expect(response.status()).toBe(404);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("NOT_FOUND");
  expect(responseBody.message).toBe(`No project found with id: ${nonExistentId}`);
});

test('should not update project with invalid id', async () => {
  const invalidId = 'invalid-id'

  const updatedProjectData = {
    name: 'Updated test project',
    description: 'This is an updated test project',
  };

  const response = await apiContext.patch(`/api/v1/projects/${invalidId}`, {
    data: updatedProjectData,
  });

  expect(response.status()).toBe(400);
  
  // 500. A powinno być 400
});