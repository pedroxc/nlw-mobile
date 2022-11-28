import axios from "axios";

export const api = axios.create({
  baseURL: "https://nlw-server-production-e378.up.railway.app/",
});
