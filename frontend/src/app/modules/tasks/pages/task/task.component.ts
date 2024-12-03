import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../../../../features/dto/project.model';
import { LoadingService } from '../../../../features/services/loading.service';
import { TaskService } from '../../../../features/services/task.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { EditTaskComponent } from '../../components/edit-task/edit-task.component';
import { TaskAssigneesComponent } from '../../components/task-assignees/task-assignees.component';
import { TaskDetailsComponent } from '../../components/task-details/task-details.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    SpinnerComponent,
    ChatComponent,
    TaskAssigneesComponent,
    MatIconModule,
    CommonModule,
    TaskDetailsComponent,
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
  public showChat = signal<boolean>(false);

  constructor(
    private taskService: TaskService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {}

  get task(): Task | undefined {
    return this.taskService.loadedTask();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  toggleChat() {
    this.showChat.set(!this.showChat());
  }

  handleGoBack() {
    if (!this.task) return;

    this.router.navigate(['/projects', this.task.projectId]);
  }

  handleDelete() {
    const confirmDelete = confirm('Are you sure you want to delete this task?');

    if (!confirmDelete) return;

    this.taskService.deleteTask().subscribe({
      error: (err) => {
        this.toastrService.error(err.message);
      },
      complete: () => {
        this.router.navigate(['/projects', this.task?.projectId]);
        this.toastrService.success('Task has been deleted');
      },
    });
  }

  handleEdit() {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!taskId) {
      return;
    }

    this.dialog.open(EditTaskComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        project: this.task,
      },
    });
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
