import { client } from "data/axios";
import { TaskType } from "types/types";

export async function postAddTask(
  data: TaskType
): Promise<TaskType | undefined> {
  try {
    const url = `/add-task`;
    const response = await client.post<TaskType>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
