import { User } from './project.model';

export interface Message {
  readonly id: string;
  readonly content: string;
  readonly sender: User;
  readonly createdAt: string;
}

export interface MessageSend {
  readonly content: string;
  readonly token: string;
}

export interface MessageQueue {
  readonly destination: string;
  readonly body: string;
}
