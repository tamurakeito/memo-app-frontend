import { client } from "data/axios";
import { MemoDetailType } from "types/types";

export async function getMemoDetail(
  id: number
): Promise<MemoDetailType | undefined> {
  try {
    const url = `/memo-detail/${id}`;
    const response = await client.get<MemoDetailType>(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
