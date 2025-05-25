import { UserProfileProjectsDto } from '@/app/features/dto/user.dto';
import { UserService } from '@/app/features/services/user.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-projects-list',
  imports: [RouterLink, TranslateModule],
  templateUrl: './user-projects-list.component.html',
  styleUrl: './user-projects-list.component.scss',
})
export class UserProjectsListComponent {
  protected commonProjects: UserProfileProjectsDto[] = [];

  public constructor(private userService: UserService) {}

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get userProjects(): UserProfileProjectsDto[] {
    return this.userService.loadedUser()?.projects || [];
  }
}
