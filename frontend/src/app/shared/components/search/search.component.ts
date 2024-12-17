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
import { Router } from '@angular/router';
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
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @ViewChild('searchInput') protected searchInput!: ElementRef;
  protected form = new FormControl<string>('');
  protected searchResults: User[] = [];

  public constructor(
    private dialogRef: MatDialogRef<SearchComponent>,
    private authService: AuthService,
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) protected data?: { projectId?: string }
  ) {}

  protected closeDialog(): void {
    if (this.data?.projectId)
      this.projectService.allowAccessToAddToProject = true;

    this.dialogRef.close();
  }

  protected handleClick(username: string): void {
    if (this.data?.projectId) {
      this.router.navigate([
        '/users',
        username,
        'projects',
        this.data.projectId,
        'add',
      ]);
    } else {
      this.router.navigate(['/users', username]);
    }

    this.closeDialog();
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

    this.userService.searchUsers(query, this.data?.projectId).subscribe({
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
