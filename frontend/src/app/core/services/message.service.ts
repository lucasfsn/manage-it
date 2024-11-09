import { Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delay, of, tap } from 'rxjs';
import { dummyMessages } from '../../dummy-data';
import { Message, MessageDummy, MessageReq } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private toastrService: ToastrService) {}

  private messages = signal<Message[]>([]);

  loadedMessages = this.messages.asReadonly();

  // Only for dummy data
  private sortMessagesByDate(messages: Message[]): Message[] {
    return messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  getProjectMessages(projectId: string) {
    return of(
      dummyMessages.filter((msg) => msg.projectId === projectId && !msg.taskId)
    ).pipe(
      delay(200),
      tap({
        next: (messages: MessageDummy[]) => {
          const res: Message[] = messages.map(
            ({ id, content, sender, createdAt }) => ({
              id,
              content,
              sender,
              createdAt,
            })
          );
          this.messages.set(this.sortMessagesByDate(res));
        },
        error: (error) => {
          console.error("Couldn't fetch messages.", error);
        },
      })
    );
  }

  getTaskMessages(taskId: string) {
    return of(dummyMessages.filter((msg) => msg.taskId === taskId)).pipe(
      delay(200),
      tap({
        next: (messages: MessageDummy[]) => {
          const res: Message[] = messages.map(
            ({ id, content, sender, createdAt }) => ({
              id,
              content,
              sender,
              createdAt,
            })
          );
          this.messages.set(this.sortMessagesByDate(res));
        },
        error: (error) => {
          console.error("Couldn't fetch messages.", error);
        },
      })
    );
  }

  sendMessage(message: MessageReq) {
    const prevMessages = this.messages();

    const newMessage: Message = {
      id: Math.random().toString(16).slice(2),
      content: message.content,
      sender: message.sender,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = this.messages.set(
      this.sortMessagesByDate([...prevMessages, newMessage])
    );

    return of(updatedMessages).pipe(
      delay(200),
      tap({
        error: () => {
          this.messages.set(prevMessages);
          this.toastrService.error('Something went wrong.');
        },
      })
    );
  }
}
