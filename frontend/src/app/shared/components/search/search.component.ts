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
import { users } from '../../../dummy-data';

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
  projectId: string | null;

  @ViewChild('searchInput') searchInput!: ElementRef;
  form = new FormControl('');
  searchResults: User[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: { projectId?: string } | null,
    readonly dialogRef: MatDialogRef<SearchComponent>,
    private authService: AuthService,
    private projectService: ProjectService
  ) {
    this.projectId = data?.projectId ?? null;
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
    if (query && query.length >= 2) {
      this.searchResults = users.filter(
        (item) =>
          item.firstName.toLowerCase().includes(query) ||
          item.lastName.toLowerCase().includes(query) ||
          item.username.toLowerCase().includes(query)
      );
    } else {
      this.searchResults = [];
    }
  }

  isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
