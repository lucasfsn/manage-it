import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { Project, ProjectRequest } from '@/app/features/dto/project.model';
import { ProjectService } from '@/app/features/services/project.service';
import { FormDateInputControlComponent } from '@/app/shared/components/form-controls/form-date-input-control/form-date-input-control.component';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormTextareaInputControlComponent } from '@/app/shared/components/form-controls/form-textarea-input-control/form-textarea-input-control.component';
import { ButtonComponent } from '@/app/shared/components/ui/button/button.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import { getTodayDate } from '@/app/shared/utils/get-today-date.util';
import { getTomorrowDate } from '@/app/shared/utils/get-tomorrow-date.util';
import { maxLength, minLength, required } from '@/app/shared/validators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

interface RouteData {
  readonly isEditing: boolean;
}

interface ProjectForm {
  readonly name: FormControl<string | null>;
  readonly description: FormControl<string | null>;
  readonly endDate: FormControl<string | null>;
}

@Component({
  selector: 'app-project-form',
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule,
    FormButtonComponent,
    ButtonComponent,
    FormDateInputControlComponent,
    FormTextInputControlComponent,
    FormTextareaInputControlComponent,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
  protected loading = false;
  protected isEditing = false;

  public constructor(
    private projectService: ProjectService,
    private router: Router,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private mapperService: MapperService,
    private route: ActivatedRoute,
  ) {}

  protected form: FormGroup<ProjectForm> = new FormGroup<ProjectForm>(
    {
      name: new FormControl('', {
        validators: [
          required('project.form.name.errors.REQUIRED'),
          minLength(5, 'project.form.name.errors.MIN_LENGTH'),
          maxLength(100, 'project.form.name.errors.MAX_LENGTH'),
        ],
      }),
      description: new FormControl('', {
        validators: [
          required('project.form.description.errors.REQUIRED'),
          minLength(5, 'project.form.description.errors.MIN_LENGTH'),
          maxLength(1000, 'project.form.description.errors.MAX_LENGTH'),
        ],
      }),
      endDate: new FormControl('', {
        validators: [required('project.form.endDate.errors.REQUIRED')],
      }),
    },
    { updateOn: 'blur' },
  );

  protected get project(): Project | null {
    return this.projectService.loadedProject();
  }

  protected get minStartDate(): string | null {
    return this.isEditing ? null : getTodayDate();
  }

  protected get minEndDate(): string | null {
    return this.isEditing ? null : getTomorrowDate();
  }

  protected get disabled(): boolean {
    const isFormInvalid = this.form.invalid;
    const isUnchanged = this.isEditing && !this.hadFormChanged();

    return isFormInvalid || isUnchanged || this.loading;
  }

  private hadFormChanged(): boolean {
    if (!this.project) return false;

    return (
      this.form.value.name !== this.project.name ||
      this.form.value.description !== this.project.description ||
      this.form.value.endDate !== this.project.endDate
    );
  }

  protected handleGoBack(): void {
    if (!this.project) {
      this.router.navigate(['/projects']);

      return;
    }

    this.router.navigate(['/projects', this.project.id]);
  }

  protected onReset(): void {
    if (this.project && this.isEditing) {
      this.fillFormWithDefaultValues();

      return;
    }

    this.form.reset();
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const projectData: ProjectRequest = this.getProjectData();

    if (this.isEditing) {
      this.updateProject(projectData);
    } else {
      this.createProject(projectData);
    }
  }

  private createProject(project: ProjectRequest): void {
    this.loading = true;
    this.projectService.createProject(project).subscribe({
      next: (projectId: string) => {
        this.router.navigate(['/projects', projectId]);
        this.toastrService.success(
          this.translationService.translate('toast.success.project.CREATE'),
        );
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

  private updateProject(project: ProjectRequest): void {
    const projectId = this.project?.id;
    if (!projectId) return;

    this.loading = true;
    this.projectService.updateProject(projectId, project).subscribe({
      next: () => {
        this.router.navigate(['/projects', projectId]);
        this.toastrService.success(
          this.translationService.translate('toast.success.project.UPDATE'),
        );
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

  private getProjectData(): ProjectRequest {
    return {
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      endDate: this.form.value.endDate ?? '',
    };
  }

  private fillFormWithDefaultValues(): void {
    if (!this.project || !this.isEditing) return;

    this.form.patchValue({
      name: this.project.name,
      description: this.project.description,
      endDate: this.project.endDate,
    });
  }

  public ngOnInit(): void {
    this.form.patchValue({
      endDate: getTodayDate(),
    });

    const { isEditing } = this.route.snapshot.data as RouteData;
    this.isEditing = isEditing;

    this.fillFormWithDefaultValues();
  }
}
