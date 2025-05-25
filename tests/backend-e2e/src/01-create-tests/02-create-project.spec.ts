// import { APIRequestContext } from '@playwright/test';
// import { test, expect } from '../fixtures/project-data';
// import { authenticateUser } from '../helpers/auth';
// import { baseUrl } from '../../playwright.config';

// let token: string;
// let apiContext: APIRequestContext;

// test.beforeAll(async ({ playwright }) => {
//   const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
//   token = authenticationResponse.token;

//   apiContext = await playwright.request.newContext({
//     baseURL: baseUrl,
//     extraHTTPHeaders: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// });

// test.afterAll(async () => {
//   await apiContext.dispose();
// });

// test('should create new projects', async ({ storeTestData }) => {
//   // const startDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10);
//   const endDate = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

//   const projectData = {
//     name: 'Test Project',
//     description: 'This is a test project',
//     // startDate: startDate,
//     endDate: endDate,
//   };

//   const response = await apiContext.post('/api/v1/projects', {
//     data: projectData,
//   });

//   expect(response.status()).toBe(201);
//   const responseBody = await response.json();

//   expect(responseBody.name).toBe(projectData.name);
//   expect(responseBody.description).toBe(projectData.description);
//   // expect(responseBody.startDate).toBe(projectData.startDate);
//   expect(responseBody.endDate).toBe(projectData.endDate);

//   expect(responseBody.id).toBeTruthy();
//   expect(responseBody.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

//   expect(responseBody.status).toBe('IN_PROGRESS');

//   expect(responseBody.owner).toBeDefined();
//   expect(responseBody.members).toBeInstanceOf(Array);
//   expect(responseBody.members.length).toBe(1);

//   expect(responseBody.members[0].username).toBe(responseBody.owner.username);
//   expect(responseBody.members[0].firstName).toBe(responseBody.owner.firstName);
//   expect(responseBody.members[0].lastName).toBe(responseBody.owner.lastName);

//   storeTestData({ projectId: responseBody.id });

//   // create project and change status to COMPLETED 
//   // const startDate2 = new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().slice(0, 10);
//   const endDate2 = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

//   const completedProjectData = {
//     name: 'Finished project',
//     description: 'This is a completed project',
//     // startDate: startDate2,
//     endDate: endDate2,
//   };

//   const response2 = await apiContext.post('/api/v1/projects', {
//     data: completedProjectData,
//   });

//   expect(response2.status()).toBe(201);
//   const responseBody2 = await response2.json();

//   const projectId2 = responseBody2.id;
//   storeTestData({ projectId2: projectId2 });

//   const updatedProjectData = {
//     status: "COMPLETED",
//   };

//   const updateResponse = await apiContext.patch(`/api/v1/projects/${projectId2}`, {
//     data: updatedProjectData,
//   });

//   expect(updateResponse.status()).toBe(200);
//   const updateResponseBody = await updateResponse.json();
//   expect(updateResponseBody.id).toBe(projectId2);
//   expect(updateResponseBody.status).toBe("COMPLETED");
// });

// // test('should return an error when startDate is after endDate', async () => {
// //   const startDate = new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().slice(0, 10);
// //   const endDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10);

// //   const projectData = {
// //     name: 'Invalid Project',
// //     description: 'Start date after end date',
// //     startDate: startDate,
// //     endDate: endDate,
// //   };

// //   const response = await apiContext.post('/api/v1/projects', {
// //     data: projectData,
// //   });

// //   expect(response.status()).toBe(400);
// // });

// test('should return an error when name and description are empty', async () => {
//   // const startDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10);
//   const endDate = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

//   const projectData = {
//     name: '',
//     description: '',
//     // startDate: startDate,
//     endDate: endDate,
//   };

//   const response = await apiContext.post('/api/v1/projects', {
//     data: projectData,
//   });

//   expect(response.status()).toBe(400);

//   const responseBody = await response.json();
//   expect(responseBody).toHaveProperty('timestamp');
//   expect(responseBody).toHaveProperty('httpStatus');
//   expect(responseBody).toHaveProperty('errorDescription');
//   expect(responseBody).toHaveProperty('message');
//   expect(responseBody).toHaveProperty('validationErrors');
  
//   expect(responseBody.httpStatus).toBe('BAD_REQUEST');
  
//   expect(responseBody.validationErrors).toBeInstanceOf(Array);
//   expect(responseBody.validationErrors).toContain('Description cannot be empty.');
//   expect(responseBody.validationErrors).toContain('Project name cannot be empty.');  
// });


// test('should return an error when end date is in the past', async () => {
//   // const startDate = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().slice(0, 10);
//   const endDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10);

//   const projectData = {
//     name: 'Past dates project',
//     description: 'Dates in the past',
//     // startDate: startDate,
//     endDate: endDate,
//   };

//   const response = await apiContext.post('/api/v1/projects', {
//     data: projectData,
//   });

//   expect(response.status()).toBe(400);

//   const responseBody = await response.json();
//   expect(responseBody).toHaveProperty('timestamp');
//   expect(responseBody).toHaveProperty('httpStatus');
//   expect(responseBody).toHaveProperty('errorDescription');
//   expect(responseBody).toHaveProperty('message');
//   expect(responseBody).toHaveProperty('validationErrors');

//   expect(responseBody.httpStatus).toBe('BAD_REQUEST');
//   expect(responseBody.validationErrors).toBeInstanceOf(Array);
//   expect(responseBody.validationErrors).toContain('Start date cannot be in the past.');
// });


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

test('should create new projects', async ({ storeTestData }) => {
  const endDate = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

  const projectData = {
    name: 'Test Project Name',
    description: 'This is a test project description',
    endDate: endDate,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
  });

  expect(response.status()).toBe(201);
  const responseBody = await response.json();

  // Sprawdzenie struktury ResponseDto
  expect(responseBody).toHaveProperty('code');
  expect(responseBody).toHaveProperty('message');
  expect(responseBody).toHaveProperty('data');
  expect(responseBody.message).toBe('Project created successfully');

  // Sprawdzenie danych projektu w responseBody.data
  expect(responseBody.data.name).toBe(projectData.name);
  expect(responseBody.data.description).toBe(projectData.description);
  expect(responseBody.data.endDate).toBe(projectData.endDate);

  expect(responseBody.data.id).toBeTruthy();
  expect(responseBody.data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

  expect(responseBody.data.status).toBe('IN_PROGRESS');

  expect(responseBody.data.owner).toBeDefined();
  expect(responseBody.data.members).toBeInstanceOf(Array);
  expect(responseBody.data.members.length).toBe(1);

  expect(responseBody.data.members[0].username).toBe(responseBody.data.owner.username);
  expect(responseBody.data.members[0].firstName).toBe(responseBody.data.owner.firstName);
  expect(responseBody.data.members[0].lastName).toBe(responseBody.data.owner.lastName);

  storeTestData({ projectId: responseBody.data.id });

  // create project and change status to COMPLETED 
  const endDate2 = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

  const completedProjectData = {
    name: 'Finished project test',
    description: 'This is a completed project description',
    endDate: endDate2,
  };

  const response2 = await apiContext.post('/api/v1/projects', {
    data: completedProjectData,
  });

  expect(response2.status()).toBe(201);
  const responseBody2 = await response2.json();

  const projectId2 = responseBody2.data.id;
  storeTestData({ projectId2: projectId2 });

  const updatedProjectData = {
    status: "COMPLETED",
  };

  const updateResponse = await apiContext.patch(`/api/v1/projects/${projectId2}`, {
    data: updatedProjectData,
  });

  expect(updateResponse.status()).toBe(200);
  const updateResponseBody = await updateResponse.json();
  expect(updateResponseBody.data.id).toBe(projectId2);
  expect(updateResponseBody.data.status).toBe("COMPLETED");
});

test('should return an error when name and description are empty', async () => {
  const endDate = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

  const projectData = {
    name: '',
    description: '',
    endDate: endDate,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
  });

  expect(response.status()).toBe(400);

  const responseBody = await response.json();
  expect(responseBody.code).toBe(400);
  expect(responseBody.message).toBe("Validation failed");
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody.errors).toBeInstanceOf(Array);
  
  // Sprawdzenie czy zawiera błędy walidacji dla name i description
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "name",
        message: "Project name cannot be empty."
      })
    ])
  );
  
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "description",
        message: "Description cannot be empty."
      })
    ])
  );
});

test('should return an error when name and description are too short', async () => {
  const endDate = new Date(new Date().setDate(new Date().getDate() + 18)).toISOString().slice(0, 10);

  const projectData = {
    name: 'abc',
    description: 'xyz',
    endDate: endDate,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
  });

  expect(response.status()).toBe(400);

  const responseBody = await response.json();
  expect(responseBody.code).toBe(400);
  expect(responseBody.message).toBe("Validation failed");
  expect(responseBody).toHaveProperty('timestamp');
  expect(responseBody.errors).toBeInstanceOf(Array);
  
  // Sprawdzenie czy zawiera błędy walidacji dla długości
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "name",
        message: "Project name must be between 5 and 100 characters."
      })
    ])
  );
  
  expect(responseBody.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        errorCode: "BAD_REQUEST",
        field: "description",
        message: "Description must be between 5 and 1000 characters."
      })
    ])
  );
});

test('should return an error when end date is in the past', async () => {
  const endDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10);

  const projectData = {
    name: 'Past dates project test',
    description: 'Project with end date in the past',
    endDate: endDate,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
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
        field: "endDate",
        message: "End date cannot be in the past."
      })
    ])
  );
});

test('should return an error when end date is null', async () => {
  const projectData = {
    name: 'Project without end date',
    description: 'This project has no end date specified',
    endDate: null,
  };

  const response = await apiContext.post('/api/v1/projects', {
    data: projectData,
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
        field: "endDate",
        message: "End date cannot be null."
      })
    ])
  );
});