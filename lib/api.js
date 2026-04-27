import axios from "axios";

export const api = axios.create({
  baseURL: "https://projek-skripsi-tata-backend-production.up.railway.app",
  withCredentials: true,
});

// TAMBAHKAN LOGIKA INI
api.interceptors.request.use((config) => {
  // Ambil token dari localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      // Masukkan ke Header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});