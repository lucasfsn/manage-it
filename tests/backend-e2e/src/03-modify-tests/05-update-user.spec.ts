import { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

let token: string;
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('testowy@mail.com', '1qazXSW@');
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

test('should update user succesfully', async () => {
  const updatedUser = {
    firstName: 'Updated',
    lastName: 'User',
  };

  const response = await apiContext.patch('/api/v1/users', {
    data: updatedUser,
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  expect(responseBody.firstName).toBe(updatedUser.firstName);
  expect(responseBody.lastName).toBe(updatedUser.lastName);
});

test('should return an error when updating with invalid password', async () => {
  const updatedUser = {
    lastName: 'User',
    password: 'password123'
  };

  const response = await apiContext.patch('/api/v1/users', {
    data: updatedUser,
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("BAD_REQUEST");
  expect(responseBody.validationErrors).toContain("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*).");
});

test('should return an error when updating with invalid email format', async () => {
  const updatedUser = {
    firstName: 'Updated',
    lastName: 'User',
    email: 'invalid-email',
  };

  const response = await apiContext.patch('/api/v1/users', {
    data: updatedUser,
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("BAD_REQUEST");
  expect(responseBody.validationErrors).toContain('Email should be valid');
});

test('should return an error when updating with empty firstName', async () => {
  const updatedUser = {
    firstName: '',
    lastName: 'User',
  };

  const response = await apiContext.patch('/api/v1/users', {
    data: updatedUser,
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("BAD_REQUEST");
  expect(responseBody.validationErrors).toContain('First name must be between 2 and 50 characters');
});

test('should return an error when email exists for another user', async ({ request }) => {
  const updatedUser = {
    email: 'jan.kowalski@mail.com',
  };

  const response = await apiContext.patch('/api/v1/users', {
    data: updatedUser,
  });

  expect(response.status()).toBe(409);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe('CONFLICT');
});