import { AuthService } from '@/app/features/services/auth.service';
import { ProfileIconComponent } from '@/app/shared/components/ui/profile-icon/profile-icon.component';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.dto';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-users-list',
  imports: [ProfileIconComponent, MatIconModule, TranslateModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  @Input({ required: true }) public iconName!: string;
  @Input({ required: true }) public users: UserSummaryDto[] = [];
  @Input() public hideButton: boolean = false;
  @Output() public handleClick = new EventEmitter<UserSummaryDto>();

  public constructor(private authService: AuthService) {}

  protected onClick(user: UserSummaryDto): void {
    this.handleClick.emit(user);
  }

  protected isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
