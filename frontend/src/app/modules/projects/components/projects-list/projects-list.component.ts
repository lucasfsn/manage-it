import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project, ProjectStatus } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, CommonModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css',
})
export class ProjectsListComponent implements OnInit {
  public sortedProjects: Project[] | undefined;
  sortCriteria: string = 'name';
  sortOrder: string = 'ascending';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  get projects(): Project[] | undefined {
    return this.projectService.loadedProjects();
  }

  get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  sortProjects() {
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

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.sortCriteria,
        order: this.sortOrder,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(event: Event, type: 'criteria' | 'order') {
    const el = event.target as HTMLSelectElement;
    if (type === 'criteria') {
      this.sortCriteria = el.value;
      this.sortOrder = 'ascending';
    } else {
      this.sortOrder = el.value;
    }

    this.sortProjects();
  }

  isInProject(project: Project): boolean {
    return project.members.some(
      (member) => member.username === this.authService.getLoggedInUsername()
    );
  }

  private statusPriority: { [key in ProjectStatus]: number } = {
    [ProjectStatus.InProgress]: 1,
    [ProjectStatus.Completed]: 2,
  };

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.sortCriteria = params['sort'] || 'name';
      this.sortOrder = params['order'] || 'ascending';
      this.sortProjects();
    });
  }
}
