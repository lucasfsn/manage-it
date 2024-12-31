import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MapperService } from '../../../../core/services/mapper.service';
import { TranslationService } from '../../../../core/services/translation.service';
import {
  Project,
  ProjectRequest,
} from '../../../../features/dto/project.model';
import { ProjectService } from '../../../../features/services/project.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormButtonComponent } from '../../../../shared/components/form-button/form-button.component';
import {
  endDateValidator,
  startDateValidator,
} from '../../../../shared/validators';

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
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule,
    FormButtonComponent,
    ButtonComponent,
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

  protected form: FormGroup<ProjectForm> = new FormGroup<ProjectForm>({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
    }),
    description: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(120),
      ],
    }),
    dates: new FormGroup<DatesForm>(
      {
        startDate: new FormControl('', {
          validators: [Validators.required],
        }),
        endDate: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      {
        validators: [endDateValidator('startDate', 'endDate')],
      },
    ),
  });

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

  protected get nameIsInvalid(): boolean {
    return (
      this.form.controls.name.dirty &&
      this.form.controls.name.touched &&
      this.form.controls.name.invalid
    );
  }

  protected get descriptionIsInvalid(): boolean {
    return (
      this.form.controls.description.dirty &&
      this.form.controls.description.touched &&
      this.form.controls.description.invalid
    );
  }

  protected get startDateIsInvalid(): boolean {
    return !!(
      this.form.controls.dates.get('startDate')?.dirty &&
      this.form.controls.dates.get('startDate')?.touched &&
      this.form.controls.dates.get('startDate')?.invalid
    );
  }

  protected get endDateIsInvalid(): boolean {
    return (
      (this.form.controls.dates.get('endDate')?.dirty &&
        this.form.controls.dates.get('endDate')?.touched &&
        this.form.controls.dates.get('endDate')?.invalid) ||
      this.form.controls.dates.hasError('invalidEndDate')
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
      dates: {
        startDate: this.today(),
        endDate: this.today(),
      },
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

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
          this.translationService.translate('toast.success.PROJECT_CREATED'),
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
          this.translationService.translate('toast.success.PROJECT_UPDATED'),
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

  private addValidatorsIfCreating(): void {
    if (this.project) return;

    this.form.controls.dates.controls.startDate.addValidators(
      startDateValidator,
    );
    this.form.controls.dates.controls.startDate.updateValueAndValidity();
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

    this.fillFormWithDefaultValues();

    this.addValidatorsIfCreating();
  }
}
