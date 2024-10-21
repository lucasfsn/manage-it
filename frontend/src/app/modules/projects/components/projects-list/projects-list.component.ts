import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project, Status } from '../../../../core/models/project.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, CommonModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css',
})
export class ProjectsListComponent implements OnChanges {
  @Input() projects: Project[] | undefined;

  public sortedProjects: Project[] | undefined;
  readonly Status = Status;
  public sortCriteria: string = 'name';
  public sortOrder: string = 'ascending';

  private statusPriority: { [key in Status]: number } = {
    [Status.InProgress]: 1,
    [Status.Completed]: 2,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projects'] && this.projects) {
      this.sortedProjects = [...this.projects];
      this.route.queryParams.subscribe((params) => {
        this.sortCriteria = params['sort'] || 'name';
        this.sortOrder = params['order'] || 'ascending';
        this.sortProjects();
      });
    }
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
      (member) =>
        member.userName === this.userService.getLoggedInUser()?.userName
    );
  }
}
