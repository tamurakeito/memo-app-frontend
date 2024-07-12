import { client } from "data/axios";
import { TaskOrder } from "types/types";

export async function putTaskOrderOverride(
  data: TaskOrder
): Promise<TaskOrder | undefined> {
  try {
    const url = `/task-order-override`;
    const response = await client.put<TaskOrder>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
