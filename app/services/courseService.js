import { api } from "@/lib/api";

// 1. GET FULL COURSES (Ini yang error 404 di konsol Bapak)
export const getFullCourses = async () => {
  try {
    // ✅ FIX: Di backend Bapak, rute ini kemungkinan besar adalah /api/teacher/courses
    // Jika Bapak punya rute khusus nested, pastikan namanya /api/teacher/courses
    const res = await api.get("/api/teacher/courses");
    
    // Unwrapping data: Axios menyimpan response body di .data
    // Backend Bapak biasanya membungkus dalam { data: [...] }
    const result = res.data?.data || res.data;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error getFullCourses:", error.message);
    return [];
  }
};

// 2. UPDATE COURSE
export const updateCourse = async (id, data) => {
  const res = await api.put(`/api/teacher/courses/${id}`, data);
  return res.data;
};

// 3. UPDATE MODULE
export const updateModule = async (id, data) => {
  const res = await api.put(`/api/teacher/modules/${id}`, data);
  return res.data;
};

// 4. UPDATE MATERI
export const updateMateri = async (id, data) => {
  const res = await api.put(`/api/teacher/materi/${id}`, data);
  return res.data;
};

// 5. DELETE COURSE
export const deleteCourse = async (id) => {
  const res = await api.delete(`/api/teacher/courses/${id}`);
  return res.data;
};

// 6. GET COURSES (Ringkas)
export const getCourses = async () => {
  try {
    const res = await api.get("/api/teacher/courses");
    return res.data?.data || res.data || [];
  } catch (error) {
    console.error("Error getCourses:", error);
    return [];
  }
};