import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "http://192.168.0.162:8003";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

const TENANT = import.meta.env.VITE_TENANT || "DDEEP";

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Tenant-scoped backend: every request must carry the tenant header,
    // otherwise quote/booking lookups return 404.
    config.headers["X-Tenant"] = TENANT;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
