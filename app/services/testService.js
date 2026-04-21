import { api } from "@/lib/api";

export const uploadDocx = (formData) => {
  return api.post("/tests/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const createTest = (data) => {
  return api.post("/tests", data);
};