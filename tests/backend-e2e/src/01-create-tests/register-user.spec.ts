import { test, expect } from '@playwright/test';
import { baseUrl } from '../../playwright.config';

test('should register a new user with valid data', async ({ request }) => {
  const userData = {
    username: 'jan_kowalski',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@mail.com',
    password: '1qazXSW@',
  };

  const response = await request.post(`${baseUrl}/auth/register`, {
    data: userData,
  });

  expect(response.status()).toBe(202);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('token');
  expect(responseBody.username).toBe(userData.username);
});

test('should return an error when registering with missing username', async ({ request }) => {
  const userData = {
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@mail.com',
    password: '1qazXSW@',
  };
  
  const response = await request.post(`${baseUrl}/auth/register`, {
    data: userData,
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("BAD_REQUEST");
  expect(responseBody.validationErrors).toContain('Username cannot be empty');
});

test('should return an error when registering with invalid email format', async ({ request }) => {
  const userData = {
    username: 'jan_kowalsky',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'invalid-email',
    password: '1qazXSW@',
  };
  
  const response = await request.post(`${baseUrl}/auth/register`, {
    data: userData,
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("BAD_REQUEST");
  expect(responseBody.validationErrors).toContain('Email should be valid');
});

test('should return an error when registering with an already existing username and email', async ({ request }) => {
  const userData = {
    username: 'jakis_username',
    firstName: 'User',
    lastName: 'Testowy',
    email: 'testowy@mail.com',
    password: '1qazXSW@',
  };

  const response1 = await request.post(`${baseUrl}/auth/register`, {
    data: userData,
  });

  expect(response1.status()).toBe(202);
  
  const response2 = await request.post(`${baseUrl}/auth/register`, {
    data: userData
  });

  expect(response2.status()).toBe(409);
  const responseBody = await response2.json();
  expect(responseBody.httpStatus).toBe("CONFLICT");
});

test('should return an error when registering with invalid password', async ({ request }) => {
  const response = await request.post(`${baseUrl}/auth/register`, {
    data: {
      username: 'test_user',
      firstName: 'Test',
      lastName: 'User',
      email: 'losowy@mail.com',
      password: 'password123',
    },
  });

  expect(response.status()).toBe(400);
  const responseBody = await response.json();
  expect(responseBody.httpStatus).toBe("BAD_REQUEST");
  expect(responseBody.validationErrors).toContain("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*).");
});
