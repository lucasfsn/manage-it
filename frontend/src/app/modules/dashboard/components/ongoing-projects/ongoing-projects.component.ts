import { ProjectDto } from '@/app/features/dto/project.model';
import { ProjectService } from '@/app/features/services/project.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ongoing-projects',
  imports: [RouterLink, TranslateModule],
  templateUrl: './ongoing-projects.component.html',
  styleUrl: './ongoing-projects.component.scss',
})
export class OngoingProjectsComponent {
  public constructor(private projectService: ProjectService) {}

  protected get projects(): ProjectDto[] {
    return this.projectService
      .loadedProjects()
      .filter((project) => project.status === ProjectStatus.IN_PROGRESS);
  }
}
