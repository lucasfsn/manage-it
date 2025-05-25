import { MessageDto, MessagePayload } from '@/app/features/dto/chat.dto';
import { AuthService } from '@/app/features/services/auth.service';
import { ACCESS_TOKEN_KEY } from '@/app/shared/constants/cookie.constant';
import { Response } from '@/app/shared/types/response.type';
import { handleApiError } from '@/app/shared/utils/handle-api-error.util';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, signal } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { CookieService } from 'ngx-cookie-service';
import { catchError, firstValueFrom, map, Observable, tap } from 'rxjs';

@Injectable()
export class ChatService implements OnDestroy {
  private rxStomp: RxStomp = new RxStomp();

  private messages = signal<MessageDto[]>([]);
  public loadedMessages = this.messages.asReadonly();

  public constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService,
  ) {
    const beforeConnect = async (): Promise<void> => {
      const token = await this.getValidAccessToken();
      if (!token) return;

      this.rxStomp.configure({
        brokerURL: `${environment.socketUrl}?token=${encodeURIComponent(`Bearer ${token}`)}`,
      });
    };

    this.rxStomp.configure({
      beforeConnect,
      reconnectDelay: 1000,
    });
    this.rxStomp.activate();
  }

  public async sendMessage(
    message: string,
    projectId: string,
    taskId: string | null = null,
  ): Promise<void> {
    const token = await this.getValidAccessToken();
    if (!token) return;

    const messageToSend: MessagePayload = {
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
  ): Observable<MessageDto[]> {
    this.messages.set([]);

    const url = taskId
      ? `chat/projects/${projectId}/tasks/${taskId}`
      : `chat/projects/${projectId}`;

    return this.http
      .get<Response<MessageDto[]>>(`${environment.apiUrl}/${url}`)
      .pipe(
        tap((res: Response<MessageDto[]>) => this.messages.set(res.data)),
        map((res: Response<MessageDto[]>) => res.data),
        catchError(handleApiError),
      );
  }

  public watchTopic(
    projectId: string,
    taskId: string | null = null,
  ): Observable<MessageDto> {
    const topic = taskId
      ? `/join/tasks/${taskId}`
      : `/join/projects/${projectId}`;

    return new Observable<MessageDto>(() =>
      this.rxStomp.watch(topic).subscribe((message) => {
        const newMessage: MessageDto = JSON.parse(message.body) as MessageDto;
        this.messages.update((messages) => [...messages, newMessage]);
      }),
    );
  }

  private async getValidAccessToken(): Promise<string | null> {
    const token = this.cookieService.get(ACCESS_TOKEN_KEY);
    if (!token) return null;

    if (!this.authService.isTokenExpired(token)) return token;

    const { accessToken } = await firstValueFrom(
      this.authService.refreshToken(),
    );

    return accessToken;
  }

  public ngOnDestroy(): void {
    this.rxStomp.deactivate();
  }
}
