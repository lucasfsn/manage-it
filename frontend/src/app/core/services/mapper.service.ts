import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import {
  SortCriteria,
  SortOrder,
} from '@/app/modules/projects/types/projects-sort.type';
import { TaskPriority } from '@/app/modules/task/types/task-priority.type';
import { TaskStatus } from '@/app/modules/task/types/task-status.type';
import { Injectable } from '@angular/core';

type ErrorResponseResource = 'project' | 'task' | 'user' | 'default';

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

  public errorToastMapper(
    code: number,
    resourceName: ErrorResponseResource = 'default',
  ): string {
    switch (code) {
      case 403:
      case 404: {
        const resource = this.translationService.translate(
          `toast.resource.${resourceName.toUpperCase()}`,
        );

        return this.translationService.translate(`toast.error.${code}`, {
          resource,
        });
      }
      case 400:
      case 401:
      case 500:
      case 503:
        return this.translationService.translate(`toast.error.${code}`);
      default:
        return this.translationService.translate('toast.error.DEFAULT');
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
}
