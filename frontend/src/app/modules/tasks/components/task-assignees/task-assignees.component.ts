import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../features/dto/project.model';
import { LoadingService } from '../../../../features/services/loading.service';
import { MappersService } from '../../../../features/services/mappers.service';
import { TaskService } from '../../../../features/services/task.service';
import { TranslationService } from '../../../../features/services/translation.service';
import {
  PageEvent,
  PaginatorComponent,
} from '../../../../shared/components/paginator/paginator.component';
import { SearchAddToTaskComponent } from '../search-add-to-task/search-add-to-task.component';

@Component({
  selector: 'app-task-assignees',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
    SearchAddToTaskComponent,
    TranslateModule,
    PaginatorComponent,
  ],
  templateUrl: './task-assignees.component.html',
  styleUrl: './task-assignees.component.scss',
  animations: [
    trigger('toggleDiv', [
      state(
        'show',
        style({
          visibility: 'visible',
          opacity: 1,
          height: '*',
        })
      ),
      state(
        'hide',
        style({
          visibility: 'hidden',
          opacity: 0,
          height: '0px',
        })
      ),
      transition('show <=> hide', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class TaskAssigneesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild('searchInput')
  protected searchInput!: ElementRef<HTMLInputElement>;
  protected filteredUsers: User[] = [];
  protected paginatedUsers: User[] = [];
  protected searchControl = new FormControl('');
  protected currentPage = 0;
  protected pageSize = 5;
  protected showAssignees = true;

  public constructor(
    private taskService: TaskService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private mappersService: MappersService
  ) {}

  protected get members(): User[] {
    return this.taskService.loadedTask()?.members || [];
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
        const localeMessage = this.mappersService.errorToastMapper();
        this.toastrService.error(localeMessage);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
    this.refreshUsersIn();
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
            'toast.success.MEMBER_REMOVED_FROM_TASK'
          )}`
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
    this.refreshUsersIn();
  }

  protected toggleShowAssignees(): void {
    this.showAssignees = true;
  }

  protected toggleShowAddAssignee(): void {
    this.showAssignees = false;
  }

  protected focusSearchInput(): void {
    this.searchInput.nativeElement.focus();
  }

  protected filterUsers(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.filteredUsers = this.members.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
    );
    this.updatePaginatedUsers();
  }

  protected pageChanged(event: PageEvent): void {
    this.currentPage = event.currentPage;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  private updatePaginatedUsers(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  private refreshUsersIn(): void {
    this.filteredUsers = this.members;
    this.updatePaginatedUsers();
  }

  public ngOnInit(): void {
    this.refreshUsersIn();
    const subscription = this.searchControl.valueChanges.subscribe(() => {
      this.filterUsers();
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
