import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import {
  SortCriteria,
  SortOrder,
} from '@/app/modules/projects/types/projects-sort.type';
import { TaskPriority } from '@/app/modules/task/types/task-priority.type';
import { TaskStatus } from '@/app/modules/task/types/task-status.type';
import {
  ErrorResponseConflict,
  ErrorResponseResource,
} from '@/app/shared/types/errors.type';
import { Injectable } from '@angular/core';

enum NotificationType {
  PROJECT = 'project',
  TASK = 'task',
}

enum NotificationOperation {
  COMPLETE = 'complete',
  UPDATE = 'update',
  JOIN = 'join',
  LEAVE = 'leave',
  CREATE = 'create',
  DELETE = 'delete',
}

@Injectable({
  providedIn: 'root',
})
export class MapperService {
  public constructor(private translationService: TranslationService) {}

  public projectStatusMapper(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.IN_PROGRESS:
        return this.translationService.translate(
          'utils.mapper.projectStatus.IN_PROGRESS',
        );
      case ProjectStatus.COMPLETED:
        return this.translationService.translate(
          'utils.mapper.projectStatus.COMPLETED',
        );
    }
  }

  public taskStatusMapper(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.IN_PROGRESS:
        return this.translationService.translate(
          'utils.mapper.taskStatus.IN_PROGRESS',
        );
      case TaskStatus.COMPLETED:
        return this.translationService.translate(
          'utils.mapper.taskStatus.COMPLETED',
        );
      case TaskStatus.NOT_STARTED:
        return this.translationService.translate(
          'utils.mapper.taskStatus.NOT_STARTED',
        );
    }
  }

  public sortCriteriaMapper(criteria: SortCriteria): string {
    switch (criteria) {
      case SortCriteria.NAME:
        return this.translationService.translate(
          'utils.mapper.sortCriteria.NAME',
        );
      case SortCriteria.CREATED_AT:
        return this.translationService.translate(
          'utils.mapper.sortCriteria.CREATED_AT',
        );
      case SortCriteria.END_DATE:
        return this.translationService.translate(
          'utils.mapper.sortCriteria.END_DATE',
        );
      case SortCriteria.COMPLETED_TASKS:
        return this.translationService.translate(
          'utils.mapper.sortCriteria.COMPLETED_TASKS',
        );
    }
  }

  public sortOrderMapper(order: SortOrder): string {
    switch (order) {
      case SortOrder.ASCENDING:
        return this.translationService.translate(
          'utils.mapper.sortOrder.ASCENDING',
        );
      case SortOrder.DESCENDING:
        return this.translationService.translate(
          'utils.mapper.sortOrder.DESCENDING',
        );
    }
  }

  public priorityMapper(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return this.translationService.translate('utils.mapper.priority.LOW');
      case TaskPriority.MEDIUM:
        return this.translationService.translate(
          'utils.mapper.priority.MEDIUM',
        );
      case TaskPriority.HIGH:
        return this.translationService.translate('utils.mapper.priority.HIGH');
    }
  }

  public notificationMessageMapper(message: string): string {
    const [type, operation, projectName] = message.split(';');
    let translationKey = '';

    if (type === NotificationType.PROJECT) {
      translationKey = this.getProjectTranslationKey(
        operation as NotificationOperation,
      );
    } else if (type === NotificationType.TASK) {
      translationKey = this.getTaskTranslationKey(
        operation as NotificationOperation,
      );
    }

    return this.translationService.translate(translationKey, {
      project: projectName,
    });
  }

  private getProjectTranslationKey(operation: NotificationOperation): string {
    switch (operation) {
      case NotificationOperation.COMPLETE:
        return 'notifications.content.project.COMPLETE';
      case NotificationOperation.UPDATE:
        return 'notifications.content.project.UPDATE';
      case NotificationOperation.JOIN:
        return 'notifications.content.project.JOIN';
      case NotificationOperation.LEAVE:
        return 'notifications.content.project.LEAVE';
      default:
        return '';
    }
  }

  private getTaskTranslationKey(operation: NotificationOperation): string {
    switch (operation) {
      case NotificationOperation.CREATE:
        return 'notifications.content.task.CREATE';
      case NotificationOperation.DELETE:
        return 'notifications.content.task.DELETE';
      case NotificationOperation.UPDATE:
        return 'notifications.content.task.UPDATE';
      case NotificationOperation.JOIN:
        return 'notifications.content.task.JOIN';
      case NotificationOperation.LEAVE:
        return 'notifications.content.task.LEAVE';
      default:
        return '';
    }
  }

  public errorToastMapper(
    code: number,
    resourceName: ErrorResponseResource = 'default',
    fieldName?: ErrorResponseConflict,
  ): string {
    if (this.isResourceError(code))
      return this.handleResourceError(code, resourceName);

    if (this.isConflictError(code))
      return this.handleConflictError(code, fieldName);

    if (this.isGenericError(code))
      return this.translationService.translate(`toast.error.${code}`);

    return this.translationService.translate('toast.error.DEFAULT');
  }

  private handleResourceError(
    code: number,
    resourceName: ErrorResponseResource,
  ): string {
    const resource = this.translationService.translate(
      `toast.resource.${resourceName.toUpperCase()}`,
    );

    return this.translationService.translate(`toast.error.${code}`, {
      resource,
    });
  }

  private handleConflictError(
    code: number,
    fieldName?: ErrorResponseConflict,
  ): string {
    if (!fieldName)
      return this.translationService.translate(`toast.error.${code}.DEFAULT`);

    const field = this.translationService.translate(
      `toast.field.${fieldName.toUpperCase()}`,
    );

    return this.translationService.translate(
      `toast.error.${code}.FIELD_CONFLICT`,
      {
        field,
      },
    );
  }

  private isResourceError(code: number): boolean {
    return code === 403 || code === 404;
  }

  private isConflictError(code: number): boolean {
    return code === 409;
  }

  private isGenericError(code: number): boolean {
    return [400, 401, 500, 503].includes(code);
  }
}
