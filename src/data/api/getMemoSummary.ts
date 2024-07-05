import { client } from "data/axios";
import { MemoSummaryType } from "types/types";

export async function getMemoSummary(): Promise<
  Array<MemoSummaryType> | undefined
> {
  try {
    const url = `/memo-summary`;
    const response = await client.get<Array<MemoSummaryType>>(url);
    const memoListTagged = response.data.filter((memo) => memo.tag);
    const memoListUnTagged = response.data.filter((memo) => !memo.tag);
    return [...memoListTagged, ...memoListUnTagged];
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
