import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../features/dto/user.model';
import { ProjectService } from '../../../../features/services/project.service';
import { TranslationService } from '../../../../features/services/translation.service';
import { UserService } from '../../../../features/services/user.service';

@Component({
  selector: 'app-add-to-project',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './add-to-project.component.html',
  styleUrl: './add-to-project.component.scss',
})
export class AddToProjectComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  protected projectId: string | null = null;

  public constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService,
    private translationService: TranslationService
  ) {}

  private get user(): User | undefined {
    return this.userService.loadedUser();
  }

  protected handleAdd(): void {
    const user = this.user;
    if (!user || !this.projectId) return;

    this.projectService.addToProject(this.projectId, this.user).subscribe({
      error: (error) => {
        this.toastrService.error(error.message);
      },
      complete: () => {
        this.toastrService.success(
          `${user.firstName} ${
            user.lastName
          } ${this.translationService.translate(
            'toast.success.MEMBER_ADDED_TO_PROJECT'
          )}`
        );
        this.router.navigate(['/projects', this.projectId]);
      },
    });
  }

  public ngOnInit(): void {
    const subscription = this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('projectId');
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
