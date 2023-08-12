import { client } from "data/axios";
import { MemoDetailType } from "types/types";

export async function putRestatusMemo(
  data: MemoDetailType
): Promise<MemoDetailType | undefined> {
  try {
    const url = `/restatus-memo`;
    const response = await client.put<MemoDetailType>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
