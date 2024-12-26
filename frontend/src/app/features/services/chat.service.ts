import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { rxStompConfig } from '../../config/rx-stomp.config';
import { Message, MessageSend } from '../dto/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly TOKEN = environment.storageKeys.TOKEN;
  public rxStomp: RxStomp;

  private messages = signal<Message[]>([]);

  public loadedMessages = this.messages.asReadonly();

  public constructor(private http: HttpClient) {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure(rxStompConfig);
    this.rxStomp.activate();
  }

  public sendMessage(
    message: string,
    projectId: string,
    taskId: string | null = null
  ): void {
    const token = localStorage.getItem(this.TOKEN);

    if (!token) return;

    const messageToSend: MessageSend = {
      content: message,
      token,
    };

    const topic = taskId
      ? `/send/tasks/${taskId}`
      : `/send/projects/${projectId}`;

    this.rxStomp.publish({
      destination: topic,
      body: JSON.stringify(messageToSend),
    });
  }

  public getChatHistory(
    projectId: string,
    taskId: string | null = null
  ): Observable<Message[]> {
    const url = taskId
      ? `chat/projects/${projectId}/tasks/${taskId}`
      : `chat/projects/${projectId}`;

    return this.http.get<Message[]>(`${environment.apiUrl}/${url}`).pipe(
      tap((messages: Message[]) => {
        this.messages.set(messages);
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  public updateMessages(newMessage: Message): void {
    this.messages.update((messages) => [...messages, newMessage]);
  }
}
