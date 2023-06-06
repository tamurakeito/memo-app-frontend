import { client } from "data/axios";
import { TaskType } from "types/types";

export async function putRestatusTask(
  data: TaskType
): Promise<TaskType | undefined> {
  try {
    const url = `/restatus-task`;
    const response = await client.put<TaskType>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
