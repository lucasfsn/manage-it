import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import {
  Project,
  ProjectRequest,
} from '../../../../features/dto/project.model';
import { LoadingService } from '../../../../features/services/loading.service';
import { ProjectService } from '../../../../features/services/project.service';
import { endDateValidator } from '../../validators/end-date.validator';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css',
})
export class EditProjectComponent {
  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<EditProjectComponent>,
    private toastrService: ToastrService
  ) {}

  form = new FormGroup({
    name: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
    }),
    description: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(120),
      ],
    }),
    dates: new FormGroup(
      {
        startDate: new FormControl<string>('', {
          validators: [Validators.required],
        }),
        endDate: new FormControl<string>('', {
          validators: [Validators.required],
        }),
      },
      [endDateValidator('startDate', 'endDate')]
    ),
  });

  get project(): Project | undefined {
    return this.projectService.loadedProject();
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

  get endDateIsInvalid() {
    return (
      (this.form.controls.dates.get('endDate')?.dirty &&
        this.form.controls.dates.get('endDate')?.touched &&
        this.form.controls.dates.get('endDate')?.invalid) ||
      this.form.controls.dates.hasError('invalidEndDate')
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  hasFormChanged(): boolean {
    if (!this.project) return false;

    return (
      this.form.value.name !== this.project.name ||
      this.form.value.description !== this.project.description ||
      this.form.value.dates?.startDate !== this.project.startDate ||
      this.form.value.dates?.endDate !== this.project.endDate
    );
  }

  private fillFormWithDefaultValues() {
    if (!this.project) return;

    this.form.patchValue({
      name: this.project.name,
      description: this.project.description,
      dates: {
        startDate: this.project.startDate,
        endDate: this.project.endDate,
      },
    });
  }

  onReset() {
    this.fillFormWithDefaultValues();
  }

  onSubmit() {
    if (this.form.invalid || !this.project) {
      return;
    }

    if (!this.hasFormChanged()) {
      this.closeDialog();
      return;
    }

    const projectData: ProjectRequest = {
      name: this.form.value.name!,
      description: this.form.value.description!,
      startDate: this.form.value.dates?.startDate!,
      endDate: this.form.value.dates?.endDate!,
    };

    this.closeDialog();

    this.loadingService.loadingOn();
    this.projectService.updateProject(this.project.id, projectData).subscribe({
      error: (err) => {
        this.toastrService.error(err.message);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.toastrService.success('Project has been updated');
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.fillFormWithDefaultValues();
  }
}
