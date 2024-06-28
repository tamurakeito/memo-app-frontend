import React, { ReactNode, useContext, useState } from "react";
import { TaskType } from "types/types";

export type TaskContext = {
  task: TaskType | undefined;
  setTask: (task?: TaskType) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
};

const TaskContext = React.createContext<TaskContext>({
  task: undefined,
  setTask: () => {
    console.log("task-provider unimplement.");
  },
  isActive: false,
  setIsActive: () => {
    console.log("task-provider unimplement.");
  },
});

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [task, setTask] = useState<TaskType>();
  const [isActive, setIsActive] = useState(false);
  return (
    <TaskContext.Provider value={{ task, setTask, isActive, setIsActive }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContext => {
  return useContext(TaskContext);
};
