import { User } from './project.model';

export interface Message {
  readonly id: string;
  readonly content: string;
  readonly sender: User;
  readonly createdAt: string;
}

export interface MessageSend {
  content: string;
  token: string;
}
