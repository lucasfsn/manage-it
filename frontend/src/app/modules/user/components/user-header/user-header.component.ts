import { UserProfileDto } from '@/app/features/dto/user.dto';
import { UserService } from '@/app/features/services/user.service';
import { ProfileIconComponent } from '@/app/shared/components/ui/profile-icon/profile-icon.component';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-header',
  imports: [MatIconModule, ProfileIconComponent, TranslateModule, DatePipe],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss',
})
export class UserHeaderComponent {
  public constructor(private userService: UserService) {}

  protected get user(): UserProfileDto | null {
    return this.userService.loadedUser();
  }
}
