import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { User } from '@/app/features/dto/project.model';
import { TaskService } from '@/app/features/services/task.service';
import { UserService } from '@/app/features/services/user.service';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { UsersListComponent } from '@/app/shared/components/ui/users-list/users-list.component';
import { ErrorResponse } from '@/app/shared/dto/error-response.model';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-add-assignee',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    MatProgressSpinnerModule,
    UsersListComponent,
    FormTextInputControlComponent,
  ],
  templateUrl: './task-add-assignee.component.html',
  styleUrl: './task-add-assignee.component.scss',
})
export class TaskAddAssigneeComponent {
  protected loading: boolean = false;
  protected form = new FormControl<string>('');
  protected searchResults: User[] = [];

  public constructor(
    private userService: UserService,
    private taskService: TaskService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private mapperService: MapperService,
  ) {}

  protected get members(): User[] {
    return this.taskService.loadedTask()?.members ?? [];
  }

  protected handleAdd(user: User): void {
    const task = this.taskService.loadedTask();
    if (!task) return;

    this.loadingService.loadingOn();
    this.taskService.addToTask(task.projectId, task.id, user).subscribe({
      next: () => {
        this.toastrService.success(
          `${user.firstName} ${
            user.lastName
          } ${this.translationService.translate(
            'toast.success.task.member.ADD',
          )}`,
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
  }

  protected onSearch(): void {
    const projectId = this.taskService.loadedTask()?.projectId;
    const taskId = this.taskService.loadedTask()?.id;

    const query = this.form.value?.toLowerCase();

    if (!projectId || !taskId || !query || query.length < 2) {
      this.searchResults = [];

      return;
    }

    this.loading = true;
    this.userService.searchUsers(query, projectId, taskId).subscribe({
      next: (res) => {
        this.searchResults = res;
      },
      error: () => {
        this.searchResults = [];
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
