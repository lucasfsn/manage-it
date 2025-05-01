import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '@/app/features/dto/project.model';
import { AuthService } from '@/app/features/services/auth.service';
import { ProfileIconComponent } from '@/app/shared/components/profile-icon/profile-icon.component';

@Component({
  selector: 'app-users-list',
  imports: [ProfileIconComponent, MatIconModule, TranslateModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
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
