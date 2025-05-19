import { LoadingService } from '@/app/core/services/loading.service';
import { User } from '@/app/features/dto/project.model';
import { TaskService } from '@/app/features/services/task.service';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import {
  PageEvent,
  PaginatorComponent,
} from '@/app/shared/components/paginator/paginator.component';
import { UsersListComponent } from '@/app/shared/components/ui/users-list/users-list.component';
import { MapperService } from '@/app/shared/services/mapper.service';
import { TranslationService } from '@/app/shared/services/translation.service';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-assignees-list',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    TranslateModule,
    PaginatorComponent,
    UsersListComponent,
    FormTextInputControlComponent,
  ],
  templateUrl: './task-assignees-list.component.html',
  styleUrl: './task-assignees-list.component.scss',
})
export class TaskAssigneesListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  protected form = new FormControl<string>('');
  protected filteredUsersCount = 0;
  protected paginatedUsers: User[] = [];
  protected currentPage = 0;
  protected pageSize = 5;
  protected pageSizes = [this.pageSize, 10, 15];

  public constructor(
    private taskService: TaskService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private mapperService: MapperService,
  ) {}

  protected get members(): User[] {
    return this.taskService.loadedTask()?.members || [];
  }

  protected handleRemove(user: User): void {
    const task = this.taskService.loadedTask();
    if (!task) return;

    this.loadingService.loadingOn();
    this.taskService.removeFromTask(task.projectId, task.id, user).subscribe({
      next: () => {
        this.toastrService.success(
          `${user.firstName} ${
            user.lastName
          } ${this.translationService.translate(
            'toast.success.task.member.REMOVE',
          )}`,
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

  protected pageChanged(event: PageEvent): void {
    this.currentPage = event.currentPage;
    this.pageSize = event.pageSize;
    this.filterUsers();
  }

  protected filterUsers(): void {
    const value = this.form.value?.toLowerCase() || '';

    const filteredUsers = this.members.filter(
      (user) =>
        user.firstName.toLowerCase().includes(value) ||
        user.lastName.toLowerCase().includes(value) ||
        user.username.toLowerCase().includes(value),
    );

    this.filteredUsersCount = filteredUsers.length;
    this.updatePaginatedUsers(filteredUsers);
  }

  private updatePaginatedUsers(users: User[]): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = users.slice(start, end);
  }

  public ngOnInit(): void {
    this.filterUsers();

    const subscription = this.form.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.filterUsers();
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
