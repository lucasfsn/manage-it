import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import {
  Priority,
  Task,
  TaskData,
  TaskStatus,
} from '@/app/features/dto/task.model';
import { ProjectService } from '@/app/features/services/project.service';
import { TaskService } from '@/app/features/services/task.service';
import { FormDateInputControlComponent } from '@/app/shared/components/form-controls/form-date-input-control/form-date-input-control.component';
import {
  FormSelectControlComponent,
  SelectOption,
} from '@/app/shared/components/form-controls/form-select-control/form-select-control.component';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import { futureOrTodayDateValidator } from '@/app/shared/validators';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

interface TaskCreateForm {
  readonly description: FormControl<string | null>;
  readonly dueDate: FormControl<string | null>;
  readonly priority: FormControl<Priority | null>;
}

@Component({
  selector: 'app-task-create-form',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
    FormButtonComponent,
    FormDateInputControlComponent,
    FormSelectControlComponent,
    FormTextInputControlComponent,
  ],
  templateUrl: './task-create-form.component.html',
  styleUrl: './task-create-form.component.scss',
})
export class TaskCreateFormComponent {
  protected loading = false;
  protected selectedStatus = inject<{ selectedStatus: TaskStatus }>(
    MAT_DIALOG_DATA,
  ).selectedStatus;

  public constructor(
    private taskService: TaskService,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TaskCreateFormComponent>,
    private mapperService: MapperService,
    private translationService: TranslationService,
  ) {}

  protected get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  protected get priorities(): SelectOption[] {
    return Object.values(Priority).map((priority) => ({
      value: priority,
      label: this.mapperService.priorityMapper(priority),
    }));
  }

  protected getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  protected form: FormGroup<TaskCreateForm> = new FormGroup<TaskCreateForm>(
    {
      description: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500),
        ],
      }),
      dueDate: new FormControl(this.getToday(), {
        validators: [Validators.required, futureOrTodayDateValidator],
      }),
      priority: new FormControl<Priority | null>(Priority.LOW, {
        validators: [Validators.required],
      }),
    },
    { updateOn: 'blur' },
  );

  protected get descriptionErrors(): string | null {
    const control = this.form.controls.description;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate(
        'task.createForm.DESCRIPTION_REQUIRED',
      );

    if (control.errors['minlength'])
      return this.translationService.translate(
        'task.createForm.DESCRIPTION_MIN_LENGTH',
        {
          minLength: control.errors['minlength'].requiredLength,
        },
      );

    if (control.errors['maxlength'])
      return this.translationService.translate(
        'task.createForm.DESCRIPTION_MAX_LENGTH',
        {
          maxLength: control.errors['maxlength'].requiredLength,
        },
      );

    return null;
  }

  protected get dueDateErrors(): string | null {
    const control = this.form.controls.dueDate;
    if (!control.errors) return null;

    if (control.errors['required'])
      return this.translationService.translate(
        'task.createForm.DUE_DATE_REQUIRED',
      );

    if (control.errors['invalidDate'])
      return this.translationService.translate(
        'task.createForm.DUE_DATE_MIN_DATE',
      );

    return null;
  }

  protected closeDialog(): void {
    this.dialog.closeAll();
  }

  protected onReset(): void {
    this.form.reset({
      priority: Priority.LOW,
      dueDate: this.getToday(),
    });
  }

  protected onSubmit(): void {
    const project = this.projectService.loadedProject();
    if (this.form.invalid || !project) return;

    const newTask: TaskData = {
      status: this.selectedStatus,
      description: this.form.value.description!,
      priority: this.form.value.priority!,
      dueDate: this.form.value.dueDate!,
    };

    this.loading = true;
    this.taskService.createTask(project, newTask).subscribe({
      next: (newTask: Task) => {
        this.loading = false;
        this.dialogRef.close(newTask);
        this.toastrService.success(
          this.translationService.translate('toast.success.TASK_ADDED'),
        );
      },
      error: () => {
        const localeMessage = this.mapperService.errorToastMapper();
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
    });
  }
}
