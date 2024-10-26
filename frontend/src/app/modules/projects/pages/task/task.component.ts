import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Task, User } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { InlineSearchComponent } from '../../../../shared/components/inline-search/inline-search.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { TaskAssigneesComponent } from '../../components/task-assignees/task-assignees.component';
import { TaskEditFormComponent } from '../../components/task-edit-form/task-edit-form.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    InlineSearchComponent,
    SpinnerComponent,
    ChatComponent,
    TaskAssigneesComponent,
    TaskEditFormComponent,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  public isLoading = signal<boolean>(false);
  public task = signal<Task | undefined>(undefined);
  public allUsers = signal<User[]>([]);
  public isTaskAssignee = signal<boolean>(false);

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get taskAssignees(): User[] {
    return this.task()?.users || [];
  }

  get taskAssigneesNicknames(): string[] {
    return this.taskAssignees.map((user) => user.userName);
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
          this.isTaskAssignee.set(
            task.users.some(
              (user) =>
                user.userName === this.userService.getLoggedInUser()?.userName
            )
          );
          this.allUsers.set(this.taskAssignees);
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
  }
}
