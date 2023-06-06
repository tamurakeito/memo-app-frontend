import { client } from "data/axios";
import { ListDetailType } from "types/types";

export async function getListDetail(
  id: number
): Promise<ListDetailType | undefined> {
  try {
    const url = `/list-detail/${id}`;
    const response = await client.get<ListDetailType>(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
