import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Task, User } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { TaskService } from '../../../../core/services/task.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { EditTaskComponent } from '../../components/edit-task/edit-task.component';
import { TaskAssigneesComponent } from '../../components/task-assignees/task-assignees.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    SpinnerComponent,
    ChatComponent,
    TaskAssigneesComponent,
    MatIconModule,
    CommonModule,
    EditTaskComponent,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  animations: [
    trigger('chatAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class TaskComponent {
  public isTaskAssignee = signal<boolean>(false);
  public showChat = signal<boolean>(false);

  constructor(
    private taskService: TaskService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  get task(): Task | undefined {
    return this.taskService.loadedTask();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  get taskAssignees(): User[] {
    return this.task?.users || [];
  }

  get taskAssigneesNicknames(): string[] {
    return this.taskAssignees.map((user) => user.username);
  }

  toggleChat() {
    this.showChat.set(!this.showChat());
  }

  private loadTaskData(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!projectId || !taskId) {
      this.router.navigate(['/projects']);
      return;
    }

    this.loadingService.loadingOn();
    this.taskService.getTask(projectId, taskId).subscribe({
      next: (task) => {
        if (task) {
          this.isTaskAssignee.set(
            task.users.some(
              (user) => user.username === this.authService.getLoggedInUsername()
            )
          );
        }
      },
      error: (err) => {
        this.toastrService.error(err.message);
        this.router.navigate(['/projects', projectId]);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.loadTaskData();
  }
}
