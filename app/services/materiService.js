import { api } from "@/lib/api";

// 1. GET MATERI BY MODULE
export const getMateriByModule = async (moduleId) => {
  // ✅ Axios menggunakan .data, bukan .json()
  const res = await api.get(`/modules/${moduleId}/materi`);
  return res.data;
};

// 2. CREATE MATERI
export const createMateri = async (data) => {
  // ✅ Pakai api.post agar cookie otomatis terkirim
  const res = await api.post("/teacher/materi", data);
  return res.data;
};

// 3. UPDATE MATERI
export const updateMateri = async (id, data) => {
  // ✅ ID dimasukkan ke URL, data sebagai body
  const res = await api.put(`/teacher/materi/${id}`, data);
  return res.data;
};

// 4. DELETE MATERI
export const deleteMateri = async (id) => {
  const res = await api.delete(`/teacher/materi/${id}`);
  return res.data;
};