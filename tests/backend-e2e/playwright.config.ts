import { defineConfig, devices } from '@playwright/test';

export const baseUrl = `http://localhost:8080/api/v1`;

export default defineConfig({
  testDir: './src',
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: baseUrl,
    trace: 'retain-on-first-failure',
  },

  projects: [
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});
