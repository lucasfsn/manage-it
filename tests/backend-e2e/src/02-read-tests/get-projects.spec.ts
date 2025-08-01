import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { baseUrl } from '../../playwright.config';

test('should return a list of projects for user with projects', async ({ playwright }) => {
  const authResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
  const token = authResponse.accessToken;;
  const userData = authResponse.user;

  const apiContext = await playwright.request.newContext({
    baseURL: baseUrl,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await apiContext.get('/api/v1/projects');
  
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  
  expect(responseBody.data).toBeInstanceOf(Array);
  expect(responseBody.data.length).toBe(2);
  
  responseBody.data.forEach(project => {
    expect(project).toHaveProperty('id');
    expect(project).toHaveProperty('name');
    expect(project).toHaveProperty('description');
    expect(project).toHaveProperty('status');
    expect(project).toHaveProperty('createdAt');
    expect(project).toHaveProperty('updatedAt');
    expect(project).toHaveProperty('endDate');
    expect(project).toHaveProperty('completedTasks');
    expect(project).toHaveProperty('totalTasks');
    expect(project).toHaveProperty('tasks');
    expect(project).toHaveProperty('members');
    expect(project).toHaveProperty('owner');
    
    expect(project.owner.username).toBe(userData.username);
    expect(project.owner.firstName).toBe(userData.firstName);
    expect(project.owner.lastName).toBe(userData.lastName);
  });

  await apiContext.dispose();
});


test('should return a projects for user assigned to project', async ({ playwright }) => {
    const authResponse = await authenticateUser('testowy@mail.com', '1qazXSW@');
    const token = authResponse.accessToken;;

    const apiContext = await playwright.request.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await apiContext.get('/api/v1/projects');
    
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data).toBeInstanceOf(Array);
    expect(responseBody.data.length).toBe(1);

    await apiContext.dispose();
  });


  test('should return an empty array for user without projects', async ({ playwright }) => {
  const authResponse = await authenticateUser('trzeci.user@mail.com', '1qazXSW@');
  const token = authResponse.accessToken;;
  const userData = authResponse.user;

  const apiContext = await playwright.request.newContext({
    baseURL: baseUrl,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await apiContext.get('/api/v1/projects');
  
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  
  expect(responseBody.data).toEqual([]);
  
  await apiContext.dispose();
});
