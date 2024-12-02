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
  styleUrl: './search-add-to-task.component.css',
})
export class SearchAddToTaskComponent {
  @Output() onClick = new EventEmitter<User>();
  form = new FormControl<string>('');
  searchResults: User[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  get members(): User[] {
    return this.taskService.loadedTask()?.members ?? [];
  }

  onSearch(): void {
    const projectId =
      this.route.snapshot.paramMap.get('projectId') ?? undefined;
    const taskId = this.route.snapshot.paramMap.get('taskId') ?? undefined;

    const query = this.form.value?.toLowerCase();

    if (!query || query.length < 2) {
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

  handleAdd(user: User): void {
    this.onClick.emit(user);
    this.form.setValue('');
    this.searchResults = [];
  }

  isAlreadyIn(username: string): boolean {
    return this.members.some((u) => u.username === username);
  }

  isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
