import { client } from "data/axios";
import { ClientData } from "types/types";

export async function putClientData(
  data: ClientData
): Promise<ClientData | undefined> {
  try {
    const url = `/client-data-override`;
    const response = await client.put<ClientData>(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
