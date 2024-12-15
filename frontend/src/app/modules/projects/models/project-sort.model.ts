export enum SortCriteria {
  NAME = 'name',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  COMPLETED_TASKS = 'completedTasks',
}

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export enum SortType {
  CRITERIA,
  ORDER,
}

export interface ProjectsSort {
  criteria: SortCriteria;
  order: SortOrder;
}
