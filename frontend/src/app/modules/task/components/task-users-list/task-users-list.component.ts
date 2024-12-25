import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';

@Component({
  selector: 'app-task-users-list',
  standalone: true,
  imports: [ProfileIconComponent, MatIconModule, TranslateModule],
  templateUrl: './task-users-list.component.html',
  styleUrl: './task-users-list.component.scss',
})
export class TaskUsersListComponent {
  @Input({ required: true }) public iconName!: string;
  @Input({ required: true }) public users: User[] = [];
  @Output() public handleClick = new EventEmitter<User>();

  public constructor(private authService: AuthService) {}

  protected onClick(user: User): void {
    this.handleClick.emit(user);
  }

  protected isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
