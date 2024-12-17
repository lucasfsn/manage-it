import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { TaskService } from '../../../../features/services/task.service';
import { UserService } from '../../../../features/services/user.service';

@Component({
  selector: 'app-search-add-to-task',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './search-add-to-task.component.html',
  styleUrl: './search-add-to-task.component.scss',
})
export class SearchAddToTaskComponent {
  @Output() public userAdd = new EventEmitter<User>();
  protected form = new FormControl<string>('');
  protected searchResults: User[] = [];

  public constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  protected get members(): User[] {
    return this.taskService.loadedTask()?.members ?? [];
  }

  protected onSearch(): void {
    const projectId = this.taskService.loadedTask()?.projectId;
    const taskId = this.taskService.loadedTask()?.id;

    const query = this.form.value?.toLowerCase();

    if (!projectId || !taskId || !query || query.length < 2) {
      this.searchResults = [];

      return;
    }

    this.userService.searchUsers(query, projectId, taskId).subscribe({
      next: (res) => {
        this.searchResults = res;
      },
      error: () => {
        this.searchResults = [];
      },
    });
  }

  protected handleAdd(user: User): void {
    this.userAdd.emit(user);
    this.form.setValue('');
    this.searchResults = [];
  }

  protected isAlreadyIn(username: string): boolean {
    return this.members.some((u) => u.username === username);
  }

  protected isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
