import axios from "axios";

export const api = axios.create({
  baseURL: "https://projek-skripsi-tata-backend.vercel.app/api", 
  withCredentials: true,
});