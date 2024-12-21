import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectStatus, Task } from '../../../../features/dto/project.model';
import { ConfirmModalService } from '../../../../features/services/confirm-modal.service';
import { LoadingService } from '../../../../features/services/loading.service';
import { MappersService } from '../../../../features/services/mappers.service';
import { TaskService } from '../../../../features/services/task.service';
import { TranslationService } from '../../../../features/services/translation.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { EditTaskComponent } from '../../components/edit-task/edit-task.component';
import { TaskAssigneesComponent } from '../../components/task-assignees/task-assignees.component';
import { TaskDetailsComponent } from '../../components/task-details/task-details.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    ChatComponent,
    TaskAssigneesComponent,
    MatIconModule,
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
export class TaskComponent {
  protected showChat = signal<boolean>(false);

  public constructor(
    private taskService: TaskService,
    private router: Router,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    private confirmModalService: ConfirmModalService,
    private translationService: TranslationService,
    private mappersService: MappersService,
    private loadingService: LoadingService
  ) {}

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get isModalOpen(): boolean {
    return this.confirmModalService.isOpen();
  }

  protected get task(): Task | undefined {
    return this.taskService.loadedTask();
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
      if (!this.task || !confirmed) return;

      const { id, projectId } = this.task;

      this.loadingService.loadingOn();
      this.taskService.deleteTask(projectId, id).subscribe({
        next: () => {
          this.router.navigate(['/projects', this.task?.projectId]);
          this.toastrService.success(
            this.translationService.translate('toast.success.TASK_DELETED')
          );
        },
        error: () => {
          const localeMessage = this.mappersService.errorToastMapper();
          this.toastrService.error(localeMessage);
          this.loadingService.loadingOff();
        },
        complete: () => {
          this.loadingService.loadingOff();
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
}
