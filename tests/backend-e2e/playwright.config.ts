import { defineConfig, devices } from '@playwright/test';

// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

export const baseUrl = `http://localhost:8080/api/v1`;

export default defineConfig({
  testDir: './src',
  // fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: baseUrl,
    trace: 'retain-on-first-failure',
  },

  projects: [
    // {
    //   name: '01-create-tests',
    //   testMatch: [
    //     './src/01-create-tests/01-register-user.spec.ts',
    //     './src/01-create-tests/02-create-project.spec.ts',
    //     './src/01-create-tests/03-add-task.spec.ts',
    //   ]
    // },
    // {
    //   name: '02-read-tests',
    //   dependencies: ['01-create-tests'],
    //   testMatch: [
    //     './src/02-read-tests/*.spec.ts',
    //   ]
    // },

    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
