import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectRequest } from '../../../../features/dto/project.model';
import { ProjectService } from '../../../../features/services/project.service';
import { TranslationService } from '../../../../features/services/translation.service';
import {
  endDateValidator,
  startDateValidator,
} from '../../../../shared/validators';

interface DatesForm {
  startDate: FormControl<string | null>;
  endDate: FormControl<string | null>;
}

interface CreateProjectForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  dates: FormGroup<DatesForm>;
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
})
export class CreateProjectComponent {
  public constructor(
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<CreateProjectComponent>,
    private router: Router,
    private toastrService: ToastrService,
    private translationService: TranslationService
  ) {}

  protected form: FormGroup<CreateProjectForm> =
    new FormGroup<CreateProjectForm>({
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
          startDate: new FormControl(this.getToday(), {
            validators: [Validators.required, startDateValidator],
          }),
          endDate: new FormControl(this.getToday(), {
            validators: [Validators.required],
          }),
        },
        {
          validators: [endDateValidator('startDate', 'endDate')],
        }
      ),
    });

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

  protected getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected onReset(): void {
    this.form.reset({
      dates: {
        startDate: this.getToday(),
        endDate: this.getToday(),
      },
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const projectData: ProjectRequest = {
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      startDate: this.form.value.dates?.startDate ?? '',
      endDate: this.form.value.dates?.endDate ?? '',
    };

    this.projectService.createProject(projectData).subscribe({
      next: (projectId: string) => {
        this.router.navigate(['/projects', projectId]);
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
      complete: () => {
        this.toastrService.success(
          this.translationService.translate('toast.success.PROJECT_CREATED')
        );
      },
    });

    this.closeDialog();
  }
}
