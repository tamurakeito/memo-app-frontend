import { client } from "data/axios";
import { ClientData } from "types/types";

export async function getClientData(): Promise<ClientData | undefined> {
  try {
    const url = `/client-data`;
    const response = await client.get<ClientData>(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
