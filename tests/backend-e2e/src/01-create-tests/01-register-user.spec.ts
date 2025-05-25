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

  expect(response.status()).toBe(201);
  const responseBody = await response.json();
  
  expect(responseBody).toHaveProperty('code');
  expect(responseBody).toHaveProperty('message');
  expect(responseBody).toHaveProperty('data');
  expect(responseBody.message).toBe('User registered successfully');
  
  expect(responseBody.data).toHaveProperty('accessToken');
  expect(responseBody.data).toHaveProperty('refreshToken');
  expect(responseBody.data).toHaveProperty('user');
  expect(responseBody.data.user.username).toBe(userData.username);
  expect(responseBody.data.user.email).toBe(userData.email);
  expect(responseBody.data.user.firstName).toBe(userData.firstName);
  expect(responseBody.data.user.lastName).toBe(userData.lastName);
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
  expect(responseBody.code).toBe(400);
  expect(responseBody.message).toBe("Validation failed");
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "username",
        message: "Username cannot be empty."
      })
    ])
  );
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
  expect(responseBody.code).toBe(400);
  expect(responseBody.message).toBe("Validation failed");
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "email",
        message: "Email should be valid."
      })
    ])
  );
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

  expect(response1.status()).toBe(201);
  
  const response2 = await request.post(`${baseUrl}/auth/register`, {
    data: userData
  });

  expect(response2.status()).toBe(409);
  const responseBody = await response2.json();
  expect(responseBody.message).toBe("Data integrity violation occurred.");
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
  expect(responseBody.code).toBe(400);
  expect(responseBody.message).toBe("Validation failed");
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "password",
        message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*)."
      })
    ])
  );
});