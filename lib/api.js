import axios from "axios";

export const API = process.env.NEXT_PUBLIC_API_URL || "https://projek-skripsi-tata-backend.vercel.app/api";

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});