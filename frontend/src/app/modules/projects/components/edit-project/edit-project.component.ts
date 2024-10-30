import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
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
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css',
})
export class EditProjectComponent {
  public project: Project;
  public form: FormGroup;

  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<EditProjectComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { project: Project }
  ) {
    this.project = data.project;
    this.form = new FormGroup({
      name: new FormControl(this.project.name, {
        validators: [Validators.minLength(2), Validators.maxLength(50)],
      }),
      description: new FormControl(this.project.description, {
        validators: [Validators.minLength(2), Validators.maxLength(120)],
      }),
      dates: new FormGroup(
        {
          startDate: new FormControl(this.project.startDate),
          endDate: new FormControl(this.project.endDate),
        },
        {
          validators: [endDateValidator('startDate', 'endDate')],
        }
      ),
    });
  }

  get nameIsInvalid() {
    return (
      this.form.controls['name'].dirty &&
      this.form.controls['name'].touched &&
      this.form.controls['name'].invalid
    );
  }

  get descriptionIsInvalid() {
    return (
      this.form.controls['description'].dirty &&
      this.form.controls['description'].touched &&
      this.form.controls['description'].invalid
    );
  }

  get wrongEndDate() {
    return this.form.controls['dates'].hasError('invalidEndDate');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onReset() {
    this.form.reset({
      name: this.project.name,
      description: this.project.description,
      dates: {
        startDate: this.project.startDate,
        endDate: this.project.endDate,
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loadingService.loadingOn();

    this.closeDialog();
  }
}
