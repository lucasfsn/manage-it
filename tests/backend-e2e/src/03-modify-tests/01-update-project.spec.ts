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

  expect(responseBody.data.id).toBe(projectId);
  expect(responseBody.data.name).toBe(updatedProjectData.name);
  expect(responseBody.data.description).toBe(updatedProjectData.description);
  expect(responseBody.data.status).toBe("IN_PROGRESS");
});

test('should not update a project for incorrect status', async ({ projectId }) => {
  const updatedProjectData = {
    name: 'Updated test project',
    description: 'This is an updated test project',
    status: 'BAD_STATUS',
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}`, {
    data: updatedProjectData,
  });

  expect(response.status()).toBe(400);
});

test('should not update a project for empty project name and description', async ({ projectId }) => {
  const updatedProjectData = {
    name: '',
    description: '',
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}`, {
    data: updatedProjectData,
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`Validation failed`);
});

test('should not update and return an error when endDate is in the past', async ({ projectId }) => {
  const endDate = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().slice(0, 10);

  const updatedProjectData = {
    name: 'Updated test project',
    description: 'This is an updated test project',
    endDate: endDate
  };

  const response = await apiContext.patch(`/api/v1/projects/${projectId}`, {
    data: updatedProjectData,
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.message).toBe(`Validation failed`);
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
});