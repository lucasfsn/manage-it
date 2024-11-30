import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, ProjectStatus } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-ongoing-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ongoing-projects.component.html',
  styleUrl: './ongoing-projects.component.css',
})
export class OngoingProjectsComponent {
  constructor(
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  get projects(): Project[] | undefined {
    return this.projectService
      .loadedProjects()
      ?.filter((project) => project.status === ProjectStatus.InProgress);
  }

  isInProject(project: Project): boolean {
    return project.members.some(
      (member) => member.username === this.authService.getLoggedInUsername()
    );
  }
}
