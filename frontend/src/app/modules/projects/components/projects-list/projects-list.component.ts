import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ProjectService } from '../../../../features/services/project.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, CommonModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css',
})
export class ProjectsListComponent implements OnInit {
  protected sortedProjects: Project[] | undefined;
  protected sortCriteria = 'name';
  protected sortOrder = 'ascending';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  protected get projects(): Project[] | undefined {
    return this.projectService.loadedProjects();
  }

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected sortProjects(): void {
    if (!this.projects) return;

    this.sortedProjects = [...this.projects].sort((a, b) => {
      let comparison = 0;
      switch (this.sortCriteria) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison =
            this.statusPriority[a.status] - this.statusPriority[b.status];
          break;
        case 'startDate':
          comparison =
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'endDate':
          comparison =
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
      }

      return this.sortOrder === 'ascending' ? comparison : -comparison;
    });

    this.updateQueryParams();
  }

  protected updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.sortCriteria,
        order: this.sortOrder,
      },
      queryParamsHandling: 'merge',
    });
  }

  protected onSortChange(event: Event, type: 'criteria' | 'order'): void {
    const el = event.target as HTMLSelectElement;
    if (type === 'criteria') {
      this.sortCriteria = el.value;
      this.sortOrder = 'ascending';
    } else {
      this.sortOrder = el.value;
    }

    this.sortProjects();
  }

  protected isInProject(project: Project): boolean {
    return project.members.some(
      (member) => member.username === this.authService.getLoggedInUsername()
    );
  }

  private statusPriority: Record<ProjectStatus, number> = {
    [ProjectStatus.IN_PROGRESS]: 1,
    [ProjectStatus.COMPLETED]: 2,
  };

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sortCriteria = params['sort'] || 'name';
      this.sortOrder = params['order'] || 'ascending';
      this.sortProjects();
    });
  }
}
