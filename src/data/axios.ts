import axios from "axios";

export const client = axios.create({
  baseURL: process.env.REACT_APP_AXIOS_BASE_URL,
  timeout: 15000,
});
