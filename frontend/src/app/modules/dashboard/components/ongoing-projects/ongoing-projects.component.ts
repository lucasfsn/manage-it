import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Project, ProjectStatus } from '@/app/features/dto/project.model';
import { ProjectService } from '@/app/features/services/project.service';

@Component({
  selector: 'app-ongoing-projects',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './ongoing-projects.component.html',
  styleUrl: './ongoing-projects.component.scss',
})
export class OngoingProjectsComponent {
  public constructor(private projectService: ProjectService) {}

  protected get projects(): Project[] {
    return this.projectService
      .loadedProjects()
      .filter((project) => project.status === ProjectStatus.IN_PROGRESS);
  }
}
