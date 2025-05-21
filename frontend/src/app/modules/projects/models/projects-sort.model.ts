export enum SortCriteria {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  END_DATE = 'deadline',
  COMPLETED_TASKS = 'completedTasks',
}

export enum SortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export enum SortType {
  CRITERIA,
  ORDER,
}

export interface ProjectsSort {
  readonly criteria: SortCriteria;
  readonly order: SortOrder;
}
