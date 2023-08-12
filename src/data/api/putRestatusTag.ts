import { client } from "data/axios";
import { MemoTagType } from "types/types";

export async function putRestatusTag(
  data: MemoTagType
): Promise<MemoTagType | undefined> {
  try {
    const url = `/restatus-tag`;
    const response = await client.put<MemoTagType>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
