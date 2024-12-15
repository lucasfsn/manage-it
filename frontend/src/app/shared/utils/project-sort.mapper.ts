import {
  SortCriteria,
  SortOrder,
} from '../../modules/projects/models/project-sort.model';

export function sortCriteriaMapper(criteria: SortCriteria): string {
  switch (criteria) {
    case SortCriteria.NAME:
      return 'Name';
    case SortCriteria.START_DATE:
      return 'Start Date';
    case SortCriteria.END_DATE:
      return 'End Date';
    case SortCriteria.COMPLETED_TASKS:
      return 'Completed Tasks';
  }
}

export function sortOrderMapper(order: SortOrder): string {
  switch (order) {
    case SortOrder.ASCENDING:
      return 'Ascending';
    case SortOrder.DESCENDING:
      return 'Descending';
  }
}
