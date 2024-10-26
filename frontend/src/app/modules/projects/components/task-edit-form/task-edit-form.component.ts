import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Priority, Status, Task } from '../../../../core/models/project.model';

@Component({
  selector: 'app-task-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-edit-form.component.html',
  styleUrl: './task-edit-form.component.css',
})
export class TaskEditFormComponent implements OnInit {
  @Input() task!: Task;
  readonly Status = Status;
  readonly Priority = Priority;
  public form: FormGroup = new FormGroup({});

  get priorities(): Priority[] {
    return Object.values(Priority);
  }

  get statuses(): Status[] {
    return Object.values(Status);
  }

  get descriptionIsInvalid() {
    return (
      this.form.controls['description'].dirty &&
      this.form.controls['description'].touched &&
      this.form.controls['description'].invalid
    );
  }

  private initializeForm(task: Task): void {
    this.form = new FormGroup({
      description: new FormControl(task.description, {
        validators: [Validators.minLength(2), Validators.maxLength(120)],
      }),
      status: new FormControl(task.status),
      priority: new FormControl(task.priority),
      dueDate: new FormControl(task.dueDate),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  }

  onReset(): void {
    this.form.reset({
      description: this.task.description,
      status: this.task.status,
      priority: this.task.priority,
      dueDate: this.task.dueDate,
    });
  }

  ngOnInit(): void {
    this.initializeForm(this.task);
  }
}
