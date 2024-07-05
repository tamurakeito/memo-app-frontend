import { client } from "data/axios";

export async function putMemoOderOverride(
  data: Array<number>
): Promise<string | undefined> {
  try {
    const url = `/memo-order-override`;
    const obj = {
      order: data,
    };
    const jsonData: string = JSON.stringify(obj);
    const response = await client.put<string>(url, jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
