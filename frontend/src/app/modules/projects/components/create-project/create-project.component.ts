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
import { ToastrService } from 'ngx-toastr';
import { ProjectData } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';
import { endDateValidator } from '../../validators/end-date.validator';
import { startDateValidator } from '../../validators/start-date.validator';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
})
export class CreateProjectComponent {
  constructor(
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<CreateProjectComponent>,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  protected form = new FormGroup({
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
    dates: new FormGroup(
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

  get nameIsInvalid() {
    return (
      this.form.controls.name.dirty &&
      this.form.controls.name.touched &&
      this.form.controls.name.invalid
    );
  }

  get descriptionIsInvalid() {
    return (
      this.form.controls.description.dirty &&
      this.form.controls.description.touched &&
      this.form.controls.description.invalid
    );
  }

  get startDateIsInvalid() {
    return (
      this.form.controls.dates.get('startDate')?.dirty &&
      this.form.controls.dates.get('startDate')?.touched &&
      this.form.controls.dates.get('startDate')?.invalid
    );
  }

  get endDateIsInvalid() {
    return (
      (this.form.controls.dates.get('endDate')?.dirty &&
        this.form.controls.dates.get('endDate')?.touched &&
        this.form.controls.dates.get('endDate')?.invalid) ||
      this.form.controls.dates.hasError('invalidEndDate')
    );
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onReset(): void {
    this.form.reset({
      dates: {
        startDate: this.getToday(),
        endDate: this.getToday(),
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const projectData: ProjectData = {
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      startDate: this.form.value.dates?.startDate ?? '',
      endDate: this.form.value.dates?.endDate ?? '',
    };

    this.projectService.createProject(projectData).subscribe({
      next: (projectId: string) => {
        this.toastrService.success('Project has been created');
        this.router.navigate(['/projects', projectId]);
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });

    this.closeDialog();
  }
}
