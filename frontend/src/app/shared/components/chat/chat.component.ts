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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
    DatePipe,
    TranslateModule,
    ProfileIconComponent,
    ReactiveFormsModule,
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
  protected showEmojiPicker: boolean = false;
  protected loading: boolean = false;
  protected form = new FormControl<string>('');

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

  protected addEmoji(event: EmojiEvent): void {
    this.form.setValue((this.form.value ?? '') + event.emoji.native);
  }

  protected toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  protected get currentUser(): UserCredentials | null {
    return this.authService.loadedUser();
  }

  protected sendMessage(): void {
    const message = this.form.value;

    if (!this.projectId || !message || !message.trim()) return;

    this.chatService.sendMessage(message, this.projectId, this.taskId);

    this.form.reset();
    this.showEmojiPicker = false;
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

  private watchTopic(): void {
    if (!this.projectId) return;

    const subscription = this.chatService
      .watchTopic(this.projectId, this.taskId)
      .subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('projectId');
      this.taskId = params.get('taskId');
      this.loadMessages();
      this.watchTopic();
    });
  }

  public ngAfterViewChecked(): void {
    const el = this.scroll.nativeElement as HTMLElement;
    el.scrollTop = el.scrollHeight;
  }
}
