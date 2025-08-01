import { ConfirmModalService } from '@/app/core/services/confirm-modal.service';
import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { TaskDto } from '@/app/features/dto/task.dto';
import { TaskService } from '@/app/features/services/task.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { TaskEditFormComponent } from '@/app/modules/task/components/task-edit-form/task-edit-form.component';
import { ButtonComponent } from '@/app/shared/components/ui/button/button.component';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-menu',
  imports: [ButtonComponent, MatIconModule],
  templateUrl: './task-menu.component.html',
  styleUrl: './task-menu.component.scss',
})
export class TaskMenuComponent {
  private destroyRef = inject(DestroyRef);

  public constructor(
    private taskService: TaskService,
    private router: Router,
    private toastrService: ToastrService,
    private confirmModalService: ConfirmModalService,
    private translationService: TranslationService,
    private mapperService: MapperService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
  ) {}

  protected get task(): TaskDto | null {
    return this.taskService.loadedTask();
  }

  protected get isProjectFinished(): boolean {
    if (!this.task) return false;

    return this.task.projectStatus === ProjectStatus.COMPLETED;
  }

  protected handleGoBack(): void {
    if (!this.task) return;

    this.router.navigate(['/projects', this.task.projectId]);
  }

  protected handleDelete(): void {
    if (!this.task) return;

    const confirmation$ = this.confirmModalService.confirm(
      this.translationService.translate('task.confirmModal.delete.MESSAGE'),
    );

    const subscription = confirmation$.subscribe((confirmed) => {
      if (!this.task || !confirmed) return;

      const { id, projectId } = this.task;

      this.loadingService.loadingOn();
      this.taskService.deleteTask(projectId, id).subscribe({
        next: () => {
          this.router.navigate(['/projects', this.task?.projectId]);
          this.toastrService.success(
            this.translationService.translate('toast.success.task.DELETE'),
          );
        },
        error: (error: ErrorResponse) => {
          const localeMessage = this.mapperService.errorToastMapper(
            error.code,
            'task',
          );
          this.toastrService.error(localeMessage);
          this.loadingService.loadingOff();
        },
        complete: () => {
          this.loadingService.loadingOff();
        },
      });
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  protected handleEdit(): void {
    if (!this.task) return;

    this.dialog.open(TaskEditFormComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
    });
  }
}
