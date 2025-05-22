import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import {
  Priority,
  Task,
  TaskData,
  TaskStatus,
} from '@/app/features/dto/task.model';
import { TaskService } from '@/app/features/services/task.service';
import { FormDateInputControlComponent } from '@/app/shared/components/form-controls/form-date-input-control/form-date-input-control.component';
import {
  FormSelectControlComponent,
  SelectOption,
} from '@/app/shared/components/form-controls/form-select-control/form-select-control.component';
import { FormTextareaInputControlComponent } from '@/app/shared/components/form-controls/form-textarea-input-control/form-textarea-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import { maxLength, minLength, required } from '@/app/shared/validators';
import { maxDate } from '@/app/shared/validators/max-date.validator';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

interface TaskEditForm {
  readonly description: FormControl<string | null>;
  readonly status: FormControl<TaskStatus | null>;
  readonly priority: FormControl<Priority | null>;
  readonly dueDate: FormControl<string | null>;
}

@Component({
  selector: 'app-task-edit-form',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    TranslateModule,
    FormButtonComponent,
    FormDateInputControlComponent,
    FormSelectControlComponent,
    FormTextareaInputControlComponent,
  ],
  templateUrl: './task-edit-form.component.html',
  styleUrl: './task-edit-form.component.scss',
})
export class TaskEditFormComponent implements OnInit {
  protected loading = false;

  public constructor(
    private taskService: TaskService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<TaskEditFormComponent>,
    private mapperService: MapperService,
    private translationService: TranslationService,
  ) {}

  protected form: FormGroup<TaskEditForm> = new FormGroup<TaskEditForm>(
    {
      description: new FormControl('', [
        required('task.editForm.description.errors.REQUIRED'),
        minLength(5, 'task.editForm.description.errors.MIN_LENGTH'),
        maxLength(500, 'task.editForm.description.errors.MAX_LENGTH'),
      ]),
      status: new FormControl<TaskStatus | null>(TaskStatus.NOT_STARTED),
      priority: new FormControl<Priority | null>(Priority.LOW),
      dueDate: new FormControl('', {
        validators: [required('task.editForm.dueDate.errors.REQUIRED')],
      }),
    },
    { updateOn: 'blur' },
  );

  protected get maxDate(): string | null {
    return this.taskService.loadedTask()?.projectEndDate || null;
  }

  protected get disabled(): boolean {
    return this.form.invalid || !this.hasFormChanged() || this.loading;
  }

  protected get task(): Task | null {
    return this.taskService.loadedTask();
  }

  protected get priorities(): SelectOption[] {
    return Object.values(Priority).map((priority) => ({
      value: priority,
      label: this.mapperService.priorityMapper(priority),
    }));
  }

  protected get statuses(): SelectOption[] {
    return Object.values(TaskStatus).map((status) => ({
      value: status,
      label: this.mapperService.taskStatusMapper(status),
    }));
  }

  private hasFormChanged(): boolean {
    if (!this.task) return false;

    return (
      this.form.value.description !== this.task.description ||
      this.form.value.status !== this.task.status ||
      this.form.value.priority !== this.task.priority ||
      this.form.value.dueDate !== this.task.dueDate
    );
  }

  private fillFormWithDefaultValues(): void {
    if (!this.task) return;

    this.form.patchValue({
      description: this.task.description,
      status: this.task.status,
      priority: this.task.priority,
      dueDate: this.task.dueDate,
    });
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected onReset(): void {
    this.fillFormWithDefaultValues();
  }

  protected onSubmit(): void {
    if (!this.task || this.form.invalid) return;

    const { id, projectId } = this.task;

    const updatedTask: TaskData = {
      description: this.form.value.description!,
      status: this.form.value.status!,
      priority: this.form.value.priority!,
      dueDate: this.form.value.dueDate!,
    };

    if (!this.hasFormChanged()) return;

    this.loading = true;
    this.taskService.updateTask(projectId, id, updatedTask).subscribe({
      next: () => {
        this.toastrService.success(
          this.translationService.translate('toast.success.task.UPDATE'),
        );
        this.closeDialog();
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

  public ngOnInit(): void {
    this.fillFormWithDefaultValues();

    const task = this.taskService.loadedTask();
    if (!task) return;

    this.form.controls.dueDate.addValidators([
      maxDate(task.projectEndDate, 'task.editForm.dueDate.errors.MAX_DATE'),
    ]);
  }
}
