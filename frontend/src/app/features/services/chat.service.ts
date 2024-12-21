import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, MessageQueue, MessageSend } from '../dto/chat.model';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client;
  private messageQueue: MessageQueue[] = [];
  private isConnected = false;

  private projectMessages = signal<Message[]>([]);
  private taskMessages = signal<Message[]>([]);

  public loadedProjectMessages = this.projectMessages.asReadonly();
  public loadedTaskMessages = this.taskMessages.asReadonly();

  public constructor(
    private http: HttpClient,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {
    this.stompClient = new Client({
      brokerURL: `${environment.socketUrl}?token=${encodeURIComponent(
        `Bearer ${localStorage.getItem('JWT_TOKEN')!}`
      )}`,
    });

    this.setup();
  }

  public sendProjectMessage(projectId: string, message: string): void {
    const token = localStorage.getItem('JWT_TOKEN');

    if (!token) return;

    const messageToSend: MessageSend = {
      content: message,
      token,
    };

    this.sendMessage(`/send/projects/${projectId}`, messageToSend);
  }

  public sendTaskMessage(taskId: string, message: string): void {
    const token = localStorage.getItem('JWT_TOKEN');

    if (!token) return;

    const messageToSend: MessageSend = {
      content: message,
      token,
    };

    this.sendMessage(`/send/tasks/${taskId}`, messageToSend);
  }

  public getProjectChatHistory(projectId: string): Observable<Message[]> {
    return this.http
      .get<Message[]>(`${environment.apiUrl}/chat/projectss/${projectId}`)
      .pipe(
        tap((messages: Message[]) => {
          this.projectMessages.set(messages);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public getTaskChatHistory(
    projectId: string,
    taskId: string
  ): Observable<Message[]> {
    return this.http
      .get<Message[]>(
        `${environment.apiUrl}/chat/projects/${projectId}/tasks/${taskId}`
      )
      .pipe(
        tap((messages: Message[]) => {
          this.taskMessages.set(messages);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public deactivate(): void {
    this.stompClient.deactivate();
    this.isConnected = false;
  }

  private sendMessage(destination: string, message: MessageSend): void {
    const body = JSON.stringify(message);
    if (this.isConnected) {
      this.stompClient.publish({ destination, body });
    } else {
      this.messageQueue.push({ destination, body });
    }
  }

  private setup(): void {
    this.stompClient.onConnect = () => {
      this.isConnected = true;

      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        if (msg) {
          this.stompClient.publish({
            destination: msg.destination,
            body: msg.body,
          });
        }
      }

      const projectId = this.projectService.loadedProject()?.id;
      const taskId = this.taskService.loadedTask()?.id;

      if (projectId) {
        this.stompClient.subscribe(
          `/join/projects/${projectId}`,
          (res: IMessage) => {
            const newMessage: Message = JSON.parse(res.body) as Message;
            this.projectMessages.update((messages: Message[]) => [
              ...messages,
              newMessage,
            ]);
          }
        );
      }
      if (taskId) {
        this.stompClient.subscribe(`/join/tasks/${taskId}`, (res: IMessage) => {
          const newMessage: Message = JSON.parse(res.body) as Message;
          this.taskMessages.update((messages: Message[]) => [
            ...messages,
            newMessage,
          ]);
        });
      }
    };

    this.stompClient.onWebSocketClose = () => {
      this.isConnected = false;
      setTimeout(() => {
        this.stompClient.activate();
      }, 100);
    };

    this.stompClient.activate();
  }
}
