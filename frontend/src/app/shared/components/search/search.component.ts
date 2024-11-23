import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { User } from '../../../core/models/project.model';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogContent,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  projectId?: string;

  @ViewChild('searchInput') searchInput!: ElementRef;
  form = new FormControl('');
  searchResults: User[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: { projectId?: string } | null,
    readonly dialogRef: MatDialogRef<SearchComponent>,
    private authService: AuthService,
    private projectService: ProjectService,
    private userService: UserService
  ) {
    this.projectId = data?.projectId;
  }

  closeDialog(): void {
    if (this.projectId) this.projectService.allowAccessToAddToProject = true;

    this.dialogRef.close();
  }

  focusInput(): void {
    this.searchInput.nativeElement.focus();
  }

  onSearch(): void {
    const query = this.form.value?.toLowerCase();

    if (!query || query.length < 2) {
      this.searchResults = [];
      return;
    }

    this.userService.searchUsers(query, this.projectId).subscribe({
      next: (res) => {
        this.searchResults = res;
      },
      error: (error) => {
        console.error(error.message);
        this.searchResults = [];
      },
    });
  }

  isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
