import { APIRequestContext } from '@playwright/test';
import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

test('should delete user jan_kowalski', async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
  const token = authenticationResponse.accessToken;;

  const apiContext: APIRequestContext = await playwright.request.newContext({
    baseURL: baseUrl,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await apiContext.delete('/api/v1/users');
  expect(response.status()).toBe(204);

  await apiContext.dispose();
});

test('should delete user jakis_username', async ({ playwright }) => {
  const authenticationResponse = await authenticateUser('testowy@mail.com', '1qazXSW@');
  const token = authenticationResponse.accessToken;

  const apiContext: APIRequestContext = await playwright.request.newContext({
    baseURL: baseUrl,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await apiContext.delete('/api/v1/users');
  expect(response.status()).toBe(204);

  await apiContext.dispose();
});