import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ProjectService } from '../../../../features/services/project.service';
import { ProjectFilters } from '../../models/project-filter.model';
import {
  ProjectsSort,
  SortCriteria,
  SortOrder,
} from '../../models/project-sort.model';
import { FilterProjectsComponent } from '../filter-projects/filter-projects.component';
import { SortProjectsComponent } from '../sort-projects/sort-projects.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    DatePipe,
    CommonModule,
    FormsModule,
    FilterProjectsComponent,
    SortProjectsComponent,
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
})
export class ProjectsListComponent implements OnInit {
  protected sortedAndFilteredProjects: Project[] | undefined;

  protected sortCriteria: SortCriteria = SortCriteria.NAME;
  protected sortOrder: SortOrder = SortOrder.ASCENDING;

  protected filterName = '';
  protected filterStatus: ProjectStatus | undefined;
  protected filterOwnedByCurrentUser = false;

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
    if (!this.sortedAndFilteredProjects) return;

    this.sortedAndFilteredProjects = [...this.sortedAndFilteredProjects].sort(
      (a, b) => {
        let comparison = 0;
        switch (this.sortCriteria) {
          case SortCriteria.NAME:
            comparison = a.name.localeCompare(b.name);
            break;
          case SortCriteria.START_DATE:
            comparison =
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            break;
          case SortCriteria.END_DATE:
            comparison =
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
            break;
          case SortCriteria.COMPLETED_TASKS:
            comparison = a.completedTasks - b.completedTasks;
            break;
        }

        return this.sortOrder === SortOrder.ASCENDING
          ? comparison
          : -comparison;
      }
    );

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

  protected onSortChange(sort: ProjectsSort): void {
    this.sortCriteria = sort.criteria;
    this.sortOrder = sort.order;
    this.sortProjects();
  }

  private filterProjects(): Project[] | undefined {
    if (!this.projects) return;

    return this.projects.filter((project) => {
      const matchesName =
        !this.filterName ||
        project.name.toLowerCase().includes(this.filterName.toLowerCase());
      const matchesStatus =
        !this.filterStatus || project.status === this.filterStatus;
      const matchesOwner =
        !this.filterOwnedByCurrentUser ||
        project.owner.username === this.authService.getLoggedInUsername();

      return matchesName && matchesStatus && matchesOwner;
    });
  }

  protected onFilterChange(filters: ProjectFilters): void {
    this.filterName = filters.name;
    this.filterStatus = filters.status;
    this.filterOwnedByCurrentUser = filters.ownedByCurrentUser;
    this.sortedAndFilteredProjects = this.filterProjects();
    this.sortProjects();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sortCriteria = (params['sort'] as SortCriteria) || SortCriteria.NAME;
      this.sortOrder = (params['order'] as SortOrder) || SortOrder.ASCENDING;
      this.sortedAndFilteredProjects = this.filterProjects();
      this.sortProjects();
    });
  }
}
