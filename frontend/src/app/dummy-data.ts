import { MessageDummy } from './features/dto/message.model';
import { Notification } from './features/dto/notification.model';

export const dummyNotifications: Notification[] = [
  {
    id: '1',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john_doe',
    },
    message: 'has joined the project "Website Redesign"',
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
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
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
    taskId: '9d837fcb-b563-4895-8d52-e544623c1fc3',
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
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
    taskId: 'e6d61c4b-0e9c-44d7-8d9e-d1531e2f64e1',
    date: '2024-01-04T14:45:00Z',
  },
  {
    id: '4',
    user: {
      firstName: 'Ella',
      lastName: 'Lopez',
      username: 'ella_lopez',
    },
    message: 'has joined the project "Website Redesign"',
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
    date: '2024-02-02T09:15:00Z',
  },
  {
    id: '5',
    user: {
      firstName: 'Michael',
      lastName: 'Johnson',
      username: 'michael_johnson',
    },
    message: 'has modified the task "Develop API"',
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
    taskId: 'e6d61c4b-0e9c-44d7-8d9e-d1531e2f64e1',
    date: '2024-10-26T16:00:00Z',
  },
];

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
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
    taskId: '9d837fcb-b563-4895-8d52-e544623c1fc3',
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
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
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
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
    taskId: '9d837fcb-b563-4895-8d52-e544623c1fc3',
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
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
  },
  {
    id: '5',
    content: 'Started working on the header.',
    sender: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john_doe',
    },
    createdAt: '2024-01-05T10:00:00Z',
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
  },
  {
    id: '5',
    content: 'Lorem ipsum :D',
    sender: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john_doe',
    },
    createdAt: '2024-01-08T10:00:00Z',
    projectId: 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4',
  },
];
