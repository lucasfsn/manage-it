import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../features/dto/user.model';
import { MappersService } from '../../../../features/services/mappers.service';
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
  protected projectId: string | null = null;
  protected loading: boolean = false;

  public constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService,
    private translationService: TranslationService,
    private mappersService: MappersService
  ) {}

  private get user(): User | undefined {
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
            'toast.success.MEMBER_ADDED_TO_PROJECT'
          )}`
        );
        this.router.navigate(['/projects', this.projectId]);
      },
      error: () => {
        const localeMessage = this.mappersService.errorToastMapper();
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
