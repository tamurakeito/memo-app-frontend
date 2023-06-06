import { client } from "data/axios";
import { ListDetailType } from "types/types";

export async function putRestatusList(
  data: ListDetailType
): Promise<ListDetailType | undefined> {
  try {
    const url = `/restatus-list`;
    const response = await client.put<ListDetailType>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
