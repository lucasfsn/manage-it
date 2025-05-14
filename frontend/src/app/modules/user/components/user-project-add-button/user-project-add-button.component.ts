import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { User } from '@/app/features/dto/user.model';
import { ProjectService } from '@/app/features/services/project.service';
import { UserService } from '@/app/features/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-project-add-button',
  imports: [TranslateModule],
  templateUrl: './user-project-add-button.component.html',
  styleUrl: './user-project-add-button.component.scss',
})
export class UserProjectAddButtonComponent implements OnInit {
  protected projectId: string | null = null;
  protected loading: boolean = false;

  public constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService,
    private translationService: TranslationService,
    private mapperService: MapperService,
  ) {}

  private get user(): User | null {
    return this.userService.loadedUser();
  }

  protected handleAdd(): void {
    const user = this.user;
    if (!user || !this.projectId) return;

    this.loading = true;
    this.projectService.addToProject(this.projectId, this.user).subscribe({
      next: () => {
        this.toastrService.success(
          `${user.firstName} ${
            user.lastName
          } ${this.translationService.translate(
            'toast.success.project.member.ADD',
          )}`,
        );
        this.router.navigate(['/projects', this.projectId]);
      },
      error: () => {
        const localeMessage = this.mapperService.errorToastMapper();
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('projectId');
    });
  }
}
