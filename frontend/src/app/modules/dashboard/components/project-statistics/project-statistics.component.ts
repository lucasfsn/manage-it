import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-project-statistics',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-statistics.component.html',
  styleUrl: './project-statistics.component.css',
})
export class ProjectStatisticsComponent {
  constructor(
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  get projects(): Project[] | undefined {
    return this.projectService.loadedProjects();
  }

  isInProject(project: Project): boolean {
    return project.members.some(
      (member) => member.username === this.authService.getLoggedInUsername()
    );
  }
}
