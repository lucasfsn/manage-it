import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ProjectStatus,
  UserProject,
} from '../../../../features/dto/project.model';
import { User } from '../../../../features/dto/user.model';
import { UserService } from '../../../../features/services/user.service';

@Component({
  selector: 'app-user-projects-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-projects-list.component.html',
  styleUrl: './user-projects-list.component.scss',
})
export class UserProjectsListComponent implements OnInit {
  protected commonProjects: UserProject[] = [];

  public constructor(private userService: UserService) {}

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get user(): User | null {
    return this.userService.loadedUser();
  }

  public ngOnInit(): void {
    if (!this.user) return;

    this.commonProjects = this.user.projects.filter((project) =>
      project.members.find((member) => member.username === this.user?.username)
    );
  }
}
