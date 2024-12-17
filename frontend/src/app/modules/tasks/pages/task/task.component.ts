import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ConfirmModalService } from '../../../../core/services/confirm-modal.service';
import { Task } from '../../../../features/dto/project.model';
import { LoadingService } from '../../../../features/services/loading.service';
import { TaskService } from '../../../../features/services/task.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
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
    ConfirmModalComponent,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
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
export class TaskComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  protected showChat = signal<boolean>(false);

  public constructor(
    private taskService: TaskService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    private confirmModalService: ConfirmModalService
  ) {}

  protected get confirmModal$(): Observable<boolean> {
    return this.confirmModalService.isOpen();
  }

  protected get task(): Task | undefined {
    return this.taskService.loadedTask();
  }

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  protected toggleChat(): void {
    this.showChat.set(!this.showChat());
  }

  protected handleGoBack(): void {
    if (!this.task) return;

    this.router.navigate(['/projects', this.task.projectId]);
  }

  protected handleDelete(): void {
    if (!this.task) return;

    const confirmation$ = this.confirmModalService.confirm(
      'Are you sure you want to delete this task?'
    );

    confirmation$.subscribe((confirmed) => {
      if (!confirmed) return;

      this.taskService.deleteTask().subscribe({
        error: (err) => {
          this.toastrService.error(err.message);
        },
        complete: () => {
          this.router.navigate(['/projects', this.task?.projectId]);
          this.toastrService.success('Task has been deleted');
        },
      });
    });
  }

  protected handleEdit(): void {
    if (!this.task) return;

    this.dialog.open(EditTaskComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
    });
  }

  private loadTaskData(projectId: string | null, taskId: string | null): void {
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

  public ngOnInit(): void {
    const subscription = this.route.paramMap.subscribe((params) => {
      const taskId = params.get('taskId');
      const projectId = params.get('projectId');
      this.loadTaskData(projectId, taskId);
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
