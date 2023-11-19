import { client } from "data/axios";
import { MemoSummaryType } from "types/types";

export async function putRestatusMemo(
  data: MemoSummaryType
): Promise<MemoSummaryType | undefined> {
  try {
    const url = `/restatus-memo`;
    const response = await client.put<MemoSummaryType>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
