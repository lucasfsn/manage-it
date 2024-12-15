import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
import { User } from '../../../features/dto/project.model';
import { AuthService } from '../../../features/services/auth.service';
import { ProjectService } from '../../../features/services/project.service';
import { UserService } from '../../../features/services/user.service';

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
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @ViewChild('searchInput') protected searchInput!: ElementRef;
  protected form = new FormControl<string>('');
  protected searchResults: User[] = [];

  protected projectId = inject<{ projectId: string }>(MAT_DIALOG_DATA)
    ?.projectId;

  constructor(
    private dialogRef: MatDialogRef<SearchComponent>,
    private authService: AuthService,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  protected closeDialog(): void {
    if (this.projectId) this.projectService.allowAccessToAddToProject = true;

    this.dialogRef.close();
  }

  protected focusInput(): void {
    this.searchInput.nativeElement.focus();
  }

  protected onSearch(): void {
    const query = this.form.value?.toLowerCase();

    if (!query || query.length < 2) {
      this.searchResults = [];

      return;
    }

    this.userService.searchUsers(query, this.projectId).subscribe({
      next: (res) => {
        this.searchResults = res;
      },
      error: () => {
        this.searchResults = [];
      },
    });
  }

  protected isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
