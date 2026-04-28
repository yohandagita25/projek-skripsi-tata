import { api } from "@/lib/api";

export const uploadDocx = async (formData) => {
  // ✅ Menuju ke /api/tests/upload melalui instance Axios
  const res = await api.post("/api/tests/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const createTest = async (data) => {
  // ✅ Menuju ke /api/tests
  const res = await api.post("/api/tests", data);
  return res.data;
};