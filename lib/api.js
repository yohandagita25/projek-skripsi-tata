import axios from "axios";

// ✅ tetap ada (kode lama aman)
export const API = "http://localhost:5000/api";

// ✅ tambahan baru (untuk fitur test & ke depan)
export const api = axios.create({
  baseURL: API,
});