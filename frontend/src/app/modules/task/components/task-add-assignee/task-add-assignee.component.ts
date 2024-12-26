import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../../core/services/loading.service';
import { MapperService } from '../../../../core/services/mapper.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { User } from '../../../../features/dto/project.model';
import { TaskService } from '../../../../features/services/task.service';
import { UserService } from '../../../../features/services/user.service';
import { UsersListComponent } from '../../../../shared/components/users-list/users-list.component';

@Component({
  selector: 'app-task-add-assignee',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    MatProgressSpinnerModule,
    UsersListComponent,
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
    private mapperService: MapperService
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
            'toast.success.MEMBER_ADDED_TO_TASK'
          )}`
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
