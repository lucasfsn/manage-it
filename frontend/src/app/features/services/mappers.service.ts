import { Injectable } from '@angular/core';
import {
  SortCriteria,
  SortOrder,
} from '../../modules/projects/models/project-sort.model';
import {
  NotificationOperation,
  NotificationType,
} from '../dto/notification.model';
import { Priority, ProjectStatus, TaskStatus } from '../dto/project.model';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root',
})
export class MappersService {
  public constructor(private translationService: TranslationService) {}

  public projectStatusMapper(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.IN_PROGRESS:
        return this.translationService.translate(
          'mappers.projectStatus.IN_PROGRESS'
        );
      case ProjectStatus.COMPLETED:
        return this.translationService.translate(
          'mappers.projectStatus.COMPLETED'
        );
    }
  }

  public taskStatusMapper(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.IN_PROGRESS:
        return this.translationService.translate(
          'mappers.taskStatus.IN_PROGRESS'
        );
      case TaskStatus.COMPLETED:
        return this.translationService.translate(
          'mappers.taskStatus.COMPLETED'
        );
      case TaskStatus.NOT_STARTED:
        return this.translationService.translate(
          'mappers.taskStatus.NOT_STARTED'
        );
    }
  }

  public sortCriteriaMapper(criteria: SortCriteria): string {
    switch (criteria) {
      case SortCriteria.NAME:
        return this.translationService.translate('mappers.sortCriteria.NAME');
      case SortCriteria.START_DATE:
        return this.translationService.translate(
          'mappers.sortCriteria.START_DATE'
        );
      case SortCriteria.END_DATE:
        return this.translationService.translate(
          'mappers.sortCriteria.END_DATE'
        );
      case SortCriteria.COMPLETED_TASKS:
        return this.translationService.translate(
          'mappers.sortCriteria.COMPLETED_TASKS'
        );
    }
  }

  public sortOrderMapper(order: SortOrder): string {
    switch (order) {
      case SortOrder.ASCENDING:
        return this.translationService.translate('mappers.sortOrder.ASCENDING');
      case SortOrder.DESCENDING:
        return this.translationService.translate(
          'mappers.sortOrder.DESCENDING'
        );
    }
  }

  public priorityMapper(priority: Priority): string {
    switch (priority) {
      case Priority.LOW:
        return this.translationService.translate('mappers.priority.LOW');
      case Priority.MEDIUM:
        return this.translationService.translate('mappers.priority.MEDIUM');
      case Priority.HIGH:
        return this.translationService.translate('mappers.priority.HIGH');
    }
  }

  public errorToastMapper(
    status?: number,
    errorDescription?: string,
    message?: string
  ): string {
    if (!status)
      return this.translationService.translate('toast.error.DEFAULT');

    switch (status) {
      case 401:
        return this.translationService.translate(
          errorDescription?.toLowerCase() === 'bad credentials'
            ? 'toast.error.BAD_CREDENTIALS'
            : 'toast.error.401'
        );
      case 404:
        return this.translationService.translate('toast.error.404');
      case 409:
        return this.translationService.translate(
          this.getConflictTranslationKey(message)
        );
      default:
        return this.translationService.translate('toast.error.DEFAULT');
    }
  }

  private getConflictTranslationKey(message?: string): string {
    if (message?.toLowerCase().includes('username')) {
      return 'toast.error.409_USERNAME';
    } else if (message?.toLowerCase().includes('email')) {
      return 'toast.error.409_EMAIL';
    }

    return 'toast.error.409';
  }

  public notificationMessageMapper(message: string): string {
    const [type, operation, projectName] = message.split(';');
    let translationKey = '';

    if (type === NotificationType.PROJECT) {
      translationKey = this.getProjectTranslationKey(
        operation as NotificationOperation
      );
    } else if (type === NotificationType.TASK) {
      translationKey = this.getTaskTranslationKey(
        operation as NotificationOperation
      );
    }

    const translatedMessage = this.translationService.translate(translationKey);

    return translatedMessage.replace('()', projectName);
  }

  private getProjectTranslationKey(operation: NotificationOperation): string {
    switch (operation) {
      case NotificationOperation.COMPLETE:
        return 'notifications.content.PROJECT_COMPLETE';
      case NotificationOperation.UPDATE:
        return 'notifications.content.PROJECT_UPDATE';
      case NotificationOperation.JOIN:
        return 'notifications.content.PROJECT_JOIN';
      case NotificationOperation.LEAVE:
        return 'notifications.content.PROJECT_LEAVE';
      default:
        return '';
    }
  }

  private getTaskTranslationKey(operation: NotificationOperation): string {
    switch (operation) {
      case NotificationOperation.CREATE:
        return 'notifications.content.TASK_CREATE';
      case NotificationOperation.DELETE:
        return 'notifications.content.TASK_DELETE';
      case NotificationOperation.UPDATE:
        return 'notifications.content.TASK_UPDATE';
      case NotificationOperation.JOIN:
        return 'notifications.content.TASK_JOIN';
      case NotificationOperation.LEAVE:
        return 'notifications.content.TASK_LEAVE';
      default:
        return '';
    }
  }
}
