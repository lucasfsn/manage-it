import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Priority,
  Status,
  Task,
  User,
} from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { InlineSearchComponent } from '../../../../shared/components/inline-search/inline-search.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    InlineSearchComponent,
    ReactiveFormsModule,
    MatIconModule,
    SpinnerComponent,
    ChatComponent,
    RouterLink,
    MatPaginatorModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly Status = Status;
  readonly Priority = Priority;
  public isLoading = signal<boolean>(false);
  public task = signal<Task | undefined>(undefined);
  public showChat = signal<boolean>(false);

  public allUsers = signal<User[]>([]);
  public filteredUsers = signal<User[]>([]);
  public paginatedUsers = signal<User[]>([]);

  public searchControl = new FormControl('');
  public form: FormGroup = new FormGroup({});

  public pageSize = 10;
  public currentPage = 0;

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.updatePaginatedUsers();
  }

  private initializeForm(task: Task): void {
    this.form = new FormGroup({
      description: new FormControl(task.description, {
        validators: [Validators.minLength(2), Validators.maxLength(120)],
      }),
      status: new FormControl(task.status),
      priority: new FormControl(task.priority),
      dueDate: new FormControl(task.dueDate),
    });
  }

  get taskMembers(): User[] {
    return this.task()?.users || [];
  }

  get taskMembersNicknames(): string[] {
    return this.taskMembers.map((user) => user.userName);
  }

  get descriptionIsInvalid() {
    return (
      this.form.controls['description'].dirty &&
      this.form.controls['description'].touched &&
      this.form.controls['description'].invalid
    );
  }

  get dueDateIsInvalid() {
    return (
      this.form.controls['dueDate'].dirty &&
      this.form.controls['dueDate'].touched &&
      this.form.controls['dueDate'].invalid
    );
  }

  get statusIsInvalid() {
    return (
      this.form.controls['priority'].dirty &&
      this.form.controls['priority'].touched &&
      this.form.controls['priority'].invalid
    );
  }
  get priorityIsInvalid() {
    return (
      this.form.controls['priority'].dirty &&
      this.form.controls['priority'].touched &&
      this.form.controls['priority'].invalid
    );
  }

  get priorities(): Priority[] {
    return Object.values(Priority);
  }

  get statuses(): Status[] {
    return Object.values(Status);
  }

  focusSearchInput(): void {
    this.searchInput.nativeElement.focus();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  }

  onReset(): void {
    this.form.reset({
      description: this.task()?.description,
      status: this.task()?.status,
      priority: this.task()?.priority,
      dueDate: this.task()?.dueDate,
    });
  }

  private updatePaginatedUsers(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers.set(this.filteredUsers().slice(start, end));
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!projectId || !taskId) {
      this.toastrService.error('Invalid project or task ID');
      this.router.navigate(['/projects']);
      return;
    }

    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.loadingService.loadingOn();
    this.projectService.getTask(projectId, taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        if (task) {
          this.allUsers.set(this.taskMembers);
          this.initializeForm(task);
          this.filteredUsers.set(this.taskMembers);
          this.updatePaginatedUsers();
        }
      },
      error: (error: Error) => {
        this.toastrService.error(error.message);
        this.loadingService.loadingOff();
        this.router.navigate(['/projects', projectId]);
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });

    this.searchControl.valueChanges.subscribe((searchTerm) => {
      const filtered = this.allUsers().filter((user) =>
        `${user.firstName} ${user.lastName} ${user.userName}`
          .toLowerCase()
          .includes((searchTerm ?? '').toLowerCase())
      );
      this.filteredUsers.set(filtered);
      this.currentPage = 0;
      this.updatePaginatedUsers();
    });
  }
}
