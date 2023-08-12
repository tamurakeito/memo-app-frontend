export type MemoSummaryType = {
  id: number;
  name: string;
  tag: boolean;
  length: number;
};

export type MemoDetailType = {
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

export type MemoTagType = { id: number; tag: boolean };
