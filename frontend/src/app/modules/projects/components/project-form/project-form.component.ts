import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { Project, ProjectRequest } from '@/app/features/dto/project.model';
import { ProjectService } from '@/app/features/services/project.service';
import { FormDateInputControlComponent } from '@/app/shared/components/form-controls/form-date-input-control/form-date-input-control.component';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormTextareaInputControlComponent } from '@/app/shared/components/form-controls/form-textarea-input-control/form-textarea-input-control.component';
import { ButtonComponent } from '@/app/shared/components/ui/button/button.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import {
  endDateValidator,
  maxLength,
  minDate,
  minLength,
  required,
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

interface DatesForm {
  readonly startDate: FormControl<string | null>;
  readonly endDate: FormControl<string | null>;
}

interface ProjectForm {
  readonly name: FormControl<string | null>;
  readonly description: FormControl<string | null>;
  readonly dates: FormGroup<DatesForm>;
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

  protected get project(): Project | null {
    return this.projectService.loadedProject();
  }

  protected get minDate(): string | null {
    return this.isEditing ? null : this.today();
  }

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
      dates: new FormGroup<DatesForm>(
        {
          startDate: new FormControl('', {
            validators: [required('project.form.startDate.errors.REQUIRED')],
          }),
          endDate: new FormControl('', {
            validators: [required('project.form.endDate.errors.REQUIRED')],
          }),
        },
        {
          validators: [endDateValidator('startDate', 'endDate')],
        },
      ),
    },
    { updateOn: 'blur' },
  );

  protected get dateErrors(): string | null {
    const group = this.form.controls.dates;

    if (group.errors && group.errors['invalidEndDate'])
      return this.translationService.translate(
        'project.form.endDate.errors.INVALID',
      );

    return null;
  }

  protected get disabled(): boolean {
    return (
      (this.isEditing
        ? this.form.invalid || !this.hadFormChanged()
        : this.form.invalid) || this.loading
    );
  }

  private hadFormChanged(): boolean {
    if (!this.project) return false;

    return (
      this.form.value.name !== this.project.name ||
      this.form.value.description !== this.project.description ||
      this.form.value.dates?.startDate !== this.project.startDate ||
      this.form.value.dates.endDate !== this.project.endDate
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

    this.form.reset({
      name: '',
      description: '',
      dates: {
        startDate: this.today(),
        endDate: this.today(),
      },
    });
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
      startDate: this.form.value.dates?.startDate ?? '',
      endDate: this.form.value.dates?.endDate ?? '',
    };
  }

  private fillFormWithDefaultValues(): void {
    if (!this.project || !this.isEditing) return;

    this.form.patchValue({
      name: this.project.name,
      description: this.project.description,
      dates: {
        startDate: this.project.startDate,
        endDate: this.project.endDate,
      },
    });
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }

  public ngOnInit(): void {
    this.form.patchValue({
      dates: {
        startDate: this.today(),
        endDate: this.today(),
      },
    });

    const { isEditing } = this.route.snapshot.data as RouteData;

    this.isEditing = isEditing;

    if (!this.isEditing) {
      this.form.controls.dates.controls.startDate.addValidators(
        minDate(this.today(), 'project.form.startDate.errors.MIN'),
      );
      this.form.controls.dates.controls.startDate.updateValueAndValidity();
    }

    this.fillFormWithDefaultValues();
  }
}
