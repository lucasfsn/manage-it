import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { User } from '../../../core/models/project.model';
import { AuthService } from '../../../core/services/auth.service';
import { users } from '../../../dummy-data';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  form = new FormControl('');
  searchResults: User[] = [];

  constructor(
    readonly dialogRef: MatDialogRef<SearchComponent>,
    private authService: AuthService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  focusInput(): void {
    this.searchInput.nativeElement.focus();
  }

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

  isLoggedInUser(userName: string): boolean {
    return this.authService.getLoggedInUser()?.userName === userName;
  }
}
