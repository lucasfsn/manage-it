import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../../features/dto/project.model';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';

@Component({
  selector: 'app-task-assignees-list',
  standalone: true,
  imports: [ProfileIconComponent, MatIconModule, TranslateModule],
  templateUrl: './task-assignees-list.component.html',
  styleUrl: './task-assignees-list.component.scss',
})
export class TaskAssigneesListComponent {
  @Input({ required: true }) public iconName!: string;
  @Input({ required: true }) public users: User[] = [];
  @Output() public handleClick = new EventEmitter<User>();

  protected onClick(user: User): void {
    this.handleClick.emit(user);
  }
}
