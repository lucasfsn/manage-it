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
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MapperService } from '../../../core/services/mapper.service';
import { UserCredentials } from '../../../features/dto/auth.model';
import { Message } from '../../../features/dto/chat.model';
import { AuthService } from '../../../features/services/auth.service';
import { ChatService } from '../../../features/services/chat.service';
import { DatePipe } from '../../pipes/date.pipe';
import { ProfileIconComponent } from '../profile-icon/profile-icon.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatIconModule,
    PickerComponent,
    FormsModule,
    DatePipe,
    TranslateModule,
    ProfileIconComponent,
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
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroll') private scroll!: ElementRef;
  private destroyRef = inject(DestroyRef);
  private projectId: string | null = null;
  private taskId: string | null = null;
  protected message: string = '';
  protected showEmojiPicker: boolean = false;
  protected loading: boolean = false;

  public constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private mapperService: MapperService
  ) {}

  protected get messages(): Message[] {
    return this.chatService.loadedMessages();
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

    this.chatService.sendMessage(this.message, this.projectId, this.taskId);

    this.message = '';
  }

  private loadMessages(): void {
    if (!this.projectId) return;

    this.loading = true;
    this.chatService.getChatHistory(this.projectId, this.taskId).subscribe({
      error: () => {
        const localeMessage = this.mapperService.errorToastMapper();
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private configureSubscription(): void {
    if (!this.projectId) return;

    const topic = this.taskId
      ? `/join/tasks/${this.taskId}`
      : `/join/projects/${this.projectId}`;

    const subscription = this.chatService.rxStomp.watch(topic).subscribe({
      next: (message) => {
        const newMessage: Message = JSON.parse(message.body) as Message;
        this.chatService.updateMessages(newMessage);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('projectId');
      this.taskId = params.get('taskId');
      this.loadMessages();
      this.configureSubscription();
    });
  }

  public ngAfterViewChecked(): void {
    const el = this.scroll.nativeElement as HTMLElement;
    el.scrollTop = el.scrollHeight;
  }
}
