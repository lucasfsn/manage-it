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
import { FormTextareaInputControlComponent } from '@/app/shared/components/form-controls/form-textarea-input-control/form-textarea-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import { MapperService } from '@/app/shared/services/mapper.service';
import { TranslationService } from '@/app/shared/services/translation.service';
import { getTodayDate } from '@/app/shared/utils/get-today-date.util';
import {
  maxLength,
  minDate,
  minLength,
  required,
} from '@/app/shared/validators';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    FormTextareaInputControlComponent,
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

  protected form: FormGroup<TaskCreateForm> = new FormGroup<TaskCreateForm>(
    {
      description: new FormControl('', {
        validators: [
          required('task.createForm.description.errors.REQUIRED'),
          minLength(5, 'task.createForm.description.errors.MIN_LENGTH'),
          maxLength(500, 'task.createForm.description.errors.MAX_LENGTH'),
        ],
      }),
      dueDate: new FormControl(getTodayDate(), {
        validators: [
          required('task.createForm.dueDate.errors.REQUIRED'),
          minDate(getTodayDate(), 'task.createForm.dueDate.errors.MIN'),
        ],
      }),
      priority: new FormControl<Priority | null>(Priority.LOW),
    },
    { updateOn: 'blur' },
  );

  protected get minDate(): string | null {
    return getTodayDate();
  }

  protected get priorities(): SelectOption[] {
    return Object.values(Priority).map((priority) => ({
      value: priority,
      label: this.mapperService.priorityMapper(priority),
    }));
  }

  protected closeDialog(): void {
    this.dialog.closeAll();
  }

  protected onReset(): void {
    this.form.reset({
      priority: Priority.LOW,
      dueDate: getTodayDate(),
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
          this.translationService.translate('toast.success.task.CREATE'),
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
