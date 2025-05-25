import { AuthService } from '@/app/features/services/auth.service';
import { ProjectService } from '@/app/features/services/project.service';
import { UserService } from '@/app/features/services/user.service';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.dto';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatIconModule,
    TranslateModule,
    MatProgressSpinnerModule,
    FormTextInputControlComponent,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  protected loading: boolean = false;
  protected form = new FormControl<string>('');
  protected searchResults: UserSummaryDto[] = [];

  public constructor(
    private dialogRef: MatDialogRef<SearchComponent>,
    private authService: AuthService,
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) protected data?: { projectId?: string },
  ) {}

  protected handleClose(): void {
    this.dialogRef.close();
  }

  protected handleClick(username: string): void {
    const projectId = this.data?.projectId;

    if (projectId) {
      this.router.navigate(['/users', username, 'projects', projectId, 'add']);
      this.projectService.allowAccessToAddToProject();
    } else {
      this.router.navigate(['/users', username]);
    }

    this.handleClose();
  }

  protected onSearch(): void {
    const query = this.form.value?.toLowerCase();

    if (!query || query.length < 2) {
      this.searchResults = [];

      return;
    }

    this.loading = true;
    this.userService.searchUsers(query, this.data?.projectId).subscribe({
      next: (res) => {
        this.searchResults = res;
      },
      error: () => {
        this.searchResults = [];
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  protected isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }
}
