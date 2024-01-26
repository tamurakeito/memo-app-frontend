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
  memo_id: number;
  complete: boolean;
};

export type ClientData = {
  currentTab: number;
};
