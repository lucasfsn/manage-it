import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ProjectService } from '../../../../features/services/project.service';

@Component({
  selector: 'app-ongoing-projects',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './ongoing-projects.component.html',
  styleUrl: './ongoing-projects.component.scss',
})
export class OngoingProjectsComponent {
  public constructor(
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  protected get projects(): Project[] | undefined {
    return this.projectService
      .loadedProjects()
      ?.filter((project) => project.status === ProjectStatus.IN_PROGRESS);
  }

  protected isInProject(project: Project): boolean {
    return project.members.some(
      (member) => member.username === this.authService.getLoggedInUsername()
    );
  }
}
