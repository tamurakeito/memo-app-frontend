import { client } from "data/axios";
import { MemoDetailType } from "types/types";

export async function postAddMemo(
  name: string,
  tag: boolean
): Promise<MemoDetailType | undefined> {
  try {
    const url = `/add-memo`;
    const data = { name: name, tag: tag };
    const response = await client.post<MemoDetailType>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
