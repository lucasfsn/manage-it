import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-search-add-to-task',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './search-add-to-task.component.html',
  styleUrl: './search-add-to-task.component.css',
})
export class SearchAddToTaskComponent {
  @Input() usersToShow: User[] = [];
  @Input() usersAlreadyIn: string[] = [];
  @Input() loading = false;
  @Output() onClick = new EventEmitter<User>();
  form = new FormControl('');
  searchResults: User[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

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
      error: (error) => {
        console.error(error.message);
        this.searchResults = [];
      },
    });
  }

  onUserSelect(user: User): void {
    this.onClick.emit(user);
    this.form.setValue('');
    this.searchResults = [];
  }

  isAlreadyIn(username: string): boolean {
    return this.usersAlreadyIn.some((u) => u === username);
  }

  isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
