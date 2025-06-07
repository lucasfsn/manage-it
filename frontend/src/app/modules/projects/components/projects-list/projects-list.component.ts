import { ProjectDto } from '@/app/features/dto/project.dto';
import { AuthService } from '@/app/features/services/auth.service';
import { ProjectService } from '@/app/features/services/project.service';
import { ProjectsFilterComponent } from '@/app/modules/projects/components/projects-filter/projects-filter.component';
import { ProjectsSortComponent } from '@/app/modules/projects/components/projects-sort/projects-sort.component';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { ProjectsFilters } from '@/app/modules/projects/types/projects-filter.type';
import {
  ProjectsSort,
  SortCriteria,
  SortOrder,
} from '@/app/modules/projects/types/projects-sort.type';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { enumValueValidator } from '@/app/shared/validators';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface ProjectsParams extends Params {
  readonly sortBy?: SortCriteria;
  readonly order?: SortOrder;
  readonly name?: string;
  readonly status?: ProjectStatus;
  readonly ownedByCurrentUser?: string;
}

@Component({
  selector: 'app-projects-list',
  imports: [
    RouterLink,
    DecimalPipe,
    TranslateModule,
    DatePipe,
    ProjectsSortComponent,
    ProjectsFilterComponent,
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
})
export class ProjectsListComponent implements OnInit {
  protected sortedAndFilteredProjects: ProjectDto[] = [];

  protected sortCriteria: SortCriteria = SortCriteria.NAME;
  protected sortOrder: SortOrder = SortOrder.ASCENDING;

  protected filterName: string = '';
  protected filterStatus: ProjectStatus | null = null;
  protected filterOwnedByCurrentUser: boolean = false;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService,
  ) {}

  protected get projects(): ProjectDto[] {
    return this.projectService.loadedProjects();
  }

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected onSortChange(sort: ProjectsSort): void {
    this.sortCriteria = sort.criteria;
    this.sortOrder = sort.order;
    this.applyFiltersAndSort();
  }

  protected onFilterChange(filters: ProjectsFilters): void {
    this.filterName = filters.name;
    this.filterStatus = filters.status;
    this.filterOwnedByCurrentUser = filters.ownedByCurrentUser;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    this.sortedAndFilteredProjects = this.sortProjects(this.filterProjects());
    this.updateQueryParams();
  }

  private sortProjects(projects: ProjectDto[]): ProjectDto[] {
    return projects.toSorted((a, b) => {
      let comparison = 0;
      switch (this.sortCriteria) {
        case SortCriteria.NAME:
          comparison = a.name.localeCompare(b.name);
          break;
        case SortCriteria.CREATED_AT:
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case SortCriteria.END_DATE:
          comparison =
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        case SortCriteria.COMPLETED_TASKS:
          comparison = a.completedTasks - b.completedTasks;
          break;
      }

      return this.sortOrder === SortOrder.ASCENDING ? comparison : -comparison;
    });
  }

  private filterProjects(): ProjectDto[] {
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

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sortBy: this.sortCriteria,
        order: this.sortOrder,
        name: this.filterName ? this.filterName : undefined,
        status: this.filterStatus ?? undefined,
        ownedByCurrentUser: this.filterOwnedByCurrentUser
          ? this.filterOwnedByCurrentUser
          : undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: ProjectsParams) => {
      this.sortCriteria =
        enumValueValidator(params.sortBy, SortCriteria) || SortCriteria.NAME;
      this.sortOrder =
        enumValueValidator(params.order, SortOrder) || SortOrder.ASCENDING;
      this.filterName = params.name || '';
      this.filterStatus = enumValueValidator(params.status, ProjectStatus);
      this.filterOwnedByCurrentUser = params.ownedByCurrentUser === 'true';
      this.applyFiltersAndSort();
    });
  }
}
