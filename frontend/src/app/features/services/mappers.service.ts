import { Injectable } from '@angular/core';
import {
  SortCriteria,
  SortOrder,
} from '../../modules/projects/models/project-sort.model';
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
}
