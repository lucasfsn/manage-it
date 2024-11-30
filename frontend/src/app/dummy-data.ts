import { MessageDummy } from './features/dto/message.model';
import { Notification } from './features/dto/notification.model';
import {
  Priority,
  Project,
  User as ProjectMember,
  ProjectStatus,
  TaskStatus,
} from './features/dto/project.model';
import { User } from './features/dto/user.model';

export const dummyProjects: Project[] = [
  {
    id: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website to improve UX/UI.',
    startDate: '2024-01-01',
    endDate: '2024-10-25',
    completedTasks: 5,
    totalTasks: 10,
    status: ProjectStatus.InProgress,
    owner: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john_doe',
    },
    members: [
      { firstName: 'John', lastName: 'Doe', username: 'john_doe' },
      { firstName: 'Jane', lastName: 'Smith', username: 'jane_smith' },
      {
        firstName: 'Alexis',
        lastName: 'Hernandez',
        username: 'alexis_hernandez',
      },
      {
        firstName: 'Ella',
        lastName: 'Lopez',
        username: 'ella_lopez',
      },
    ],
    tasks: [
      {
        id: '1',
        projectId: '1',
        users: [
          { firstName: 'John', lastName: 'Doe', username: 'john_doe' },
          {
            firstName: 'Jane',
            lastName: 'Smith',
            username: 'jane_smith',
          },
          {
            firstName: 'Ella',
            lastName: 'Lopez',
            username: 'ella_lopez',
          },
        ],
        description: 'Develop Header',
        status: TaskStatus.InProgress,
        priority: Priority.High,
        dueDate: '2024-05-01',
      },
      {
        id: '2',
        projectId: '1',
        users: [
          {
            firstName: 'Michael',
            lastName: 'Johnson',
            username: 'michael_johnson',
          },
          {
            firstName: 'Anna',
            lastName: 'Williams',
            username: 'anna_williams',
          },
        ],
        description: 'Develop Sidebar',
        status: TaskStatus.NotStarted,
        priority: Priority.Medium,
        dueDate: '2024-06-01',
      },
      {
        id: '3',
        projectId: '1',
        users: [
          {
            firstName: 'Olivia',
            lastName: 'Brown',
            username: 'olivia_brown',
          },
          {
            firstName: 'Sophia',
            lastName: 'Jones',
            username: 'sophia_jones',
          },
        ],
        description: 'Develop API',
        status: TaskStatus.Completed,
        priority: Priority.Low,
        dueDate: '2024-07-01',
      },
      {
        id: '4',
        projectId: '1',
        users: [
          {
            firstName: 'Isabella',
            lastName: 'Garcia',
            username: 'isabella_garcia',
          },
          {
            firstName: 'Mia',
            lastName: 'Martinez',
            username: 'mia_martinez',
          },
        ],
        description: 'Database Design',
        status: TaskStatus.Completed,
        priority: Priority.Medium,
        dueDate: '2024-08-01',
      },
      {
        id: '5',
        projectId: '1',
        users: [
          {
            firstName: 'Emily',
            lastName: 'Davis',
            username: 'emily_davis',
          },
          {
            firstName: 'Elizabeth',
            lastName: 'Rodriguez',
            username: 'elizabeth_rodriguez',
          },
        ],
        description: 'Testing',
        status: TaskStatus.InProgress,
        priority: Priority.High,
        dueDate: '2024-09-01',
      },
    ],
  },
  {
    id: 'cc687098-fb51-4f28-b95e-c9b7b4241d58',
    name: 'Mobile App Development',
    description: 'Development of a new mobile application for iOS and Android.',
    startDate: '2024-02-01',
    endDate: '2024-10-18',
    completedTasks: 3,
    totalTasks: 8,
    status: ProjectStatus.Completed,
    owner: {
      firstName: 'Olivia',
      lastName: 'Brown',
      username: 'olivia_brown',
    },
    members: [
      {
        firstName: 'Olivia',
        lastName: 'Brown',
        username: 'olivia_brown',
      },
      {
        firstName: 'Sophia',
        lastName: 'Jones',
        username: 'sophia_jones',
      },
      { firstName: 'John', lastName: 'Doe', username: 'john_doe' },
    ],
    tasks: [],
  },
  {
    id: '40424d07-1902-47f5-bf5e-9085ca8310bc',
    name: 'E-commerce Platform',
    description: 'Building a new e-commerce platform with advanced features.',
    startDate: '2024-03-01',
    endDate: '2024-08-01',
    completedTasks: 7,
    totalTasks: 15,
    status: ProjectStatus.Completed,
    owner: {
      firstName: 'Isabella',
      lastName: 'Garcia',
      username: 'isabella_garcia',
    },
    members: [
      {
        firstName: 'Isabella',
        lastName: 'Garcia',
        username: 'isabella_garcia',
      },
      {
        firstName: 'Mia',
        lastName: 'Martinez',
        username: 'mia_martinez',
      },
    ],
    tasks: [],
  },
  {
    id: '2c9fcdc9-b591-41d0-9152-c5e4eec7b158',
    name: 'Cloud Migration',
    description: 'Migrating all company data and applications to the cloud.',
    startDate: '2024-04-01',
    endDate: '2025-01-01',
    completedTasks: 2,
    totalTasks: 5,
    status: ProjectStatus.InProgress,
    owner: {
      firstName: 'Emily',
      lastName: 'Davis',
      username: 'emily_davis',
    },
    members: [
      {
        firstName: 'Emily',
        lastName: 'Davis',
        username: 'emily_davis',
      },
      {
        firstName: 'Elizabeth',
        lastName: 'Rodriguez',
        username: 'elizabeth_rodriguez',
      },
    ],
    tasks: [],
  },
  {
    id: 'f9712337-fb38-4b7f-b080-51b6a04eec6d',
    name: 'Marketing Campaign',
    description:
      'Launching a new marketing campaign to increase brand awareness.',
    startDate: '2024-05-01',
    endDate: '2024-12-15',
    completedTasks: 6,
    totalTasks: 12,
    status: ProjectStatus.InProgress,
    owner: {
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'jane_smith',
    },
    members: [
      { firstName: 'John', lastName: 'Doe', username: 'john_doe' },
      { firstName: 'Jane', lastName: 'Smith', username: 'jane_smith' },
    ],
    tasks: [],
  },
];

export const usersData: User[] = [
  {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    username: 'john_doe',
    projects: [dummyProjects[0], dummyProjects[1], dummyProjects[4]],
    createdAt: '2022-01-15',
  },
  {
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'jane_smith',
    projects: [dummyProjects[0], dummyProjects[4]],
    createdAt: '2022-02-20',
  },
  {
    email: 'michael.johnson@example.com',
    firstName: 'Michael',
    lastName: 'Johnson',
    username: 'michael_johnson',
    projects: [],
    createdAt: '2022-03-25',
  },
  {
    email: 'anna.williams@example.com',
    firstName: 'Anna',
    lastName: 'Williams',
    username: 'anna_williams',
    projects: [],
    createdAt: '2022-04-30',
  },
  {
    email: 'olivia.brown@example.com',
    firstName: 'Olivia',
    lastName: 'Brown',
    username: 'olivia_brown',
    projects: [dummyProjects[1]],
    createdAt: '2022-05-05',
  },
  {
    email: 'sophia.jones@example.com',
    firstName: 'Sophia',
    lastName: 'Jones',
    username: 'sophia_jones',
    projects: [dummyProjects[1]],
    createdAt: '2022-06-10',
  },
  {
    email: 'isabella.garcia@example.com',
    firstName: 'Isabella',
    lastName: 'Garcia',
    username: 'isabella_garcia',
    projects: [dummyProjects[2]],
    createdAt: '2022-07-15',
  },
  {
    email: 'mia.martinez@example.com',
    firstName: 'Mia',
    lastName: 'Martinez',
    username: 'mia_martinez',
    projects: [dummyProjects[2]],
    createdAt: '2022-08-20',
  },
  {
    email: 'emily.davis@example.com',
    firstName: 'Emily',
    lastName: 'Davis',
    username: 'emily_davis',
    projects: [dummyProjects[3]],
    createdAt: '2022-09-25',
  },
  {
    email: 'elizabeth.rodriguez@example.com',
    firstName: 'Elizabeth',
    lastName: 'Rodriguez',
    username: 'elizabeth_rodriguez',
    projects: [dummyProjects[3]],
    createdAt: '2022-10-30',
  },
  {
    email: 'alexis.hernandez@example.com',
    firstName: 'Alexis',
    lastName: 'Hernandez',
    username: 'alexis_hernandez',
    projects: [dummyProjects[0]],
    createdAt: '2022-11-05',
  },
  {
    email: 'ella.lopez@example.com',
    firstName: 'Ella',
    lastName: 'Lopez',
    username: 'ella_lopez',
    projects: [dummyProjects[0]],
    createdAt: '2022-12-10',
  },
];

export const dummyNotifications: Notification[] = [
  {
    id: '1',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john_doe',
    },
    message: 'has joined the project "Website Redesign"',
    projectId: '1',
    date: '2024-01-02T10:00:00Z',
  },
  {
    id: '2',
    user: {
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'jane_smith',
    },
    message: 'has modified the task "Develop Header"',
    projectId: '1',
    taskId: '1',
    date: '2024-01-03T11:30:00Z',
  },
  {
    id: '3',
    user: {
      firstName: 'Alexis',
      lastName: 'Hernandez',
      username: 'alexis_hernandez',
    },
    message: 'has completed the task "Develop API"',
    projectId: '1',
    taskId: '3',
    date: '2024-01-04T14:45:00Z',
  },
  {
    id: '4',
    user: {
      firstName: 'Ella',
      lastName: 'Lopez',
      username: 'ella_lopez',
    },
    message: 'has joined the project "Mobile App Development"',
    projectId: '2',
    date: '2024-02-02T09:15:00Z',
  },
  {
    id: '5',
    user: {
      firstName: 'Michael',
      lastName: 'Johnson',
      username: 'michael_johnson',
    },
    message: 'has modified the task "Database Design"',
    projectId: '1',
    taskId: '4',
    date: '2024-10-26T16:00:00Z',
  },
];

export const users: ProjectMember[] = usersData.map((user) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
}));

export const dummyMessages: MessageDummy[] = [
  {
    id: '1',
    content: 'Started working on the header.',
    sender: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john_doe',
    },
    createdAt: '2024-01-02T10:00:00Z',
    projectId: '1',
    taskId: '1',
  },
  {
    id: '2',
    content:
      'Completed the API development. dsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    sender: {
      firstName: 'Michael',
      lastName: 'Johnson',
      username: 'michael_johnson',
    },
    createdAt: '2024-01-04T14:45:00Z',
    projectId: '1',
  },
  {
    id: '3',
    content: 'Reviewed the database design.',
    sender: {
      firstName: 'Anna',
      lastName: 'Williams',
      username: 'anna_williams',
    },
    createdAt: '2024-01-05T09:15:00Z',
    projectId: '1',
    taskId: '1',
  },
  {
    id: '4',
    content: 'Started the marketing campaign.',
    sender: {
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'jane_smith',
    },
    createdAt: '2024-01-06T11:30:00Z',
    projectId: '1',
  },
];
