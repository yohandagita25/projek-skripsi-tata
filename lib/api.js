import axios from "axios";

export const api = axios.create({
  // ✅ Hapus /api di ujung jika rute di backend Bapak sudah diawali /api
  baseURL: "https://projek-skripsi-tata-backend.vercel.app", 
  withCredentials: true,
});