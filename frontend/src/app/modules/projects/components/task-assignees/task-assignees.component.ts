import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { InlineSearchComponent } from '../../../../shared/components/inline-search/inline-search.component';

@Component({
  selector: 'app-task-assignees',
  standalone: true,
  imports: [
    MatIconModule,
    MatPaginatorModule,
    RouterLink,
    ReactiveFormsModule,
    InlineSearchComponent,
    CommonModule,
  ],
  templateUrl: './task-assignees.component.html',
  styleUrl: './task-assignees.component.css',
  animations: [
    trigger('toggleDiv', [
      state(
        'show',
        style({
          visibility: 'visible',
          opacity: 1,
          height: '*',
        })
      ),
      state(
        'hide',
        style({
          visibility: 'hidden',
          opacity: 0,
          height: '0px',
        })
      ),
      transition('show <=> hide', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class TaskAssigneesComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @Input() usersIn: User[] = [];
  @Input() isTaskAssignee!: boolean;
  protected allUsersInProject = signal<User[]>([]);
  protected projectId = signal<string>('');
  protected taskId = signal<string>('');
  protected loading = signal<boolean>(false);

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {}

  public filteredUsers: User[] = [];
  public paginatedUsers: User[] = [];
  public searchControl = new FormControl('');
  public currentPage = 0;
  public pageSize = 5;

  public showAssignees = true;

  get usersInNicknames(): string[] {
    return this.usersIn.map((user) => user.userName);
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  handleAdd(user: User): void {
    this.loadingService.loadingOn();
    this.projectService
      .addToTask(this.projectId(), this.taskId(), user)
      .subscribe({
        next: () => {
          this.loadingService.loadingOff();
        },
        error: () => {
          this.loadingService.loadingOff();
        },
      });
  }

  handleRemove(user: User): void {
    this.loadingService.loadingOn();
    this.projectService
      .removeFromTask(this.projectId(), this.taskId(), user)
      .subscribe({
        next: () => {
          this.loadingService.loadingOff();
        },
        error: () => {
          this.loadingService.loadingOff();
        },
      });
  }

  toggleShowAssignees(): void {
    this.showAssignees = true;
  }

  toggleShowAddAssignee(): void {
    this.showAssignees = false;
  }

  focusSearchInput(): void {
    this.searchInput.nativeElement.focus();
  }

  filterUsers() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.filteredUsers = this.usersIn.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.userName.toLowerCase().includes(searchTerm)
    );
    this.updatePaginatedUsers();
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  private updatePaginatedUsers(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  private loadAllUsersInProject(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!projectId || !taskId) {
      return;
    }

    this.projectId.set(projectId!);
    this.taskId.set(taskId!);

    this.loading.set(true);
    this.projectService.getProjectMembers(projectId).subscribe({
      next: (users) => {
        this.allUsersInProject.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.loadAllUsersInProject();
    this.filteredUsers = this.usersIn;
    this.updatePaginatedUsers();
    this.searchControl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }
}
