import { LanguageCode } from '@/app/config/language.config';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { UserCredentials } from '@/app/features/dto/auth.model';
import { Message } from '@/app/features/dto/chat.model';
import { AuthService } from '@/app/features/services/auth.service';
import { ChatService } from '@/app/features/services/chat.service';
import { ProfileIconComponent } from '@/app/shared/components/ui/profile-icon/profile-icon.component';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
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
  providers: [ChatService],
  animations: [
    trigger('buttonAnimation', [
      state('void', style({ transform: 'scale(0.8)', opacity: 0 })),
      state('*', style({ transform: 'scale(1)', opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
    trigger('chatAnimation', [
      state('void', style({ transform: 'scale(0)', opacity: 0 })),
      state('*', style({ transform: 'scale(1)', opacity: 1 })),
      transition('void <=> *', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ChatComponent
  implements OnInit, AfterViewChecked, OnDestroy, AfterViewInit
{
  @ViewChild('scroll') private scroll!: ElementRef;
  @ViewChild('input') private input!: ElementRef;

  @Output() public handleClose = new EventEmitter<void>();

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
    private mapperService: MapperService,
    private translationService: TranslationService,
  ) {}

  protected get messages(): Message[] {
    return this.chatService.loadedMessages();
  }

  protected get dateFormat(): string {
    const locale = this.translationService.loadedLanguage();

    if (locale === LanguageCode.PL) return 'd MMM y, H:mm';

    return 'd MMM y, h:mm a';
  }

  protected onClick(): void {
    this.handleClose.emit();
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

  @HostListener('window:resize')
  protected onResize(): void {
    this.checkWindowSizeAndToggleLock();
  }

  private checkWindowSizeAndToggleLock(): void {
    if (window.innerWidth < 400) {
      document.body.classList.add('scroll-lock');
    } else {
      document.body.classList.remove('scroll-lock');
    }
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('projectId');
      this.taskId = params.get('taskId');
      this.loadMessages();
      this.watchTopic();
    });
    this.checkWindowSizeAndToggleLock();
  }

  public ngAfterViewInit(): void {
    this.input.nativeElement.focus();
  }

  public ngAfterViewChecked(): void {
    const el = this.scroll.nativeElement as HTMLElement;
    el.scrollTop = el.scrollHeight;
  }

  public ngOnDestroy(): void {
    document.body.classList.remove('scroll-lock');
  }
}
