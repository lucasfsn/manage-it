import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { UserCredentials } from '../../../features/dto/auth.model';
import { Message } from '../../../features/dto/chat.model';
import { AuthService } from '../../../features/services/auth.service';
import { ChatService } from '../../../features/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatIconModule,
    PickerComponent,
    FormsModule,
    CommonModule,
    DatePipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  animations: [
    trigger('buttonAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.8)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() isTaskChat: boolean = false;
  @Input() customPosition: string = '';
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  message: string = '';
  showEmojiPicker: boolean = false;
  isLoading = signal(false);

  get messages(): Message[] {
    return this.isTaskChat
      ? this.chatService.loadedTaskMessages()
      : this.chatService.loadedProjectMessages();
  }

  onTypeMessage(event: Event) {
    this.showEmojiPicker = false;
    this.message = (event.target as HTMLInputElement).value;
  }

  addEmoji(event: EmojiEvent): void {
    this.message += event.emoji.native;
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  get currentUser(): UserCredentials | null {
    return this.authService.loadedUser();
  }

  sendMessage(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!projectId || !this.message.trim()) return;

    if (taskId) {
      this.chatService.sendTaskMessage(taskId, this.message);
    } else {
      this.chatService.sendProjectMessage(projectId, this.message);
    }

    this.message = '';
  }

  private loadMessages(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!projectId) return;

    if (taskId) {
      this.isLoading.set(true);
      this.chatService.getTaskChatHistory(projectId, taskId).subscribe({
        error: () => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    } else {
      this.isLoading.set(true);
      this.chatService.getProjectChatHistory(projectId).subscribe({
        error: () => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  ngOnDestroy(): void {
    this.chatService.deactivate();
  }

  ngAfterViewChecked(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}
