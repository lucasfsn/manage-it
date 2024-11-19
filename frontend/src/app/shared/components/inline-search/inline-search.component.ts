import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/project.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-inline-search',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './inline-search.component.html',
  styleUrl: './inline-search.component.css',
})
export class InlineSearchComponent {
  @Input() usersToShow: User[] = [];
  @Input() usersAlreadyIn: string[] = [];
  @Input() loading = false;
  @Output() onClick = new EventEmitter<User>();
  form = new FormControl('');
  searchResults: User[] = [];

  constructor(private authService: AuthService) {}

  onSearch(): void {
    const query = this.form.value?.toLowerCase();
    if (query && query.length >= 2) {
      this.searchResults = this.usersToShow.filter(
        (item) =>
          item.firstName.toLowerCase().includes(query) ||
          item.lastName.toLowerCase().includes(query) ||
          item.username.toLowerCase().includes(query)
      );
    } else {
      this.searchResults = [];
    }
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
