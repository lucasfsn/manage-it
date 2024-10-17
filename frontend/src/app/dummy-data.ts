import { Project, Status } from './core/models/project.model';

export const dummyProjects: Project[] = [
  {
    id: '1',
    name: 'Project Alpha',
    description: 'Description for Project Alpha',
    startDate: '2024-01-01',
    endDate: '2024-10-22',
    completedTasks: 5,
    totalTasks: 10,
    status: Status.InProgress,
    owner: {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john_doe',
    },
    members: [
      {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'john_doe',
      },
      {
        firstName: 'Test',
        lastName: 'Doe',
        userName: 'test_doe',
      },
      {
        firstName: 'Michael',
        lastName: 'Doe',
        userName: 'michael_doe',
      },
      {
        firstName: 'Anna',
        lastName: 'Doe',
        userName: 'anna_doe',
      },
      {
        firstName: 'Olivia',
        lastName: 'Doe',
        userName: 'olivia_doe',
      },
      {
        firstName: 'Sophia',
        lastName: 'Doe',
        userName: 'sophia_doe',
      },
      {
        firstName: 'Isabella',
        lastName: 'Doe',
        userName: 'isabella_doe',
      },
      {
        firstName: 'Mia',
        lastName: 'Doe',
        userName: 'mia_doe',
      },
      {
        firstName: 'Emily',
        lastName: 'Doe',
        userName: 'emily_doe',
      },
      {
        firstName: 'Elizabeth',
        lastName: 'Doe',
        userName: 'elizabeth_doe',
      },
    ],
  },
  {
    id: '2',
    name: 'Project Beta',
    description: 'Description for Project Beta',
    startDate: '2024-02-01',
    endDate: '2024-10-18',
    completedTasks: 3,
    totalTasks: 8,
    status: Status.Completed,
    owner: {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john_doe',
    },
    members: [
      {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'john_doe',
      },
    ],
  },
  {
    id: '3',
    name: 'Project Gamma',
    description: 'Description for Project Gamma',
    startDate: '2024-03-01',
    endDate: '2024-08-01',
    completedTasks: 7,
    totalTasks: 15,
    status: Status.Completed,
    owner: {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john_doe',
    },
    members: [
      {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'john_doe',
      },
    ],
  },
  {
    id: '4',
    name: 'Project Delta',
    description: 'Description for Project Delta',
    startDate: '2024-04-01',
    endDate: '2025-01-01',
    completedTasks: 2,
    totalTasks: 5,
    status: Status.InProgress,
    owner: {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john_doe',
    },
    members: [
      {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'john_doe',
      },
    ],
  },
  {
    id: '5',
    name: 'Project Epsilon',
    description: 'Description for Project Epsilon',
    startDate: '2024-05-01',
    endDate: '2024-12-15',
    completedTasks: 6,
    totalTasks: 12,
    status: Status.InProgress,
    owner: {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john_doe',
    },
    members: [
      {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'john_doe',
      },
    ],
  },
];
