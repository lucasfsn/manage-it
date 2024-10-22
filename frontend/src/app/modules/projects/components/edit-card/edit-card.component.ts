import { Component, Inject } from '@angular/core';
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
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  Priority,
  Task,
  TaskStatus,
  User as TaskUser,
} from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';
import { InlineSearchComponent } from '../../../../shared/components/inline-search/inline-search.component';

@Component({
  selector: 'app-edit-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    InlineSearchComponent,
  ],
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css'],
})
export class EditCardComponent {
  readonly TaskStatus = TaskStatus;
  readonly priorities = Object.values(Priority);
  readonly statuses = Object.values(TaskStatus);
  public selectedTask: Task;
  public members: TaskUser[] = [];

  public form: FormGroup;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedTask: Task }
  ) {
    this.selectedTask = data.selectedTask;
    this.members = data.selectedTask.users;

    this.form = new FormGroup({
      description: new FormControl(this.selectedTask.description, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(120),
        ],
      }),
      status: new FormControl(this.selectedTask.status, {
        validators: [Validators.required],
      }),
      priority: new FormControl(this.selectedTask.priority, {
        validators: [Validators.required],
      }),
      dueDate: new FormControl(this.selectedTask.dueDate, {
        validators: [Validators.required],
      }),
    });
  }

  get taskMembers(): string[] {
    return this.members.map((member) => member.userName);
  }

  get descriptionIsInvalid() {
    return (
      this.form.controls['description'].dirty &&
      this.form.controls['description'].touched &&
      this.form.controls['description'].invalid
    );
  }

  get dueDateIsInvalid() {
    return (
      this.form.controls['dueDate'].dirty &&
      this.form.controls['dueDate'].touched &&
      this.form.controls['dueDate'].invalid
    );
  }

  get statusIsInvalid() {
    return (
      this.form.controls['priority'].dirty &&
      this.form.controls['priority'].touched &&
      this.form.controls['priority'].invalid
    );
  }

  get priorityIsInvalid() {
    return (
      this.form.controls['priority'].dirty &&
      this.form.controls['priority'].touched &&
      this.form.controls['priority'].invalid
    );
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  }

  onReset(): void {
    this.form.reset({
      description: this.selectedTask.description,
      status: this.selectedTask.status,
      priority: this.selectedTask.priority,
      dueDate: this.selectedTask.dueDate,
    });
  }
}
