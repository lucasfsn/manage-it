import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../../features/dto/user.model';
import { UserService } from '../../../../features/services/user.service';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';
import { DatePipe } from '../../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [MatIconModule, ProfileIconComponent, TranslateModule, DatePipe],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss',
})
export class UserHeaderComponent {
  public constructor(private userService: UserService) {}

  protected get user(): User | null {
    return this.userService.loadedUser();
  }
}
