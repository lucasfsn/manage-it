import { User } from './project.model';

export interface MessageDummy {
  id: string;
  content: string;
  sender: User;
  createdAt: string;
  projectId: string;
  taskId?: string;
}

export interface Message {
  readonly id: string;
  readonly content: string;
  readonly sender: User;
  readonly createdAt: string;
}

export interface MessageSend {
  content: string;
  sender: User;
  projectId: string;
  taskId?: string;
}
