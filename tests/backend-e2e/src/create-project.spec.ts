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

test('should create a new project', async ({ storeTestData }) => {
  const startDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10);
  const endDate = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

  const projectData = {
    name: 'Test Project',
    description: 'This is a test project',
    startDate: startDate,
    endDate: endDate,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
  });

  expect(response.status()).toBe(201);
  const responseBody = await response.json();

  expect(responseBody.name).toBe(projectData.name);
  expect(responseBody.description).toBe(projectData.description);
  expect(responseBody.startDate).toBe(projectData.startDate);
  expect(responseBody.endDate).toBe(projectData.endDate);

  expect(responseBody.id).toBeTruthy();
  expect(responseBody.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

  expect(responseBody.status).toBe('IN_PROGRESS');

  expect(responseBody.owner).toBeDefined();
  expect(responseBody.members).toBeInstanceOf(Array);
  expect(responseBody.members.length).toBe(1);

  expect(responseBody.members[0].username).toBe(responseBody.owner.username);
  expect(responseBody.members[0].firstName).toBe(responseBody.owner.firstName);
  expect(responseBody.members[0].lastName).toBe(responseBody.owner.lastName);

  storeTestData({ projectId: responseBody.id });
});

test('should return an error when startDate is after endDate', async () => {
  const startDate = new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().slice(0, 10);
  const endDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10);

  const projectData = {
    name: 'Invalid Project',
    description: 'Start date after end date',
    startDate: startDate,
    endDate: endDate,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
  });

  expect(response.status()).toBe(400);

  // tworzy projekt. błąd!
});

test('should return an error when name and description are empty', async () => {
  const startDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10);
  const endDate = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

  const projectData = {
    name: '',
    description: '',
    startDate: startDate,
    endDate: endDate,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
  });

  expect(response.status()).toBe(400);

  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody).toHaveProperty('httpStatus');
  expect(responseBody).toHaveProperty('errorDescription');
  expect(responseBody).toHaveProperty('message');
  expect(responseBody).toHaveProperty('validationErrors');
  
  expect(responseBody.httpStatus).toBe('BAD_REQUEST');
  
  expect(responseBody.validationErrors).toBeInstanceOf(Array);
  expect(responseBody.validationErrors.length).toBe(2);
  expect(responseBody.validationErrors).toContain('Description cannot be empty');
  expect(responseBody.validationErrors).toContain('Project name cannot be empty');  
});


test('should return an error when dates are in the past', async () => {
  const startDate = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().slice(0, 10);
  const endDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10);

  const projectData = {
    name: 'Past dates project',
    description: 'Dates in the past',
    startDate: startDate,
    endDate: endDate,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
  });

  expect(response.status()).toBe(400);

  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody).toHaveProperty('httpStatus');
  expect(responseBody).toHaveProperty('errorDescription');
  expect(responseBody).toHaveProperty('message');
  expect(responseBody).toHaveProperty('validationErrors');

  expect(responseBody.httpStatus).toBe('BAD_REQUEST');
  expect(responseBody.validationErrors).toBeInstanceOf(Array);
  expect(responseBody.validationErrors).toContain('Start date cannot be in the past.');
});
