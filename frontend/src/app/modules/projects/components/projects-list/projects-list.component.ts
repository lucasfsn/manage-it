import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Project, ProjectStatus } from '@/app/features/dto/project.model';
import { AuthService } from '@/app/features/services/auth.service';
import { ProjectService } from '@/app/features/services/project.service';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { enumValueValidator } from '@/app/shared/validators';
import { ProjectsFilters } from '@/app/modules/projects/models/projects-filter.model';
import {
  ProjectsSort,
  SortCriteria,
  SortOrder,
} from '@/app/modules/projects/models/projects-sort.model';
import { ProjectsFilterComponent } from '@/app/modules/projects/components/projects-filter/projects-filter.component';
import { ProjectsSortComponent } from '@/app/modules/projects/components/projects-sort/projects-sort.component';

interface ProjectsParams extends Params {
  readonly sort?: SortCriteria;
  readonly order?: SortOrder;
  readonly name?: string;
  readonly status?: ProjectStatus;
  readonly onlyOwnedByMe?: string;
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
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  protected sortedAndFilteredProjects: Project[] = [];

  protected sortCriteria: SortCriteria = SortCriteria.NAME;
  protected sortOrder: SortOrder = SortOrder.ASCENDING;

  protected filterName: string = '';
  protected filterStatus: ProjectStatus | null = null;
  protected filterOnlyOwnedByMe: boolean = false;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  protected get projects(): Project[] {
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
    this.filterOnlyOwnedByMe = filters.onlyOwnedByMe;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    this.sortedAndFilteredProjects = this.sortProjects(this.filterProjects());
    this.updateQueryParams();
  }

  private sortProjects(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => {
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

      return this.sortOrder === SortOrder.ASCENDING ? comparison : -comparison;
    });
  }

  private filterProjects(): Project[] {
    return this.projects.filter((project) => {
      const matchesName =
        !this.filterName ||
        project.name.toLowerCase().includes(this.filterName.toLowerCase());
      const matchesStatus =
        !this.filterStatus || project.status === this.filterStatus;
      const matchesOwner =
        !this.filterOnlyOwnedByMe ||
        project.owner.username === this.authService.getLoggedInUsername();

      return matchesName && matchesStatus && matchesOwner;
    });
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.sortCriteria,
        order: this.sortOrder,
        name: this.filterName ? this.filterName : undefined,
        status: this.filterStatus ?? undefined,
        onlyOwnedByMe: this.filterOnlyOwnedByMe
          ? this.filterOnlyOwnedByMe
          : undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: ProjectsParams) => {
      this.sortCriteria =
        enumValueValidator(params.sort, SortCriteria) || SortCriteria.NAME;
      this.sortOrder =
        enumValueValidator(params.order, SortOrder) || SortOrder.ASCENDING;
      this.filterName = params.name || '';
      this.filterStatus = enumValueValidator(params.status, ProjectStatus);
      this.filterOnlyOwnedByMe = params.onlyOwnedByMe === 'true';
      this.applyFiltersAndSort();
    });
  }
}
