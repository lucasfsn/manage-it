import { Message, MessageSend } from '@/app/features/dto/chat.model';
import { ACCESS_TOKEN_KEY } from '@/app/shared/constants/cookie.constant';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private rxStomp: RxStomp;

  private messages = signal<Message[]>([]);
  public loadedMessages = this.messages.asReadonly();

  public constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {
    const token = this.cookieService.get(ACCESS_TOKEN_KEY);

    const rxStompConfig: RxStompConfig = {
      brokerURL: `${environment.socketUrl}?token=${encodeURIComponent(
        `Bearer ${token}`,
      )}`,
      reconnectDelay: 1000,
    };

    this.rxStomp = new RxStomp();
    this.rxStomp.configure(rxStompConfig);
    this.rxStomp.activate();
  }

  public sendMessage(
    message: string,
    projectId: string,
    taskId: string | null = null,
  ): void {
    const token = this.cookieService.get(ACCESS_TOKEN_KEY);

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
    taskId: string | null = null,
  ): Observable<Message[]> {
    this.messages.set([]);

    const url = taskId
      ? `chat/projects/${projectId}/tasks/${taskId}`
      : `chat/projects/${projectId}`;

    return this.http.get<Message[]>(`${environment.apiUrl}/${url}`).pipe(
      tap((messages: Message[]) => {
        this.messages.set(messages);
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      }),
    );
  }

  public watchTopic(
    projectId: string,
    taskId: string | null = null,
  ): Observable<Message> {
    const topic = taskId
      ? `/join/tasks/${taskId}`
      : `/join/projects/${projectId}`;

    return new Observable<Message>(() =>
      this.rxStomp.watch(topic).subscribe((message) => {
        const newMessage: Message = JSON.parse(message.body) as Message;
        this.messages.update((messages) => [...messages, newMessage]);
      }),
    );
  }
}
