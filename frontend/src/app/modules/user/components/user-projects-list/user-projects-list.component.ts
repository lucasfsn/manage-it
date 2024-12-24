import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ProjectStatus,
  UserProject,
} from '../../../../features/dto/project.model';
import { UserService } from '../../../../features/services/user.service';

@Component({
  selector: 'app-user-projects-list',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './user-projects-list.component.html',
  styleUrl: './user-projects-list.component.scss',
})
export class UserProjectsListComponent {
  protected commonProjects: UserProject[] = [];

  public constructor(private userService: UserService) {}

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get userProjects(): UserProject[] {
    return this.userService.loadedUser()?.projects || [];
  }
}
