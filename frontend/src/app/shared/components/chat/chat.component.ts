import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewChecked,
  Component,
  DestroyRef,
  ElementRef,
  inject,
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
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserCredentials } from '../../../features/dto/auth.model';
import { Message } from '../../../features/dto/chat.model';
import { AuthService } from '../../../features/services/auth.service';
import { ChatService } from '../../../features/services/chat.service';
import { MappersService } from '../../../features/services/mappers.service';
import { DatePipe } from '../../pipes/date.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatIconModule,
    PickerComponent,
    FormsModule,
    DatePipe,
    TranslateModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
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
  private projectId: string | null = null;
  private taskId: string | null = null;
  private destroyRef = inject(DestroyRef);

  @Input() public isTaskChat = false;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  public constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private mappersService: MappersService
  ) {}

  protected message = '';
  protected showEmojiPicker = false;
  protected isLoading = signal(false);

  protected get messages(): Message[] {
    return this.isTaskChat
      ? this.chatService.loadedTaskMessages()
      : this.chatService.loadedProjectMessages();
  }

  protected onTypeMessage(event: Event): void {
    this.showEmojiPicker = false;
    this.message = (event.target as HTMLInputElement).value;
  }

  protected addEmoji(event: EmojiEvent): void {
    this.message += event.emoji.native;
  }

  protected toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  protected get currentUser(): UserCredentials | null {
    return this.authService.loadedUser();
  }

  protected sendMessage(): void {
    if (!this.projectId || !this.message.trim()) return;

    if (this.taskId) {
      this.chatService.sendTaskMessage(this.taskId, this.message);
    } else {
      this.chatService.sendProjectMessage(this.projectId, this.message);
    }

    this.message = '';
  }

  private loadMessages(): void {
    if (!this.projectId) return;

    this.isLoading.set(true);
    if (this.taskId) {
      this.chatService
        .getTaskChatHistory(this.projectId, this.taskId)
        .subscribe({
          error: () => {
            const localeMessage = this.mappersService.errorToastMapper();
            this.toastrService.error(localeMessage);
            this.isLoading.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
    } else {
      this.chatService.getProjectChatHistory(this.projectId).subscribe({
        error: () => {
          const localeMessage = this.mappersService.errorToastMapper();
          this.toastrService.error(localeMessage);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  public ngOnInit(): void {
    const subscription = this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('projectId');
      this.taskId = params.get('taskId');

      this.loadMessages();
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  public ngOnDestroy(): void {
    this.chatService.deactivate();
  }

  public ngAfterViewChecked(): void {
    const el = this.messageContainer.nativeElement as HTMLElement;
    el.scrollTop = el.scrollHeight;
  }
}
