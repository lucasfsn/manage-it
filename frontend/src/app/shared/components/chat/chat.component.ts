import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatIconModule, PickerComponent, FormsModule, CommonModule],
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
export class ChatComponent {
  @Input() customPosition: string = '';

  public message: string = '';
  public showEmojiPicker: boolean = false;

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
}
