import { api } from "@/lib/api";

// 1. AMBIL SEMUA DATA KURSUS LENGKAP (JOIN SESUAI ERD)
export const getFullCourses = async () => {
  try {
    // Menembak rute API Railway Bapak
    const res = await api.get("/api/teacher/courses");
    
    // Unwrapping data: Axios (res.data) -> Backend Wrap (data)
    const data = res.data?.data || res.data || [];
    
    // Pastikan mengembalikan Array agar UI tidak putih (error .map)
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error getFullCourses:", error.message);
    return [];
  }
};

// 2. UPDATE COURSE
export const updateCourse = async (id, data) => {
  return await api.put(`/api/teacher/courses/${id}`, data);
};

// 3. UPDATE MODULE (Sesuai ERD: module_id di tabel materi)
export const updateModule = async (id, data) => {
  return await api.put(`/api/teacher/modules/${id}`, data);
};

// 4. UPDATE MATERI (Sesuai ERD: memiliki has_reflection & reflection_question)
export const updateMateri = async (id, data) => {
  return await api.put(`/api/teacher/materi/${id}`, data);
};

// 5. DELETE COURSE
export const deleteCourse = async (id) => {
  return await api.delete(`/api/teacher/courses/${id}`);
};

// 6. GET AVAILABLE FOR TEST (Untuk Pretest/Posttest)
export const getAvailableCourses = async (type) => {
  const res = await api.get(`/api/courses/available-for-test?type=${type}`);
  return res.data?.data || res.data || [];
};