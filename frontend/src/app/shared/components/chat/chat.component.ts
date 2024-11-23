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
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { UserCredentials } from '../../../core/models/auth.model';
import { Message, MessageSend } from '../../../core/models/message.model';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from '../../../core/services/message.service';

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
export class ChatComponent implements OnInit, AfterViewChecked {
  @Input() customPosition: string = '';
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  protected message: string = '';
  protected showEmojiPicker: boolean = false;
  protected isLoading = signal(false);

  onTypeMessage(event: Event) {
    this.showEmojiPicker = false;
    const inputEl = event.target as HTMLInputElement;
    this.message = inputEl.value;
  }

  addEmoji(event: EmojiEvent): void {
    this.message += event.emoji.native;
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  get messages(): Message[] {
    return this.messageService.loadedMessages();
  }

  get currentUser(): UserCredentials | null {
    return this.authService.loadedUser();
  }

  sendMessage(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!projectId || !this.message.trim() || !this.currentUser) {
      return;
    }

    const newMessage: MessageSend = {
      content: this.message,
      sender: {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        username: this.currentUser.username,
      },
      projectId,
      taskId: taskId || undefined,
    };

    this.messageService.sendMessage(newMessage);
    this.message = '';
  }

  private loadMessages(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!projectId) {
      return;
    }

    if (taskId) {
      this.isLoading.set(true);
      this.messageService.getTaskMessages(taskId).subscribe({
        error: () => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });

      return;
    }

    this.isLoading.set(true);
    this.messageService.getProjectMessages(projectId).subscribe({
      error: () => {
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed:', err);
    }
  }
}
