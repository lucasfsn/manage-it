import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ProjectCreate } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';

function endDateValidator(startDate: string, endDate: string) {
  return (control: AbstractControl) => {
    const startDateValue = control.get(startDate)?.value;
    const endDateValue = control.get(endDate)?.value;

    if (!startDateValue || !endDateValue) {
      return null;
    }

    if (new Date(startDateValue) <= new Date(endDateValue)) {
      return null;
    }

    return {
      invalidEndDate: true,
    };
  };
}

function startDateValidator(control: AbstractControl) {
  const selectedDate = new Date(control.value);
  const today = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate >= today) return null;

  return {
    invalidDate: true,
  };
}

@Component({
  selector: 'app-create-new-project',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-new-project.component.html',
  styleUrl: './create-new-project.component.css',
})
export class CreateNewProjectComponent {
  constructor(
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<CreateNewProjectComponent>
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

    const projectData: ProjectCreate = {
      name: this.form.value.name!,
      description: this.form.value.description!,
      startDate: this.form.value.dates?.startDate!,
      endDate: this.form.value.dates?.endDate!,
    };

    this.projectService.addProject(projectData).subscribe();

    this.closeDialog();
  }
}
