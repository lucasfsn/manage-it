import { Component, OnInit } from '@angular/core';
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
export class EditProjectComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<EditProjectComponent>,
    private toastrService: ToastrService
  ) {}

  protected form = new FormGroup({
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

  protected get disabled(): boolean {
    return this.form.invalid || !this.isFormChanged();
  }

  protected get project(): Project | undefined {
    return this.projectService.loadedProject();
  }

  protected get nameIsInvalid(): boolean {
    return (
      this.form.controls['name'].dirty &&
      this.form.controls['name'].touched &&
      this.form.controls['name'].invalid
    );
  }

  protected get descriptionIsInvalid(): boolean {
    return (
      this.form.controls['description'].dirty &&
      this.form.controls['description'].touched &&
      this.form.controls['description'].invalid
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

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  private isFormChanged(): boolean {
    if (!this.project) return false;

    return (
      this.form.value.name !== this.project.name ||
      this.form.value.description !== this.project.description ||
      this.form.value.dates?.startDate !== this.project.startDate ||
      this.form.value.dates?.endDate !== this.project.endDate
    );
  }

  private fillFormWithDefaultValues(): void {
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

  protected onReset(): void {
    this.fillFormWithDefaultValues();
  }

  protected onSubmit(): void {
    if (this.form.invalid || !this.project || !this.isFormChanged()) return;

    const projectData: ProjectRequest = this.getProjectData();

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

  private getProjectData(): ProjectRequest {
    return {
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      startDate: this.form.value.dates?.startDate ?? '',
      endDate: this.form.value.dates?.endDate ?? '',
    };
  }

  public ngOnInit(): void {
    this.fillFormWithDefaultValues();
  }
}
