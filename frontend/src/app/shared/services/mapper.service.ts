import {
  NotificationOperation,
  NotificationType,
} from '@/app/features/dto/notification.model';
import { ProjectStatus } from '@/app/features/dto/project.model';
import { Priority, TaskStatus } from '@/app/features/dto/task.model';
import {
  SortCriteria,
  SortOrder,
} from '@/app/modules/projects/models/projects-sort.model';
import { TranslationService } from '@/app/shared/services/translation.service';
import { Injectable } from '@angular/core';

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
      case SortCriteria.START_DATE:
        return this.translationService.translate(
          'utils.mapper.sortCriteria.START_DATE',
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

  public priorityMapper(priority: Priority): string {
    switch (priority) {
      case Priority.LOW:
        return this.translationService.translate('utils.mapper.priority.LOW');
      case Priority.MEDIUM:
        return this.translationService.translate(
          'utils.mapper.priority.MEDIUM',
        );
      case Priority.HIGH:
        return this.translationService.translate('utils.mapper.priority.HIGH');
    }
  }

  public errorToastMapper(
    status?: number,
    errorDescription?: string,
    message?: string,
  ): string {
    if (!status)
      return this.translationService.translate('toast.error.DEFAULT');

    switch (status) {
      case 401:
        return this.translationService.translate(
          errorDescription?.toLowerCase() === 'bad credentials'
            ? 'toast.error.BAD_CREDENTIALS'
            : 'toast.error.401',
        );
      case 404:
        return this.translationService.translate('toast.error.404');
      case 409:
        return this.translationService.translate(
          this.getConflictTranslationKey(message),
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
