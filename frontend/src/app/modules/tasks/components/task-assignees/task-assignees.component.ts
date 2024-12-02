import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
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
    CommonModule,
  ],
  templateUrl: './task-assignees.component.html',
  styleUrl: './task-assignees.component.css',
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
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  private destroyRef = inject(DestroyRef);
  public filteredUsers: User[] = [];
  public paginatedUsers: User[] = [];
  public searchControl = new FormControl('');
  public currentPage = 0;
  public pageSize = 5;
  public showAssignees = true;

  constructor(
    private taskService: TaskService,
    private loadingService: LoadingService,
    private toastrService: ToastrService
  ) {}

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  get members(): User[] {
    return this.taskService.loadedTask()?.members || [];
  }

  handleAdd(user: User): void {
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

  handleRemove(user: User): void {
    this.taskService.removeFromTask(user).subscribe({
      error: (error) => {
        this.toastrService.error(error?.message);
        this.refreshUsersIn();
      },
    });
    this.refreshUsersIn();
  }

  toggleShowAssignees(): void {
    this.showAssignees = true;
  }

  toggleShowAddAssignee(): void {
    this.showAssignees = false;
  }

  focusSearchInput(): void {
    this.searchInput.nativeElement.focus();
  }

  filterUsers() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.filteredUsers = this.members.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
    );
    this.updatePaginatedUsers();
  }

  pageChanged(event: PageEvent) {
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

  ngOnInit(): void {
    this.refreshUsersIn();
    const subscription = this.searchControl.valueChanges.subscribe(() => {
      this.filterUsers();
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
