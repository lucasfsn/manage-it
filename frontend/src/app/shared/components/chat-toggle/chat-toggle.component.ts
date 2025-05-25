import { ButtonComponent } from '@/app/shared/components/ui/button/button.component';
import { ChatComponent } from '@/app/shared/components/ui/chat/chat.component';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-toggle',
  imports: [ButtonComponent, MatIconModule, ChatComponent],
  templateUrl: './chat-toggle.component.html',
  styleUrl: './chat-toggle.component.scss',
})
export class ChatToggleComponent {
  protected showChat: boolean = false;

  protected toggleChat(): void {
    this.showChat = !this.showChat;
  }

  protected get toggleButtonClass(): string {
    return `fixed bottom-14 lg:bottom-4 right-4 z-50  ${this.showChat && 'chat-toggle-button'}`;
  }
}
