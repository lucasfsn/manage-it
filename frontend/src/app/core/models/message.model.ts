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
  id: string;
  content: string;
  sender: User;
  createdAt: string;
}

export interface MessageReq {
  content: string;
  sender: User;
  projectId: string;
  taskId?: string;
}
