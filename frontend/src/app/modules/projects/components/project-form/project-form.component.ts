import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectDto, ProjectPayload } from '@/app/features/dto/project.dto';
import { ProjectService } from '@/app/features/services/project.service';
import { FormDateInputControlComponent } from '@/app/shared/components/form-controls/form-date-input-control/form-date-input-control.component';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormTextareaInputControlComponent } from '@/app/shared/components/form-controls/form-textarea-input-control/form-textarea-input-control.component';
import { ButtonComponent } from '@/app/shared/components/ui/button/button.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { getTodayDate } from '@/app/shared/utils/get-today-date.util';
import { getTomorrowDate } from '@/app/shared/utils/get-tomorrow-date.util';
import {
  maxLengthValidator,
  minDateValidator,
  minLengthValidator,
  profanityValidator,
  requiredValidator,
} from '@/app/shared/validators';
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
          requiredValidator('project.form.name.errors.REQUIRED'),
          minLengthValidator(5, 'project.form.name.errors.MIN_LENGTH'),
          maxLengthValidator(100, 'project.form.name.errors.MAX_LENGTH'),
          profanityValidator('project.form.name.errors.PROFANITY'),
        ],
      }),
      description: new FormControl('', {
        validators: [
          requiredValidator('project.form.description.errors.REQUIRED'),
          minLengthValidator(5, 'project.form.description.errors.MIN_LENGTH'),
          maxLengthValidator(
            1000,
            'project.form.description.errors.MAX_LENGTH',
          ),
          profanityValidator('project.form.description.errors.PROFANITY'),
        ],
      }),
      endDate: new FormControl('', {
        validators: [requiredValidator('project.form.endDate.errors.REQUIRED')],
      }),
    },
    { updateOn: 'blur' },
  );

  protected get project(): ProjectDto | null {
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
    if (this.project && this.isEditing) {
      this.router.navigate(['/projects', this.project.id]);

      return;
    }

    this.router.navigate(['/projects']);
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

    const projectData: ProjectPayload = this.getProjectData();

    if (this.isEditing) {
      this.updateProject(projectData);
    } else {
      this.createProject(projectData);
    }
  }

  private createProject(project: ProjectPayload): void {
    this.loading = true;
    this.projectService.createProject(project).subscribe({
      next: (project: ProjectDto) => {
        this.router.navigate(['/projects', project.id]);
        this.toastrService.success(
          this.translationService.translate('toast.success.project.CREATE'),
        );
      },
      error: (error: ErrorResponse) => {
        const localeMessage = this.mapperService.errorToastMapper(
          error.code,
          'project',
        );
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private updateProject(project: ProjectPayload): void {
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
      error: (error: ErrorResponse) => {
        const localeMessage = this.mapperService.errorToastMapper(
          error.code,
          'project',
        );
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private getProjectData(): ProjectPayload {
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
    const { isEditing } = this.route.snapshot.data as RouteData;
    this.isEditing = isEditing;

    if (!this.isEditing) {
      this.form.controls.endDate.addValidators(
        minDateValidator(getTodayDate(), 'project.form.endDate.errors.MIN'),
      );
      this.form.controls.endDate.updateValueAndValidity();
    }

    this.fillFormWithDefaultValues();
  }
}
