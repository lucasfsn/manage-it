import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { TasksComponent } from '../../../tasks/components/tasks/tasks.component';
import { ProjectDetailsComponent } from '../../components/project-details/project-details.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    MatIconModule,
    TasksComponent,
    ChatComponent,
    ProjectDetailsComponent,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  animations: [
    trigger('chatAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ProjectComponent {
  protected showChat = signal<boolean>(false);

  protected toggleChat(): void {
    this.showChat.set(!this.showChat());
  }
}
