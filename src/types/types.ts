export type ListSummaryType = {
  id: number;
  name: string;
  tag: boolean;
  length: number;
};

export type ListDetailType = {
  id: number;
  name: string;
  tag: boolean;
  tasks: Array<TaskType>;
};

export type TaskType = {
  id: number;
  name: string;
  complete: boolean;
};
