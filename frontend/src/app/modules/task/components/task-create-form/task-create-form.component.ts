import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { TaskDto, TaskPayload } from '@/app/features/dto/task.dto';
import { ProjectService } from '@/app/features/services/project.service';
import { TaskService } from '@/app/features/services/task.service';
import { TaskPriority } from '@/app/modules/task/types/task-priority.type';
import { TaskStatus } from '@/app/modules/task/types/task-status.type';
import { FormDateInputControlComponent } from '@/app/shared/components/form-controls/form-date-input-control/form-date-input-control.component';
import {
  FormSelectControlComponent,
  SelectOption,
} from '@/app/shared/components/form-controls/form-select-control/form-select-control.component';
import { FormTextareaInputControlComponent } from '@/app/shared/components/form-controls/form-textarea-input-control/form-textarea-input-control.component';
import { FormButtonComponent } from '@/app/shared/components/ui/form-button/form-button.component';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { getTodayDate } from '@/app/shared/utils/get-today-date.util';
import {
  maxDateValidator,
  maxLengthValidator,
  minLengthValidator,
  profanityValidator,
  requiredValidator,
} from '@/app/shared/validators';
import { Component, inject, OnInit } from '@angular/core';
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
  readonly priority: FormControl<TaskPriority | null>;
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
export class TaskCreateFormComponent implements OnInit {
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
          requiredValidator('task.createForm.description.errors.REQUIRED'),
          minLengthValidator(
            5,
            'task.createForm.description.errors.MIN_LENGTH',
          ),
          maxLengthValidator(
            500,
            'task.createForm.description.errors.MAX_LENGTH',
          ),
          profanityValidator('task.createForm.description.errors.PROFANITY'),
        ],
      }),
      dueDate: new FormControl('', {
        validators: [
          requiredValidator('task.createForm.dueDate.errors.REQUIRED'),
        ],
      }),
      priority: new FormControl<TaskPriority | null>(TaskPriority.LOW),
    },
    { updateOn: 'blur' },
  );

  protected get maxDate(): string | null {
    return this.projectService.loadedProject()?.endDate ?? null;
  }

  protected get priorities(): SelectOption[] {
    return Object.values(TaskPriority).map((priority) => ({
      value: priority,
      label: this.mapperService.priorityMapper(priority),
    }));
  }

  protected closeDialog(): void {
    this.dialog.closeAll();
  }

  protected onReset(): void {
    this.form.reset({
      priority: TaskPriority.LOW,
      dueDate: getTodayDate(),
    });
  }

  protected onSubmit(): void {
    const project = this.projectService.loadedProject();
    if (this.form.invalid || !project) return;

    const newTask: TaskPayload = {
      status: this.selectedStatus,
      description: this.form.value.description!,
      priority: this.form.value.priority!,
      dueDate: this.form.value.dueDate!,
    };

    this.loading = true;
    this.taskService.createTask(project, newTask).subscribe({
      next: (newTask: TaskDto) => {
        this.loading = false;
        this.dialogRef.close(newTask);
        this.toastrService.success(
          this.translationService.translate('toast.success.task.CREATE'),
        );
      },
      error: (error: ErrorResponse) => {
        const localeMessage = this.mapperService.errorToastMapper(
          error.code,
          'task',
        );
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
    });
  }

  public ngOnInit(): void {
    const project = this.projectService.loadedProject();
    if (!project) return;

    this.form.controls.dueDate.addValidators([
      maxDateValidator(
        project.endDate,
        'task.createForm.dueDate.errors.MAX_DATE',
      ),
    ]);
  }
}
