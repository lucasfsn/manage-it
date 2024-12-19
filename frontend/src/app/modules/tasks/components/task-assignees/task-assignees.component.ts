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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../features/dto/project.model';
import { LoadingService } from '../../../../features/services/loading.service';
import { TaskService } from '../../../../features/services/task.service';
import { SearchAddToTaskComponent } from '../search-add-to-task/search-add-to-task.component';

@Component({
  selector: 'app-task-assignees',
  standalone: true,
  imports: [
    MatIconModule,
    MatPaginatorModule,
    RouterLink,
    ReactiveFormsModule,
    SearchAddToTaskComponent,
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
    private toastrService: ToastrService
  ) {}

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  protected get members(): User[] {
    return this.taskService.loadedTask()?.members || [];
  }

  protected handleAdd(user: User): void {
    this.taskService.addToTask(user).subscribe({
      error: (error) => {
        this.toastrService.error(error?.message);
        this.refreshUsersIn();
      },
      complete: () => {
        this.toastrService.success(
          `${user.firstName} ${user.lastName} has been added to task`
        );
      },
    });
    this.refreshUsersIn();
  }

  protected handleRemove(user: User): void {
    this.taskService.removeFromTask(user).subscribe({
      error: (error) => {
        this.toastrService.error(error?.message);
        this.refreshUsersIn();
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
    this.currentPage = event.pageIndex;
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
