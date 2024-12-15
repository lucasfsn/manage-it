import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, MessageSend } from '../dto/chat.model';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client;
  private messageQueue: { destination: string; body: string }[] = [];
  private isConnected = false;

  private projectMessages = signal<Message[]>([]);
  private taskMessages = signal<Message[]>([]);

  public loadedProjectMessages = this.projectMessages.asReadonly();
  public loadedTaskMessages = this.taskMessages.asReadonly();

  constructor(
    private httpClient: HttpClient,
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
    return this.httpClient
      .get<Message[]>(`${environment.apiUrl}/chat/projects/${projectId}`)
      .pipe(
        tap((messages: Message[]) => {
          this.projectMessages.set(messages);
        })
      );
  }

  public getTaskChatHistory(
    projectId: string,
    taskId: string
  ): Observable<Message[]> {
    return this.httpClient
      .get<Message[]>(
        `${environment.apiUrl}/chat/projects/${projectId}/tasks/${taskId}`
      )
      .pipe(
        tap((messages: Message[]) => {
          this.taskMessages.set(messages);
        })
      );
  }

  public deactivate(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.isConnected = false;
    }
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
            const newMessage: Message = JSON.parse(res.body);
            this.projectMessages.update((messages: Message[]) => [
              ...messages,
              newMessage,
            ]);
          }
        );
      }
      if (taskId) {
        this.stompClient.subscribe(`/join/tasks/${taskId}`, (res: IMessage) => {
          const newMessage: Message = JSON.parse(res.body);
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
