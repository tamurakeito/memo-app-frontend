import { client } from "data/axios";
import { ListSummaryType } from "types/types";

export async function getListSummary(): Promise<
  Array<ListSummaryType> | undefined
> {
  try {
    const url = `/list-summary`;
    const response = await client.get<Array<ListSummaryType>>(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
