import axios from "axios";
import { setupAuthInterceptor } from "./interceptors";
export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
setupAuthInterceptor(apiClient);
