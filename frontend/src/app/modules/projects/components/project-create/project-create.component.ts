import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css',
})
export class ProjectCreateComponent {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  private dialog = inject(MatDialog);

  constructor(private projectService: ProjectService) {}

  form = new FormGroup({
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
        startDate: new FormControl('', {
          validators: [Validators.required],
        }),
        endDate: new FormControl('', {
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
      this.form.controls.dates.get('endDate')?.dirty &&
      this.form.controls.dates.get('endDate')?.touched &&
      this.form.controls.dates.get('endDate')?.invalid
    );
  }

  get wrongEndDate() {
    return this.form.controls.dates.hasError('invalidEndDate');
  }

  openDialog(): void {
    this.dialog.open(this.dialogTemplate, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const projectData: ProjectCreate = {
      name: this.form.value.name as string,
      description: this.form.value.description as string,
      startDate: this.form.value.dates?.startDate as string,
      endDate: this.form.value.dates?.endDate as string,
    };

    this.projectService.addProject(projectData).subscribe(() => {
      this.closeDialog();
    });
  }
}
