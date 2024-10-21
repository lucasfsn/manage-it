import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/project.model';
import { UserService } from '../../../core/services/user.service';
import { users } from '../../../dummy-data';

@Component({
  selector: 'app-inline-search',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './inline-search.component.html',
  styleUrl: './inline-search.component.css',
})
export class InlineSearchComponent {
  @Input() usersAlreadyIn: string[] = [];
  form = new FormControl('');
  searchResults: User[] = [];

  constructor(private userService: UserService) {}

  onSearch(): void {
    const query = this.form.value?.toLowerCase();
    if (query && query.length >= 2) {
      this.searchResults = users.filter(
        (item) =>
          item.firstName.toLowerCase().includes(query) ||
          item.lastName.toLowerCase().includes(query) ||
          item.userName.toLowerCase().includes(query)
      );
    } else {
      this.searchResults = [];
    }
  }

  isProjectMember(userName: string): boolean {
    return this.usersAlreadyIn.some((u) => u === userName);
  }

  isLoggedInUser(userName: string): boolean {
    return this.userService.getLoggedInUser()?.userName === userName;
  }
}
