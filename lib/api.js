import axios from "axios";

export const api = axios.create({
  baseURL: "projek-skripsi-tata-backend-production.up.railway.app/api", 
  withCredentials: true,
});