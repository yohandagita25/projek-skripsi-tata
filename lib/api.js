import axios from "axios";

export const API = "https://projek-skripsi-tata-backend.vercel.app/api";

export const api = axios.create({
  baseURL: API,
});