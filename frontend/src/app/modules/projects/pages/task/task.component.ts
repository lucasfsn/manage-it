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
import { Task, User } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { TaskAssigneesComponent } from '../../components/task-assignees/task-assignees.component';
import { TaskEditFormComponent } from '../../components/task-edit-form/task-edit-form.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    SpinnerComponent,
    ChatComponent,
    TaskAssigneesComponent,
    TaskEditFormComponent,
    MatIconModule,
    CommonModule,
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
    private projectService: ProjectService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get task(): Task | undefined {
    return this.projectService.loadedTask();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  get taskAssignees(): User[] {
    return this.task?.users || [];
  }

  get taskAssigneesNicknames(): string[] {
    return this.taskAssignees.map((user) => user.userName);
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
    this.projectService.getTask(projectId, taskId).subscribe({
      next: (task) => {
        if (task) {
          this.isTaskAssignee.set(
            task.users.some(
              (user) => user.userName === this.authService.getLoggedInUsername()
            )
          );
        }
      },
      error: () => {
        this.loadingService.loadingOff();
        this.router.navigate(['/projects', projectId]);
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
