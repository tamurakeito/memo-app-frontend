import { client } from "data/axios";
import { TaskType } from "types/types";

export async function deleteTask(id: number): Promise<TaskType | undefined> {
  try {
    const url = `/delete-task/${id}`;
    const response = await client.delete(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
