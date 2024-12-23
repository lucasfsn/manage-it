import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../../../../features/dto/project.model';
import { ConfirmModalService } from '../../../../features/services/confirm-modal.service';
import { LoadingService } from '../../../../features/services/loading.service';
import { MapperService } from '../../../../features/services/mapper.service';
import { TaskService } from '../../../../features/services/task.service';
import { TranslationService } from '../../../../features/services/translation.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { TaskEditFormComponent } from '../task-edit-form/task-edit-form.component';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [
    ButtonComponent,
    MatIconModule,
    ConfirmModalComponent,
    ChatComponent,
  ],
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
  templateUrl: './task-menu.component.html',
  styleUrl: './task-menu.component.scss',
})
export class TaskMenuComponent {
  protected showChat: boolean = false;

  public constructor(
    private taskService: TaskService,
    private router: Router,
    private toastrService: ToastrService,
    private confirmModalService: ConfirmModalService,
    private translationService: TranslationService,
    private mapperService: MapperService,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) {}

  protected toggleChat(): void {
    this.showChat = !this.showChat;
  }

  protected get task(): Task | null {
    return this.taskService.loadedTask();
  }

  protected get isModalOpen(): boolean {
    return this.confirmModalService.isModalOpen;
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
          const localeMessage = this.mapperService.errorToastMapper();
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

    this.dialog.open(TaskEditFormComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
    });
  }
}
