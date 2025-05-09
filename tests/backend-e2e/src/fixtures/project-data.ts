import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface ProjectData {
  projectId?: string;
  taskId?: string;
}

const projectDataPath = path.join(__dirname, 'project-data.json');

function readProjectData(): ProjectData {
  if (fs.existsSync(projectDataPath)) {
    try {
      return JSON.parse(fs.readFileSync(projectDataPath, 'utf-8')) as ProjectData;
    } catch (error) {
      console.warn('Error reading test data file:', error);
    }
  }
  return {};
}

function writeProjectData(data: ProjectData): void {
  const existingData = readProjectData();
  const mergedData = { ...existingData, ...data };
  fs.writeFileSync(projectDataPath, JSON.stringify(mergedData, null, 2), 'utf-8');
}

interface ProjectFixtures {
  projectId: string;
  taskId: string;
  storeTestData: (data: ProjectData) => void;
}

export const test = base.extend<ProjectFixtures>({
  projectId: async ({}, use) => {
    const data = readProjectData();
    await use(data.projectId || '');
  },

  taskId: async ({}, use) => {
    const data = readProjectData();
    await use(data.taskId || '');
  },

  storeTestData: async ({}, use) => {
    const storeData = (data: ProjectData) => {
      writeProjectData(data);
    };

    await use(storeData);
  }
});

export { expect } from '@playwright/test';